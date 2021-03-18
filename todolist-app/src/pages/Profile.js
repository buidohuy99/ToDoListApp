import { useEffect, useState } from 'react';

import { Grid, Button, Typography, Box, TextField, makeStyles, Container } from '@material-ui/core';
import { Alert } from '@material-ui/lab';

import { useDispatch } from 'react-redux';
import { setCurrentPage } from '../redux/navigation/navigationSlice';
import { setLoadingPrompt, setGlobalError } from '../redux/loading/loadingSlice';

import { PROFILE_PAGE } from '../constants/constants';

import { APIWorker } from '../services/axios';

const useStyles = makeStyles((theme) => ({
    paper: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
    },
    form: {
      width: '100%', // Fix IE 11 issue.
    },
    submit: {
      margin: theme.spacing(3, 0, 2),
    },
}));

export function Profile(){
    const classes = useStyles();
    const dispatch = useDispatch();

    const [disableForm, setDisableForm] = useState(false);
    const [currentUser, setCurrentUser] = useState(null);
    const [isEditOn, setEditOn] = useState(false);

    const [password, setPassword] = useState(null);
    const [newPassword, setNewPassword] = useState(null);
    const [firstName, setFirstName] = useState(null);
    const [lastName, setLastName] = useState(null);
    const [phoneNumber, setPhoneNumber] = useState(null);

    const [isError, setIsError] = useState(null);
    const [isSuccess , setIsSuccess] = useState(null);

    useEffect(() => {
        dispatch(setCurrentPage(PROFILE_PAGE));
    }, []);

    const postChangeProfileForm = async () => {
        if(firstName && firstName.length <= 0) {
            setIsError("Your new first name is illegal");
            setDisableForm(false);
            return;
        }
        if(lastName && lastName.length <= 0) {
            setIsError("Your new last name is illegal");
            setDisableForm(false);
            return;
        }
        if(phoneNumber && phoneNumber.length <= 0) {
            setIsError("Your new phone number is illegal");
            setDisableForm(false);
            return;
        }
        if(password && (!newPassword || newPassword.length <= 0)){
            setIsError("You have to type in both password and new password fields to change your password");
            setDisableForm(false);
            return;
        }
        if(newPassword && newPassword.length > 0 && (!password || password.length <= 0 || newPassword === password)){
            setIsError("Your new password is illegal");
            setDisableForm(false);
            return;
        }
        try{
            dispatch(setLoadingPrompt("Updating your profile info"));
            const user = await APIWorker.patchAPI('/main-business/v1/user-management/profile', {
                currentPassword: newPassword ? password : undefined,
                newPassword: newPassword ?  newPassword : undefined,
                firstName: firstName ? firstName : undefined,
                lastName: lastName ? lastName : undefined,
                phone: phoneNumber ? phoneNumber : undefined
            });
            const {data} = user.data;
            setCurrentUser(data);
            setIsSuccess("You have successfully changed the infos");
            setIsError(null);
            setEditOn(false);
        }catch(err){
            console.log(err);
            setIsSuccess(null);
            setIsError("There has been a problem when updating your profile, please recheck the validity of fields");  
        }
        setDisableForm(false);
        dispatch(setLoadingPrompt(null));
    };

    useEffect(() => {
        (async () => {
            try{
                dispatch(setLoadingPrompt(""));
                const fetchUser = await APIWorker.callAPI('get', '/main-business/v1/user-management/profile');
                const {data} = fetchUser.data;
                setCurrentUser(data);
            }catch(err){
                dispatch(setGlobalError("Error fetching user profile data"));
                setCurrentUser(null);
            }
            dispatch(setLoadingPrompt(null));
        })();
    }, []);

    return (
        <Container component="main" maxWidth="sm">
        <div className={classes.paper}>
        {
        !currentUser ?
        <Alert severity="info">
            No user info to display
        </Alert>
        :
            <Grid container item spacing={3} justify="center">
                <Grid container item xs={12} style={{
                                    display: 'flex',
                                    flexDirection: 'row',
                                }}>
                    <Grid item xs={10}>
                        <Typography component="h1" variant="h5" style={{
                            overflowWrap: 'break-word',
                            userSelect: "none",
                        }} align="justify">
                            Account Information
                        </Typography>
                    </Grid>
                    <Grid container item xs={2} justify="flex-end">
                        <Grid item>
                            <Button style={{
                                flexDirection: "row",
                            }} color="primary" onClick={(e) => {
                                setIsSuccess(null);
                                setPassword(null);
                                setNewPassword(null);
                                if(isEditOn){
                                    setFirstName(null);
                                    setLastName(null);
                                    setPhoneNumber(null);
                                }else{
                                    setFirstName(currentUser.firstName);
                                    setLastName(currentUser.lastName);
                                    setPhoneNumber(currentUser.phone);
                                }
                                setEditOn(!isEditOn);
                            }} disabled={disableForm}>
                                {isEditOn ? "Stop edit": "Edit"}
                            </Button>
                        </Grid>
                    </Grid>
                </Grid>
                {
                    isSuccess ? 
                    <Grid container item xs={12} justify="center">
                        <Alert severity="success" style={{
                                    overflowWrap: "break-word",
                                    fontStyle: 'italic'
                                }}>{isSuccess}
                        </Alert>
                    </Grid>
                    : null
                }
                {
                    isError ? 
                    <Grid container item xs={12} justify="center">
                        <Alert severity="error" style={{
                            overflowWrap: "break-word",
                            fontStyle: 'italic'
                        }}>{isError}</Alert> 
                    </Grid>
                    : null
                }
                <Grid item xs={12}>
                    <form className={classes.form} onSubmit={async (e) => {
                        e.preventDefault();
                        setDisableForm(true);
                        //Do axios post call after preventing form from posting
                        postChangeProfileForm();
                    }}>
                    <Grid container spacing={2}>
                        <Grid item xs={12} >
                            <TextField
                                label="Username"
                                variant="outlined"
                                fullWidth
                                value={currentUser.userName}
                                disabled={true}
                            />
                        </Grid> 
                        <Grid item xs={12} >
                            <TextField
                                label="Email"
                                variant="outlined"
                                fullWidth
                                value={currentUser.email}
                                disabled={true}
                            />
                        </Grid> 
                        <Grid item xs={6} >
                            <TextField
                                variant="outlined"
                                fullWidth
                                id="firstName"
                                label="First Name"
                                name="firstname"
                                onChange={(e) => {
                                    e.target.value = e.target.value.slice(0,Math.min(100, e.target.value.length));
                                    setFirstName(e.target.value);
                                }}
                                value={!isEditOn ? currentUser.firstName : (firstName ? firstName : '')}
                                disabled={disableForm || !isEditOn}
                            />
                        </Grid>
                        <Grid item xs={6} >
                            <TextField
                                variant="outlined"
                                fullWidth
                                id="lastName"
                                label="Last Name"
                                name="lastname"
                                onChange={(e) => {
                                    e.target.value = e.target.value.slice(0,Math.min(100, e.target.value.length));
                                    setLastName(e.target.value);
                                }}
                                value={!isEditOn ? currentUser.lastName : (lastName ? lastName : '')}
                                disabled={disableForm || !isEditOn}
                            />
                        </Grid>
                        <Grid item xs={12} >
                            <TextField
                                variant="outlined"
                                fullWidth
                                id="phoneNumber"
                                label="Phone"
                                name="phonenumber"
                                type="tel"
                                onChange={(e) => {
                                    e.target.value = e.target.value.slice(0,Math.min(30, e.target.value.length));
                                    setPhoneNumber(e.target.value);
                                }}
                                value={!isEditOn ? currentUser.phone : (phoneNumber ? phoneNumber : '')}
                                disabled={disableForm || !isEditOn}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                variant="outlined"
                                fullWidth
                                name="password"
                                label={isEditOn ?  "Current password" : "Password"}
                                type={isEditOn ? "password" : undefined}
                                id="password"
                                autoComplete="current-password"
                                onChange={(e) => {
                                e.target.value = e.target.value.slice(0,Math.min(100, e.target.value.length));
                                    setPassword(e.target.value);
                                }}
                                value={!isEditOn ? 'Your password is hidden' : (password ? password : '')}
                                inputProps={!isEditOn ? {
                                    style: {fontStyle: "italic"}
                                } : undefined}
                                disabled={disableForm || !isEditOn}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            {isEditOn ? 
                            <TextField
                                variant="outlined"
                                fullWidth
                                name="passwordNew"
                                label="Type your new password"
                                type="password"
                                id="passwordNew"
                                autoComplete="new-password"
                                onChange={(e) => {
                                    e.target.value = e.target.value.slice(0,Math.min(100, e.target.value.length));
                                    setNewPassword(e.target.value);
                                }}
                                value={newPassword ? newPassword : ''}
                                disabled={disableForm}
                            />
                            : 
                                null
                            }
                        </Grid>
                    </Grid>
                        {isEditOn ?
                            <Button
                                type="submit"
                                fullWidth
                                variant="contained"
                                color="primary"
                                className={classes.submit}
                                disabled={disableForm}>
                                Submit change
                            </Button>
                        : null}
                    </form>
                </Grid>
            </Grid>
        }
        </div>
        </Container>
    );
}