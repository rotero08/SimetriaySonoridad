import React from 'react'
import './styles.css'
import { Container, Grid, Box, useTheme, useMediaQuery } from '@mui/material'
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
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'))

  return (
    <Container maxWidth="xl" sx={{ height: '100vh', position: 'relative', display: 'flex', flexDirection: 'column' }}>
      <Box sx={{
        position: 'absolute', top: 0, left: 0, zIndex: 1200,
        width: isMobile ? '100%' : 'auto',
      }}>
        <TemporaryDrawer />
      </Box>
      <Box sx={{
        flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center',
        p: isMobile ? 3 : 2,
      }}>
        <Grid container spacing={2} sx={{ justifyContent: 'center', alignItems: 'center', height: '100%' }}>
          <Grid item xs={12} md={8} lg={6}>
            <CircleOfFifths sx={{
              width: isMobile ? '90%' : 'auto', // Make the circle 90% of the screen width on mobile
              fontSize: isMobile ? '1.5rem' : '1rem', // Adjust font size for mobile
            }} />
          </Grid>
        </Grid>
      </Box>
      <Box sx={{ width: '100%', mt: 'auto' }}>
        <ResponsivePiano />
      </Box>
    </Container>
  )
}

export default App
