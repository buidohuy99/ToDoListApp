import { useAuth } from '../../services/auth';
import { useTheme, Drawer ,IconButton, Divider, makeStyles } from '@material-ui/core';
import { ChevronLeft, ChevronRight } from '@material-ui/icons';

import { useDispatch, useSelector } from 'react-redux';

import { DueTasksMenuList, NavigationsMenuList } from './DrawerContent';

import { setNavigationOpenState } from '../../redux/navigation/navigationSlice';
import {NAVIGATION_DRAWER_WIDTH} from '../../constants/constants';

const useStyles = makeStyles((theme) => ({
    drawer: {
      width: NAVIGATION_DRAWER_WIDTH,
      flexShrink: 0,
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

export default function GlobalDrawer() {
    const theme = useTheme();
    const {access_token} = useAuth();
    const dispatch = useDispatch();

    const classes = useStyles();

    const isDrawerOpen = Boolean(useSelector((state) => state.navigation.isNavigationOpened));

    return(
        access_token ?
        <nav className={classes.drawer} aria-label="navigations">
          <Drawer open={isDrawerOpen} classes={{
            paper: classes.drawerPaper,
          }} onClose={() => {
            dispatch(
              setNavigationOpenState(!isDrawerOpen)
            );
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
            {/* <DueTasksMenuList />
            <Divider /> */}
            <NavigationsMenuList />
          </Drawer>
        </nav> : null
    );
}