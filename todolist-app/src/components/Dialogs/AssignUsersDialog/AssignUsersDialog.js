import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
 
import { Dialog, DialogActions, DialogContent, DialogTitle, InputAdornment, IconButton, TextField, FormControl, Input, Grid, Hidden, Button, useTheme, makeStyles, Typography } from '@material-ui/core';
import { Alert } from '@material-ui/lab';

import { setOpenAssignUsersDialog, setParentProject, setIsDialogInSearchMode, setIsLoadingUsersList, setUserListsForAssignDialog, setParticipantsOfAssignDialog } from '../../../redux/dialogs/dialogSlice';
import { setLoadingPrompt } from '../../../redux/loading/loadingSlice';

import { APIWorker } from '../../../services/axios';

import { UsersList } from '../../../components/Dialogs/AssignUsersDialog/UsersList';

const useStyles = makeStyles((theme) => ({
}));

export function AssignUsersDialog({open}){
    const dispatch = useDispatch();
    const classes = useStyles();

    const [error, setError] = useState(null);
    const [disableForm, setDisableForm] = useState(false);
    
    const [searchFieldValue, setSearchFieldValue] = useState(null);

    const openDialog = useSelector((state) => state.dialog.openAssignUsersDialog);
    const parentProjectOfDialog = useSelector((state) => state.dialog.parentProject);

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
            const query = `UserNameOrEmail=${keyword}`;
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
            if(parentProjectOfDialog){
                dispatch(setParentProject(null));
            }
        }}>
        <DialogTitle id="form-dialog-title">Assign users</DialogTitle>
        <DialogContent>
            <Grid container item xs={12} direction="column">
                <Grid item xs={12} style={{
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
                        Users 
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
    </Dialog>);
}