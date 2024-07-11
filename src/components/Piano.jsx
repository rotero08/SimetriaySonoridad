import 'react-piano/dist/styles.css'
import './customPianoStyles.css'
import { Piano, KeyboardShortcuts, MidiNumbers } from 'react-piano'
import SoundfontProvider from '../piano_tools/SoundfontProvider'
import DimensionsProvider from '../piano_tools/DimensionsProvider'
import React, { useState } from 'react'

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

const vectorToMidiNumbers = (vector) => {
  const noteNameToMidiNumber = {
    'C': 0, 'C♯': 1, 'D': 2, 'E♭': 3, 'E': 4, 'F': 5, 'F♯': 6,
    'G': 7, 'G♯': 8, 'A': 9, 'B♭': 10, 'B': 11
  }
  const baseMidiNumber = MidiNumbers.fromNote('c3')
  const noteNames = vector.replace(/[[\]]/g, '').split(',')

  return noteNames.map(note => baseMidiNumber + noteNameToMidiNumber[note.trim()])
}

const getNoteNameWithOctave = (midiNumber) => {
  const octave = Math.floor(midiNumber / 12) - 1
  const noteIndex = midiNumber % 12
  const noteNames = ['C', 'C♯', 'D', 'E♭', 'E', 'F', 'F♯', 'G', 'G♯', 'A', 'B♭', 'B']
  return `${noteNames[noteIndex]}${octave}`
}

export default function ResponsivePiano({ vectors, colorMapping, selectedNotes }) {
  const [activeNotes, setActiveNotes] = useState([])

  // Convert selected notes to MIDI numbers
  const activeMidiNotes = selectedNotes.map(note => noteToMidi[note])

  const getNoteColor = (midiNumber) => {
    for (let i = 0; i < vectors.length; i++) {
      const midiNumbers = vectorToMidiNumbers(vectors[i])
      if (midiNumbers.includes(midiNumber)) {
        return colorMapping[i]
      }
    }
    return '#FFFFFF'
  }

  const renderNoteLabel = ({ midiNumber, isActive }) => {
    const isSelected = activeMidiNotes.includes(midiNumber) || activeNotes.includes(midiNumber)
    const className = isSelected ? 'ReactPiano__Key--selected' : ''
    return (
      <div
        style={{
          backgroundColor: getNoteColor(midiNumber),
          width: '100%',
          height: '100%',
        }}
        className={className}
      >
        {getNoteNameWithOctave(midiNumber)}
      </div>
    )
  }

  const playVectors = (playNote, stopNote) => {
    let delay = 0
    const chordDuration = 500 // milliseconds

    vectors.forEach((vector, index) => {
      const midiNumbers = vectorToMidiNumbers(vector).sort((a, b) => a - b)

      setTimeout(() => {
        // Stop previous notes
        setActiveNotes([]) // Clear the active notes
        activeNotes.forEach((midiNumber) => {
          stopNote(midiNumber)
        })

        // Play new chord
        midiNumbers.forEach((midiNumber) => {
          playNote(midiNumber)
        })
        setActiveNotes(midiNumbers) // Set the active notes to highlight on the piano
      }, delay)

      delay += chordDuration
    })

    // Ensure to stop the final chord
    setTimeout(() => {
      activeNotes.forEach((midiNumber) => {
        stopNote(midiNumber)
      })
      setActiveNotes([]) // Clear the active notes
    }, delay + chordDuration)
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
                <>
                  <button onClick={() => playVectors(playNote, stopNote)}>Play Vectors</button>
                  <Piano
                    noteRange={noteRange}
                    width={containerWidth}
                    playNote={playNote}
                    stopNote={stopNote}
                    disabled={isLoading}
                    renderNoteLabel={renderNoteLabel}
                    keyboardShortcuts={keyboardShortcuts}
                    activeNotes={activeNotes} // Ensure the piano updates to reflect active notes
                  />
                </>
              )}
            />
          )
        }}
      </DimensionsProvider>
    </div>
  )
}
