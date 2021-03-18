import clsx from 'clsx';

import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { Grid, Paper, ListItem, ListItemIcon, ListItemText, ListItemSecondaryAction, makeStyles, IconButton, Typography, Checkbox, Tooltip, useTheme } from '@material-ui/core';
import { FiberManualRecord } from '@material-ui/icons';
import { RemoveCircle, AssignmentInd, MoreHoriz } from '@material-ui/icons';

import { setLoadingPrompt, setGlobalError } from '../../redux/loading/loadingSlice';
import { setCurrentModifyingTask, setOpenAssignToTaskDialog } from '../../redux/dialogs/dialogSlice';

import { APIWorker } from '../../services/axios';
import { useAuth } from '../../services/auth';

const useStyles = makeStyles((theme) => ({
    root: {
      width: '100%',
    },
    nested: {
        paddingLeft: theme.spacing(4),
    },
}));

export function TaskInProject({isNested, task}){
    const classes = useStyles();
    const dispatch = useDispatch();
    const theme = useTheme();
    const { current_user } = useAuth();

    const [isDone, setTaskDone] = useState(task ? task.isDone : false);

    const canUserDoAssignment = useSelector((state) => state.projectDetail.canUserDoAssignment);

    const onCheckBoxStateChange = async(event) => {
        if(task && task.assignedFor && task.assignedFor.id && parseInt(task.assignedFor.id) === parseInt(current_user)){
            const checkState = Boolean(event.target.checked);

            dispatch(setLoadingPrompt('Updating task status...'));
            try{
                if(!task || !task.id){
                    throw new Error("Cannot update an inexistent task");
                }
                const result = await APIWorker.patchAPI(`/main-business/v1/task-management/task/${task.id}`, {
                    isTaskDone: checkState,
                });  
            }catch(e){
                console.log(e);
                dispatch(setGlobalError("Cannot update done status of task"));
            } 
            dispatch(setLoadingPrompt(null));
        }
    };

    const onRemoveTaskClick = async() => {
        if(task && task.id){
            dispatch(setLoadingPrompt('Processing task deletion...'));
            try{
                if(!task || !task.id){
                    throw new Error("Cannot delete an inexistent task");
                }
                const result = await APIWorker.callAPI('delete', `/main-business/v1/task-management/task/${task.id}`);
            }catch(e){
                console.log(e);
                dispatch(setGlobalError("Cannot delete task"));
            } 
            dispatch(setLoadingPrompt(null));
        }
    }

    useEffect(() => {
        if(!task){
            setTaskDone(false);
        }else{
            setTaskDone(Boolean(task.isDone));
        }
    } , [task]);

    return (
       <ListItem className={clsx(classes.root, {
           [classes.nested]: isNested
       })} component={!isNested ? Paper : null} elevation={3}>
            <ListItemIcon>
                <IconButton size="small" onClick={() => {

                }}>
                    <FiberManualRecord/>
                </IconButton>
            </ListItemIcon>
            <ListItemText style={{
                userSelect: 'none',
            }}>
                <Grid style={{
                    borderRadius: 20,
                    padding: 3,
                    background: task && task.assignedFor && task.assignedFor.id ? theme.palette.secondary.light : 'grey',
                    maxWidth: 100,
                    textAlign: 'center',
                }} container item justify="center">
                {task && task.assignedFor && task.assignedFor.id?
                    <Typography variant="caption" style={{
                        wordBreak: 'break-word'
                    }}>
                        Assigned 
                    </Typography>
                    :
                    <Typography variant="caption" style={{
                        fontStyle: 'italic',
                        color: 'white',
                        wordBreak: 'break-word'
                    }}>
                        Unassigned
                    </Typography>
                }
                </Grid>
                <Typography variant="body2" style={{
                    fontStyle: task && task.name ? 'normal' : 'italic',
                    overflowWrap: 'break-word',
                    marginTop: 10,
                }}>
                    {task && task.name ? task.name : "This task is empty"}
                </Typography>
            </ListItemText>

            <Grid style={{
                display: 'flex',
                justifyContent: 'center',
                flexWrap: 'wrap'
            }}>
                <Tooltip title="Finished/unfinished?">
                    <Checkbox checked={Boolean(isDone)} onChange={onCheckBoxStateChange} disabled={task && task.assignedFor && task.assignedFor.id && parseInt(task.assignedFor.id) === parseInt(current_user) ? false : true }>
                    </Checkbox>
                </Tooltip>

                {
                canUserDoAssignment || (task && task.assignedFor && task.assignedBy)?
                <Tooltip title={!canUserDoAssignment || (task && task.assignedFor && task.assignedFor.id) ? "Assignment details" : "Assign user"}>
                    <IconButton size="small" onClick={() => {
                        dispatch(setCurrentModifyingTask(task));
                        dispatch(setOpenAssignToTaskDialog(true));
                    }}>
                        {
                            !canUserDoAssignment || (task && task.assignedFor && task.assignedFor.id) ?
                            <MoreHoriz/>
                            :
                            <AssignmentInd/>
                        }
                    </IconButton>
                </Tooltip> 
                : 
                null
                }

                {
                canUserDoAssignment ? 
                <Tooltip title="Delete task...">
                    <IconButton size="small" onClick={() => {
                        onRemoveTaskClick();
                    }}>
                        <RemoveCircle/>
                    </IconButton>
                </Tooltip> : null
                }
            </Grid>
        </ListItem>
    );
}