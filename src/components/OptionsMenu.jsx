import React, { useState } from 'react'
import { IconButton, Popper, Box, FormControlLabel, Checkbox, Typography, Divider, ClickAwayListener, Paper, Slider } from '@mui/material'
import SettingsIcon from '@mui/icons-material/Settings'

const OptionsMenu = ({ numSelected, setNumSelected, showNoteNames, setShowNoteNames }) => {
  const [anchorEl, setAnchorEl] = useState(null)

  const handleClick = (event) => {
    if (anchorEl) {
      setAnchorEl(null)
    } else {
      setAnchorEl(event.currentTarget)
    }
  }

  const handleClickAway = () => {
    setAnchorEl(null)
  }

  const handleNumSelectedChange = (event, newValue) => {
    setNumSelected(newValue)
  }

  const handleShowNoteNamesChange = (event) => {
    setShowNoteNames(event.target.checked)
  }

  const open = Boolean(anchorEl)
  const id = open ? 'options-popper' : undefined

  return (
    <>
      <IconButton
        color="primary"
        onClick={handleClick}
        style={{ position: 'absolute', top: 10, right: 10 }}
        aria-describedby={id}
      >
        <SettingsIcon />
      </IconButton>
      <Popper id={id} open={open} anchorEl={anchorEl} placement="bottom-end" disablePortal>
        <ClickAwayListener onClickAway={handleClickAway}>
          <Paper>
            <Box sx={{ width: 300, padding: 2 }}>
              <Typography variant="h6" gutterBottom>Options</Typography>
              <FormControlLabel
                control={<Checkbox checked={showNoteNames} onChange={handleShowNoteNamesChange} />}
                label="Show Note Names"
              />
              <Typography variant="subtitle1" gutterBottom>Number of Clickable Points</Typography>
              <Slider
                value={numSelected}
                onChange={handleNumSelectedChange}
                step={1}
                min={0}
                max={12}
                valueLabelDisplay="auto"
              />
            </Box>
          </Paper>
        </ClickAwayListener>
      </Popper>
    </>
  )
}

export default OptionsMenu
