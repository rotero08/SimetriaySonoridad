import React, { useState, useEffect } from 'react'
import Box from '@mui/material/Box'
import Drawer from '@mui/material/Drawer'
import IconButton from '@mui/material/IconButton'
import MenuIcon from '@mui/icons-material/Menu'
import { useTheme, useMediaQuery, TextField, IconButton as MuiIconButton, Tooltip, Checkbox } from '@mui/material'
import DeleteIcon from '@mui/icons-material/Delete'
import MergeIcon from '@mui/icons-material/MergeType' // Assuming you have this icon

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

export default function TemporaryDrawer({ vectors, setVectors, showNoteNames, originalVectorsShown, setOriginalVectorsShown }) {
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
    const regex = /^(T|I)(\d+)\((.*)\)$/

    const parseNested = (input) => {
      const match = input.match(regex)
      if (match) {
        const type = match[1]
        const value = parseInt(match[2], 10)
        const { transformations, vector } = parseNested(match[3])
        return { transformations: [...transformations, { type, value }], vector }
      } else {
        const vector = input.replace(/[[\]]/g, '').split(',').map(val => val.trim()).map(val => (isNaN(val) ? noteToNum(val) : parseInt(val, 10)))
        return { transformations: [], vector }
      }
    }

    return parseNested(input)
  }

  const validateVector = (vector) => {
    const uniqueValues = new Set(vector)
    return uniqueValues.size === vector.length && vector.every(val => notes.some(n => n.note === val || n.num === val))
  }

  const handleEditVector = (index) => {
    setEditVectorIndex(index)
    const { transformations, vector } = parseTransformation(vectors[index])
    if (transformations !== null && vector !== null) {
      const displayVector = vector.map(val => showNoteNames ? (isNaN(val) ? val : numToNote(val)) : (isNaN(val) ? noteToNum(val) : val)).join(', ')
      const transformationStr = transformations.map(t => `${t.type}${t.value}`).join('(') + (transformations.length > 0 ? '(' : '') + `[${displayVector}]` + ')'.repeat(transformations.length)
      setTempVector(transformationStr)
    } else {
      setTempVector(vectors[index])
    }
    setErrorMessage('')
  }

  const handleSaveVector = (index) => {
    const { transformations, vector } = parseTransformation(tempVector)
    if (transformations !== null && vector !== null && validateVector(vector)) {
      const displayVector = vector.map(val => isNaN(val) ? noteToNum(val) : val).join(', ')
      const transformationStr = transformations.map(t => `${t.type}${t.value}`).join('(') + (transformations.length > 0 ? '(' : '') + `[${displayVector}]` + ')'.repeat(transformations.length)
      const newVectors = vectors.map((vec, i) => (i === index ? transformationStr : vec))
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
    setOriginalVectorsShown(originalVectorsShown.filter((_, i) => i !== index))
  }

  const applyTransformation = (vector, transformation) => {
    if (transformation.type === 'T') {
      return vector.map(note => (note + transformation.value) % 12)
    } else if (transformation.type === 'I') {
      return vector.map(note => (2 * transformation.value - note + 12) % 12)
    }
    return vector
  }

  const combineTransformations = (index) => {
    const { transformations, vector } = parseTransformation(vectors[index])
    const transformedVector = transformations.reduce((acc, curr) => applyTransformation(acc, curr), vector)
    const combinedTransformation = transformations.filter(t => t.type === 'T').reduce((acc, curr) => acc + curr.value, 0)
    const inversionTransformations = transformations.filter(t => t.type === 'I')
    const combinedVector = inversionTransformations.length
      ? `${inversionTransformations.map(t => `I${t.value}`).join('(')}(T${combinedTransformation}([${transformedVector.join(', ')}]))${')'.repeat(inversionTransformations.length)}`
      : `T${combinedTransformation}([${transformedVector.join(', ')}])`
    const newVectors = vectors.map((vec, i) => (i === index ? combinedVector : vec))
    setVectors(newVectors)
  }

  const toggleOriginalVectorShown = (index) => {
    const newShown = [...originalVectorsShown]
    newShown[index] = !newShown[index]
    setOriginalVectorsShown(newShown)
  }

  const drawerWidth = isMobile ? '60%' : 450

  const DrawerList = (
    <Box sx={{ width: drawerWidth }} role="presentation" edge="start">
      <Box sx={{ padding: 2 }}>
        {vectors.map((vector, index) => {
          const { transformations, vector: parsedVector } = parseTransformation(vector)
          const displayVector = parsedVector.map(val => showNoteNames ? (isNaN(val) ? val : numToNote(val)) : (isNaN(val) ? noteToNum(val) : val)).join(', ')
          const transformationStr = transformations.map(t => `${t.type}${t.value}`).join('(') + (transformations.length > 0 ? '(' : '') + `[${displayVector}]` + ')'.repeat(transformations.length)
          return (
            <Box key={index} sx={{ marginBottom: 1 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', marginBottom: 0 }}>
                <Checkbox
                  checked={!!originalVectorsShown[index]}
                  onChange={() => toggleOriginalVectorShown(index)}
                />
                {editVectorIndex === index ? (
                  <TextField
                    value={tempVector}
                    onChange={handleTempVectorChange}
                    onBlur={() => handleBlur(index)}
                    onKeyPress={(e) => handleKeyPress(e, index)}
                    fullWidth
                    margin="dense"
                    sx={{ marginBottom: 0, marginRight: 1 }}
                    error={!!errorMessage}
                    helperText={errorMessage}
                  />
                ) : (
                  <TextField
                    label={`Vector ${index + 1}`}
                    value={transformationStr}
                    onClick={() => handleEditVector(index)}
                    fullWidth
                    margin="dense"
                    sx={{ marginBottom: 0, marginRight: 1 }}
                    InputProps={{
                      readOnly: true,
                    }}
                  />
                )}
                <MuiIconButton edge="end" aria-label="delete" onClick={() => removeVector(index)} sx={{ padding: 0 }}>
                  <DeleteIcon />
                </MuiIconButton>
              </Box>
              <Tooltip title="Combine Transformations">
                <MuiIconButton
                  aria-label="combine"
                  onClick={() => combineTransformations(index)}
                  sx={{
                    margin: 0,
                    padding: 0,
                    display: 'block',
                    '& .MuiIconButton-root': {
                      padding: '0px',
                      width: '24px',
                      height: '24px',
                    },
                  }}
                >
                  <MergeIcon fontSize="small" />
                </MuiIconButton>
              </Tooltip>
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


