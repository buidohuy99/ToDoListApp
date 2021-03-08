import { useSelector } from 'react-redux';

import { ProjectSection } from './ProjectSection';
import { TaskInProject } from './TaskInProject';

import { Grid, Typography } from '@material-ui/core';
import { List, ListSubheader } from '@material-ui/core';

import { Alert } from '@material-ui/lab';

export function ProjectItemsList() {
    const currentViewingProject = useSelector((state) => state.projectDetail.currentViewingProject);

    return (
        <Grid container item xs={12} spacing={1}>
            <List subheader={
                <ListSubheader component={Grid} xs={12} item>
                    <Typography variant="body1" style={{
                        textDecorationLine: 'underline',
                        fontWeight: 'bold',
                        display: 'inline'
                    }}>
                        {"Description"}
                    </Typography>
                    <Typography variant="body1" style={{
                        display: 'inline',
                        fontStyle: currentViewingProject && currentViewingProject.description ? 'normal' : 'italic'
                    }}>
                        {" : " + (currentViewingProject && currentViewingProject.description ? currentViewingProject.description : "<this project doesnt have a description>")}
                    </Typography>
                </ListSubheader>
            } component={Grid} container item spacing={1}>
                {/* print out all tasks in project first */}
                <Grid item xs={12}>
                    <List subheader={
                        <ListSubheader component={Grid} xs={12} item>
                            Tasks ~ 
                        </ListSubheader>
                    } component={Grid} item>

                        {currentViewingProject && currentViewingProject.childrenTasks && currentViewingProject.childrenTasks.length > 0 ? 
                            currentViewingProject.childrenTasks.map((val, idx) => (
                                <Grid key={"task"+idx} item xs={12}>
                                    <TaskInProject task={val}/>
                                </Grid>
                            ))
                        : 
                            currentViewingProject && currentViewingProject.childrenTasks && currentViewingProject.childrenTasks.length <= 0 ?
                            <Grid container item xs={12} justify="center">
                                <Typography variant="body2" style={{
                                    fontStyle: 'italic'
                                }}>
                                    There are no child tasks
                                </Typography>
                            </Grid>
                        : 
                        null}
                        

                    </List>
                </Grid>
                {/* print out child projects later*/}
                <Grid item xs={12}>
                    <List subheader={
                        <ListSubheader component={Grid} xs={12} item>
                            Groups   
                        </ListSubheader>
                    } component={Grid} item>

                        {currentViewingProject && currentViewingProject.children && currentViewingProject.children.length > 0 ? 
                            currentViewingProject.children.map((val, idx) => {
                                return(
                                <Grid key={"child_project_"+idx} item xs={12}>
                                    <ProjectSection section={val}/>
                                </Grid>);
                                }
                            )
                        : currentViewingProject && currentViewingProject.children && currentViewingProject.children.length <= 0 ?
                            <Grid container item xs={12} justify="center">
                                <Typography variant="body2" style={{
                                    fontStyle: 'italic'
                                }}>
                                    There are no child projects
                                </Typography>
                            </Grid>
                        : null}

                    </List>
                </Grid>
            </List>
        </Grid>);
}