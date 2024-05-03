import React from 'react'
import './styles.css'
import { Container, Grid, Box } from '@mui/material'
import CircleOfFifths from './components/CircleOfFifths'
import TemporaryDrawer from './components/Sidebar'
import ResponsivePiano from './components/Piano'

/*
const handleSelectNote = (noteData) => {
  setSelectedNotes((prevSelectedNotes) => {
    const isNoteSelected = prevSelectedNotes.find((selected) => selected.note === note.note)
    if (isNoteSelected) {
      // Remove the note if it was already selected
      return prevSelectedNotes.filter((selected) => selected.note !== note.note)
    } if (prevSelectedNotes.length < 2) {
      // Add the note if it wasn't selected and less than 2 notes are selected
      return [...prevSelectedNotes, note]
    }
    return prevSelectedNotes
  })
}
*/

function App() {
  return (
    <Container maxWidth="xl">
      <Box sx={{ position: 'absolute', top: 0, left: 0, zIndex: 1200 }}>
        <TemporaryDrawer />
      </Box>
      <Box height={600} sx={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Grid item xs={12}>
          <CircleOfFifths />
        </Grid>
      </Box>
      <ResponsivePiano/>
    </Container>
  )
}

export default App
