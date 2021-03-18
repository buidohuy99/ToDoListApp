import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
 
import { Dialog, DialogActions, DialogContent, DialogTitle, InputAdornment, IconButton, TextField, FormControl, Input, Grid, Hidden, Button, useTheme, makeStyles, Typography } from '@material-ui/core';
import { Alert } from '@material-ui/lab';

import { setOpenAssignUsersDialog, setParentProject, setIsDialogInSearchMode, setIsLoadingUsersList, setUserListsForAssignDialog, setUserForUserRolesEditDialog, setOpenUserRolesEditDialog } from '../../../redux/dialogs/dialogSlice';
import { setLoadingPrompt } from '../../../redux/loading/loadingSlice';
import { setParticipantsOfViewingProject } from '../../../redux/projectDetail/projectDetailSlice';

import { APIWorker } from '../../../services/axios';
import { useAuth } from '../../../services/auth';

import { UsersList } from '../../../components/Dialogs/AssignUsersDialog/UsersList';
import { RolesEditDialog } from '../../../components/Dialogs/AssignUsersDialog/RolesEditDialog';

import { useSignalR } from '../../../services/signalR';

export function AssignUsersDialog({open}){
    const dispatch = useDispatch();
    const history = useHistory();
    const { signalR } = useSignalR();
    const { current_user } = useAuth();

    const [error, setError] = useState(null);
    const [disableForm, setDisableForm] = useState(false);
    
    const [searchFieldValue, setSearchFieldValue] = useState(null);

    const openDialog = useSelector((state) => state.dialog.openAssignUsersDialog);
    const parentProjectOfDialog = useSelector((state) => state.dialog.parentProject);
    const isDialogInSearchMode = useSelector((state) => state.dialog.isDialogInSearchMode);
    const usersListForDialog = useSelector((state) => state.dialog.usersListOfAssignDialog);

    const userRolesDialogIsOpen = useSelector((state) => state.dialog.openUserRolesEditDialog);
    const userForUserRolesDialog = useSelector((state) => state.dialog.userForUserRolesEditDialog);

    const canUserDoAssignment = useSelector((state) => state.projectDetail.canUserDoAssignment);

    const handleCloseDialog = () => {   
        dispatch(setOpenAssignUsersDialog(false)); 
        dispatch(setOpenUserRolesEditDialog(false));
        setSearchFieldValue(null);
        dispatch(setLoadingPrompt(null));
    };

    const searchUsers = async(keyword) => {
        dispatch(setIsLoadingUsersList(true));
        dispatch(setIsDialogInSearchMode(true));
        try{
            if(!parentProjectOfDialog || !parentProjectOfDialog.id){
                throw new Error("No project specified to assign participants");
            }
            const query = `UserNameOrEmail=${keyword}&ExcludeUsersFromProjectId=${parentProjectOfDialog.id}`;
            const result = await APIWorker.callAPI('get', '/main-business/v1/user-management/users?' + query);
            const { data } = result.data;
            dispatch(setUserListsForAssignDialog(data));
        }catch(e){
            console.log(e);
            setError("A problem occurred while searching for users");
        }
        dispatch(setIsLoadingUsersList(false));
    };

    useEffect(() => {
        dispatch(setOpenAssignUsersDialog(open));
    }, [open]);

    const [isUnmounted, setIsUnmounted] = useState(false);

    useEffect(() => {
        return () => {
            setIsUnmounted(true);
        }
    }, []);

    // signalr sent data to display
    useEffect(() => {
        signalR.on("project-participants-list-changed", (data) => {
            if(!isUnmounted && current_user){
                (async() => {
                    setDisableForm(true);
                    dispatch(setLoadingPrompt("An update for participants came from the server..."));
                    dispatch(setParticipantsOfViewingProject(data.users));

                    // check if got kicked
                    const found = data.users.find((e) => parseInt(e.userDetail.id) === parseInt(current_user));
                
                    if(!found){
                        dispatch(setLoadingPrompt("You got kicked out from the project, redirecting to index..."));
                        handleCloseDialog();
                        history.push('/');
                        dispatch(setLoadingPrompt(null));
                        return;
                    } 
                    
                    // change search list to remove participants of project
                    if(usersListForDialog){
                        const newListWithoutParticipants = usersListForDialog.filter((e) => {
                            const filtered = data.users.find(x => x.userDetail.id === e.id);
                            return !filtered;
                        });
                        
                        dispatch(setUserListsForAssignDialog(newListWithoutParticipants));
                    }

                    //update info in roles edit dialog if its open
                    if(userForUserRolesDialog && userRolesDialogIsOpen){
                        const currentUserInEditRolesDialog = data.users.find((val) => userForUserRolesDialog.userDetail && val.userDetail && parseInt(val.userDetail.id) === parseInt(userForUserRolesDialog.userDetail.id));
                        if(currentUserInEditRolesDialog){
                            dispatch(setUserForUserRolesEditDialog(currentUserInEditRolesDialog));
                        }
                    }

                    dispatch(setLoadingPrompt(null));
                    
                    setDisableForm(false);
                })();
            }
        });
    }, [usersListForDialog, userForUserRolesDialog, userRolesDialogIsOpen, current_user, isUnmounted]);

    return (<Dialog 
        fullScreen
        style={{
            zIndex: 8,
        }}
        open={openDialog}
        disableBackdropClick={disableForm}
        onClose={() => {
            handleCloseDialog();         
        }}
        onExited={() => {  
            setError(null);     
            setDisableForm(false);
            setSearchFieldValue(null);
            if(parentProjectOfDialog){
                dispatch(setParentProject(null));
            }
            dispatch(setIsDialogInSearchMode(false));
        }}>
        <DialogTitle id="form-dialog-title">Users</DialogTitle>
        <DialogContent>
            <Grid container item xs={12} direction="column">
                <Grid item xs={12} style={{
                    display: canUserDoAssignment ? 'block' : 'none',
                    marginBottom: 25,
                }}>
                    <TextField color='secondary'
                        fullWidth
                        disabled={disableForm}
                        placeholder="Type in username or email to find user"
                        value={searchFieldValue ? searchFieldValue : ""}
                        onChange={(e) => {
                            if(error){
                                setError(null);
                            }
                            setSearchFieldValue(e.target.value === "" ? null : e.target.value);
                            if(!e.target.value || e.target.value === ""){
                                dispatch(setIsDialogInSearchMode(false));
                            }else{
                                searchUsers(e.target.value);
                            }
                        }}
                    />
                </Grid>
                <Grid xs={12} item>
                    <Typography variant="caption" style={{
                        fontStyle: 'italic'
                    }}>
                        {isDialogInSearchMode ? "Users" : "Participants"}
                    </Typography>
                </Grid>
                <Grid item xs={12}>
                    <UsersList errorSetter={setError}/>
                </Grid>
                {error ? (<Grid container item xs={12} justify="center">
                    <Alert severity="error">{error}</Alert>
                </Grid>) : null}
            </Grid>
        </DialogContent>
        <DialogActions>
            <Button onClick={() => {
                handleCloseDialog();
            }} color="secondary">
                Close
            </Button>
        </DialogActions>
        <RolesEditDialog/>
    </Dialog>);
}