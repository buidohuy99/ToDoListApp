import React, { useEffect, useState } from 'react';
import { Tooltip, IconButton, Dialog, DialogTitle, DialogContent, DialogActions, Grid, Typography, Button, Paper, useTheme, Select, MenuItem, FormHelperText, InputLabel, FormControl, Table, TableBody, TableHead, TableRow, TableCell, TableContainer, Divider } from '@material-ui/core';
import { RemoveCircle } from '@material-ui/icons';

import { Alert } from '@material-ui/lab';
import { useSelector, useDispatch } from 'react-redux';

import { setUserForUserRolesEditDialog, setOpenUserRolesEditDialog, addNewRole, removeRole } from '../../../redux/dialogs/dialogSlice';
import { setLoadingPrompt } from '../../../redux/loading/loadingSlice';

function AddRoleComponent({disableForm}) {
    const theme = useTheme();
    const dispatch = useDispatch();

    const [openAddRoleComponent, setOpenAddRoleComponent] = useState(false);
    const [roleForParticipant, setRoleForParticipant] = useState("");
    const [error, setError] = useState(null);
    const [disableInput, setDisableInput] = useState(false);

    const userForUserRolesDialog = useSelector((state) => state.dialog.userForUserRolesEditDialog);
    const parentProjectOfDialog = useSelector((state) => state.dialog.parentProject);

    const possibleRoles = ["PM", "Leader", "QA", "Developer", "BA", "Member"];

    const [roleList, setRoleList] = useState([]);

    useEffect(() => {
        setDisableInput(disableForm);
    }, [disableForm]);

    useEffect(() => {
        (async () => {
            dispatch(setLoadingPrompt("Updating possible roles..."));
            if(openAddRoleComponent && userForUserRolesDialog && userForUserRolesDialog.rolesInProject){
                const newRoleList = possibleRoles.map((value) => {
                    const filteredRoles = userForUserRolesDialog.rolesInProject.find((val) => val.name === value);
                    if(!filteredRoles){
                        return value;
                    }     
                    return null;
                });

                setRoleForParticipant("");
                setRoleList(newRoleList);
            }
            dispatch(setLoadingPrompt(null));
        })();
    }, [openAddRoleComponent, userForUserRolesDialog]);

    const handleCloseComponent = () => {
        setOpenAddRoleComponent(false); 
        setError(null);
        setRoleForParticipant("");
        setRoleList([]);
        dispatch(setLoadingPrompt(null));
    }

    const handleAddRole = () => {
        dispatch(setLoadingPrompt("Trying to add the new role..."));
       try{
            if(!parentProjectOfDialog || !parentProjectOfDialog.id){
                throw new Error("No project specified to start adding role");
            }
            if(!userForUserRolesDialog){
                throw new Error("No user specified to start adding role");
            }
            if(roleForParticipant === ""){
                throw new Error("You need to provide a role to add...");
            }

            dispatch(addNewRole(
                {
                    projectId: parentProjectOfDialog.id,
                    userId: userForUserRolesDialog.userDetail ? userForUserRolesDialog.userDetail.id : userForUserRolesDialog.id,
                    roleId: roleForParticipant,
                }, 
                (data) => {
                    handleCloseComponent();
                },
                (error) => {
                    setError("A problem occurred while trying to add the new role");
                    dispatch(setLoadingPrompt(null));
                }
            ));
            return;
        }catch(e){
            console.log(e);
            setError("A problem occurred while trying to add the new role");
            dispatch(setLoadingPrompt(null));
        }
    }

    return (
        <Grid container item xs={12} justify="center">
        {
        openAddRoleComponent ?
        <Grid container item xs={12} spacing={3}>
            <Grid item xs={12}>
                <Divider/>
            </Grid>
            <Grid item xs={12}>
            {
                userForUserRolesDialog && userForUserRolesDialog.rolesInProject ?
                <Grid container item xs={12} justify="center" spacing={1}>
                    <Grid container item xs={12} justify="center">
                        <FormControl fullWidth disabled={disableInput}>
                            <InputLabel shrink style={{
                                userSelect: 'none',
                            }}>
                                New role
                            </InputLabel>
                            <Select
                            displayEmpty
                            value={roleForParticipant}
                            onChange={(e) => {
                                setRoleForParticipant(e.target.value);
                            }}
                            style={{
                                marginTop: theme.spacing(2)
                            }}>
                                <MenuItem value={""}>
                                    <em>None</em>
                                </MenuItem>
                                {
                                    roleList.map((value, idx) => {
                                        if(value){
                                            return (
                                                <MenuItem key={"possible_role_"+value} value={idx+2}>
                                                    {value}
                                                </MenuItem>
                                            );
                                        }
                                        return null;
                                    })      
                                }
                            </Select>
                            <FormHelperText style={{
                                userSelect: 'none'
                            }}>Choose another role for the participant</FormHelperText>
                        </FormControl>
                    </Grid>
                    <Grid container item xs={12} justify="flex-end" spacing={1}>
                        <Grid item>
                            <Button variant="outlined" size="small" color="secondary" onClick={() => {
                                setOpenAddRoleComponent(false);
                            }}>
                                Cancel
                            </Button>
                        </Grid>
                        <Grid item>
                            <Button variant="outlined" size="small" color="primary" onClick={() => {
                                handleAddRole();
                            }}>
                                Add
                            </Button>
                        </Grid>
                    </Grid>
                    {error ? (<Grid container item xs={12} justify="center">
                        <Alert severity="error">{error}</Alert>
                    </Grid>) : null}
                </Grid>
                :
                null
            } 
            </Grid>
        </Grid>
        :
        <Button size="small" color="primary" onClick={() => {
            setOpenAddRoleComponent(true);
        }}>
            Add more roles...
        </Button>
        }
        </Grid>
    );
}

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

    const handleAddParticipant = () => {
        dispatch(setLoadingPrompt("Trying to add the new participant..."));
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

            dispatch(addNewRole(
                {
                    projectId: parentProjectOfDialog.id,
                    userId: userForDialog.userDetail ? userForDialog.userDetail.id : userForDialog.id,
                    roleId: addParticipantRoleField,
                }, 
                (data) => {
                    handleCloseDialog();
                }, 
                (error) => {
                    setError("A problem occurred while trying to add participant");
                    dispatch(setLoadingPrompt(null));
            }));
            return;
        }catch(e){
            console.log(e);
            setError("A problem occurred while trying to add participant");
            dispatch(setLoadingPrompt(null));
        }
    }

    const handleRemoveRole = async (roleid) => {
        dispatch(setLoadingPrompt("Trying to remove the specified role of user..."));
        try{
            if(!parentProjectOfDialog || !parentProjectOfDialog.id){
                throw new Error("No project specified to start removal");
            }
            if(!userForDialog || !userForDialog.userDetail || !userForDialog.userDetail.id){
                throw new Error("No user specified to start removal");
            }

            dispatch(removeRole(
                {
                    projectId: parentProjectOfDialog.id,
                    userId: userForDialog.userDetail.id,
                    roleId: roleid
                }, 
                (data) => {
                    dispatch(setLoadingPrompt(null));
                }, 
                (error) => {
                    setError("A problem occurred while trying to remove the role");
                    dispatch(setLoadingPrompt(null));
                }
            ));    
            return;
        }catch(e){
            console.log(e);
            setError("A problem occurred while trying to remove the role");
            dispatch(setLoadingPrompt(null));
        }
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
            setAddParticipantRoleField("");
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
                            width: '100%',
                            background: theme.palette.primary.main,
                            color: 'white'
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
                            <FormControl fullWidth disabled={disableForm} displayEmpty>
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
                            width: '100%',
                            background: theme.palette.primary.main,
                            color: 'white'
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
                        <Grid xs={12} item>
                            <TableContainer component={Paper}>
                                <Table>
                                    <TableHead>
                                        <TableRow>
                                            <TableCell>Id</TableCell>
                                            <TableCell>Role name</TableCell>
                                            <TableCell align="right">Actions</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                    {userForDialog.rolesInProject.map((val, idx) => (
                                        <TableRow key={"role_of_participant"+idx}>
                                            <TableCell component="th" scope="row">
                                                {idx+1}
                                            </TableCell>
                                            <TableCell>
                                                {val.name}
                                            </TableCell>
                                            <TableCell align="right">
                                                {
                                                (() => {
                                                return(canUserDoAssignment && val.id !== 1 && userForDialog.rolesInProject.length > 1?
                                                <Tooltip title="Remove this role">
                                                    <IconButton onClick={() => {
                                                        handleRemoveRole(val.id);
                                                    }}>
                                                        <RemoveCircle/>
                                                    </IconButton>
                                                </Tooltip> : null);
                                                })()
                                                }
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                    </TableBody>
                                </Table>
                            </TableContainer>
                        </Grid>
                        <Grid container item xs={12} justify="center">
                            {
                                canUserDoAssignment? 
                                <AddRoleComponent disableForm={disableForm} />
                                : 
                                null
                            }
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