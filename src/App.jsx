import React, { useState } from 'react'
import './styles.css'
import { Container, Grid, Box, useTheme, useMediaQuery } from '@mui/material'
import CromaticCircle from './components/CromaticCircle'
import TemporaryDrawer from './components/Sidebar'
import ResponsivePiano from './components/Piano'

function App() {
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'))

  const [transformation, setTransformation] = useState(1)
  const [selectedNotes, setSelectedNotes] = useState([])
  const [numSelected, setNumSelected] = useState(2)
  const [transformations, setTransformations] = useState([]) // Manage multiple transformations

  const notes = [
    { note: 'C', num: 0 },
    { note: 'C♯', num: 1 },
    { note: 'D', num: 2 },
    { note: 'E♭', num: 3 },
    { note: 'E', num: 4 },
    { note: 'F', num: 5 },
    { note: 'F♯', num: 6 },
    { note: 'G', num: 7 },
    { note: 'G♯', num: 8 },
    { note: 'A', num: 9 },
    { note: 'B♭', num: 10 },
    { note: 'B', num: 11 },
  ]

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
    <Container
      maxWidth={false}
      sx={{
        height: 'calc(100vh - 64px)',
        position: 'relative',
        display: 'flex',
        flexDirection: 'column',
        p: 0,
        m: 0,
      }}
    >
      <Box
        sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          zIndex: 1200,
          width: isMobile ? '100%' : 'auto',
        }}
      >
        <TemporaryDrawer
          transformation={transformation}
          setTransformation={setTransformation}
          numSelected={numSelected}
          setNumSelected={setNumSelected}
          transformations={transformations} // Pass down transformations
          addTransformation={addTransformation} // Pass down add transformation function
          removeTransformation={removeTransformation} // Pass down remove transformation function
        />
      </Box>
      <Box
        sx={{
          flex: 0,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          p: isMobile ? 3 : 4,
        }}
      >
        <Grid
          container
          direction="column"
          justifyContent="center"
          alignItems="center"
        >
          <Grid item xs={12} lg={12}>
            <CromaticCircle
              selectedNotes={selectedNotes}
              setSelectedNotes={setSelectedNotes}
              numSelected={numSelected}
              transformations={transformations} // Pass down transformations
            />
          </Grid>
          <Box
            sx={{
              width: '100%',
              position: 'fixed',
              bottom: 0,
            }}
          >
            <ResponsivePiano selectedNotes={selectedNotes} />
          </Box>
        </Grid>
      </Box>
    </Container>
  )
}

export default App
