import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { APIWorker } from '../../services/axios';

import { Dialog, Grid, TextField, DialogActions, DialogContent, DialogContentText, Button, Hidden, useTheme } from '@material-ui/core';
import { Alert } from '@material-ui/lab';

import { setLoadingPrompt } from '../../redux/loading/loadingSlice';
import { setOpenAddModifyTaskDialog, setCurrentModifyingTask, setParentProject } from '../../redux/dialogs/dialogSlice';

export function Add_ModifyTaskDialog({open}){
    const dispatch = useDispatch();
    const theme = useTheme();

    const [disableForm, setDisableForm] = useState(false);
    
    const [error, setError] = useState(null);

    //Form informations
    const [taskNameField, setTaskNameField] = useState(null);

    const taskToModify = useSelector((state) => state.dialog.currentModifyingTask);
    const openDialog = useSelector((state) => state.dialog.openAddModifyTaskDialog);
    const parentProjectOfDialog = useSelector((state) => state.dialog.parentProject);

    const handleCloseDialog = () => {   
        dispatch(setOpenAddModifyTaskDialog(false)); 
        dispatch(setLoadingPrompt(null));
    };

    useEffect(() => {
        dispatch(setOpenAddModifyTaskDialog(open));
    }, [open]);

    useEffect(() => {
        if(taskToModify){
            setTaskNameField(taskToModify.name);
        }else{
            setTaskNameField(null);
        }
    }, [taskToModify]);

    return (
        <Dialog
        style={{
            zIndex: 8,
        }}
        open={openDialog}
        disableBackdropClick={disableForm}
        onClose={handleCloseDialog}
        onExited={() => {
            setTaskNameField(null);     
            setError(null);  
            setDisableForm(false);
            if(taskToModify){
                dispatch(setCurrentModifyingTask(null));
            }   
            if(parentProjectOfDialog){
                dispatch(setParentProject(null));
            }
        }}>
            <form onSubmit={async (e) => {
                e.preventDefault();
                setDisableForm(true);
                dispatch(setLoadingPrompt("Processing your request...."));

                try {
                    // api call here
                    if(!taskToModify){
                        if(!parentProjectOfDialog || !parentProjectOfDialog.id){
                            throw new Error("No project specified to add task");
                        }
                        const newTask = await APIWorker.postAPI("/main-business/v1/task-management/task", {
                            name: taskNameField,
                            projectId: parentProjectOfDialog.id
                        });

                        const { data } = newTask.data;    
                    }

                    handleCloseDialog();

                    // const roomLink = `/room/${data[0]._id}`;
                    // history.push(roomLink);
                } catch (e) {
                    dispatch(setLoadingPrompt(null));
                    setDisableForm(false);
                    setError(`There has been a problem while ${taskToModify ? "modifying" : "creating"} the task, please recheck your input or internet connection`);
                    return;
                }
            }}>
                <DialogContent>
                <DialogContentText>
                    Enter these information below to {taskToModify ? 'modify' : 'create'} a task:
                    <br />
                </DialogContentText>
                <Grid container item xs={12}>
                    <Grid container item xs={12} direction="column">
                        <Grid item>
                            <TextField
                                variant="outlined"
                                required
                                id="TaskName"
                                placeholder="Type in your task name"
                                fullWidth
                                disabled={disableForm}
                                value={taskNameField ? taskNameField : ""}
                                onChange={(e) => {
                                    e.target.value = e.target.value.slice(
                                        0,
                                        Math.min(100, e.target.value.length)
                                    );
                                    setTaskNameField(e.target.value === "" ? null : e.target.value);
                                }}
                                margin="normal"
                            />
                        </Grid>
                    </Grid>
                    {error ? (<Grid container item xs={12} justify="center">
                        <Alert severity="error">{error}</Alert>
                    </Grid>) : null}
                </Grid>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseDialog} color="secondary">
                        Close
                    </Button>
                    <Button
                        type="submit"
                        color="primary"
                        disabled={
                        disableForm ||
                        (!taskNameField || taskNameField.length < 5
                            ? true
                            : false)
                    }>
                        {taskToModify ? 'Modify' : 'Create'}
                    </Button>
                </DialogActions>
            </form>
        </Dialog>
    );
}