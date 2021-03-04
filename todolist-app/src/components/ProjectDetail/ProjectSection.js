import { useState } from 'react';

import { Paper, List, ListItem, ListItemIcon, ListItemText, Collapse, makeStyles, IconButton } from '@material-ui/core';
import { ExpandMore, ExpandLess, ChatBubbleOutline } from '@material-ui/icons';

import { TaskInProject } from './TaskInProject';

import {  } from '../../redux/projectDetail/projectDetailSlice';

const useStyles = makeStyles((theme) => ({
    root: {
      width: '100%'
    },
  }));

export function ProjectSection({component}){
    const classes = useStyles();

    const [open, setOpen] = useState(false);

    const handleClick = () => {
        setOpen(!open);
    }

    return (
        <List className={classes.root} component={Paper} elevation={3}>     
            <ListItem>
                <ListItemIcon>
                    <IconButton onClick={handleClick} size="small">
                        {open ? <ExpandLess /> : <ExpandMore />}
                    </IconButton>
                </ListItemIcon>
                <ListItemText primary="Project Item" />
            </ListItem>
            <Collapse in={open} timeout="auto" unmountOnExit>
                <List component="div" disablePadding>
                    <TaskInProject isNested/>
                </List>
            </Collapse>
        </List>
    );
}