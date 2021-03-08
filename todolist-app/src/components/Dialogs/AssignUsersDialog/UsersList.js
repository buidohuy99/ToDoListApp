import { useSelector } from 'react-redux';

import { Grid, Typography, Paper, Divider, IconButton, Tooltip, CircularProgress, Button, Table, TableCell, TableRow, TableBody, TableHead, TableContainer } from '@material-ui/core';
import { List, ListSubheader } from '@material-ui/core';
import { Alert } from '@material-ui/lab';
import { PersonAddOutlined, MoreHoriz } from '@material-ui/icons';

export function UsersList() {
    const usersListForDialog = useSelector((state) => state.dialog.usersListOfAssignDialog);
    const participantsOfProject = useSelector((state) => state.dialog.participantsOfAssignDialog);
    const isLoadingUsersList = useSelector((state) => state.dialog.isLoadingUsersList);
    const isDialogInSearchMode = useSelector((state) => state.dialog.isDialogInSearchMode);

    return (
    <Grid container item xs={12} style={{
        minHeight: 300,
        maxHeight: 300,
        overflowY: 'auto'
    }}>
        {/* print out all tasks in project first */}
        <Grid item xs={12}>
            {
            isLoadingUsersList?
                <Grid xs={12}>
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
                                <TableCell align="right">
                                    <Tooltip title="Add participant">
                                        <IconButton>
                                            <PersonAddOutlined/>
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
                                <TableCell align="right">
                                    <Tooltip title="See roles">
                                        <IconButton>
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