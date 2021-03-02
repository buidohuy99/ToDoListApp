import { Grid, Typography, Paper, Divider, Hidden, Button, IconButton } from '@material-ui/core';
import { useTheme, makeStyles } from '@material-ui/core';

import { FolderShared as ProjectIcon } from '@material-ui/icons';

import { Link } from 'react-router-dom';

import { useDispatch } from 'react-redux';
import { setCurrentModifyingProject, setOpenState_CreateModifyProjectDialog } from '../../redux/projects/projectsSlice';

const useStyles = makeStyles((theme) => ({
    projectName: {
        fontWeight: 'bold',
        userSelect: 'none',
        
        overflowWrap: 'break-word'
    },
    projectDescription: {
        overflowWrap: 'break-word',

        minHeight: 100,
        overflow: 'hidden',
        userSelect: 'none',
        maxWidth: '100%',
        textAlign: 'justify',
        textOverflow: 'ellipsis',
        display: '-webkit-box',
        WebkitBoxOrient: 'vertical',
        WebkitLineClamp: 8,
        [theme.breakpoints.up("md")]: {
            WebkitLineClamp: 8,
        },
        [theme.breakpoints.down("sm")]: {
            WebkitLineClamp: 6,
        },
        [theme.breakpoints.down("xs")]: {
            WebkitLineClamp: 8,
        },
    }
}));

export function ProjectGridItem({project}){
    const theme = useTheme();
    const classes = useStyles();

    const dispatch = useDispatch();

    return (
        <Grid container item xs={12} sm={6} lg={4}>
            <Paper elevation={3} style={{
                padding: theme.spacing(2),
                width: '100%',
                height: '100%'
            }}>
                <Grid container item xs={12}>
                    <Hidden mdUp>
                        <Grid container item xs={3} justify="center" alignContent="center" style={{
                            alignSelf: 'stretch',
                        }}>
                            <IconButton style={{
                                width: "100%"
                            }}>
                                <ProjectIcon style={{
                                    width: "70%",
                                    height: '70%'
                                }}/>
                            </IconButton>
                        </Grid>
                    </Hidden>
                    <Hidden mdUp>
                        <Grid container item xs={1} justify="center">
                            <Divider orientation="vertical"/>
                        </Grid>
                    </Hidden>
                    <Grid container item xs={8} md={12} spacing={1}>
                        <Grid item xs={12}>
                            <Link to="#" style={{  
                                textDecoration: 'none',
                            }}>
                                <Typography variant="subtitle1" color='primary' className={classes.projectName}>
                                    {project && project.name ? project.name : "This is the project name"}
                                </Typography>
                            </Link>
                        </Grid>
                        <Grid item xs={12}>
                            <Divider orientation="horizontal"/>
                        </Grid>
                        <Grid item xs={12}>
                            <Typography variant="body2" className={classes.projectDescription}>
                                {project && project.description ? project.description : "No description for this project..." }
                            </Typography>
                        </Grid>
                        <Grid item xs={12}>
                            <Divider orientation="horizontal"/>
                        </Grid>
                        <Grid container item xs={12} spacing={1} style={{
                            display: 'flex',
                            flexDirection: 'row-reverse'
                        }}>
                            <Grid item>
                                <Button variant='contained' color='secondary' size='small' onClick={() => {
                                    dispatch(setCurrentModifyingProject(project));
                                    dispatch(setOpenState_CreateModifyProjectDialog(true));
                                }}>
                                    Modify
                                </Button>
                            </Grid>     
                        </Grid>
                    </Grid>
                </Grid>           
            </Paper>
        </Grid>
    );
}