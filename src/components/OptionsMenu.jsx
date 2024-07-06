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
              <Divider />
              <FormControlLabel control={<Checkbox />} label="Invert Contrast" />
              <FormControlLabel control={<Checkbox />} label="Braille Mode" />
              <FormControlLabel control={<Checkbox defaultChecked />} label="Grid" />
              <FormControlLabel control={<Checkbox defaultChecked />} label="Axis Numbers" />
              <FormControlLabel control={<Checkbox />} label="Small Grid" />
              <FormControlLabel control={<Checkbox />} label="Arrows" />
              <Divider />
              <Typography variant="subtitle1" gutterBottom>X Axis</Typography>
              <Typography variant="subtitle2">Range: -10 to 10</Typography>
              <Typography variant="subtitle1" gutterBottom>Y Axis</Typography>
              <Typography variant="subtitle2">Range: -10.62 to 10.62</Typography>
              <Divider />
              <FormControlLabel control={<Checkbox />} label="Radians" />
              <FormControlLabel control={<Checkbox />} label="Degrees" />
              <Divider />
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
