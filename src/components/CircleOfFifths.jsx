import React, { useRef, useEffect, useState } from 'react'
import * as d3 from 'd3'
import { useTheme, useMediaQuery } from '@mui/material'

function CircleOfFifths({ onSelectNote }) {
  const ref = useRef()
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'))
  const [size, setSize] = useState(window.innerWidth * 0.9) // Default to 90% of window width

  useEffect(() => {
    function handleResize() {
      if (isMobile) {
        setSize(window.innerWidth * 0.9) // Adjust size to 90% of window width only if mobile
      }
    }

    const timer = setTimeout(() => {
      handleResize()
    }, 100) // Delay slightly to allow for full layout render

    return () => {
      clearTimeout(timer)
      window.removeEventListener('resize', handleResize)
    }
  }, [isMobile])

  useEffect(() => {
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

    // Inside your useEffect hook after the arcGenerator is defined

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
      .attr('fill', 'white')
      .attr('stroke', 'black')
      .style('cursor', 'pointer')
      .on('click', (d) => onSelectNote && onSelectNote(d))
  }, [size])

  useEffect(() => {
    setSize(isMobile ? 400 : 500)
  }, [isMobile])

  return <div ref={ref} className="circle-of-fifths" />
}

export default CircleOfFifths
