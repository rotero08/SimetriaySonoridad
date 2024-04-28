import React from 'react';
import ReactDOM from 'react-dom';
import { Piano, KeyboardShortcuts, MidiNumbers } from 'react-piano';
import 'react-piano/dist/styles.css';

import CircleOfFifths from './CircleOfFifths';
import DimensionsProvider from './DimensionsProvider';
import SoundfontProvider from './SoundfontProvider';
import './styles.css';
import TemporaryDrawer from './Sidebar';

// webkitAudioContext fallback needed to support Safari
const audioContext = new (window.AudioContext || window.webkitAudioContext)();
const soundfontHostname = 'https://d1pzp51pvbm36p.cloudfront.net';

const noteRange = {
  first: MidiNumbers.fromNote('c3'),
  last: MidiNumbers.fromNote('f4'),
};
const keyboardShortcuts = KeyboardShortcuts.create({
  firstNote: noteRange.first,
  lastNote: noteRange.last,
  keyboardConfig: KeyboardShortcuts.HOME_ROW,
});

const handleSelectNote = (noteData) => {
  setSelectedNotes((prevSelectedNotes) => {
    const isNoteSelected = prevSelectedNotes.find((selected) => selected.note === note.note);
    if (isNoteSelected) {
      // Remove the note if it was already selected
      return prevSelectedNotes.filter((selected) => selected.note !== note.note);
    } else if (prevSelectedNotes.length < 2) {
      // Add the note if it wasn't selected and less than 2 notes are selected
      return [...prevSelectedNotes, note];
    }
    return prevSelectedNotes;
  });
};

function App() {
  
  return (
    <div className="app-container">
      <TemporaryDrawer />
      <div className="circle-container">
        <CircleOfFifths onSelectNote={handleSelectNote} />
      </div>
      <div className="piano-container">
        <ResponsivePiano />
      </div>
    </div>
  );
}


function ResponsivePiano(props) {
  return (
    <DimensionsProvider>
      {({ containerWidth }) => (
          <SoundfontProvider
            instrumentName="acoustic_grand_piano"
            audioContext={audioContext}
            hostname={soundfontHostname}
            render={({ isLoading, playNote, stopNote }) => (
              <div className="responsive-piano">
                <Piano
                  noteRange={noteRange}
                  width={containerWidth}
                  playNote={playNote}
                  stopNote={stopNote}
                  disabled={isLoading}
                  {...props}
                />
              </div>
            )}
          />
      )}
    </DimensionsProvider>
  );
}

export default App
