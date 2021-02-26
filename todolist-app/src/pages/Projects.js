import { useEffect, useState } from 'react';

import { useDispatch, useSelector } from 'react-redux';
import { setCurrentPage } from '../redux/navigation/navigationSlice';

import { PROJECTS_PAGE } from '../constants/constants';

import { Container, Grid, Paper, Typography, Button } from '@material-ui/core';
import { makeStyles, useTheme } from '@material-ui/core';

//Components
import { SearchBar } from '../components/Projects/SearchBar';
import ProjectsGrid from '../components/Projects/ProjectsGrid';

import { setSearchString } from '../redux/projects/projectsSlice';

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

        return () => {
            dispatch(
                setSearchString(null)
            );
        };
    }, []);

    const searchString = useSelector((state) => state.projects.searchString);

    return(
    <Container maxWidth="lg">
        <Grid container justify="center" spacing={2}>
            <Grid item xs={12} sm={10} md={5} lg={4}>
                <Grid container item xs={12} spacing={3} justify="center" style={{
                    position: 'sticky',
                    top: theme.mixins.toolbar.minHeight + theme.spacing(2),
                }}>
                    <Grid container item xs={12} justify="center">
                        <Button variant='contained' color='secondary' size='large'>
                            Create a new project...
                        </Button>
                    </Grid>
                    <Grid item xs={12}>
                        <Paper elevation={3} className={classes.filterArea}>
                            <Grid container spacing={1} justify="center">
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
                                                <SearchBar searchBarPlaceholder="Find by project name"/>
                                            </Grid>
                                            <Grid container item xs={12} spacing={1}>
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
                                                            <Button variant='contained' color='secondary' size="small">
                                                                A-Z
                                                            </Button>
                                                        </Grid>
                                                        <Grid item style={{
                                                            padding: theme.spacing(1)
                                                        }}>
                                                            <Button variant='contained' color='secondary' size="small">
                                                                Z-A
                                                            </Button>
                                                        </Grid>
                                                        <Grid item style={{
                                                            padding: theme.spacing(1)
                                                        }}>
                                                            <Button variant='contained' color='secondary' size="small">
                                                                Recently created
                                                            </Button>
                                                        </Grid>
                                                        <Grid item style={{
                                                            padding: theme.spacing(1)
                                                        }}>
                                                            <Button variant='contained' color='secondary' size="small">
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
                </Grid>
            </Grid>
            <Grid item xs={12} md={7} lg={8}>
                <Grid container spacing={3} justify="center" style={{
                    paddingLeft: theme.spacing(1),
                    paddingRight: theme.spacing(1),
                }}>
                    <ProjectsGrid/>
                </Grid>
            </Grid>
        </Grid>
    </Container>);
}