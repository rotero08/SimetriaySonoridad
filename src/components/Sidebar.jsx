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

const noteToNum = note => notes.find(n => n.note === note)?.num
const numToNote = num => notes.find(n => n.num === num)?.note

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

  const parseTransformation = (input) => {
    if (typeof input !== 'string') {
      return { transformation: 0, vector: [] }
    }
    const match = input.match(/^T(\d+)\(\[(.*)\]\)$/)
    if (match) {
      const transformation = parseInt(match[1], 10)
      const vector = match[2].split(',').map(val => val.trim()).map(val => (isNaN(val) ? noteToNum(val) : parseInt(val, 10)))
      return { transformation, vector }
    } else {
      const vector = input.replace(/[[\]]/g, '').split(',').map(val => val.trim()).map(val => (isNaN(val) ? noteToNum(val) : parseInt(val, 10)))
      return { transformation: 0, vector }
    }
  }

  const validateVector = (vector) => {
    const uniqueValues = new Set(vector)
    return uniqueValues.size === vector.length && vector.every(val => notes.some(n => n.note === val || n.num === val))
  }

  const handleEditVector = (index) => {
    setEditVectorIndex(index)
    const { transformation, vector } = parseTransformation(vectors[index])
    if (transformation !== null && vector !== null) {
      const displayVector = vector.map(val => showNoteNames ? (isNaN(val) ? val : numToNote(val)) : (isNaN(val) ? noteToNum(val) : val)).join(', ')
      setTempVector(transformation ? `T${transformation}([${displayVector}])` : `[${displayVector}]`)
    } else {
      setTempVector(vectors[index])
    }
    setErrorMessage('')
  }

  const handleSaveVector = (index) => {
    const { transformation, vector } = parseTransformation(tempVector)
    if (transformation !== null && vector !== null && validateVector(vector)) {
      const updatedVector = transformation ? `T${transformation}([${vector.map(val => isNaN(val) ? noteToNum(val) : val).join(', ')}])` : `[${vector.map(val => isNaN(val) ? noteToNum(val) : val).join(', ')}]`
      const newVectors = vectors.map((vec, i) => (i === index ? updatedVector : vec))
      setVectors(newVectors)
      setEditVectorIndex(null)
      setErrorMessage('')
    } else {
      setErrorMessage('Invalid vector. Please enter a valid transformation and vector.')
      setTimeout(() => setErrorMessage(''), 5000)
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
    setVectors([...vectors, '[]'])
  }

  const removeVector = (index) => {
    setVectors(vectors.filter((_, i) => i !== index))
  }

  const drawerWidth = isMobile ? '60%' : 450

  const DrawerList = (
    <Box sx={{ width: drawerWidth }} role="presentation" edge="start">
      <Box sx={{ padding: 2 }}>
        {vectors.map((vector, index) => {
          const { transformation, vector: parsedVector } = parseTransformation(vector)
          const displayVector = parsedVector.map(val => showNoteNames ? (isNaN(val) ? val : numToNote(val)) : (isNaN(val) ? noteToNum(val) : val)).join(', ')
          return (
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
                  value={transformation ? `T${transformation}([${displayVector}])` : `[${displayVector}]`}
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
          )
        })}
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
            mt: 2,
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
          '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
        }}
      >
        {DrawerList}
      </Drawer>
    </Box>
  )
}

