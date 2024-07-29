import 'react-piano/dist/styles.css'
import './customPianoStyles.css'
import { Piano, KeyboardShortcuts, MidiNumbers } from 'react-piano'
import SoundfontProvider from '../piano_tools/SoundfontProvider'
import DimensionsProvider from '../piano_tools/DimensionsProvider'
import React, { useState } from 'react'

const audioContext = new (window.AudioContext || window.webkitAudioContext)()
const soundfontHostname = 'https://d1pzp51pvbm36p.cloudfront.net'

const minKeyWidth = 40
const firstNote = MidiNumbers.fromNote('c3')
const lastNote = MidiNumbers.fromNote('f4')

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

const noteNameToMidiNumber = {
  'C': 0, 'C♯': 1, 'D': 2, 'E♭': 3, 'E': 4, 'F': 5, 'F♯': 6,
  'G': 7, 'G♯': 8, 'A': 9, 'B♭': 10, 'B': 11
}

const vectorToMidiNumbers = (vector) => {
  const baseMidiNumber = MidiNumbers.fromNote('c3')
  const noteNames = vector.replace(/[[\]]/g, '').split(',')

  return noteNames.map(note => {
    note = note.trim()
    if (isNaN(note)) {
      return baseMidiNumber + noteNameToMidiNumber[note]
    } else {
      return baseMidiNumber + parseInt(note)
    }
  })
}

const getNoteNameWithOctave = (midiNumber) => {
  const octave = Math.floor(midiNumber / 12) - 1
  const noteIndex = midiNumber % 12
  const noteNames = ['C', 'C♯', 'D', 'E♭', 'E', 'F', 'F♯', 'G', 'G♯', 'A', 'B♭', 'B']
  return `${noteNames[noteIndex]}${octave}`
}

const getNoteIndex = (midiNumber) => midiNumber % 12

export default function ResponsivePiano({ vectors, colorMapping, selectedNotes, addVector }) {
  const [activeNotes, setActiveNotes] = useState([])
  const [isRecording, setIsRecording] = useState(false)
  const [recordedNotes, setRecordedNotes] = useState([])

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
    const chordDuration = 500

    vectors.forEach((vector, index) => {
      const midiNumbers = vectorToMidiNumbers(vector).sort((a, b) => a - b)

      setTimeout(() => {
        setActiveNotes([])
        activeNotes.forEach((midiNumber) => {
          stopNote(midiNumber)
        })

        midiNumbers.forEach((midiNumber) => {
          playNote(midiNumber)
        })
        setActiveNotes(midiNumbers)
      }, delay)

      delay += chordDuration
    })

    setTimeout(() => {
      activeNotes.forEach((midiNumber) => {
        stopNote(midiNumber)
      })
      setActiveNotes([])
    }, delay + chordDuration)
  }

  const handlePlayNote = (midiNumber) => {
    if (isRecording) {
      setRecordedNotes((prev) => [...prev, getNoteIndex(midiNumber)])
    }
  }

  const toggleRecording = () => {
    if (isRecording) {
      const uniqueNotes = Array.from(new Set(recordedNotes))
      addVector(uniqueNotes)
      setRecordedNotes([])
    }
    setIsRecording(!isRecording)
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
                  <button onClick={toggleRecording}>
                    {isRecording ? 'Stop Recording' : 'Start Recording'}
                  </button>
                  <Piano
                    noteRange={noteRange}
                    width={containerWidth}
                    playNote={(midiNumber) => {
                      playNote(midiNumber)
                      handlePlayNote(midiNumber)
                    }}
                    stopNote={stopNote}
                    disabled={isLoading}
                    renderNoteLabel={renderNoteLabel}
                    keyboardShortcuts={keyboardShortcuts}
                    activeNotes={activeNotes}
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
