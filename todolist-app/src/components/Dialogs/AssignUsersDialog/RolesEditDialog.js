import { useEffect, useState } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Grid, Typography, Button, Paper, useTheme, Select, MenuItem, FormHelperText, InputLabel, FormControl } from '@material-ui/core';

import { Alert } from '@material-ui/lab';
import { useSelector, useDispatch } from 'react-redux';

import { setUserForUserRolesEditDialog, setOpenUserRolesEditDialog } from '../../../redux/dialogs/dialogSlice';
import { setLoadingPrompt } from '../../../redux/loading/loadingSlice';

import { APIWorker } from '../../../services/axios';

export function RolesEditDialog(){
    const dispatch = useDispatch();
    const theme = useTheme();

    const [error, setError] = useState(null);
    const [disableForm, setDisableForm] = useState(false);

    const [addParticipantRoleField, setAddParticipantRoleField] = useState("");

    const openDialog = useSelector((state) => state.dialog.openUserRolesEditDialog);
    const userForDialog = useSelector((state) => state.dialog.userForUserRolesEditDialog);
    const parentProjectOfDialog = useSelector((state) => state.dialog.parentProject);

    const canUserDoAssignment = useSelector((state) => state.dialog.canUserDoAssignment);

    const handleCloseDialog = () => {   
        dispatch(setOpenUserRolesEditDialog(false)); 
        dispatch(setLoadingPrompt(null));
    };

    const handleAddParticipant = async() => {
        setDisableForm(true);
        dispatch(setLoadingPrompt("Trying to add participant..."));
        try{
            if(!parentProjectOfDialog || !parentProjectOfDialog.id){
                throw new Error("No project specified to start adding participants");
            }
            if(!userForDialog){
                throw new Error("No user specified to start adding participants");
            }
            if(addParticipantRoleField === ""){
                throw new Error("You need to provide a role to add...");
            }
            const result = await APIWorker.postAPI('/main-business/v1/participation-management/participation', {
                projectId: parentProjectOfDialog.id,
                userId: userForDialog.userDetail ? userForDialog.userDetail.id : userForDialog.id,
                roleId: addParticipantRoleField,
            });
            const { data } = result.data;

            handleCloseDialog();
            return;
        }catch(e){
            console.log(e);
            setError("A problem occurred while trying to add participant");
        }
        dispatch(setLoadingPrompt(null));
        setDisableForm(false);
    }

    return (
        <Dialog
        style={{
            zIndex: 9,
        }}
        open={openDialog}
        disableBackdropClick={disableForm}
        onEnter={() => {
            if(!userForDialog || !parentProjectOfDialog){
                handleCloseDialog();
            }
        }}
        onClose={() => {
            handleCloseDialog();         
        }}
        onExited={() => {  
            setError(null);
            setDisableForm(false);
            setAddParticipantRoleField(null);
            if(userForDialog){
                dispatch(setUserForUserRolesEditDialog(null));
            }
        }}>
            <DialogTitle id="form-dialog-title">Roles</DialogTitle>
            <DialogContent>
                <Grid container item xs={12} direction="column">
                    {
                    userForDialog?
                    !userForDialog.rolesInProject ?
                    <Grid container item xs={12} spacing={2}>
                        <Grid xs={12} item>
                            <Typography variant="body1" style={{
                                fontStyle: 'italic',
                                overflowWrap: 'break-word',
                                userSelect: 'none'
                            }}>
                                Adding user ...
                            </Typography>
                        </Grid>
                        <Grid xs={12} item component={Paper} elevation={3} style={{
                            padding: theme.spacing(1),
                            width: '100%'
                        }}>
                            <Grid item xs={12}>
                                <Typography variant="body2" style={{
                                    userSelect: 'none',
                                    fontWeight: 'bold',
                                    overflowWrap: 'break-word'
                                }}>
                                    {userForDialog.userName}
                                </Typography>
                            </Grid>
                            <Grid item xs={12}>
                                <Typography variant="body2" style={{
                                    userSelect: 'none',
                                    overflowWrap: 'break-word'
                                }}>
                                    {userForDialog.email}
                                </Typography>
                            </Grid>
                        </Grid>
                        <Grid xs={12} item>
                            <Typography variant="body1" style={{
                                fontStyle: 'italic',
                                overflowWrap: 'break-word',
                                userSelect: 'none'
                            }}>
                                as ...
                            </Typography>
                        </Grid>
                        <Grid xs={12} item>
                            <FormControl fullWidth disabled={disableForm}>
                                <InputLabel shrink style={{
                                    userSelect: 'none',
                                }}>Role</InputLabel>
                                <Select
                                displayEmpty
                                value={addParticipantRoleField}
                                onChange={(e) => {
                                    setAddParticipantRoleField(e.target.value);
                                }}
                                style={{
                                    marginTop: theme.spacing(2)
                                }}>
                                    <MenuItem value={""}>
                                        <em>None</em>
                                    </MenuItem>
                                    <MenuItem value={2}>PM</MenuItem>
                                    <MenuItem value={3}>Leader</MenuItem>
                                    <MenuItem value={4}>QA</MenuItem>
                                    <MenuItem value={5}>Developer</MenuItem>
                                    <MenuItem value={6}>BA</MenuItem>
                                    <MenuItem value={7}>Member</MenuItem>
                                </Select>
                                <FormHelperText style={{
                                    userSelect: 'none'
                                }}>Role for the new participant</FormHelperText>
                            </FormControl>
                        </Grid>
                        <Grid xs={12} item>
                            <Typography variant="body1" style={{
                                fontStyle: 'italic',
                                overflowWrap: 'break-word',
                                userSelect: 'none'
                            }}>
                                of the project?
                            </Typography>
                        </Grid>
                    </Grid>
                    :  
                    <Grid container item xs={12} spacing={2}>
                        <Grid xs={12} item style={{
                            display: canUserDoAssignment ? 'block' : 'none'
                        }}>
                            <Typography variant="body1" style={{
                                fontStyle: 'italic',
                                overflowWrap: 'break-word'
                            }}>
                                Modifying role of user ...
                            </Typography>
                        </Grid>
                        <Grid xs={12} item component={Paper} elevation={3} style={{
                            padding: theme.spacing(1),
                            width: '100%'
                        }}>
                            <Grid item xs={12}>
                                <Typography variant="body2" style={{
                                    userSelect: 'none',
                                    fontWeight: 'bold',
                                    overflowWrap: 'break-word'
                                }}>
                                    {userForDialog.userDetail.userName}
                                </Typography>
                            </Grid>
                            <Grid item xs={12}>
                                <Typography variant="body2" style={{
                                    userSelect: 'none',
                                    overflowWrap: 'break-word'
                                }}>
                                    {userForDialog.userDetail.email}
                                </Typography>
                            </Grid>
                        </Grid>
                        <Grid xs={12} item >
                            <Typography variant="caption" style={{
                                fontStyle: 'italic'
                            }}>
                                Role
                            </Typography>
                        </Grid>
                    </Grid>
                    :
                    <Alert severity="error">
                        No user is set for this dialog
                    </Alert>
                    }
                    
                    {error ? (<Grid container item xs={12} justify="center">
                        <Alert severity="error">{error}</Alert>
                    </Grid>) : null}
                </Grid>
            </DialogContent>
            <DialogActions>
                <Button disabled={disableForm} onClick={() => {
                    handleCloseDialog();
                }} color="secondary">
                    Close
                </Button>
                {
                userForDialog && !userForDialog.rolesInProject?
                <Button disabled={disableForm} onClick={() => {
                    // add participants
                    handleAddParticipant();
                }} color="primary">
                    Add
                </Button>
                : null
                }
            </DialogActions>
        </Dialog>
    );
}