import { useState } from 'react';
import { useDispatch } from 'react-redux';

import { makeStyles, Container, CssBaseline, Avatar, Typography, Grid, TextField, Button, Link } from '@material-ui/core';
import { Link as RouterLink, useHistory } from 'react-router-dom';
import { AssignmentIndOutlined } from '@material-ui/icons';
import { Alert } from '@material-ui/lab';

import { APIWorker } from '../services/axios';

import { setLoadingPrompt } from '../redux/loading/loadingSlice';

const useStyles = makeStyles((theme) => ({
    paper: {
      marginTop: theme.spacing(8),
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
    },
    avatar: {
      margin: theme.spacing(1),
      backgroundColor: theme.palette.secondary.main,
    },
    form: {
      width: "100%", // Fix IE 11 issue.
      marginTop: theme.spacing(3),
    },
    signUpMessage: {
      marginTop: theme.spacing(3),
      marginBottom: theme.spacing(-2),
    },
    submit: {
      margin: theme.spacing(3, 0, 2),
    },
  }));
  
  export function SignUp() {
    const classes = useStyles();
    const dispatch = useDispatch();
    const history = useHistory();
  
    const [usernameValue, setUsernameValue] = useState(null);
    const [passwordValue, setPasswordValue] = useState(null);
    const [emailValue, setEmailValue] = useState(null);
    const [firstNameValue, setFirstNameValue] = useState(null);
    const [lastNameValue, setLastNameValue] = useState(null);
    const [phoneValue, setPhoneValue] = useState(null);

    const [signUpMessage, setSignUpMessage] = useState(null);
    const [signUpError, setSignUpError] = useState(null);
  
    const checkInput = () => {
      if (
        !firstNameValue || !emailValue ||
        !lastNameValue || !passwordValue || !usernameValue || !phoneValue
      ) {
        return "Missing Information, please fill out all of required fields";
      }
      if (passwordValue.length < 5) {
        return "Password too short, must be more than 5 characters";
      }
      return null;
    };
  
    const handleChange = (e, setValue) => {
        setValue(e.target.value.length <= 0 ? null : e.target.value);
    };

    const setNullEverything = () => {
        setUsernameValue(null);
        setFirstNameValue(null);
        setLastNameValue(null);
        setEmailValue(null);
        setPhoneValue(null);
        setPasswordValue(null);
    }
  
    const handleSignUp = async () => {
      const newUser = {
        username: usernameValue,
        firstName: firstNameValue,
        lastName: lastNameValue,
        password: passwordValue,
        email: emailValue,
        phone: phoneValue
      };
      console.log(newUser);
      const check = checkInput();
      if (check) {
        setSignUpMessage(null);
        setSignUpError(check);
        return;
      }
      try {
        dispatch(setLoadingPrompt("Signing you up..."));
        const result = await APIWorker.postAPI("/main-business/v1/authentication/register", newUser);
        const {message} = result.data;
  
        if ((result.status >= 200 && result.status < 300) || result.status === 304) {
            setSignUpError(null);
            setSignUpMessage(message);
            setTimeout(() => {
                setNullEverything();
                history.push('/login');
                dispatch(setLoadingPrompt(null));
            }
            , 1000);
            return;
        } else {
            setSignUpMessage(null);
            setSignUpError(message);
        }
      } catch (error) {
        setSignUpMessage(null);
        setSignUpError("Something went wrong, please recheck your infos and/or try again");
        console.log(error);
      }
      dispatch(setLoadingPrompt(null));
    };

    return (
      <Container component="main" maxWidth="xs">
        <CssBaseline />
        <div className={classes.paper}>
          <Avatar className={classes.avatar}>
            <AssignmentIndOutlined />
          </Avatar>
          <Typography component="h1" variant="h5">
            Sign up
          </Typography>
          {
          signUpError ?
          <Alert severity="error">
              {signUpError}
          </Alert> : null
          }
          {
          signUpMessage ?
          <Alert severity="success">
              {signUpMessage}
          </Alert> : null
          }
          <form className={classes.form} noValidate>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  onChange={(e) => handleChange(e, setUsernameValue)}
                  value={usernameValue ? usernameValue : ""}
                  variant="outlined"
                  required
                  fullWidth
                  id="username"
                  label="Username"
                  name="username"
                  autoComplete="username"
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  onChange={(e) => handleChange(e, setEmailValue)}
                  value={emailValue ? emailValue : ""}
                  variant="outlined"
                  required
                  fullWidth
                  id="email"
                  label="Email Address"
                  name="email"
                  autoComplete="email"
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  onChange={(e) => handleChange(e, setPhoneValue)}
                  value={phoneValue ? phoneValue : ""}
                  variant="outlined"
                  required
                  fullWidth
                  id="phone-number"
                  label="Phone number"
                  name="Phone number"
                  autoComplete="mobile"
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  onChange={(e) => handleChange(e, setFirstNameValue)}
                  value={firstNameValue ? firstNameValue : ""}
                  autoComplete="fname"
                  name="firstName"
                  variant="outlined"
                  required
                  fullWidth
                  id="firstName"
                  label="First Name"
                  autoFocus
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  onChange={(e) => handleChange(e, setLastNameValue)}
                  value={lastNameValue ? lastNameValue : ""}
                  variant="outlined"
                  required
                  fullWidth
                  id="lastName"
                  label="Last Name"
                  name="lastName"
                  autoComplete="lname"
                />
              </Grid>
  
              <Grid item xs={12}>
                <TextField
                  onChange={(e) => handleChange(e, setPasswordValue)}
                  value={passwordValue ? passwordValue : ""}
                  variant="outlined"
                  required
                  fullWidth
                  name="password"
                  label="Password"
                  type="password"
                  id="password"
                  autoComplete="current-password"
                />
              </Grid>
            </Grid>
            <Button
              onClick={handleSignUp}
              fullWidth
              variant="contained"
              color="primary"
              className={classes.submit}
            >
              Sign Up
            </Button>
            <Grid container justify="flex-end">
                <Grid container item xs={12} justify="flex-end">
                    <Link component={RouterLink} to="/login" variant="body2">
                    {"Log in with your already made account...?"}
                    </Link>
                </Grid>
            </Grid>
          </form>
        </div>
      </Container>
    );
  }