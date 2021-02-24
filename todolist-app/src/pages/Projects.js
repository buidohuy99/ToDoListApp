import { useEffect, useState } from 'react';

import { useDispatch, useSelector } from 'react-redux';
import { setCurrentPage } from '../redux/navigation/navigationSlice';
import { setProjects } from '../redux/projects/projectsSlice';

import { PROJECTS_PAGE } from '../constants/constants';

import { Container, Grid, Paper, Typography, Button } from '@material-ui/core';
import { makeStyles, useTheme } from '@material-ui/core';

//Components
import { SearchBar } from '../components/Projects/SearchBar';
import { ProjectsGrid } from '../components/Projects/ProjectsGrid';

import clsx from 'clsx';

const useStyles = makeStyles((theme) => ({
    filterArea: {
        flex: 1,
        flexDirection: 'column',
        alignItems: "center",
        justifyContent: 'flex-start',
        padding: theme.spacing(1),
        backgroundColor: theme.palette.primary.main,
        color: theme.palette.primary.contrastText,
        [theme.breakpoints.down("sm")]:{
            flexDirection: 'row',
            justifyContent: "center",
            alignItems: "center",
        }
    },
    filterAreaInnerPaper: {
        backgroundColor: 'white',
        color: 'black',
        padding: theme.spacing(2),
    }
}));

export function ProjectsView(){
    const dispatch = useDispatch();
    const classes = useStyles();
    const theme = useTheme();

    useEffect(() => {
        dispatch(setCurrentPage(PROJECTS_PAGE));
    }, []);

    const onSearchSubmit = (searchString) => {

    }

    return(
    <Container maxWidth="lg">
        <Grid container justify="center" spacing={1}>
            <Grid item xs={12} sm={10} md={5} lg={4}>
                <Paper elevation={3} className={classes.filterArea} style={{
                    position: 'sticky'
                }}>
                    <Grid container spacing={1}>
                        <Grid item xs={12}>
                            <Typography variant="h6" style={{
                                userSelect: 'none',
                                fontWeight: 'normal'
                            }}>
                                Filter
                            </Typography>
                        </Grid>
                        <Grid item xs={12}>
                            <Paper elevation={3} className={clsx(classes.filterArea, classes.filterAreaInnerPaper)}>
                                <Grid container spacing={2}>
                                    <Grid item xs={12}>
                                        <SearchBar searchBarPlaceholder="Find by project name" callbackOnSearch={onSearchSubmit}/>
                                    </Grid>
                                    <Grid item xs={12} spacing={1}>
                                        <Grid container item xs={12} justify="center">
                                            <Typography variant="body1" style={{
                                                userSelect: 'none',
                                                fontWeight: 'bold'
                                            }}>
                                                Sort by...
                                            </Typography>
                                        </Grid>
                                        <Grid container item xs={12} justify="center">
                                            <Grid container item xs={12} justify="center" style={{
                                                flex: 1,
                                                flexDirection: 'row',
                                            }}>
                                                <Grid item style={{
                                                    padding: theme.spacing(1)
                                                }}>
                                                    <Button variant='contained' color='secondary'>
                                                        A-Z
                                                    </Button>
                                                </Grid>
                                                <Grid item style={{
                                                    padding: theme.spacing(1)
                                                }}>
                                                    <Button variant='contained' color='secondary'>
                                                        Z-A
                                                    </Button>
                                                </Grid>
                                                <Grid item style={{
                                                    padding: theme.spacing(1)
                                                }}>
                                                    <Button variant='contained' color='secondary'>
                                                        Recently created
                                                    </Button>
                                                </Grid>
                                                <Grid item style={{
                                                    padding: theme.spacing(1)
                                                }}>
                                                    <Button variant='contained' color='secondary'>
                                                        Recently updated
                                                    </Button>
                                                </Grid>
                                            </Grid>
                                        </Grid>
                                    </Grid>
                                    
                                </Grid>
                            </Paper>
                        </Grid>
                    </Grid>
                </Paper>
            </Grid>
            <Grid item xs={12} md={7} lg={8}>
                <Paper elevation={3} style={{
                    padding: theme.spacing(1)
                }}>
                    <Grid container spacing={1}>
                        <ProjectsGrid/>
                    </Grid>
                </Paper>
            </Grid>
        </Grid>
    </Container>);
}