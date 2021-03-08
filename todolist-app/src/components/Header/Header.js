import React, { useState } from 'react';
import clsx from 'clsx';
import Slide from '@material-ui/core/Slide';
import PropTypes from 'prop-types';

import { useAuth, uid_keyname } from '../../services/auth';

import { AppBar, Toolbar, Typography, IconButton, Button, Grid } from '@material-ui/core';
import { makeStyles, useScrollTrigger } from "@material-ui/core";
import { Menu as MenuIcon } from "@material-ui/icons";
import { Link } from "react-router-dom";

import { NAVIGATION_DRAWER_WIDTH } from '../../constants/constants';

import { useSelector, useDispatch } from 'react-redux';
import { setLoadingPrompt } from '../../redux/loading/loadingSlice';
import { setNavigationOpenState } from '../../redux/navigation/navigationSlice';

import { useSignalR } from '../../services/signalR';

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
    }),
    marginRight: 0,
  },
  appBarShift: {
    [theme.breakpoints.up('md')]:{
      width: `calc(100% - ${NAVIGATION_DRAWER_WIDTH}px)`,
      marginLeft: NAVIGATION_DRAWER_WIDTH,
      transition: theme.transitions.create(['margin', 'width'], {
        easing: theme.transitions.easing.easeOut,
        duration: theme.transitions.duration.enteringScreen,
      }),
    },
  },
}));

function HideOnScroll(props) {
  const { children, window } = props;
  // Note that you normally won't need to set the window ref as useScrollTrigger
  // will default to window.
  // This is only being set here because the demo is in an iframe.
  const trigger = useScrollTrigger({ target: window ? window() : undefined });

  return (
    <Slide appear={false} direction="down" in={!trigger}>
      {children}
    </Slide>
  );
}

HideOnScroll.propTypes = {
  children: PropTypes.element.isRequired,
  /**
   * Injected by the documentation to work in an iframe.
   * You won't need it on your project.
   */
  window: PropTypes.func,
};

export default function DefaultAppBar(props) {
    const dispatch = useDispatch();

    const classes = useStyles();
    const { access_token, set_access_token } = useAuth();
    const { signalR } = useSignalR();

    const handleLogOut = async () => {
      dispatch(setLoadingPrompt("Logging you out..."));
      try{
        await signalR.invoke("Logout", parseInt(localStorage.getItem(uid_keyname)));
      } catch (e){
        console.log(e);
      }
      set_access_token(null);
      dispatch(setLoadingPrompt(null));
    };

    const navigationPanelOpenState = Boolean(useSelector((state) => state.navigation.isNavigationOpened));

    return (
      <AppBar position="fixed" className={clsx(classes.appBar, {
        [classes.appBarShift]: navigationPanelOpenState,
      })} style={{
        zIndex: 5,
      }}>
        <Toolbar>  
          <Grid container alignItems="center" justify="center" spacing={2}>
            <Grid item>
              {access_token ?
              <IconButton
                className={classes.navigationDrawerButton}
                aria-label="open navigation drawer"
                onClick={() => {
                  dispatch(
                    setNavigationOpenState(!navigationPanelOpenState)
                  );
                }}
                edge="start"
                variant='contained'
                color='secondary'
              >
                <MenuIcon/>
              </IconButton> : null}
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
                <Grid container item justify="center" spacing={2}>
                  <Grid item>
                    <Button
                      className={classes.defaultButton}
                      onClick={handleLogOut}
                      variant='contained'
                      color='secondary'
                    >
                    Log out
                    </Button>
                  </Grid>
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