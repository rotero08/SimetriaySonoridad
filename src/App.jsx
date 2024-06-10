import React, { useState } from 'react'
import CromaticCircle from './components/CromaticCircle'
import TemporaryDrawer from './components/Sidebar'
import ResponsivePiano from './components/Piano'

function App() {

  const [transformation, setTransformation] = useState(1)
  const [selectedNotes, setSelectedNotes] = useState([])
  const [numSelected, setNumSelected] = useState(2)
  const [transformations, setTransformations] = useState([])

  const addTransformation = () => {
    setTransformations([...transformations, transformation])
  }

  const removeTransformation = (index) => {
    const newTransformations = transformations.filter((_, i) => i !== index)
    setTransformations(newTransformations)
  }

  return (
    <div className="app-container">
      <TemporaryDrawer
        transformation={transformation}
        setTransformation={setTransformation}
        numSelected={numSelected}
        setNumSelected={setNumSelected}
        transformations={transformations}
        addTransformation={addTransformation}
        removeTransformation={removeTransformation}
      />
      <div className="center-container">
        <CromaticCircle
          selectedNotes={selectedNotes}
          setSelectedNotes={setSelectedNotes}
          numSelected={numSelected}
          transformations={transformations}
        />
      </div>
      <div className="piano-container">
        <ResponsivePiano selectedNotes={selectedNotes} />
      </div>
    </div>
  )
}

export default App

