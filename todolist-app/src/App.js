import clsx from 'clsx';

import { BrowserRouter, Switch, Route } from "react-router-dom";
import PrivateRoute from './routes/PrivateRoute';
import AuthRoute from './routes/AuthRoute';

import { ProjectsView as Projects } from './pages/Projects';
import { TasksCollection } from './pages/TasksCollection';
import { Login } from './pages/Login';
import { SignUp } from './pages/SignUp';
import ProjectDetail from './pages/ProjectDetail';
import { Profile } from './pages/Profile';

import Header from './components/Header/Header';
import Footer from './components/Footer/Footer';

import NotFoundPage from './pages/NotFoundPage';

import { ThemeProvider } from '@material-ui/styles';
import { theme as pageTheme } from './themes/WebsiteThemePalette';

import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { CssBaseline, Grid, Backdrop, Typography, Slide, Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, Button } from '@material-ui/core';
import { makeStyles, useTheme } from "@material-ui/core";

import GlobalDrawer from './components/Drawer/Drawer';

import {NAVIGATION_DRAWER_WIDTH} from './constants/constants';

import { AuthProvider } from './services/auth';
import { SignalRProvider } from './services/signalR';

import { setGlobalError } from './redux/loading/loadingSlice';

const useStyles = makeStyles((theme) => ({
  loadingBackdrop: {
    zIndex: theme.zIndex.drawer + 2,
    color: "#fff",
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    overflowY: 'hidden'
  },
  globalErrorDialog: {
    zIndex: theme.zIndex.drawer + 1,
  },
  content: {
    flexGrow: 1,
    padding: theme.spacing(3),
    transition: theme.transitions.create('margin', {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
    }),
    marginLeft: 0,
  },
  contentShift: {
    [theme.breakpoints.up('md')]:{
      transition: theme.transitions.create('margin', {
          easing: theme.transitions.easing.easeOut,
          duration: theme.transitions.duration.enteringScreen,
      }),
      marginLeft: NAVIGATION_DRAWER_WIDTH,
    }
  },
  footer: {
    padding: theme.spacing(3),
    transition: theme.transitions.create('margin', {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
    }),
    marginLeft: 0
  },
  footerShift: {
    [theme.breakpoints.up('md')]:{
      transition: theme.transitions.create('margin', {
          easing: theme.transitions.easing.easeOut,
          duration: theme.transitions.duration.enteringScreen,
      }),
      marginLeft: NAVIGATION_DRAWER_WIDTH,
    }
  },
  toolbar: theme.mixins.toolbar,
}));

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

function App() {
  const classes = useStyles();
  const theme = useTheme();
  const dispatch = useDispatch();

  const isDrawerOpen = Boolean(useSelector((state) => state.navigation.isNavigationOpened));
  const loadingPrompt = useSelector((state) => state.loading.loadingPrompt);
  const globalError = useSelector((state) => state.loading.globalError);

  return (
    <ThemeProvider theme={pageTheme}>
      <BrowserRouter>
        <SignalRProvider>
          <AuthProvider>  
            <header>
              <CssBaseline/>
              <Header/>
            </header>              
            <main className={clsx(classes.content, {
              [classes.contentShift]: isDrawerOpen,
            })}>
              <Grid item xs={12} className={classes.toolbar}>
              </Grid>
              <GlobalDrawer/>
              <Switch>
                <PrivateRoute exact path='/'>
                  <Projects/>
                </PrivateRoute>

                <AuthRoute exact path='/login'>
                  <Login/>
                </AuthRoute>

                <AuthRoute exact path='/signup'>
                  <SignUp/>
                </AuthRoute>

                <PrivateRoute exact path='/projects'>
                  <Projects/>
                </PrivateRoute>

                <PrivateRoute exact path='/project/:project_id'>
                  <ProjectDetail/>
                </PrivateRoute>

                <PrivateRoute exact path='/tasks/:tasks_group'>
                  <TasksCollection/>
                </PrivateRoute>

                <PrivateRoute exact path='/profile'>
                  <Profile/>
                </PrivateRoute>
                
                <Route component={NotFoundPage}/>
              </Switch>
            </main>

            <footer className={clsx(classes.footer, {
              [classes.footerShift]: isDrawerOpen,
            })}>
              <Footer />
            </footer>

            <Backdrop open={loadingPrompt !== null}
              className={classes.loadingBackdrop}
              style={{
                visibility: loadingPrompt ? 'visible' : 'hidden'
              }}>
              <img src={process.env.PUBLIC_URL + '/memo-nib.gif'} style={{
                width: 96,
                height: 96,
                marginBottom: 15,
              }}/>
              <Typography variant="body1" style={{ color: "white", userSelect: 'none' }}>
                {loadingPrompt}
              </Typography>
            </Backdrop>

            {/* Error dialog */}
            <Dialog
              fullWidth
              maxWidth="sm"
              open={globalError ? true : false}
              TransitionComponent={Transition}
              keepMounted
              onClose={() => {
                dispatch(setGlobalError(null));
              }}
            >
              <DialogTitle>
                <Typography color="secondary">{"Đã xảy ra lỗi..."}</Typography>
              </DialogTitle>
              <DialogContent>
                <DialogContentText id="alert-dialog-slide-description">
                  {globalError}
                </DialogContentText>
              </DialogContent>
              <DialogActions>
                <Button onClick={() => {
                  dispatch(setGlobalError(null));
                }} color="secondary">
                  Đóng
                </Button>
              </DialogActions>
            </Dialog>
            
          </AuthProvider>     
        </SignalRProvider>

        
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;
