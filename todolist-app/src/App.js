import clsx from 'clsx';

import {useAuth} from './contexts/auth';
import { BrowserRouter, Switch, Route} from "react-router-dom";
import PrivateRoute from './routes/PrivateRoute';
import AuthRoute from './routes/AuthRoute';

import {Dashboard} from './pages/Dashboard';
import { Login } from './pages/Login';

import Header from './components/Header/Header';
import Footer from './components/Footer/Footer';

import NotFoundPage from './pages/NotFoundPage';

import { ThemeProvider } from '@material-ui/styles';
import { theme as pageTheme } from './themes/WebsiteThemePalette';

import { useState } from 'react';
import { useSelector } from 'react-redux';
import { CssBaseline, Drawer, Hidden, IconButton, Divider, List, ListItem, ListItemText, ListItemIcon } from '@material-ui/core';
import { makeStyles, useTheme } from "@material-ui/core";

import {ChevronLeft, ChevronRight, Inbox as InboxIcon, Mail as MailIcon } from '@material-ui/icons';

import {NAVIGATION_DRAWER_WIDTH} from './constants/constants';

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
    transition: theme.transitions.create('margin', {
        easing: theme.transitions.easing.easeOut,
        duration: theme.transitions.duration.enteringScreen,
    }),
    marginLeft: NAVIGATION_DRAWER_WIDTH,
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
}));

function App() {
  const classes = useStyles();
  const theme = useTheme();
  const {access_token} = useAuth();

  const drawer = (
      <div>
          <List>
          {['Inbox', 'Starred', 'Send email', 'Drafts'].map((text, index) => (
              <ListItem button key={text}>
              <ListItemIcon>{index % 2 === 0 ? <InboxIcon /> : <MailIcon />}</ListItemIcon>
              <ListItemText primary={text} />
              </ListItem>
          ))}
          </List>
          <Divider />
          <List>
          {['All mail', 'Trash', 'Spam'].map((text, index) => (
              <ListItem button key={text}>
              <ListItemIcon>{index % 2 === 0 ? <InboxIcon /> : <MailIcon />}</ListItemIcon>
              <ListItemText primary={text} />
              </ListItem>
          ))}
          </List>
      </div>
  );

  const [isDrawerOpen, setDrawerOpen] = useState(Boolean(useSelector((state) => state.navigation.isNavigationOpened)));

  return (
    <ThemeProvider theme={pageTheme}>
      <BrowserRouter>
          <CssBaseline/>
          <Header/>
          {
            access_token ?
            <Hidden xsDown>
              <nav className={classes.drawer} aria-label="navigations">
                <Drawer variant="temporary" open={isDrawerOpen} classes={{
                    paper: classes.drawerPaper,
                }}>
                  <div className={classes.drawerHeader}> 
                    <IconButton onClick={() => {
                      setDrawerOpen(false);
                    }}>
                      {theme.direction === 'ltr' ? <ChevronLeft /> : <ChevronRight />}
                    </IconButton>
                  </div>
                  <Divider />
                  {drawer}
                </Drawer>
              </nav>
            </Hidden> : null
          }
          <main className={clsx(classes.content, {
            [classes.contentShift]: isDrawerOpen && access_token != null,
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

          <footer className={clsx(classes.content, {
            [classes.contentShift]: isDrawerOpen && access_token != null,
          })} style={{
            backgroundColor: 'yellow'
          }}>
            <Footer />
          </footer>
        </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;
