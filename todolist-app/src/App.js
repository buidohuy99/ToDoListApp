import clsx from 'clsx';

import {useAuth} from './contexts/auth';
import { BrowserRouter, Switch, Route} from "react-router-dom";
import PrivateRoute from './routes/PrivateRoute';
import AuthRoute from './routes/AuthRoute';

import {Dashboard} from './pages/Dashboard';
import { Login } from './pages/Login';

import Header from './components/Header/Header';
import Footer from './components/Footer/Footer';
import DrawerContent from './components/Drawer/DrawerContent';

import NotFoundPage from './pages/NotFoundPage';

import { ThemeProvider } from '@material-ui/styles';
import { theme as pageTheme } from './themes/WebsiteThemePalette';

import { useSelector, useDispatch } from 'react-redux';
import { CssBaseline, Drawer, CircularProgress, IconButton, Divider, Backdrop, Grid, Typography } from '@material-ui/core';
import { makeStyles, useTheme } from "@material-ui/core";

import {ChevronLeft, ChevronRight } from '@material-ui/icons';

import {NAVIGATION_DRAWER_WIDTH} from './constants/constants';

import {setNavigationOpenState} from './redux/navigation/navigationSlice';

const useStyles = makeStyles((theme) => ({
  content: {
    flexGrow: 1,
    padding: theme.spacing(3),
    transition: theme.transitions.create('margin', {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
    }),
    marginLeft: 0,
    height: "100%"
  },
  contentShift: {
    [theme.breakpoints.up('sm')]:{
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
    [theme.breakpoints.up('sm')]:{
      transition: theme.transitions.create('margin', {
          easing: theme.transitions.easing.easeOut,
          duration: theme.transitions.duration.enteringScreen,
      }),
      marginLeft: NAVIGATION_DRAWER_WIDTH,
    }
  },
  drawer: {
    [theme.breakpoints.up('sm')]: {
      width: NAVIGATION_DRAWER_WIDTH,
      flexShrink: 0,
    },
  },
  drawerHeader: {
    display: 'flex',
    alignItems: 'center',
    padding: theme.spacing(0, 1),
    // necessary for content to be below app bar
    ...theme.mixins.toolbar,
    justifyContent: 'flex-end',
  },
  drawerPaper: {
    width: NAVIGATION_DRAWER_WIDTH,
  },
  toolbar: theme.mixins.toolbar,
}));

function App() {
  const classes = useStyles();
  const theme = useTheme();
  const {access_token} = useAuth();
  const dispatch = useDispatch();

  const isDrawerOpen = Boolean(useSelector((state) => state.navigation.isNavigationOpened));
  const loadingPrompt = useSelector((state) => state.loading.loadingPrompt);

  return (
    <ThemeProvider theme={pageTheme}>
      <BrowserRouter>
        <Header/>
        <CssBaseline/>
        {
          access_token ?
          <nav className={classes.drawer} aria-label="navigations">
            <Drawer open={isDrawerOpen} classes={{
                paper: classes.drawerPaper,
            }}>
              <div className={classes.drawerHeader}> 
                <IconButton onClick={() => {
                  dispatch(
                    setNavigationOpenState(!isDrawerOpen)
                  );
                }}>
                  {theme.direction === 'ltr' ? <ChevronLeft /> : <ChevronRight />}
                </IconButton>
              </div>
              <Divider />
              <DrawerContent/>
            </Drawer>
          </nav> : null
        }
        <main className={clsx(classes.content, {
          [classes.contentShift]: isDrawerOpen,
        })}>
          <Switch>
            <PrivateRoute exact path='/'>
              <Dashboard/>
            </PrivateRoute>

            <AuthRoute exact path='/login'>
              <Login/>
            </AuthRoute>

            <Route exact path='/test/dashboard'>
              <Dashboard/>
            </Route>

            <Route component={NotFoundPage}/>
          </Switch>
        </main>

        <footer className={clsx(classes.footer, {
          [classes.footerShift]: isDrawerOpen,
        })} style={{
          backgroundColor: 'yellow'
        }}>
          <Footer />
        </footer>

        <Backdrop
          open={loadingPrompt !== null}
          style={{ color: "#fff", zIndex: 100 }}
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
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;
