import { useState } from 'react';

import { Paper, List, ListItem, ListItemIcon, ListItemText, Collapse, makeStyles, IconButton, Typography, Grid, Tooltip } from '@material-ui/core';
import { ExpandMore, ExpandLess, AddCommentOutlined } from '@material-ui/icons';
import { Alert } from '@material-ui/lab';

import { TaskInProject } from './TaskInProject';

const useStyles = makeStyles((theme) => ({
    root: {
      width: '100%'
    },
  }));

export function ProjectSection({section}){
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
                <ListItemText>
                    <Typography variant="body2" style={{
                        fontWeight: section && section.name ? 'bold' : 'normal',
                        fontStyle: section && section.name ? 'normal' : 'italic',
                    }}>
                        {section && section.name ? section.name : 'Project doesnt have a name' }
                    </Typography>
                </ListItemText>
                <Tooltip title="Add task">
                    <IconButton>
                        <AddCommentOutlined/>
                    </IconButton>
                </Tooltip>
            </ListItem>
            {/* all the children tasks goes here */}
            <Collapse in={open} timeout="auto" unmountOnExit>
                <List disablePadding component={Grid} item>
                    {section && section.childrenTasks && section.childrenTasks.length > 0 ?
                        section.childrenTasks.map((val, idx) => (
                            <Grid key={"childTasksOfSection"+idx} item xs={12}>
                                <TaskInProject isNested task={val}/>
                            </Grid>
                        ))   
                    :<Grid container item xs={12} justify="center">
                        <Alert severity="info">
                            There are no child tasks
                        </Alert>
                    </Grid>
                    }
                </List>
            </Collapse>
        </List>
    );
}