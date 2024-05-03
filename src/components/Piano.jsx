import ReactDOM from 'react-dom'
import 'react-piano/dist/styles.css'
import { Piano, KeyboardShortcuts, MidiNumbers } from 'react-piano'
import SoundfontProvider from '../piano_tools/SoundfontProvider'
import DimensionsProvider from '../piano_tools/DimensionsProvider'

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

export default function ResponsivePiano(props) {
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
                  {...props}
                />
              )}
            />
          )
        }}
      </DimensionsProvider>
    </div>
  )
}
