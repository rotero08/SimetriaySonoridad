import React, { useState } from 'react'
import Box from '@mui/material/Box'
import Drawer from '@mui/material/Drawer'
import IconButton from '@mui/material/IconButton'
import MenuIcon from '@mui/icons-material/Menu'
import { useTheme, useMediaQuery, TextField, IconButton as MuiIconButton, Tooltip, Checkbox, Popover, Typography, Grid } from '@mui/material'
import DeleteIcon from '@mui/icons-material/Delete'
import MergeIcon from '@mui/icons-material/MergeType'
import TransformIcon from '@mui/icons-material/Transform'
import SwapVertIcon from '@mui/icons-material/SwapVert'

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
const generateColor = (index) => `hsl(${index * 137.508}, 100%, 50%)`

export default function TemporaryDrawer({ colorMapping, setColorMapping, vectors, setVectors, showNoteNames, originalVectorsShown, setOriginalVectorsShown, inversionAxesShown, setInversionAxesShown }) {
  const [open, setOpen] = useState(false)
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'))
  const [editVectorIndex, setEditVectorIndex] = useState(null)
  const [tempVector, setTempVector] = useState('')
  const [errorMessage, setErrorMessage] = useState('')
  const [popoverAnchor, setPopoverAnchor] = useState(null)
  const [popoverType, setPopoverType] = useState('')
  const [popoverIndex, setPopoverIndex] = useState(null)

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
    const newVectors = [...vectors, '[]']
    const newColorMapping = [...colorMapping, generateColor(vectors.length)]
    setVectors(newVectors)
    setColorMapping(newColorMapping)
  }

  const removeVector = (index) => {
    const newVectors = vectors.filter((_, i) => i !== index)
    const newOriginalVectorsShown = originalVectorsShown.filter((_, i) => i !== index)
    const newInversionAxesShown = inversionAxesShown.filter((_, i) => i !== index)
    const newColorMapping = colorMapping.filter((_, i) => i !== index)

    setVectors(newVectors)
    setOriginalVectorsShown(newOriginalVectorsShown)
    setInversionAxesShown(newInversionAxesShown)
    setColorMapping(newColorMapping)
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
    const newColorMapping = [...colorMapping]

    if (newShown[index]) {
      newColorMapping.splice(index * 2 + 1, 1)
    } else {
      newColorMapping.splice(index * 2 + 1, 0, generateColor(colorMapping.length))
    }

    newShown[index] = !newShown[index]
    setColorMapping(newColorMapping)
    setOriginalVectorsShown(newShown)
  }

  const toggleInversionAxisShown = (index) => {
    const newShown = [...inversionAxesShown]
    const newColorMapping = [...colorMapping]

    if (newShown[index]) {
      newColorMapping.splice(index * 2 + 1, 1)
    } else {
      newColorMapping.splice(index * 2 + 1, 0, generateColor(colorMapping.length))
    }

    newShown[index] = !newShown[index]
    setColorMapping(newColorMapping)
    setInversionAxesShown(newShown)
  }

  const handlePopoverOpen = (event, type, index) => {
    setPopoverAnchor(event.currentTarget)
    setPopoverType(type)
    setPopoverIndex(index)
  }

  const handlePopoverClose = () => {
    setPopoverAnchor(null)
    setPopoverType('')
    setPopoverIndex(null)
  }

  const handleSelectNumber = (number) => {
    if (popoverType && popoverIndex !== null) {
      const type = popoverType
      const index = popoverIndex
      const { transformations, vector } = parseTransformation(vectors[index])
      const updatedTransformations = [...transformations, { type, value: number }]
      const displayVector = vector.map(val => (isNaN(val) ? noteToNum(val) : val)).join(', ')
      const transformationStr = updatedTransformations.map(t => `${t.type}${t.value}`).join('(') + (updatedTransformations.length > 0 ? '(' : '') + `[${displayVector}]` + ')'.repeat(updatedTransformations.length)
      const newVectors = vectors.map((vec, i) => (i === index ? transformationStr : vec))
      setVectors(newVectors)
      handlePopoverClose()
    }
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
                <Box sx={{ display: 'flex', flexDirection: 'column', marginRight: 1 }}>
                  <Checkbox
                    checked={!!originalVectorsShown[index]}
                    onChange={() => toggleOriginalVectorShown(index)}
                  />
                  <Checkbox
                    checked={!!inversionAxesShown[index]}
                    onChange={() => toggleInversionAxisShown(index)}
                  />
                </Box>
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
              <Box sx={{ display: 'flex', justifyContent: 'space-between', marginTop: 1 }}>
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
                <Tooltip title="Add Transformation">
                  <MuiIconButton
                    aria-label="add-transformation"
                    onClick={(event) => handlePopoverOpen(event, 'T', index)}
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
                    <TransformIcon fontSize="small" />
                  </MuiIconButton>
                </Tooltip>
                <Tooltip title="Add Inversion">
                  <MuiIconButton
                    aria-label="add-inversion"
                    onClick={(event) => handlePopoverOpen(event, 'I', index)}
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
                    <SwapVertIcon fontSize="small" />
                  </MuiIconButton>
                </Tooltip>
              </Box>
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
      <Popover
        open={Boolean(popoverAnchor)}
        anchorEl={popoverAnchor}
        onClose={handlePopoverClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'left',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'left',
        }}
      >
        <Box sx={{ p: 1, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <Typography variant="subtitle2" sx={{ mb: 1 }}>Select number</Typography>
          <Grid container spacing={1}>
            {Array.from({ length: 12 }, (_, i) => (
              <Grid item xs={4} key={i}>
                <Typography
                  sx={{
                    cursor: 'pointer',
                    textAlign: 'center',
                    backgroundColor: 'lightgray',
                    borderRadius: 1,
                    p: 0.5,
                    '&:hover': {
                      backgroundColor: 'gray',
                      color: 'white'
                    }
                  }}
                  onClick={() => handleSelectNumber(i)}
                >
                  {i}
                </Typography>
              </Grid>
            ))}
          </Grid>
        </Box>
      </Popover>
    </Box>
  )
}
