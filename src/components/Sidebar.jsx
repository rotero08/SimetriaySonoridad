import React from 'react'
import Box from '@mui/material/Box'
import Drawer from '@mui/material/Drawer'
import IconButton from '@mui/material/IconButton'
import MenuIcon from '@mui/icons-material/Menu'
import { useTheme, useMediaQuery, TextField, Button, Select, MenuItem, List, ListItem, ListItemText, ListItemSecondaryAction, IconButton as MuiIconButton } from '@mui/material'
import DeleteIcon from '@mui/icons-material/Delete'

export default function TemporaryDrawer({ transformation, setTransformation, numSelected, setNumSelected, transformations, addTransformation, removeTransformation }) {
  const [open, setOpen] = React.useState(false)
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'))

  const toggleDrawer = (newOpen) => () => {
    setOpen(newOpen)
  }

  // Dynamic drawer width based on screen size
  const drawerWidth = isMobile ? '60%' : 450 // Full width on mobile

  // Drawer content
  const DrawerList = (
    <Box
      sx={{ width: drawerWidth }}
      role="presentation"
      edge="start"
    >
      <Box sx={{ padding: 2 }}>
        <Select
          value={numSelected}
          onChange={(event) => setNumSelected(event.target.value)}
          fullWidth
          margin="normal"
        >
          <MenuItem value={2}>2</MenuItem>
          <MenuItem value={3}>3</MenuItem>
          <MenuItem value={4}>4</MenuItem>
        </Select>
        <TextField
          label="Transformation"
          type="number"
          value={transformation}
          onChange={(e) => setTransformation(Number(e.target.value))}
          min="1"
          max="11"
          fullWidth
          margin="normal"
        />
        <Button variant="contained" color="secondary" onClick={addTransformation} fullWidth sx={{ mt: 2 }}>
          Add Transformation
        </Button>
        <List>
          {transformations.map((t, index) => (
            <ListItem key={index}>
              <ListItemText primary={`T${t}(V1)`} />
              <ListItemSecondaryAction>
                <MuiIconButton edge="end" aria-label="delete" onClick={() => removeTransformation(index)}>
                  <DeleteIcon />
                </MuiIconButton>
              </ListItemSecondaryAction>
            </ListItem>
          ))}
        </List>
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
