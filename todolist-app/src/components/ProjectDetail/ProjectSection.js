import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';

import { Paper, List, ListItem, ListItemIcon, ListItemText, Collapse, makeStyles, IconButton, Typography, Grid, Tooltip, InputBase, ClickAwayListener, Button } from '@material-ui/core';
import { ExpandMore, ExpandLess, AddCommentOutlined, RemoveCircle } from '@material-ui/icons';

import { TaskInProject } from './TaskInProject';

import { setLoadingPrompt, setGlobalError } from '../../redux/loading/loadingSlice';
import { setParentProject, setOpenAddModifyTaskDialog } from '../../redux/dialogs/dialogSlice';

import { APIWorker } from '../../services/axios';

const useStyles = makeStyles((theme) => ({
    root: {
      width: '100%'
    },
    input: {
        borderRadius: 10,
        padding: 5,
        fontSize: theme.typography.body2.fontSize,
        "&:focus": {
            border: `2px solid ${theme.palette.primary.main}`,
        },
        fontWeight: 'bold'
    }
  }));

export function ProjectSection({section}){
    const classes = useStyles();
    const dispatch = useDispatch();

    const [open, setOpen] = useState(false);

    const [sectionName, setSectionName] = useState(section ? section.name : '');
    const [isEditingOn, setIsEditingOn] = useState(false);
    const [disableForm, setDisableForm] = useState(false);

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

    const onDoneButtonClick = async () => {
        setDisableForm(true);
        setIsEditingOn(false);  
        dispatch(setLoadingPrompt('Updating section...'));
        try{
            if(!section || !section.id){
                throw new Error("Cannot update an inexistent section");
            }
            const result = await APIWorker.patchAPI(`/main-business/v1/project-management/project/${section.id}`, {
                name: sectionName
            });  
        }catch(e){
            console.log(e);
            dispatch(setGlobalError("Cannot update section name..."));
        }
        dispatch(setLoadingPrompt(null));
        setSectionName('');
        setDisableForm(false);
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
                    <InputBase
                        value={isEditingOn? sectionName : section && section.name ? section.name : "This section is empty"}
                        fullWidth
                        multiline
                        inputProps={{
                            className: classes.input,
                        }}
                        placeholder="Your section name goes here"
                        onBlur={() => {
                            onDoneButtonClick();
                        }}
                        onFocus={() => {
                            const placeholder = section && section.name ? section.name : "";
                            setIsEditingOn(true);
                            setSectionName(placeholder);
                        }}
                        onChange={(e) => {
                            e.target.value = e.target.value.slice(
                                0,
                                Math.min(100, e.target.value.length)
                            );
                            setSectionName(e.target.value);
                        }}
                        disabled={!section || !section.name || disableForm}>
                    </InputBase>
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