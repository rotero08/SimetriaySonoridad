import React, { useState } from 'react'
import OptionsMenu from './components/OptionsMenu'
import CromaticCircle from './components/CromaticCircle'
import TemporaryDrawer from './components/Sidebar'
import ResponsivePiano from './components/Piano'
import Tonnetz from './components/Tonnetz'

function App() {
  const [selectedNotes, setSelectedNotes] = useState([])
  const [numSelected, setNumSelected] = useState(2)
  const [vectors, setVectors] = useState([])
  const [showNoteNames, setShowNoteNames] = useState(false)
  const [originalVectorsShown, setOriginalVectorsShown] = useState([])
  const [inversionAxesShown, setInversionAxesShown] = useState([])
  const [colorMapping, setColorMapping] = useState([]) // New state for color mapping

  const generateColor = (index) => `hsl(${index * 137.508}, 100%, 50%)`

  const addVector = (vector) => {
    const newVectors = [...vectors, vector]

    let index = newVectors.length - 1
    let newColor = generateColor(index)
    while (colorMapping.includes(newColor)) {
      index++
      newColor = generateColor(index)
    }

    const newColorMapping = [...colorMapping, newColor]
    setVectors([...vectors, `[${vector.join(',')}]`])
    setColorMapping(newColorMapping)
  }

  const removeVector = (index) => {
    const newVectors = vectors.filter((_, i) => i !== index)
    setVectors(newVectors)
  }

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
        inversionAxesShown={inversionAxesShown}
        setInversionAxesShown={setInversionAxesShown}
        colorMapping={colorMapping}
        setColorMapping={setColorMapping}
      />
      <div className="center-container">
        {/* <CromaticCircle
          selectedNotes={selectedNotes}
          setSelectedNotes={setSelectedNotes}
          numSelected={numSelected}
          vectors={vectors}
          setVectors={setVectors}
          originalVectorsShown={originalVectorsShown}
          inversionAxesShown={inversionAxesShown}
          addVector={addVector}
          colorMapping={colorMapping}
        /> */}
        <Tonnetz
          colorMapping={colorMapping}
          selectedNotes={selectedNotes}
          setSelectedNotes={setSelectedNotes}
          numSelected={numSelected}
          vectors={vectors}
          setVectors={setVectors}
          addVector={addVector}
          showNoteNames={showNoteNames}
          originalVectorsShown={originalVectorsShown}
          inversionAxesShown={inversionAxesShown}
        />
      </div>
      <div className="piano-container">
        <ResponsivePiano
          selectedNotes={selectedNotes}
          vectors={vectors}
          colorMapping={colorMapping} />
      </div>
    </div>
  )
}

export default App

