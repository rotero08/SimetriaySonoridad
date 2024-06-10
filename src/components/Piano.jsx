import 'react-piano/dist/styles.css'
import './customPianoStyles.css'
import { Piano, KeyboardShortcuts, MidiNumbers } from 'react-piano'
import SoundfontProvider from '../piano_tools/SoundfontProvider'
import DimensionsProvider from '../piano_tools/DimensionsProvider'
import React from 'react'

// webkitAudioContext fallback needed to support Safari
const audioContext = new (window.AudioContext || window.webkitAudioContext)()
const soundfontHostname = 'https://d1pzp51pvbm36p.cloudfront.net'

const minKeyWidth = 40 // Minimum width of a key in pixels
const firstNote = MidiNumbers.fromNote('c3') // MIDI number for C3
const lastNote = MidiNumbers.fromNote('f4') // MIDI number for F4

const noteRange = {
  first: MidiNumbers.fromNote('c3'),
  last: MidiNumbers.fromNote('f4'),
}

const keyboardShortcuts = KeyboardShortcuts.create({
  firstNote: noteRange.first,
  lastNote: noteRange.last,
  keyboardConfig: KeyboardShortcuts.HOME_ROW,
})

const noteToMidi = {
  'C': MidiNumbers.fromNote('c3'),
  'C♯': MidiNumbers.fromNote('c#3'),
  'D': MidiNumbers.fromNote('d3'),
  'E♭': MidiNumbers.fromNote('eb3'),
  'E': MidiNumbers.fromNote('e3'),
  'F': MidiNumbers.fromNote('f3'),
  'F♯': MidiNumbers.fromNote('f#3'),
  'G': MidiNumbers.fromNote('g3'),
  'G♯': MidiNumbers.fromNote('g#3'),
  'A': MidiNumbers.fromNote('a3'),
  'B♭': MidiNumbers.fromNote('bb3'),
  'B': MidiNumbers.fromNote('b3')
}

export default function ResponsivePiano({ selectedNotes }) {
  // Convert selected notes to MIDI numbers
  const activeMidiNotes = selectedNotes.map(note => noteToMidi[note])

  const renderNoteLabel = ({ midiNumber, isActive }) => {
    const isSelected = activeMidiNotes.includes(midiNumber)
    const className = isSelected ? 'ReactPiano__Key--selected' : ''
    return (
      <div className={className} />
    )
  }

  return (
    <div className='piano-container'>
      <DimensionsProvider>
        {({ containerWidth }) => {
          const numberOfKeys = Math.max(Math.floor(containerWidth / minKeyWidth), lastNote - firstNote + 1)
          const newLastNote = firstNote + numberOfKeys - 1
          const noteRange = {
            first: firstNote,
            last: newLastNote,
          }
          return (
            <SoundfontProvider
              instrumentName="acoustic_grand_piano"
              audioContext={audioContext}
              hostname={soundfontHostname}
              render={({ isLoading, playNote, stopNote }) => (
                <Piano
                  noteRange={noteRange}
                  width={containerWidth}
                  playNote={playNote}
                  stopNote={stopNote}
                  disabled={isLoading}
                  renderNoteLabel={renderNoteLabel}
                  keyboardShortcuts={keyboardShortcuts}
                />
              )}
            />
          )
        }}
      </DimensionsProvider>
    </div>
  )
}
