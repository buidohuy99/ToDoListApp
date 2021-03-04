import { useEffect } from 'react';

import { useDispatch, useSelector } from 'react-redux';
import { setCurrentPage } from '../redux/navigation/navigationSlice';

import { useHistory, useParams } from 'react-router-dom';

import { PROJECT_DETAIL_PAGE } from '../constants/constants';

import { ProjectSection } from '../components/ProjectDetail/ProjectSection';
import { TaskInProject } from '../components/ProjectDetail/TaskInProject';

import { Container, Grid, Typography, withWidth, useTheme, IconButton } from '@material-ui/core';
import { List, ListSubheader } from '@material-ui/core';
import { Alert } from '@material-ui/lab';
import { AddCommentOutlined, PostAddOutlined, MoreVertOutlined } from '@material-ui/icons';

import { Create_ModifyProjectDialog } from '../components/Dialogs/Create_ModifyProjectDialog';
import { Add_ModifyTaskDialog } from '../components/Dialogs/Add_ModifyTaskDialog';

function ProjectDetail({width}){
    const dispatch = useDispatch();
    const params = useParams();
    const theme = useTheme();

    const currentViewingProject = useSelector((state) => state.projectDetail.currentViewingProject);
    
    useEffect(() => {
        dispatch(setCurrentPage(PROJECT_DETAIL_PAGE));

    }, []);

    return (<Container maxWidth="md">
        {
            currentViewingProject ? 
            <Grid container item xs={12} justify="center">
                <Alert severity="info">
                    There is no information to display here...
                </Alert>
            </Grid>
            :
            <Grid container item xs={12} justify="center" spacing={1} style={{
                userSelect: 'none'
            }}>
                <Grid container item xs={12} sm={6} justify="flex-start" alignContent="center">
                    <Typography color="primary" variant="h5" style={{
                        fontWeight: "bolder"
                    }}>
                        {currentViewingProject && currentViewingProject.name ? currentViewingProject.name : "PROJECT NAME"}   
                    </Typography>
                </Grid>
                {/* functional buttons */}
                <Grid container item xs={12} sm={6} justify={/xs/.test(width) ? "center" : "flex-end"} alignContent="center" spacing={1}>
                    <Grid item>
                        <IconButton size="medium">
                            <AddCommentOutlined />
                        </IconButton>
                    </Grid>
                    <Grid item>
                        <IconButton size="medium">
                            <PostAddOutlined />
                        </IconButton>
                    </Grid>
                    <Grid item>
                        <IconButton size="medium">
                            <MoreVertOutlined />
                        </IconButton>
                    </Grid>
                </Grid>
                { /* List of subprojects and tasks here */ }
                <Grid container item xs={12} spacing={1}>
                    <List subheader={
                        <ListSubheader component={Grid} xs={12} item>
                            <Typography variant="body1">
                                {currentViewingProject && currentViewingProject.description ? currentViewingProject.description : "this project doesnt have a description"}
                            </Typography>
                        </ListSubheader>
                    } component={Grid} container item spacing={1}>
                        {/* print out all tasks in project first */}
                        <Grid item xs={12}>
                            <List subheader={
                                <ListSubheader component={Grid} xs={12} item>
                                    Tasks ~~    
                                </ListSubheader>
                            } component={Grid} item>

                                {/* Run loop here */}
                                <Grid item xs={12}>
                                    <TaskInProject/>
                                </Grid>

                            </List>
                        </Grid>
                        {/* print out child projects later*/}
                        <Grid item xs={12}>
                            <List subheader={
                                <ListSubheader component={Grid} xs={12} item>
                                    Grouped tasks...   
                                </ListSubheader>
                            } component={Grid} item>

                                {/* Run loop here */}
                                <Grid item xs={12}>
                                    <ProjectSection/>
                                </Grid>

                            </List>
                        </Grid>
                    </List>
                </Grid>
            </Grid>
        }
        <Create_ModifyProjectDialog />
        <Add_ModifyTaskDialog />
    </Container>);
}

export default withWidth()(ProjectDetail);