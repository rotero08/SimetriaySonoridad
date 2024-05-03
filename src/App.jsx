import React from 'react'
import './styles.css'
import { Container, Grid, Box, useTheme, useMediaQuery } from '@mui/material'
import CircleOfFifths from './components/CircleOfFifths'
import TemporaryDrawer from './components/Sidebar'
import ResponsivePiano from './components/Piano'

function App() {
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'))

  return (
    <Container maxWidth={false} sx={{
      height: '100vh', // Full viewport height
      position: 'relative',
      display: 'flex',
      flexDirection: 'column',
      p: 0,
      m: 0,
      overflow: 'hidden' // Prevent scrolling
    }}>
      <Box sx={{
        position: 'absolute',
        top: 0,
        left: 0,
        zIndex: 1200,
        width: isMobile ? '100%' : 'auto',
      }}>
        <TemporaryDrawer />
      </Box>
      <Box sx={{
        flex: 1,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        p: isMobile ? 3 : 2,
      }}>
        <Grid container sx={{ justifyContent: 'center', alignItems: 'center', height: '100%' }}>
          <Grid item xs={12} md={8} lg={6}>
            <CircleOfFifths sx={{
              width: isMobile ? `${100 - 10}vw` : 500, // Adjust size dynamically
              height: isMobile ? `${100 - 10}vw` : 500,
              fontSize: isMobile ? '1.5rem' : '1rem',
            }} />
          </Grid>
        </Grid>
      </Box>
      <Box sx={{
        width: '100%',
        position: 'fixed',
        bottom: 0,
      }}>
        <ResponsivePiano />
      </Box>
    </Container>
  )
}

export default App

