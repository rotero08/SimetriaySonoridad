import React, { useEffect, useMemo, useState } from 'react'
import * as d3 from 'd3'
import { useTheme, useMediaQuery } from '@mui/material'

const notes = [
  { note: 'C', num: 0 },
  { note: 'C♯', num: 1 },
  { note: 'D', num: 2 },
  { note: 'E♭', num: 3 },
  { note: 'E', num: 4 },
  { note: 'F', num: 5 },
  { note: 'F♯', num: 6 },
  { note: 'G', num: 7 },
  { note: 'G♯', num: 8 },
  { note: 'A', num: 9 },
  { note: 'B♭', num: 10 },
  { note: 'B', num: 11 },
]

// Function to generate a color based on the index
const generateColor = (index) => `hsl(${index * 137.508}, 100%, 50%)`

function CromaticCircle({ selectedNotes, setSelectedNotes, numSelected, vectors, setVectors }) {
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'))
  const [size, setSize] = useState(window.innerWidth * 0.9)

  useEffect(() => {
    function handleResize() {
      if (isMobile) {
        setSize(window.innerWidth * 0.9)
      }
    }
    const debouncedHandleResize = debounce(handleResize, 100)
    debouncedHandleResize()
    window.addEventListener('resize', debouncedHandleResize)
    return () => {
      window.removeEventListener('resize', debouncedHandleResize)
    }
  }, [isMobile])

  useEffect(() => {
    setSize(isMobile ? 400 : 500)
  }, [isMobile])

  useEffect(() => {
    if (selectedNotes.length === numSelected) {
      setVectors([...vectors, [...selectedNotes]])
      setSelectedNotes([])
    }
  }, [selectedNotes, numSelected, setVectors, vectors, setSelectedNotes])

  const applyTransformations = (initialNotes) => {
    let result = [initialNotes]
    vectors.forEach((vector, index) => {
      console.log(`Applying transformation ${index + 1}: ${vector}`)
      const transformed = vector.map((note) => {
        const currentIndex = notes.findIndex((n) => n.note === note)
        if (currentIndex === -1) return null // Handle invalid note
        const newIndex = (currentIndex + notes.length) % notes.length
        const newNote = notes[newIndex].note
        console.log(`Transforming note ${note} at index ${currentIndex} to ${newNote} at index ${newIndex}`)
        return newNote
      }).filter(note => note !== null) // Filter out invalid notes
      result.push(transformed)
      console.log(`Transformed notes after transformation ${index + 1}: ${transformed}`)
    })
    return result
  }

  const allTransformedNotes = useMemo(() => applyTransformations(selectedNotes), [selectedNotes, vectors])

  const fillColor = (d) => {
    if (selectedNotes.includes(d.note)) {
      return generateColor(0)
    }
    for (let i = 1; i < allTransformedNotes.length; i++) {
      if (allTransformedNotes[i].includes(d.note)) {
        return generateColor(i)
      }
    }
    return 'white'
  }

  const fillOpacity = (d) => {
    if (selectedNotes.includes(d.note)) {
      return 1.0
    }
    for (let i = 1; i < allTransformedNotes.length; i++) {
      if (allTransformedNotes[i].includes(d.note)) {
        return 0.5
      }
    }
    return 1.0
  }

  const width = size
  const height = size
  const margin = 50
  const radius = Math.min(width, height) / 2 - margin
  const arcGenerator = d3.arc().innerRadius(radius - 1).outerRadius(radius)
  const pieGenerator = d3.pie().value(() => 1).sort(null)

  const arcs = pieGenerator(notes)

  const getPoints = (notesArray) => {
    return notesArray.map((note) => {
      const noteObj = notes.find((n) => n.note === note)
      if (!noteObj) return null // Handle invalid note
      const angle = (((noteObj.num * 360) / notes.length - 90) * Math.PI) / 180
      const x = radius * Math.cos(angle)
      const y = radius * Math.sin(angle)
      return { x, y, num: noteObj.num }
    }).filter(point => point !== null).sort((a, b) => a.num - b.num) // Filter out invalid points and sort by their numerical value
  }

  const points = useMemo(() => getPoints(selectedNotes), [selectedNotes, radius])
  const allPoints = useMemo(() => allTransformedNotes.map(getPoints), [allTransformedNotes, radius])

  return (
    <svg width={width} height={height}>
      <g transform={`translate(${width / 2}, ${height / 2})`}>
        {arcs.map((arc, i) => (
          <path key={i} d={arcGenerator(arc)} fill="none" stroke="black" />
        ))}
        {notes.map((note, i) => {
          const angle = (((i * 360) / notes.length - 90) * Math.PI) / 180
          const x = (radius + 30) * Math.cos(angle)
          const y = (radius + 30) * Math.sin(angle)
          return (
            <text key={i} x={x} y={y} textAnchor="middle" fontSize="16px">
              {note.note}
            </text>
          )
        })}
        {notes.map((note, i) => {
          const offset = 30
          const angle = (((i * 360) / notes.length - 90) * Math.PI) / 180
          const x = (radius - offset) * Math.cos(angle)
          const y = (radius - offset) * Math.sin(angle)
          return (
            <text key={i} x={x} y={y} textAnchor="middle" fontSize="14px">
              {note.num}
            </text>
          )
        })}
        {allPoints.slice().reverse().map((points, vectorIndex) => (
          points.map((point, i) => {
            const nextPoint = points[(i + 1) % points.length]
            return (
              <line
                key={`${vectorIndex}-${i}`}
                x1={point.x}
                y1={point.y}
                x2={nextPoint.x}
                y2={nextPoint.y}
                stroke={generateColor(allPoints.length - vectorIndex - 1)}
                strokeWidth={2}
                strokeOpacity={0.5}
              />
            )
          })
        ))}
        {notes.map((note, i) => {
          const angle = (((i * 360) / notes.length - 90) * Math.PI) / 180
          const x = radius * Math.cos(angle)
          const y = radius * Math.sin(angle)
          return (
            <circle
              key={i}
              cx={x}
              cy={y}
              r="10"
              fill={fillColor(note)}
              fillOpacity={fillOpacity(note)}
              stroke="black"
              style={{ cursor: 'pointer' }}
              onClick={() => {
                if (selectedNotes.includes(note.note)) {
                  setSelectedNotes(selectedNotes.filter((n) => n !== note.note))
                } else if (selectedNotes.length < numSelected) {
                  setSelectedNotes([...selectedNotes, note.note])
                }
              }}
            />
          )
        })}
        {selectedNotes.length === numSelected && points.length && (
          points.map((point, i) => {
            const nextPoint = points[(i + 1) % points.length]
            return (
              <line
                key={i}
                x1={point.x}
                y1={point.y}
                x2={nextPoint.x}
                y2={nextPoint.y}
                stroke={generateColor(0)}
                strokeWidth={2}
              />
            )
          })
        )}
      </g>
    </svg>
  )
}

export default CromaticCircle

function debounce(fn, ms) {
  let timer
  return () => {
    clearTimeout(timer)
    timer = setTimeout(() => {
      timer = null
      fn.apply(this, arguments)
    }, ms)
  }
}
