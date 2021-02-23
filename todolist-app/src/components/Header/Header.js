import React, { useState } from 'react';
import clsx from 'clsx';

import { useAuth } from '../../contexts/auth';

import { AppBar, Toolbar, Typography, IconButton, Menu, MenuItem, Button, Grid } from '@material-ui/core';
import { makeStyles } from "@material-ui/core";
import { AccountCircle, Menu as MenuIcon } from "@material-ui/icons";
import { Link, useHistory } from "react-router-dom";

import { NAVIGATION_DRAWER_WIDTH } from '../../constants/constants';

import { useSelector, useDispatch } from 'react-redux';
import { setNavigationOpenState } from '../../redux/navigation/navigationSlice';

const useStyles = makeStyles((theme) => ({
    title: {
      flexGrow: 1,
      [theme.breakpoints.down('xs')]: {
        justifyContent: 'center',
        textAlign: 'center'
      }
    },
    titleText: {
      color: "inherit",
      fontSize: 18,
      fontWeight: 'bold',
      [theme.breakpoints.down('xs')]: {
        fontSize: 16,
      }
    },
    defaultButton: {
      textAlign: 'center'
    },
    navigationDrawerButton: {
      display: 'block',   
      [theme.breakpoints.down('xs')]: {
        fontSize: 16,
        justifyContent: 'center'
      }
    },
    appBar: {
      transition: theme.transitions.create(['margin', 'width'], {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
      })
    },
    appBarShift: {
      [theme.breakpoints.up('sm')]:{
        width: `calc(100% - ${NAVIGATION_DRAWER_WIDTH}px)`,
        marginLeft: NAVIGATION_DRAWER_WIDTH,
        transition: theme.transitions.create(['margin', 'width'], {
          easing: theme.transitions.easing.easeOut,
          duration: theme.transitions.duration.enteringScreen,
        }),
      }
    },
  }));

export default function DefaultAppBar() {
    const classes = useStyles();
    const [anchorEl, setAnchorEl] = useState(null);
    const { access_token, set_access_token } = useAuth();
    const open = Boolean(anchorEl);
  
    const history = useHistory();
  
    const handleMenu = (event) => {
      setAnchorEl(event.currentTarget);
    };
  
    const handleClose = () => {
      setAnchorEl(null);
    };
  
    const handleLogOut = async () => {
        set_access_token(null);
        setAnchorEl(null);
        history.push("/");
    };
  
    const handleProfile = () => {
        history.push("/profile");
    };

    const navigationPanelOpenState = Boolean(useSelector((state) => state.navigation.isNavigationOpened));
    const loadingPrompt = useSelector((state) => state.loading.loadingPrompt);

    const dispatch = useDispatch();

    return (
      <AppBar position="sticky" className={clsx(classes.appBar, {
        [classes.appBarShift]: navigationPanelOpenState,
      })}>
        <Toolbar>  
          <Grid container alignItems="center" justify="center" spacing={2}>
            <Grid item style={{
              display: access_token && loadingPrompt === null ? 'block' : 'none'
            }}>
              <IconButton
                className={classes.navigationDrawerButton}
                color="inherit"
                aria-label="open navigation drawer"
                onClick={() => {
                  dispatch(
                    setNavigationOpenState(!navigationPanelOpenState)
                  );
                }}
                edge="start"
              >
                <MenuIcon/>
              </IconButton>
            </Grid>
            <Grid item className={classes.title}>
              <Typography
                  className={classes.titleText}
                  variant="h6"
                  color="inherit"
                  component={Link}
                  to="/"
                  style={{
                    textDecoration: 'none'
                  }}>
                  My Todolist
              </Typography> 
            </Grid>
            <Grid item>
              {access_token ? (
                <Grid style={{
                  display: loadingPrompt === null ? 'block' : 'none'
                }}>
                  <IconButton
                    onClick={handleMenu}
                    aria-label="account of current user"
                    aria-controls="menu-appbar"
                    aria-haspopup="true"
                    color="inherit"
                  >
                    <AccountCircle />
                  </IconButton>
                  <Menu
                    id="menu-appbar"
                    anchorEl={anchorEl}
                    anchorOrigin={{
                      vertical: "top",
                      horizontal: "right",
                    }}
                    keepMounted
                    transformOrigin={{
                      vertical: "top",
                      horizontal: "right",
                    }}
                    open={open}
                    onClose={handleClose}
                  >
                    <MenuItem onClick={handleProfile}>Profile</MenuItem>
                    <MenuItem onClick={handleLogOut}>Log Out</MenuItem>
                  </Menu>
                </Grid>
              ) : (
                <Grid container item justify="center" spacing={2}>
                  <Grid item>
                    <Button
                    className={classes.defaultButton}
                    color="inherit"
                    href="/signup"
                    >
                    Sign Up
                    </Button>
                  </Grid>
                  <Grid item>
                    <Button
                    className={classes.defaultButton}
                    color="inherit"
                    href="/login"
                    >
                    Login
                    </Button>
                  </Grid>
                </Grid>
              )}
            </Grid>
          </Grid>
        </Toolbar>
      </AppBar>
    );
}