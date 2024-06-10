import React, { useState } from 'react'
import './styles.css'
import { Container, Stack } from '@mui/material'
import CromaticCircle from './components/CromaticCircle'
import TemporaryDrawer from './components/Sidebar'
import ResponsivePiano from './components/Piano'

function App() {

  const [transformation, setTransformation] = useState(1)
  const [selectedNotes, setSelectedNotes] = useState([])
  const [numSelected, setNumSelected] = useState(2)
  const [transformations, setTransformations] = useState([]) // Manage multiple transformations

  // Function to add a new transformation
  const addTransformation = () => {
    setTransformations([...transformations, transformation])
  }

  // Function to remove a transformation
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

      <Stack
        justifyContent="space-between"
        className="app-stack"
      >
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
      </Stack>
    </div>
  )
}

export default App
