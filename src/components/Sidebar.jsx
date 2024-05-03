import React from 'react'
import Box from '@mui/material/Box'
import Drawer from '@mui/material/Drawer'
import IconButton from '@mui/material/IconButton'
import MenuIcon from '@mui/icons-material/Menu'
import { useTheme, useMediaQuery } from '@mui/material'

export default function TemporaryDrawer() {
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
      onClick={toggleDrawer(false)}
      onKeyDown={toggleDrawer(false)}
      edge="start"
    >
      {/* Add content here such as list items */}
    </Box>
  )

  return (
    <div>
      <IconButton
        color="primary"
        onClick={toggleDrawer(true)}
      >
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
    </div>
  )
}
