import React from "react";
import { useState, useContext } from "react";
import {
  AppBar,
  Drawer,
  Box,
  Typography,
  IconButton,
  createTheme,
  ThemeProvider,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import { Link } from "react-router-dom";
import AuthContext from "../../context/AuthContext.js";

const theme = createTheme({
  typography: {
    drawerLink: {
      fontSize: "1.75rem",
      fontWeight: 400,
      color: "#D77676",
    },
  },
});

function NavBar({ isSignedIn }) {
  const [open, setOpen] = useState(false);
  let { user, logoutUser } = useContext(AuthContext);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };
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
          alignItems: "center",
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

        <img src="/images/logo.svg" alt="Reader" className="nav-img" />

        <Box
          className="nav-group"
          sx={{
            flexDirection: "row",
            display: { xs: "none", sm: "none", md: "flex" },
          }}
        >
          <Link to="/" onClick={scrollToTop} style={{ textDecoration: "none" }}>
            <h2 className="navitem">Home</h2>
          </Link>

          <Link
            to="/discover"
            onClick={scrollToTop}
            style={{ textDecoration: "none" }}
          >
            <h2 className="navitem">Discover</h2>
          </Link>

          <Link
            to="/profile"
            onClick={scrollToTop}
            style={{
              textDecoration: "none",
              display: user ? "block" : "none",
            }}
          >
            <h2 className="navitem">My shelf</h2>
          </Link>
        </Box>

        <Box
          sx={{
            display: { xs: "none", sm: "none", md: "block" },
          }}
        >
          <Link
            to="/login"
            onClick={user ? logoutUser : () => {}}
            style={{ textDecoration: "none" }}
          >
            <h2 className="navitem">{user ? "Sign out" : "Sign in"}</h2>
          </Link>
        </Box>
      </AppBar>

      <ThemeProvider theme={theme}>
        <Drawer anchor="left" open={open} onClose={() => setOpen(false)}>
          <Box
            marginY={5}
            width="250px"
            textAlign="center"
            role="presentation"
            display="flex"
            flexDirection="column"
            justifyContent="space-between"
            style={{ height: "100%" }}
          >
            <Box display="flex" flexDirection="column" gap="1rem">
              <Link
                to="/"
                style={{ textDecoration: "none" }}
                onClick={() => setOpen(false)}
              >
                <Typography variant="drawerLink">Home</Typography>
              </Link>

              <Link
                to="/discover"
                style={{ textDecoration: "none" }}
                onClick={() => setOpen(false)}
              >
                <Typography variant="drawerLink">Discover</Typography>
              </Link>

              <Link
                to="/profile"
                style={{
                  textDecoration: "none",
                  display: isSignedIn ? "block" : "none", // Show only when signed in
                }}
                onClick={() => setOpen(false)}
              >
                <Typography variant="drawerLink">My Shelf</Typography>
              </Link>

              <Link
                to={"/details"}
                style={{ textDecoration: "none" }}
                onClick={() => setOpen(false)}
              >
                <Typography variant="drawerLink">Details</Typography>
              </Link>
            </Box>

            <Link
              to={isSignedIn ? "/signout" : "/signin"}
              style={{ textDecoration: "none" }}
              onClick={() => setOpen(false)}
            >
              <Typography variant="drawerLink">
                {isSignedIn ? "Sign out" : "Sign in"}
              </Typography>
            </Link>
          </Box>
        </Drawer>
      </ThemeProvider>
    </>
  );
}

export default NavBar;
