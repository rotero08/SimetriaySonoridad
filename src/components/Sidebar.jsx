import React, { useState, useEffect } from 'react'
import Box from '@mui/material/Box'
import Drawer from '@mui/material/Drawer'
import IconButton from '@mui/material/IconButton'
import MenuIcon from '@mui/icons-material/Menu'
import { useTheme, useMediaQuery, TextField, IconButton as MuiIconButton, Typography } from '@mui/material'
import DeleteIcon from '@mui/icons-material/Delete'

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

export default function TemporaryDrawer({ vectors, setVectors, showNoteNames }) {
  const [open, setOpen] = useState(false)
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'))
  const [editVectorIndex, setEditVectorIndex] = useState(null)
  const [tempVector, setTempVector] = useState('')
  const [errorMessage, setErrorMessage] = useState('')

  const toggleDrawer = (newOpen) => () => {
    setOpen(newOpen)
  }

  const validateVector = (vector) => {
    const uniqueValues = new Set(vector)
    return uniqueValues.size === vector.length && vector.every(val => showNoteNames ? notes.some(n => n.note === val) : notes.some(n => n.num === parseInt(val)))
  }

  const handleEditVector = (index) => {
    setEditVectorIndex(index)
    setTempVector(showNoteNames ? vectors[index].join(',') : vectors[index].map(note => notes.find(n => n.note === note).num).join(','))
    setErrorMessage('')
  }

  const handleSaveVector = (index) => {
    const newVector = tempVector.split(',').map(val => val.trim())
    if (validateVector(newVector)) {
      const updatedVector = showNoteNames ? newVector : newVector.map(val => notes.find(n => n.num === parseInt(val)).note)
      const newVectors = vectors.map((vector, i) => (
        i === index ? updatedVector : vector
      ))
      setVectors(newVectors)
      setEditVectorIndex(null)
      setErrorMessage('')
    } else {
      setErrorMessage('Invalid vector. Please enter unique and valid notes or numbers.')
      setTempVector(showNoteNames ? vectors[index].join(',') : vectors[index].map(note => notes.find(n => n.note === note).num).join(','))
      setTimeout(() => setErrorMessage(''), 5000) // Clear error message after 3 seconds
    }
  }

  const handleTempVectorChange = (event) => {
    setTempVector(event.target.value)
  }

  const handleKeyPress = (event, index) => {
    if (event.key === 'Enter') {
      handleSaveVector(index)
    }
  }

  const handleBlur = (index) => {
    handleSaveVector(index)
  }

  const addVectorField = () => {
    setVectors([...vectors, []])
  }

  const removeVector = (index) => {
    setVectors(vectors.filter((_, i) => i !== index))
  }

  const drawerWidth = isMobile ? '60%' : 450

  const DrawerList = (
    <Box
      sx={{ width: drawerWidth }}
      role="presentation"
      edge="start"
    >
      <Box sx={{ padding: 2 }}>
        {vectors.map((vector, index) => (
          <Box key={index} sx={{ display: 'flex', alignItems: 'center', marginBottom: 2 }}>
            {editVectorIndex === index ? (
              <TextField
                value={tempVector}
                onChange={handleTempVectorChange}
                onBlur={() => handleBlur(index)}
                onKeyPress={(e) => handleKeyPress(e, index)}
                fullWidth
                margin="dense"
                sx={{ marginRight: 1 }}
                error={!!errorMessage}
                helperText={errorMessage}
              />
            ) : (
              <TextField
                label={`Vector ${index + 1}`}
                value={showNoteNames ? vector.join(',') : vector.map(note => notes.find(n => n.note === note).num).join(',')}
                onClick={() => handleEditVector(index)}
                fullWidth
                margin="dense"
                sx={{ marginRight: 1 }}
                InputProps={{
                  readOnly: true,
                }}
              />
            )}
            <MuiIconButton edge="end" aria-label="delete" onClick={() => removeVector(index)}>
              <DeleteIcon />
            </MuiIconButton>
          </Box>
        ))}
        <Box
          sx={{
            height: 56,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            border: '1px dashed gray',
            borderRadius: 1,
            color: 'text.secondary',
            cursor: 'pointer',
            mt: 2
          }}
          onClick={addVectorField}
        >
          + Add
        </Box>
      </Box>
    </Box>
  )

  return (
    <Box>
      <IconButton color="primary" onClick={toggleDrawer(true)}>
        <MenuIcon />
      </IconButton>
      <Drawer
        open={open}
        onClose={toggleDrawer(false)}
        sx={{
          '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth }
        }}
      >
        {DrawerList}
      </Drawer>
    </Box>
  )
}
