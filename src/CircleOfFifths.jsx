import React, { useRef, useEffect } from 'react';
import * as d3 from 'd3';

const CircleOfFifths = () => {
  const ref = useRef();

  useEffect(() => {
    const width = 500;  // You can adjust the width to fit your container size
    const height = 500; // You can adjust the height to fit your container size
    const margin = 40;

    // The radius of the Circle of Fifths
    const radius = Math.min(width, height) / 2 - margin;

    // Remove the old svg if it exists
    d3.select(ref.current).selectAll('svg').remove();

    // Create SVG container
    const svg = d3.select(ref.current)
      .append('svg')
      .attr('width', width)
      .attr('height', height)
      .append('g')
      .attr('transform', `translate(${width / 2}, ${height / 2})`);

    // Data for Circle of Fifths (12 notes)
    const notes = [
      'C', 'G', 'D', 'A', 'E', 'B', 'F♯', 'C♯', 'G♭', 'D♭', 'A♭', 'E♭', 'B♭', 'F'
    ];

    // Create a scale for the circle's outline
    const color = d3.scaleOrdinal(d3.schemeCategory10);

    // Generate the pie
    const pie = d3.pie()
      .value(() => 1); // We want all slices to be the same size

    // Generate the arcs
    const arc = d3.arc()
      .innerRadius(0)
      .outerRadius(radius);

    // Draw the circle
    svg.selectAll('path')
      .data(pie(notes))
      .enter().append('path')
      .attr('d', arc)
      .attr('fill', (d, i) => color(i));

    // Add the note labels
    svg.selectAll('text')
      .data(pie(notes))
      .enter().append('text')
      .text((d) => d.data)
      .attr('transform', (d) => {
        const [x, y] = arc.centroid(d);
        return `translate(${x}, ${y})`;
      })
      .style('text-anchor', 'middle')
      .style('alignment-baseline', 'middle')
      .style('font-size', 16);
  }, []); // The empty dependency array ensures the effect is only run on mount

  return <div ref={ref} />;
};

export default CircleOfFifths;