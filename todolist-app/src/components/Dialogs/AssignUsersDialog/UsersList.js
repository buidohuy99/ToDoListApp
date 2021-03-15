import { useSelector, useDispatch } from 'react-redux';

import { Grid, Typography, Paper, Divider, IconButton, Tooltip, CircularProgress, Button, Table, TableCell, TableRow, TableBody, TableHead, TableContainer } from '@material-ui/core';
import { Alert } from '@material-ui/lab';
import { PersonAddOutlined, MoreHoriz, RemoveCircle } from '@material-ui/icons';

import { setLoadingPrompt } from '../../../redux/loading/loadingSlice';

import { setOpenUserRolesEditDialog, setUserForUserRolesEditDialog } from '../../../redux/dialogs/dialogSlice';
import { uid_keyname } from '../../../services/auth';
import { APIWorker } from '../../../services/axios';

import { useEffect, useState } from 'react';

export function UsersList({errorSetter}) {
    const dispatch = useDispatch();

    const usersListForDialog = useSelector((state) => state.dialog.usersListOfAssignDialog);
    const participantsOfProject = useSelector((state) => state.dialog.participantsOfAssignDialog);
    const isLoadingUsersList = useSelector((state) => state.dialog.isLoadingUsersList);
    const isDialogInSearchMode = useSelector((state) => state.dialog.isDialogInSearchMode);

    const openAssignUsersDialog = useSelector((state) => state.dialog.openAssignUsersDialog);

    const parentProjectOfDialog = useSelector((state) => state.dialog.parentProject);
    const canUserDoAssignment = useSelector((state) => state.dialog.canUserDoAssignment);

    const [ownerParticipant, setOwnerParticipant] = useState(null);

    useEffect(() => {
        dispatch(setLoadingPrompt("Getting infos of project owner..."));
        // update owner
        (async() => {
            if(openAssignUsersDialog && participantsOfProject){
                const owner = participantsOfProject.find((value) => {
                    const filterOwner = value.rolesInProject.find((val) => parseInt(val.id) === 1);
                    if(filterOwner){
                        return true;
                    }
                    return false;
                });
                if(owner){
                    setOwnerParticipant(owner);
                }
            }
            dispatch(setLoadingPrompt(null));
        })();
    }, [openAssignUsersDialog, participantsOfProject]);

    const handleAddParticipant = (user) => {
        dispatch(setUserForUserRolesEditDialog(user));
        dispatch(setOpenUserRolesEditDialog(true));
    };

    const handleRemoveUserFromProject = (userid) => {
        dispatch(setLoadingPrompt("Trying to remove the specified user..."));
        (async() => {
            try{
                if(!parentProjectOfDialog || !parentProjectOfDialog.id){
                    throw new Error("No project specified to start removal");
                }
                if(!userid){
                    throw new Error("No user specified to start removal");
                }
                const query = `RemoveFromProjectId=${parentProjectOfDialog.id}&RemoveUserId=${userid}`
                const result = await APIWorker.callAPI('delete', '/main-business/v1/participation-management/participation?' + query);
                const { data } = result.data;

                dispatch(setLoadingPrompt(null));
                return;
            }catch(e){
                console.log(e);
                if(errorSetter){
                    errorSetter("A problem occurred while trying to remove the user");
                }
            }
            dispatch(setLoadingPrompt(null));
        })();
    }

    return (
    <Grid container item xs={12} style={{
        minHeight: 300,
        maxHeight: 300,
        overflowY: 'auto'
    }}>
        <Grid item xs={12}>
            {
            isLoadingUsersList?
                <Grid item xs={12}>
                    <CircularProgress size="small" color="primary"></CircularProgress>
                </Grid>
            :
            isDialogInSearchMode?(
            usersListForDialog? 
                usersListForDialog.length > 0 ?
                <TableContainer component={Paper}>
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
                        {usersListForDialog.map((val, idx) => (
                            <TableRow key={"participant"+idx}>
                                <TableCell component="th" scope="row">
                                    {val.userName}
                                </TableCell>
                                <TableCell>
                                    {val.email}
                                </TableCell>
                                <TableCell>
                                    {val.firstName+" "+val.lastName}
                                </TableCell>
                                <TableCell align="right">
                                    {(() => {
                                    // if not owner, PM or leader, cannot remove
                                    if(!canUserDoAssignment){
                                        return null;
                                    }

                                    return(
                                    <Tooltip title="Add participant">
                                        <IconButton onClick={() => {
                                            handleAddParticipant(val);
                                        }}>
                                            <PersonAddOutlined/>
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
                <Grid container item xs={12} justify="center">
                    <Alert severity="error">
                        Cannot find any user of such
                    </Alert>
                </Grid>
            :
                <Grid container item xs={12} justify="center">
                    <Alert severity="info">
                        Initializing...
                    </Alert>
                </Grid>
            ):(
            participantsOfProject ?
                participantsOfProject.length > 0 ?
                <TableContainer component={Paper}>
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
                                    {
                                    (() => {
                                    const currentUser = localStorage.getItem(uid_keyname);
                                    if(!currentUser){
                                        return null;
                                    }

                                    //if participant is himself
                                    if(parseInt(currentUser) === parseInt(val.userDetail.id)){
                                        return null;
                                    }

                                    //if participant is owner
                                    if(ownerParticipant && parseInt(val.userDetail.id) === parseInt(ownerParticipant.userDetail.id)){
                                        return null;
                                    }

                                    // if not owner, PM or leader, cannot remove
                                    if(!canUserDoAssignment){
                                        return null;
                                    }

                                    return(<Tooltip title="Remove from project">
                                        <IconButton onClick={() => {
                                            handleRemoveUserFromProject(val.userDetail.id);
                                        }}>
                                            <RemoveCircle/>
                                        </IconButton>
                                    </Tooltip>);
                                    })()
                                    }
                                    <Tooltip title="See roles">
                                        <IconButton onClick={() => {
                                            handleAddParticipant(val);
                                        }}>
                                            <MoreHoriz/>
                                        </IconButton>
                                    </Tooltip>
                                </TableCell>
                            </TableRow>
                        ))}
                        </TableBody>
                    </Table>
                </TableContainer>
                :
                <Grid container item xs={12} justify="center">
                    <Alert severity="error">
                        Cannot find any user of such
                    </Alert>
                </Grid>
            :
                <Grid container item xs={12} justify="center">
                    <Alert severity="info">
                        Please start by adding a participant through searching
                    </Alert>
                </Grid>
            )
            } 
        </Grid>
    </Grid>);
}