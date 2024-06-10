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

function CromaticCircle({ selectedNotes, setSelectedNotes, numSelected, transformations }) {
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
    setSelectedNotes([])
  }, [numSelected, setSelectedNotes])

  const fillColor = (d) => {
    if (selectedNotes.includes(d.note)) {
      return 'blue'
    }
    for (let i = 0; i < transformations.length; i++) {
      const transformation = transformations[i]
      const transformed = selectedNotes.map(note => {
        const currentIndex = notes.findIndex(n => n.note === note)
        const newIndex = (currentIndex + transformation) % notes.length
        return notes[newIndex].note
      })
      if (transformed.includes(d.note)) {
        return 'lightblue'
      }
    }
    return 'white'
  }

  const width = size
  const height = size
  const margin = 50
  const radius = Math.min(width, height) / 2 - margin
  const arcGenerator = d3.arc()
    .innerRadius(radius - 1)
    .outerRadius(radius)
  const pieGenerator = d3.pie()
    .value(() => 1)
    .sort(null)

  const arcs = pieGenerator(notes)

  const points = useMemo(() => {
    return selectedNotes.map(note => {
      const noteObj = notes.find(n => n.note === note)
      const angle = (((noteObj.num * 360) / notes.length - 90) * Math.PI) / 180
      const x = radius * Math.cos(angle)
      const y = radius * Math.sin(angle)
      return { x, y }
    })
  }, [selectedNotes, radius])

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
              stroke="black"
              style={{ cursor: 'pointer' }}
              onClick={() => {
                if (selectedNotes.includes(note.note)) {
                  setSelectedNotes(selectedNotes.filter(n => n !== note.note))
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
                stroke="blue"
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
