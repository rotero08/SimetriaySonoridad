import React, { useState } from 'react'
import OptionsMenu from './components/OptionsMenu'
import CromaticCircle from './components/CromaticCircle'
import TemporaryDrawer from './components/Sidebar'
import ResponsivePiano from './components/Piano'
import Tonnetz from './components/Tonnetz'
import IconButton from '@mui/material/IconButton'
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos'
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos'
import { AppBar, Toolbar, Grid, Box } from '@mui/material'

function App() {
  const [selectedNotes, setSelectedNotes] = useState([])
  const [numSelected, setNumSelected] = useState(2)
  const [vectors, setVectors] = useState([])
  const [showNoteNames, setShowNoteNames] = useState(false)
  const [originalVectorsShown, setOriginalVectorsShown] = useState([])
  const [inversionAxesShown, setInversionAxesShown] = useState([])
  const [colorMapping, setColorMapping] = useState([]) // New state for color mapping
  const [showTonnetz, setShowTonnetz] = useState(false) // Default to Chromatic Circle

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
      <AppBar position="static" style={{ background: 'transparent', boxShadow: 'none' }}>
        <Toolbar>
          <Grid container alignItems="center" justifyContent="space-between">
            <Grid item xs={3}>
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
            </Grid>
            <Grid item xs={6} container justifyContent="center">
              <Box display="flex" justifyContent="center">
                <IconButton
                  color="inherit"
                  onClick={() => setShowTonnetz(false)}
                  disabled={!showTonnetz}
                  sx={{ color: !showTonnetz ? 'inherit' : '#1976d2' }}
                >
                  <ArrowBackIosIcon />
                </IconButton>
                <IconButton
                  color="inherit"
                  onClick={() => setShowTonnetz(true)}
                  disabled={showTonnetz}
                  sx={{ color: showTonnetz ? 'inherit' : '#1976d2' }}
                >
                  <ArrowForwardIosIcon />
                </IconButton>
              </Box>
            </Grid>
            <Grid item xs={3} container justifyContent="flex-end">
              <OptionsMenu
                numSelected={numSelected}
                setNumSelected={setNumSelected}
                showNoteNames={showNoteNames}
                setShowNoteNames={setShowNoteNames}
              />
            </Grid>
          </Grid>
        </Toolbar>
      </AppBar>
      <div className="center-container">
        {showTonnetz ? (
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
        ) : (
          <CromaticCircle
            selectedNotes={selectedNotes}
            setSelectedNotes={setSelectedNotes}
            numSelected={numSelected}
            vectors={vectors}
            setVectors={setVectors}
            originalVectorsShown={originalVectorsShown}
            inversionAxesShown={inversionAxesShown}
            addVector={addVector}
            colorMapping={colorMapping}
          />
        )}
      </div>
      <div className="piano-container">
        <ResponsivePiano
          selectedNotes={selectedNotes}
          vectors={vectors}
          colorMapping={colorMapping}
        />
      </div>
    </div>
  )
}

export default App
