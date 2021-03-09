import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
 
import { Dialog, DialogActions, DialogContent, DialogTitle, InputAdornment, IconButton, TextField, FormControl, Input, Grid, Hidden, Button, useTheme, makeStyles, Typography } from '@material-ui/core';
import { Alert } from '@material-ui/lab';

import { setOpenAssignUsersDialog, setParentProject, setIsDialogInSearchMode, setIsLoadingUsersList, setUserListsForAssignDialog, setParticipantsOfAssignDialog, setCanUserDoAssignment } from '../../../redux/dialogs/dialogSlice';
import { setLoadingPrompt } from '../../../redux/loading/loadingSlice';

import { APIWorker } from '../../../services/axios';
import { uid_keyname } from '../../../services/auth';

import { UsersList } from '../../../components/Dialogs/AssignUsersDialog/UsersList';
import { RolesEditDialog } from '../../../components/Dialogs/AssignUsersDialog/RolesEditDialog';

import { useSignalR } from '../../../services/signalR';

const useStyles = makeStyles((theme) => ({

}));

export function AssignUsersDialog({open}){
    const dispatch = useDispatch();
    const history = useHistory();
    const {signalR} = useSignalR();

    const [error, setError] = useState(null);
    const [disableForm, setDisableForm] = useState(false);
    
    const [searchFieldValue, setSearchFieldValue] = useState(null);

    const openDialog = useSelector((state) => state.dialog.openAssignUsersDialog);
    const parentProjectOfDialog = useSelector((state) => state.dialog.parentProject);
    const isDialogInSearchMode = useSelector((state) => state.dialog.isDialogInSearchMode);
    const usersListForDialog = useSelector((state) => state.dialog.usersListOfAssignDialog);
    const participantsOfProject = useSelector((state) => state.dialog.participantsOfAssignDialog);

    const canUserDoAssignment = useSelector((state) => state.dialog.canUserDoAssignment);

    const handleCloseDialog = () => {   
        dispatch(setOpenAssignUsersDialog(false)); 
        setSearchFieldValue(null);
        dispatch(setLoadingPrompt(null));
    };

    const getParticipants = async() => {
        setDisableForm(true);
        dispatch(setIsLoadingUsersList(true));
        dispatch(setIsDialogInSearchMode(false));
        try{
            if(!parentProjectOfDialog || !parentProjectOfDialog.id){
                throw new Error("No project specified to assign participants");
            }
            const query = `ProjectId=${parentProjectOfDialog.id}`;
            const result = await APIWorker.callAPI('get', '/main-business/v1/participation-management/participations?' + query);
            const { data } = result.data;
            dispatch(setParticipantsOfAssignDialog(data.users));
        }catch(e){
            console.log(e);
            setError("A problem occurred while fetching participants of this project");
        }
        dispatch(setIsLoadingUsersList(false));
        setDisableForm(false);
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

    useEffect(() => {
        if(openDialog && participantsOfProject){
            const currentUser = localStorage.getItem(uid_keyname);
            if(currentUser){
                const filter = participantsOfProject.filter((e) => {
                    if(parseInt(e.userDetail.id) === parseInt(currentUser)){
                        // only allow
                        const filteredRoles = e.rolesInProject.filter(role => parseInt(role.id) < 4);
                        if(filteredRoles && filteredRoles.length > 0){
                            return true;
                        }
                    }
                    return false;
                });

                if(filter && filter.length > 0){
                    dispatch(setCanUserDoAssignment(true));
                }
            }
        }
    }, [openDialog, participantsOfProject]);

    // process signalr sent data use effect to display
    useEffect(() => {
        signalR.on("project-participants-list-changed", (data) => {
            setDisableForm(true);
            dispatch(setLoadingPrompt("An update for participants came from the server..."));
            dispatch(setParticipantsOfAssignDialog(data.users));
            
            // check if got kicked
            const currentUser = localStorage.getItem(uid_keyname);
            const found = data.users.filter((e) => parseInt(e.userDetail.id) === parseInt(currentUser));
           
            if(!found || found.length <= 0){
                dispatch(setLoadingPrompt("You got kicked out from the project, redirecting to index..."));
                handleCloseDialog();
                history.push('/');
                dispatch(setLoadingPrompt(null));
                return;
            } 
              
            // change 
            if(usersListForDialog){
                const copyOfUsersList = usersListForDialog.slice();
                const newListWithoutParticipants = copyOfUsersList.filter((e) => {
                    const filtered = data.users.filter(x => x.userDetail.id === e.id);
                    return (!filtered || filtered.length <= 0);
                });
                
                dispatch(setUserListsForAssignDialog(newListWithoutParticipants));
            }

            dispatch(setLoadingPrompt(null));
            
            setDisableForm(false);
        });
    }, [usersListForDialog]);

    return (<Dialog 
        fullScreen
        style={{
            zIndex: 8,
        }}
        open={openDialog}
        disableBackdropClick={disableForm}
        onEnter={() => {
            getParticipants();
        }}
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
                            if(error) {
                                setDisableForm(true);
                                return;
                            }
                            setSearchFieldValue(e.target.value === "" ? null : e.target.value);
                            if(!e.target.value || e.target.value === ""){
                                getParticipants();
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
                    <UsersList/>
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