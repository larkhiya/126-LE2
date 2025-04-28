import React from "react";
import { useState } from "react";
import {
  AppBar,
  Link,
  Drawer,
  Box,
  Typography,
  IconButton,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";

function NavBar({ isSignedIn }) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <AppBar
        position="sticky"
        sx={{
          boxShadow: "none",
          backgroundColor: "#D77676",
          display: "flex",
          flexDirection: "row",
          padding: { xs: "0rem 1.25rem", sm: "0rem 2.5rem" },
          justifyContent: "space-between",
        }}
      >
        <IconButton
          size="large"
          edge="start"
          onClick={() => setOpen(true)}
          sx={{
            "&:hover": {
              backgroundColor: "transparent",
            },
            color: "inherit",
            display: { xs: "block", sm: "block", md: "none" },
          }}
        >
          <MenuIcon />
        </IconButton>

        <h2 className="navitem">Bakz</h2>

        <Box
          className="nav-group"
          sx={{ 
            flexDirection: "row",
            display: { xs: "none", sm: "none", md:"flex" } }}
        >
          <Link to="/" style={{ textDecoration: "none" }}>
            <h2 className="navitem">Home</h2>
          </Link>

          <Link to="/" style={{ textDecoration: "none" }}>
            <h2 className="navitem">Discover</h2>
          </Link>

          <Link
            to="/"
            style={{
              textDecoration: "none",
              display: isSignedIn ? "block" : "none",
            }}
          >
            <h2 className="navitem">My shelf</h2>
          </Link>
        </Box>

        <Link to="/" style={{ textDecoration: "none" }} sx={{display: { xs: "none", sm: "none", md: "block" }}}>
          <h2 className="navitem">{isSignedIn ? "Sign out" : "Sign in"}</h2>
        </Link>
      </AppBar>

      <Drawer anchor="left" open={open} onClose={() => setOpen(false)}>
        <Box p={2} width="250px" textAlign="center" role="presentation">
       
        </Box>
      </Drawer>
    </>
  );
}

export default NavBar;
