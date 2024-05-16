import React, { useRef, useEffect, useState } from 'react'
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
  const ref = useRef()
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'))
  const [size, setSize] = useState(window.innerWidth * 0.9) // Default to 90% of window width

  function debounce(fn, ms) {
    let timer
    return _ => {
      clearTimeout(timer)
      timer = setTimeout(_ => {
        timer = null
        fn.apply(this, arguments)
      }, ms)
    }
  }

  useEffect(() => {
    function handleResize() {
      if (isMobile) {
        setSize(window.innerWidth * 0.9) // Adjust size to 90% of window width only if mobile
      }
    }

    // Wrap the handleResize with debounce
    const debouncedHandleResize = debounce(handleResize, 100)

    // Initial call and setup of resize event listener
    debouncedHandleResize()
    window.addEventListener('resize', debouncedHandleResize)

    // Cleanup function to remove the event listener
    return () => {
      window.removeEventListener('resize', debouncedHandleResize)
    }
  }, [isMobile])

  useEffect(() => {
    // Dynamically adjust size based on the device
    const width = size
    const height = size
    const margin = 50
    const radius = Math.min(width, height) / 2 - margin

    d3.select(ref.current).selectAll('svg').remove()

    const svg = d3.select(ref.current)
      .append('svg')
      .attr('width', width)
      .attr('height', height)
      .append('g')
      .attr('transform', `translate(${width / 2}, ${height / 2})`)

    const arcGenerator = d3.arc()
      .innerRadius(radius - 1)
      .outerRadius(radius)

    const pieGenerator = d3.pie()
      .value(() => 1)
      .sort(null)

    svg.selectAll('path')
      .data(pieGenerator(notes))
      .enter()
      .append('path')
      .attr('d', arcGenerator)
      .attr('fill', 'none')
      .attr('stroke', 'black')

    // Drawing the note labels
    svg.selectAll('.note-text')
      .data(notes)
      .enter()
      .append('text')
      .attr('class', 'note-text')
      .text((d) => d.note)
      .attr('transform', (d, i) => {
        const angle = (((i * 360) / notes.length - 90) * Math.PI) / 180
        const x = (radius + 30) * Math.cos(angle)
        const y = (radius + 30) * Math.sin(angle)
        return `translate(${x}, ${y})`
      })
      .attr('text-anchor', 'middle')
      .style('font-size', '16px')

    // Drawing the number labels
    svg.selectAll('.number-text')
      .data(notes)
      .enter()
      .append('text')
      .attr('class', 'number-text')
      .text((d) => d.num)
      .attr('transform', (d, i) => {
        const offset = 30 // You can adjust this value to move the numbers closer or further away
        const angle = (((i * 360) / notes.length - 90) * Math.PI) / 180
        const x = (radius - offset) * Math.cos(angle)
        const y = (radius - offset) * Math.sin(angle)
        return `translate(${x}, ${y})`
      })
      .attr('text-anchor', 'middle')
      .style('font-size', '14px') // Adjust the font size as needed

    // Function to fill circles based on selected and transformed notes
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

    svg.selectAll('circle')
      .data(notes)
      .enter()
      .append('circle')
      .attr('r', 10)
      .attr('transform', (d, i) => {
        const angle = (((i * 360) / notes.length - 90) * Math.PI) / 180
        const x = (radius) * Math.cos(angle)
        const y = (radius) * Math.sin(angle)
        return `translate(${x}, ${y})`
      })
      .attr('fill', d => fillColor(d))
      .attr('stroke', 'black')
      .style('cursor', 'pointer')
      .on('click', (event, d) => {
        if (selectedNotes.includes(d.note)) {
          setSelectedNotes(selectedNotes.filter(note => note !== d.note))
        } else if (selectedNotes.length < numSelected) {
          setSelectedNotes([...selectedNotes, d.note])
        }
      })

    // Draw lines between selected notes if there are two, three, or four
    if (selectedNotes.length === numSelected) {
      const points = selectedNotes.map(note => {
        const noteObj = notes.find(n => n.note === note)
        const angle = (((noteObj.num * 360) / notes.length - 90) * Math.PI) / 180
        const x = radius * Math.cos(angle)
        const y = radius * Math.sin(angle)
        return { x, y }
      })

      // Order the points to form a square if numSelected is 4
      if (numSelected === 4) {
        const center = { x: 0, y: 0 }
        points.sort((a, b) => Math.atan2(a.y - center.y, a.x - center.x) - Math.atan2(b.y - center.y, b.x - center.x))
      }

      let topLineIndex = 0
      let topLineY = Number.POSITIVE_INFINITY

      for (let i = 0; i < points.length; i++) {
        const nextPoint = points[(i + 1) % points.length]
        svg.append('line')
          .attr('x1', points[i].x)
          .attr('y1', points[i].y)
          .attr('x2', nextPoint.x)
          .attr('y2', nextPoint.y)
          .attr('stroke', 'blue')
          .attr('stroke-width', 2)

        // Calculate midpoint for the line
        const midX = (points[i].x + nextPoint.x) / 2
        const midY = (points[i].y + nextPoint.y) / 2

        // Find the topmost line
        if (midY < topLineY) {
          topLineY = midY
          topLineIndex = i
        }
      }

      // Calculate the midpoint of the topmost line for the vector label
      const topLine = points[topLineIndex]
      const nextTopLine = points[(topLineIndex + 1) % points.length]
      const topMidX = (topLine.x + nextTopLine.x) / 2
      const topMidY = (topLine.y + nextTopLine.y) / 2

      // Add vector label to the topmost line
      svg.append('text')
        .attr('x', topMidX)
        .attr('y', topMidY)
        .attr('dy', -5) // Adjust this value as needed to position the label
        .attr('text-anchor', 'middle')
        .attr('font-size', '12px')
        .attr('fill', 'blue')
        .text('\u2192v1') // Unicode for right arrow followed by vector index
    }

    // Draw lines between transformed notes if there are two, three, or four
    transformations.forEach((transformation, index) => {
      const transformed = selectedNotes.map(note => {
        const currentIndex = notes.findIndex(n => n.note === note)
        const newIndex = (currentIndex + transformation) % notes.length
        return notes[newIndex].note
      })

      if (transformed.length === numSelected) {
        const points = transformed.map(note => {
          const noteObj = notes.find(n => n.note === note)
          const angle = (((noteObj.num * 360) / notes.length - 90) * Math.PI) / 180
          const x = radius * Math.cos(angle)
          const y = radius * Math.sin(angle)
          return { x, y }
        })

        // Order the points to form a square if numSelected is 4
        if (numSelected === 4) {
          const center = { x: 0, y: 0 }
          points.sort((a, b) => Math.atan2(a.y - center.y, a.x - center.x) - Math.atan2(b.y - center.y, b.x - center.x))
        }

        for (let i = 0; i < points.length; i++) {
          const nextPoint = points[(i + 1) % points.length]
          svg.append('line')
            .attr('x1', points[i].x)
            .attr('y1', points[i].y)
            .attr('x2', nextPoint.x)
            .attr('y2', nextPoint.y)
            .attr('stroke', 'lightblue')
            .attr('stroke-width', 2)
            .style('opacity', 0.6)
        }

        // Calculate the midpoint of the topmost line for the vector label
        const topLine = points[0]
        const nextTopLine = points[1]
        const topMidX = (topLine.x + nextTopLine.x) / 2
        const topMidY = (topLine.y + nextTopLine.y) / 2

        // Add vector label to the topmost line
        svg.append('text')
          .attr('x', topMidX)
          .attr('y', topMidY)
          .attr('dy', -5) // Adjust this value as needed to position the label
          .attr('text-anchor', 'middle')
          .attr('font-size', '12px')
          .attr('fill', 'lightblue')
          .style('opacity', 0.6)
          .text(`\u2192v${index + 2}`) // Unicode for right arrow followed by vector index
      }
    })
  }, [selectedNotes, size, numSelected, setSelectedNotes, transformations])

  useEffect(() => {
    setSize(isMobile ? 400 : 500)
  }, [isMobile])

  useEffect(() => {
    setSelectedNotes([]) // Reset selected notes when numSelected changes
  }, [numSelected, setSelectedNotes])

  return (
    <div>
      <div ref={ref} className="cromatic-circle" />
    </div>
  )
}

export default CromaticCircle
