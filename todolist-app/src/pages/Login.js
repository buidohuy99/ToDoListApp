import {Container, Avatar, Button, TextField, Link, Grid, Typography, CircularProgress, FormControlLabel, Checkbox} from '@material-ui/core';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import Alert from '@material-ui/lab/Alert';
import { makeStyles } from '@material-ui/core/styles';

import {useState, useEffect} from 'react';
import { useDispatch } from 'react-redux';

import { setCurrentPage } from '../redux/navigation/navigationSlice';

import {useAuth, AuthAxios} from '../contexts/auth';

import {Link as RouterLink} from 'react-router-dom';

import { LOGIN_PAGE } from '../constants/constants';

const useStyles = makeStyles((theme) => ({
    paper: {
        marginTop: theme.spacing(8),
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
    },
    avatar: {
        margin: theme.spacing(1),
        backgroundColor: theme.palette.secondary.main,
    },
    form: {
        width: '100%', // Fix IE 11 issue.
        marginTop: theme.spacing(1),
    },
    submit: {
        margin: theme.spacing(3, 0, 2),
    },
}));

export function Login({}){
    const classes = useStyles();

    const [isError, setIsError] = useState(false);
    const { set_access_token } = useAuth();
    const dispatch = useDispatch();

    //Login infos
    const [username, setUsername] = useState(null);
    const [password, setPassword] = useState(null);
    const [disableForm, setDisableForm] = useState(false);

    const postLogin = async () => {
        if(!username || !password) {
            setIsError(true);
            return;
        } 
        let result;
        try{
          result = await AuthAxios.post(process.env.REACT_APP_API_URL + "/main-business/v1/authentication/login", {
              username,
              password,
          });
          setUsername(null);
          setPassword(null);  
          setDisableForm(false);  
          if (result.status === 200) {
            const {data} = result.data;
            set_access_token(data.token);
          } else {
            setIsError(true);
          }
        }catch(err){
          console.log(err);
          setUsername(null);
          setPassword(null);  
          setDisableForm(false); 
          setIsError(true);
        }
    }

    useEffect(() => {
      dispatch(setCurrentPage(LOGIN_PAGE));

      return () => {
        setUsername(null);
        setPassword(null);  
        setDisableForm(false);
      }
    }, []);

    return (
      <Container component="main" maxWidth="xs">
        <div className={classes.paper}>
          <Avatar className={classes.avatar}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            Log in
          </Typography>
          <form action="/" method="POST" className={classes.form} onSubmit={async (e) => {
            e.preventDefault();
            setIsError(false);
            setDisableForm(true);        
            //Do axios post call after preventing form from posting
            await postLogin();
          }}>
            <TextField
              variant="outlined"
              margin="normal"
              required
              fullWidth
              id="username"
              label="Username"
              name="username"
              autoComplete="username"
              autoFocus
              onChange={(e) => {
                e.target.value = e.target.value.slice(0,Math.min(40, e.target.value.length));
                setUsername(e.target.value);
              }}
              value={username ? username : ''}
              disabled={disableForm}
            />
            <TextField
              variant="outlined"
              margin="normal"
              required
              fullWidth
              name="password"
              label="Password"
              type="password"
              id="password"
              autoComplete="current-password"
              onChange={(e) => {
                e.target.value = e.target.value.slice(0,Math.min(100, e.target.value.length));
                setPassword(e.target.value);
              }}
              value={password ? password : ''}
              disabled={disableForm}
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              color="primary"
              className={classes.submit}
              disabled={disableForm}
            >
              Log In
            </Button>
            <Grid container>
              <Grid container item xs={12} justify="flex-end">
                <Link component={RouterLink} to="/signup" variant="body2">
                  {"Don't have an account? Sign Up"}
                </Link>
              </Grid>
  
              <Grid container item xs={12} justify="center" style={{
                  paddingTop: 10
              }}>
                {isError ? <Alert severity="error">There was a problem with your login</Alert> : 
                disableForm? <CircularProgress/> : null}
              </Grid>
            </Grid>
          </form>
        </div>
      </Container>
    );
}