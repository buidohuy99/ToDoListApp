import React from 'react';

import '../css/NotFoundPage.scss';

import {Link} from 'react-router-dom';
import {Button, Grid} from '@material-ui/core';

export default function NotFoundPage(){
    return(
        <Grid container style={{
            display: 'flex',
            justifyContent: 'center',
        }}>
            <Grid container item xs={12} justify="center">
                <div className="face">
                    <div className="band">
                        <div className="red"></div>
                        <div className="white"></div>
                        <div className="blue"></div>
                    </div>
                    <div className="eyes"></div>
                    <div className="dimples"></div>
                    <div className="mouth"></div>
                </div>
            </Grid>
            <Grid container item xs={12} justify="center">
                <h1>404 page not found</h1>
            </Grid>
            <Grid container item xs={12} justify="center">
                <Button component={Link} to="/" type="submit"
                    variant="contained"
                    color="primary"
                >
                    Về trang chủ
                </Button>
            </Grid>        
        </Grid>
    );
}