import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';

import { Paper, List, ListItem, ListItemIcon, ListItemText, Collapse, makeStyles, IconButton, Typography, Grid, Tooltip } from '@material-ui/core';
import { ExpandMore, ExpandLess, AddCommentOutlined, RemoveCircle } from '@material-ui/icons';

import { TaskInProject } from './TaskInProject';

import { setLoadingPrompt, setGlobalError } from '../../redux/loading/loadingSlice';
import { setParentProject, setOpenAddModifyTaskDialog } from '../../redux/dialogs/dialogSlice';

import { APIWorker } from '../../services/axios';

const useStyles = makeStyles((theme) => ({
    root: {
      width: '100%'
    },
  }));

export function ProjectSection({section}){
    const classes = useStyles();
    const dispatch = useDispatch();

    const [open, setOpen] = useState(false);

    const handleClick = () => {
        setOpen(!open);
    }

    const deleteSection = async() => {
        dispatch(setLoadingPrompt("Processing your deletion request..."));
        try{
            if(!section || !section.id){
                throw new Error("No section specified to delete");
            }
            const result = await APIWorker.callAPI('delete', `/main-business/v1/project-management/project/${parseInt(section.id)}`);
            const { data } = result.data;
        }catch(e){
            console.log(e);
            dispatch(setGlobalError("Section deletion request encountered an error ~"));
        }
        dispatch(setLoadingPrompt(null));
    };

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
                        overflowWrap: 'break-word',
                    }}>
                        {section && section.name ? section.name : 'Project have no name' }
                    </Typography>
                </ListItemText>
                <Grid style={{
                    display: 'flex',
                    justifyContent: 'center',
                    flexWrap: 'wrap'
                }}>
                    <Tooltip title="Add task">
                        <IconButton onClick={() => {
                            dispatch(setParentProject(section));
                            dispatch(setOpenAddModifyTaskDialog(true));
                        }}>
                            <AddCommentOutlined/>
                        </IconButton>
                    </Tooltip>
                    <Tooltip title="Remove section">
                        <IconButton onClick={() => {
                            deleteSection();
                        }}>
                            <RemoveCircle/>
                        </IconButton>
                    </Tooltip>
                </Grid>
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
                        <Typography variant="body2" style={{
                            fontStyle: 'italic'
                        }}>
                            There are no child tasks
                        </Typography>
                    </Grid>
                    }
                </List>
            </Collapse>
        </List>
    );
}