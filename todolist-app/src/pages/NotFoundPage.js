import React, { useEffect } from 'react';

import { useDispatch } from 'react-redux';
import { setCurrentPage } from '../redux/navigation/navigationSlice';

import {Link} from 'react-router-dom';
import {Button, Grid, Typography} from '@material-ui/core';

export default function NotFoundPage(){
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(setCurrentPage(null));
    }, []);

    return(
        <Grid container style={{
            display: 'flex',
            justifyContent: 'center',
        }}>
            <Grid container item xs={12} justify="center">
                <Typography variant="h1">404 NOT FOUND</Typography>
            </Grid>
            <Grid container item xs={12} justify="center">
                <Button component={Link} to="/" type="submit"
                    variant="contained"
                    color="primary">
                    Back to index
                </Button>
            </Grid>        
        </Grid>
    );
}