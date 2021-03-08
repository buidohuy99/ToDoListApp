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

import { useSelector, useDispatch } from 'react-redux';
import { CssBaseline, Grid, CircularProgress, Backdrop, Typography } from '@material-ui/core';
import { makeStyles, useTheme } from "@material-ui/core";

import GlobalDrawer from './components/Drawer/Drawer';

import {NAVIGATION_DRAWER_WIDTH} from './constants/constants';

import { AuthProvider } from './services/auth';
import { SignalRProvider } from './services/signalR';

const useStyles = makeStyles((theme) => ({
  loadingBackdrop: {
    zIndex: theme.zIndex.drawer + 1,
    color: "#fff",
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    overflowY: 'hidden'
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

function App() {
  const classes = useStyles();
  const theme = useTheme();

  const isDrawerOpen = Boolean(useSelector((state) => state.navigation.isNavigationOpened));
  const loadingPrompt = useSelector((state) => state.loading.loadingPrompt);

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
              className={classes.loadingBackdrop}>
              <CircularProgress color="inherit" style={{
                marginBottom: 15,
              }}/>
              <Typography variant="body1" style={{ color: "white", userSelect: 'none' }}>
                {loadingPrompt}
              </Typography>
            </Backdrop>
            
          </AuthProvider>     
        </SignalRProvider>

        
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;
