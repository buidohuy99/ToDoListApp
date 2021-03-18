import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { APIWorker } from '../../services/axios';
import { useAuth } from '../../services/auth';

import { Dialog, Grid, TableCell, Tooltip, IconButton, Typography, Table, TableHead, TableRow, TableBody, TableContainer, DialogActions, DialogContent, DialogTitle, Button, Hidden, useTheme } from '@material-ui/core';
import { Alert } from '@material-ui/lab';
import { AssignmentTurnedIn } from '@material-ui/icons';

import { setLoadingPrompt } from '../../redux/loading/loadingSlice';
import { setOpenAssignToTaskDialog, setCurrentModifyingTask } from '../../redux/dialogs/dialogSlice';

export function AssignUserToTaskDialog({open}){
    const dispatch = useDispatch();
    const { current_user } = useAuth();
 
    const [error, setError] = useState(null);

    const taskToModify = useSelector((state) => state.dialog.currentModifyingTask);
    const participantsOfProject = useSelector((state) => state.projectDetail.participantsOfViewingProject);
    const openDialog = useSelector((state) => state.dialog.openAssignToTaskDialog);

    const canUserDoAssignment = useSelector((state) => state.projectDetail.canUserDoAssignment);

    const handleCloseDialog = () => {   
        dispatch(setOpenAssignToTaskDialog(false)); 
        dispatch(setLoadingPrompt(null));
    };

    useEffect(() => {
        dispatch(setOpenAssignToTaskDialog(open));
    }, [open]);

    const handleAssignToUser = async (participant) => {
        dispatch(setLoadingPrompt("Processing your request...."));

        try {
            // api call here
            if(!taskToModify || !taskToModify.id){
                throw new Error("No task to assign user to");
            }
            if(!participant || !participant.id){
                throw new Error("No specified participant to assign task to");
            }

            const result = await APIWorker.patchAPI(`/main-business/v1/task-management/task/${taskToModify.id}`, {
                assignedFor: parseInt(participant.id),
                assignedBy: parseInt(current_user)
            });

            handleCloseDialog();
        } catch (e) {
            dispatch(setLoadingPrompt(null));
            setError(`There has been a problem while assigning user to the task, please recheck your input or internet connection`);
            return;
        }
    }

    return (
        <Dialog
        style={{
            zIndex: 8,
        }}
        open={openDialog}
        onClose={handleCloseDialog}
        onExited={() => {     
            setError(null); 
            if(taskToModify){
                dispatch(setCurrentModifyingTask(null));
            }  
        }}>
            <DialogTitle>{!canUserDoAssignment || (taskToModify && taskToModify.assignedFor && taskToModify.assignedBy)? "Assignment details" : "Assign task to..." }</DialogTitle>
            <DialogContent>
                <Grid container item xs={12}>
                    <Grid container item xs={12}>
                    {
                        participantsOfProject ?
                        !canUserDoAssignment || (taskToModify && taskToModify.assignedFor && taskToModify.assignedBy)?
                        <TableContainer>
                            <Table>
                                <TableHead>
                                    <TableRow>
                                        <TableCell>
                                            Assigned by...
                                        </TableCell>
                                        <TableCell>
                                            Assigned for...
                                        </TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    <TableRow>
                                        <TableCell>
                                            {
                                            !taskToModify?
                                            "Task not found to see details"
                                            :
                                            !taskToModify.assignedBy ? 
                                            "Cannot find user"
                                            :
                                            taskToModify.assignedBy.userName + " ( at " + taskToModify.assignedBy.email + " ) "
                                            }
                                        </TableCell>
                                        <TableCell>
                                            {
                                            !taskToModify?
                                            "Task not found to see details"
                                            :
                                            !taskToModify.assignedFor ? 
                                            "Cannot find user"
                                            :
                                            taskToModify.assignedFor.userName + " ( at " + taskToModify.assignedFor.email + " ) "
                                            }
                                        </TableCell>
                                    </TableRow>
                                </TableBody>
                            </Table>
                        </TableContainer>
                        :
                        <TableContainer>
                            <Table>
                                <TableHead>
                                    <TableRow>
                                        <TableCell>Username</TableCell>
                                        <TableCell>Email</TableCell>
                                        <TableCell>Full name</TableCell>
                                        <TableCell align="right">Actions</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                {participantsOfProject.map((val, idx) => (
                                    <TableRow key={"participant"+idx}>
                                        <TableCell component="th" scope="row">
                                            {val.userDetail.userName}
                                        </TableCell>
                                        <TableCell>
                                            {val.userDetail.email}
                                        </TableCell>
                                        <TableCell>
                                            {val.userDetail.firstName+" "+val.userDetail.lastName}
                                        </TableCell>
                                        <TableCell align="right">
                                            {(() => {
                                                // if not owner, PM or leader, cannot remove
                                                if(!canUserDoAssignment){
                                                    return null;
                                                }

                                                return(
                                                <Tooltip title="Assign">
                                                    <IconButton onClick={() => {
                                                        handleAssignToUser(val.userDetail);
                                                    }}>
                                                        <AssignmentTurnedIn/>
                                                    </IconButton>
                                                </Tooltip>);
                                            })()}
                                        </TableCell>
                                    </TableRow>
                                ))}
                                </TableBody>
                            </Table>
                        </TableContainer>
                        :
                        <Typography variant="body2">
                            There are no participants in project to assign
                        </Typography>
                    }
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
            </DialogActions>
        </Dialog>
    );
}