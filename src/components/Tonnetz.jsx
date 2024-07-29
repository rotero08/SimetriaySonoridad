import React, { useEffect, useRef, useState, useMemo } from 'react'
import * as d3 from 'd3'
import { useTheme, useMediaQuery } from '@mui/material'

const notes = [
  { note: 'C', num: 0 },
  { note: 'C#', num: 1 },
  { note: 'D', num: 2 },
  { note: 'E♭', num: 3 },
  { note: 'E', num: 4 },
  { note: 'F', num: 5 },
  { note: 'F#', num: 6 },
  { note: 'G', num: 7 },
  { note: 'G#', num: 8 },
  { note: 'A', num: 9 },
  { note: 'B♭', num: 10 },
  { note: 'B', num: 11 }
]

const noteToNum = note => notes.find(n => n.note === note)?.num
const numToNote = num => notes.find(n => n.num === num)?.note
const generateColor = (index) => `hsl(${index * 137.508}, 100%, 50%)`

const TonnetzGraph = ({ colorMapping, selectedNotes, setSelectedNotes, numSelected, vectors, setVectors, addVector, showNoteNames, originalVectorsShown, inversionAxesShown }) => {
  const svgRef = useRef()
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'))
  const [dimensions, setDimensions] = useState({ width: window.innerWidth * 0.8, height: window.innerHeight * 0.7 })

  useEffect(() => {
    const handleResize = () => {
      setDimensions({
        width: window.innerWidth * 0.8,
        height: window.innerHeight * 0.7
      })
    }

    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  useEffect(() => {
    const svg = d3.select(svgRef.current)
      .attr('viewBox', '0 0 800 500')
      .attr('preserveAspectRatio', 'xMidYMid meet')

    const pitchClasses = [
      { id: 0, label: 'B', x: 100, y: 50 },
      { id: 1, label: 'F#', x: 250, y: 50 },
      { id: 2, label: 'C#', x: 400, y: 50 },
      { id: 3, label: 'G#', x: 550, y: 50 },
      { id: 4, label: 'D#', x: 700, y: 50 },
      { id: 5, label: 'D', x: 180, y: 150 },
      { id: 6, label: 'A', x: 330, y: 150 },
      { id: 7, label: 'E', x: 480, y: 150 },
      { id: 8, label: 'B', x: 630, y: 150 },
      { id: 9, label: 'B♭', x: 100, y: 250 },
      { id: 10, label: 'F', x: 250, y: 250 },
      { id: 11, label: 'C', x: 400, y: 250 },
      { id: 12, label: 'G', x: 550, y: 250 },
      { id: 13, label: 'D', x: 700, y: 250 },
      { id: 14, label: 'D♭', x: 180, y: 350 },
      { id: 15, label: 'A♭', x: 330, y: 350 },
      { id: 16, label: 'E♭', x: 480, y: 350 },
      { id: 17, label: 'B♭', x: 630, y: 350 }
    ]

    const links = [
      { source: 0, target: 1 }, { source: 1, target: 2 }, { source: 2, target: 3 }, { source: 3, target: 4 },
      { source: 5, target: 6 }, { source: 6, target: 7 }, { source: 7, target: 8 },
      { source: 9, target: 10 }, { source: 10, target: 11 }, { source: 11, target: 12 }, { source: 12, target: 13 },
      { source: 14, target: 15 }, { source: 15, target: 16 }, { source: 16, target: 17 },
      { source: 0, target: 5 }, { source: 5, target: 9 }, { source: 9, target: 14 },
      { source: 1, target: 6 }, { source: 6, target: 10 }, { source: 10, target: 15 },
      { source: 2, target: 7 }, { source: 7, target: 11 }, { source: 11, target: 16 },
      { source: 3, target: 8 }, { source: 8, target: 12 }, { source: 12, target: 17 },
      { source: 4, target: 8 }, { source: 8, target: 13 }, { source: 13, target: 17 },
      { source: 1, target: 5 }, { source: 5, target: 10 }, { source: 10, target: 14 },
      { source: 2, target: 6 }, { source: 6, target: 11 }, { source: 11, target: 15 },
      { source: 3, target: 7 }, { source: 7, target: 12 }, { source: 12, target: 16 }
    ]

    // Clear any existing SVG elements before drawing
    svg.selectAll('*').remove()

    // Draw links
    svg.selectAll('.link')
      .data(links)
      .enter()
      .append('line')
      .attr('class', 'link')
      .attr('x1', d => pitchClasses[d.source].x)
      .attr('y1', d => pitchClasses[d.source].y)
      .attr('x2', d => pitchClasses[d.target].x)
      .attr('y2', d => pitchClasses[d.target].y)
      .attr('stroke', d => getColorForLink(d, pitchClasses))

    // Draw nodes
    svg.selectAll('.node')
      .data(pitchClasses)
      .enter()
      .append('circle')
      .attr('class', 'node')
      .attr('cx', d => d.x)
      .attr('cy', d => d.y)
      .attr('r', 20)
      .attr('fill', d => fillColor(d))
      .style('cursor', 'pointer')
      .on('click', function(event, d) {
        const note = d.label
        if (selectedNotes.includes(note)) {
          setSelectedNotes(selectedNotes.filter(n => n !== note))
        } else if (selectedNotes.length < numSelected) {
          setSelectedNotes([...selectedNotes, note])
        }
      })

    // Draw labels
    svg.selectAll('.text')
      .data(pitchClasses)
      .enter()
      .append('text')
      .attr('class', 'text')
      .attr('x', d => d.x)
      .attr('y', d => d.y)
      .attr('text-anchor', 'middle')
      .attr('dy', '.35em')
      .text(d => d.label)

  }, [dimensions, selectedNotes, numSelected, setSelectedNotes])

  useEffect(() => {
    if (selectedNotes.length === numSelected) {
      const newVector = selectedNotes.map(note => showNoteNames ? noteToNum(note) : note)
      addVector(newVector)
      setSelectedNotes([])
    }
  }, [selectedNotes, numSelected, addVector, setSelectedNotes, showNoteNames])

  const parseTransformation = (input) => {
    const regex = /^(T|I)(\d+)\((.*)\)$/

    const parseNested = (input) => {
      const match = input.match(regex)
      if (match) {
        const type = match[1]
        const value = parseInt(match[2], 10)
        const { transformations, vector } = parseNested(match[3])
        return { transformations: [...transformations, { type, value }], vector }
      } else {
        const vector = input.replace(/[[\]]/g, '').split(',').map(val => val.trim()).map(val => (isNaN(val) ? noteToNum(val) : parseInt(val, 10)))
        return { transformations: [], vector }
      }
    }

    return parseNested(input)
  }

  const applyTransformation = (vector, transformation) => {
    if (transformation.type === 'T') {
      return vector.map(note => (note + transformation.value) % 12)
    } else if (transformation.type === 'I') {
      return vector.map(note => (-note + transformation.value + 12) % 12)
    }
    return vector
  }

  const applyTransformations = (initialNotes) => {
    let result = [initialNotes]
    vectors.forEach((vectorStr, index) => {
      const { transformations, vector } = parseTransformation(vectorStr)
      const transformed = transformations.reduceRight((acc, transformation) => {
        return applyTransformation(acc, transformation)
      }, vector || [])
      result.push(transformed.map(numToNote))
      if (originalVectorsShown[index]) {
        result.push(vector.map(numToNote))
      }
    })
    return result
  }

  const allTransformedNotes = useMemo(() => applyTransformations(selectedNotes.map(noteToNum)), [selectedNotes, vectors, originalVectorsShown])

  const fillColor = (d) => {
    if (selectedNotes.includes(d.label)) {
      return 'hsl(100%, 100%, 50%)'
    }
    for (let i = 1; i < allTransformedNotes.length; i++) {
      if (allTransformedNotes[i].includes(d.label)) {
        return colorMapping[i - 1]
      }
    }
    return 'lightblue'
  }

  const getColorForLink = (link, pitchClasses) => {
    for (let i = 1; i < allTransformedNotes.length; i++) {
      const transformedNotes = allTransformedNotes[i]
      if (transformedNotes.includes(pitchClasses[link.source].label) && transformedNotes.includes(pitchClasses[link.target].label)) {
        return colorMapping[i - 1]
      }
    }
    return 'black'
  }

  return (
    <svg ref={svgRef} width={dimensions.width} height={dimensions.height}>
      <g>
        {/* The SVG content is rendered here */}
      </g>
    </svg>
  )
}

export default TonnetzGraph
