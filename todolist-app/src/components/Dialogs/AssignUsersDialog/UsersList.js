import { useSelector, useDispatch } from 'react-redux';

import { Grid, Typography, Paper, Divider, IconButton, Tooltip, CircularProgress, Button, Table, TableCell, TableRow, TableBody, TableHead, TableContainer } from '@material-ui/core';
import { Alert } from '@material-ui/lab';
import { PersonAddOutlined, MoreHoriz, RemoveCircle } from '@material-ui/icons';

import { setLoadingPrompt } from '../../../redux/loading/loadingSlice';

import { setOpenUserRolesEditDialog, setUserForUserRolesEditDialog } from '../../../redux/dialogs/dialogSlice';
import { uid_keyname } from '../../../services/auth';
import { useEffect, useState } from 'react';

export function UsersList() {
    const dispatch = useDispatch();

    const usersListForDialog = useSelector((state) => state.dialog.usersListOfAssignDialog);
    const participantsOfProject = useSelector((state) => state.dialog.participantsOfAssignDialog);
    const isLoadingUsersList = useSelector((state) => state.dialog.isLoadingUsersList);
    const isDialogInSearchMode = useSelector((state) => state.dialog.isDialogInSearchMode);
    const canUserDoAssignment = useSelector((state) => state.dialog.canUserDoAssignment);

    const handleAddParticipant = (user) => {
        dispatch(setUserForUserRolesEditDialog(user));
        dispatch(setOpenUserRolesEditDialog(true));
    };

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
                                    if(!currentUser || !val.rolesInProject){
                                        return null;
                                    }

                                    //if participant is himself
                                    if(parseInt(currentUser) === parseInt(val.userDetail.id)){
                                        return null;
                                    }

                                    // if not owner, PM or leader, cannot remove
                                    if(!canUserDoAssignment){
                                        return null;
                                    }

                                    return(<Tooltip title="Remove user">
                                        <IconButton>
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