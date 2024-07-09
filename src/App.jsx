import React, { useState } from 'react'
import OptionsMenu from './components/OptionsMenu'
import CromaticCircle from './components/CromaticCircle'
import TemporaryDrawer from './components/Sidebar'
import ResponsivePiano from './components/Piano'

function App() {
  const [selectedNotes, setSelectedNotes] = useState([])
  const [numSelected, setNumSelected] = useState(2)
  const [vectors, setVectors] = useState([])
  const [showNoteNames, setShowNoteNames] = useState(false)
  const [originalVectorsShown, setOriginalVectorsShown] = useState([])

  return (
    <div className="app-container">
      <OptionsMenu
        numSelected={numSelected}
        setNumSelected={setNumSelected}
        showNoteNames={showNoteNames}
        setShowNoteNames={setShowNoteNames}
      />
      <TemporaryDrawer
        vectors={vectors}
        setVectors={setVectors}
        showNoteNames={showNoteNames}
        originalVectorsShown={originalVectorsShown}
        setOriginalVectorsShown={setOriginalVectorsShown}
      />
      <div className="center-container">
        <CromaticCircle
          selectedNotes={selectedNotes}
          setSelectedNotes={setSelectedNotes}
          numSelected={numSelected}
          vectors={vectors}
          setVectors={setVectors}
          originalVectorsShown={originalVectorsShown}
        />
      </div>
      <div className="piano-container">
        <ResponsivePiano selectedNotes={selectedNotes} />
      </div>
    </div>
  )
}

export default App

