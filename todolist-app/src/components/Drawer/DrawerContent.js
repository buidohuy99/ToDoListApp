import { List, MenuItem, ListItemText, ListItemIcon, ListSubheader } from '@material-ui/core';
import { Today as TodayIcon, Schedule as UpcomingIcon, Folder as ProjectsIcon, AccountBox as ProfileIcon } from '@material-ui/icons';

import { useSelector, useDispatch } from 'react-redux';
import { setNavigationOpenState } from '../../redux/navigation/navigationSlice';

import { useHistory } from 'react-router-dom';

import { TODAY_PAGE, UPCOMING_PAGE, PROJECTS_PAGE, PROFILE_PAGE } from '../../constants/constants';

export function DueTasksMenuList() {
    const history = useHistory();
    const dispatch = useDispatch();

    const currentPage = useSelector((state) => state.navigation.currentPage);

    return(
        <div>
            <List>
                <MenuItem button key="Today" onClick={() => {
                    history.push('/tasks/today');
                    dispatch(setNavigationOpenState(false));
                }} selected={ currentPage === TODAY_PAGE ? true : undefined }>
                    <ListItemIcon>
                        <TodayIcon />
                    </ListItemIcon>
                    <ListItemText primary="Today" />
                </MenuItem>
                <MenuItem button key="Upcoming" onClick={() => {
                    history.push('/tasks/upcoming');
                    dispatch(setNavigationOpenState(false));
                }}
                selected={ currentPage === UPCOMING_PAGE ? true : undefined }>
                    <ListItemIcon>
                        <UpcomingIcon />
                    </ListItemIcon>
                    <ListItemText primary="Upcoming" />
                </MenuItem>
            </List>          
        </div>
    );
}

export function NavigationsMenuList(){
    const history = useHistory();
    const dispatch = useDispatch();

    const currentPage = useSelector((state) => state.navigation.currentPage);

    return(
        <div>
            <List>
                <ListSubheader inset>Navigations</ListSubheader>
                <MenuItem button key="My projects"
                onClick={() => {
                    history.push('/projects');
                    dispatch(setNavigationOpenState(false));
                }}
                selected={ currentPage === PROJECTS_PAGE ? true : undefined }>
                    <ListItemIcon>
                        <ProjectsIcon />
                    </ListItemIcon>
                    <ListItemText primary="My projects" />
                </MenuItem>
                <MenuItem button key="Profile"
                onClick={() => {
                    history.push('/profile');
                    dispatch(setNavigationOpenState(false));
                }}
                selected={ currentPage === PROFILE_PAGE ? true : undefined }>
                    <ListItemIcon>
                        <ProfileIcon />
                    </ListItemIcon>
                    <ListItemText primary="Profile" />
                </MenuItem>
            </List>          
        </div>
    );
}