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
        flex: 0,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        p: isMobile ? 3 : 4,
      }}>
        <Grid
          container
          direction="column"
          justifyContent="center"
          alignItems="center"
        >
          <Grid item xs={1} lg={12}>
            <CircleOfFifths />
          </Grid>
          <Box sx={{
            width: '100%',
            position: 'fixed',
            bottom: 0,
          }}>
            <ResponsivePiano />
          </Box>
        </Grid>
      </Box>
    </Container>
  )
}

export default App

