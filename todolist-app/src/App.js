import clsx from 'clsx';

import { BrowserRouter, Switch, Route} from "react-router-dom";
import PrivateRoute from './routes/PrivateRoute';
import AuthRoute from './routes/AuthRoute';

import { ProjectsView as Projects } from './pages/Projects';
import { TasksCollection } from './pages/TasksCollection';
import { Login } from './pages/Login';
import { ProjectDetail } from './pages/ProjectDetail';
import { Profile } from './pages/Profile';

import Header from './components/Header/Header';
import Footer from './components/Footer/Footer';

import NotFoundPage from './pages/NotFoundPage';

import { ThemeProvider } from '@material-ui/styles';
import { theme as pageTheme } from './themes/WebsiteThemePalette';

import { useSelector, useDispatch } from 'react-redux';
import { CssBaseline, Drawer, CircularProgress, IconButton, Divider, Backdrop, Grid, Typography } from '@material-ui/core';
import { makeStyles } from "@material-ui/core";

import GlobalDrawer from './components/Drawer/Drawer';

import {NAVIGATION_DRAWER_WIDTH} from './constants/constants';

import {AuthProvider} from './contexts/auth';

const useStyles = makeStyles((theme) => ({
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

  const isDrawerOpen = Boolean(useSelector((state) => state.navigation.isNavigationOpened));
  const loadingPrompt = useSelector((state) => state.loading.loadingPrompt);

  return (
    <ThemeProvider theme={pageTheme}>
      <BrowserRouter>
        <AuthProvider>
          <CssBaseline/>
          <Header/>        
          <GlobalDrawer/>
          <main className={clsx(classes.content, {
            [classes.contentShift]: isDrawerOpen,
          })}>
            <Switch>
              <PrivateRoute exact path='/'>
                <Projects/>
              </PrivateRoute>

              <AuthRoute exact path='/login'>
                <Login/>
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

          <Backdrop
            open={loadingPrompt !== null}
            style={{ position: "fixed", color: "#fff", zIndex: 100, height: "100%", width: "100%" }}
          >
            <Grid container item justify="center">
              <Grid container item xs={12} className={classes.toolbar}>
              </Grid>
              <Grid container item xs={12} justify="center" style={{
                marginBottom: 15,
              }}>
                <CircularProgress color="inherit" />
              </Grid>
              <Grid container item xs={12} justify="center">
                <Typography variant="body1" style={{ color: "white" }}>
                  {loadingPrompt}
                </Typography>
              </Grid>
            </Grid>
          </Backdrop>
        </AuthProvider>
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;
