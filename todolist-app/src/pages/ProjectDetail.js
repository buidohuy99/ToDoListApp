import { useEffect, useState } from 'react';

import { useDispatch, useSelector } from 'react-redux';
import { setCurrentPage } from '../redux/navigation/navigationSlice';
import { setLoadingPrompt }  from '../redux/loading/loadingSlice';
import { setCurrentViewingProject } from '../redux/projectDetail/projectDetailSlice';
import { setOpenAddModifyTaskDialog, setOpenCreateModifyProjectDialog, setParentProject, setCurrentModifyingProject, setCurrentModifyingTask, setOpenAssignUsersDialog } from '../redux/dialogs/dialogSlice';

import { useHistory, useParams } from 'react-router-dom';

import { PROJECT_DETAIL_PAGE } from '../constants/constants';

import { ProjectItemsList } from '../components/ProjectDetail/ProjectItemsList';

import { Container, Grid, Typography, withWidth, useTheme, IconButton, Tooltip } from '@material-ui/core';
import { Alert } from '@material-ui/lab';
import { AddCommentOutlined, PostAddOutlined, CreateOutlined, GroupOutlined } from '@material-ui/icons';

import { Create_ModifyProjectDialog } from '../components/Dialogs/Create_ModifyProjectDialog';
import { Add_ModifyTaskDialog } from '../components/Dialogs/Add_ModifyTaskDialog';
import { AssignUsersDialog } from '../components/Dialogs/AssignUsersDialog/AssignUsersDialog';

import { APIWorker } from '../services/axios';

import { useSignalR, signalR as SR } from '../services/signalR';
import { useAuth } from '../services/auth';

function ProjectDetail({width}){
    const dispatch = useDispatch();
    const params = useParams();
    const theme = useTheme();
    const history = useHistory();
    const { signalR } = useSignalR();
    const { set_access_token } = useAuth();

    const [error, setError] = useState(null);
    
    const getProjectDetail = async() => {
        try{
            const result = await APIWorker.callAPI('get', `/main-business/v1/project-management/project/${params.project_id}`);
            const {data} = result.data;
            if(data.parent){
                throw new Error("Project isnt available for viewing");
            }
            if(data.isDeleted){
                throw new Error("Project is not available because its deleted");
            }
            dispatch(setCurrentViewingProject(data));
            try{
                await signalR.invoke("RegisterViewProject", data.id);
                dispatch(setLoadingPrompt(null));
                return;
            }catch(e){
                console.log(e);
                setError("A problem occurred while connecting to the server, please reload or check the internet");
            }
        } catch (e) {
            console.log(e);
            setError("A problem occurred while fetching the details for the requested project");
        }
        dispatch(setLoadingPrompt("An error occurred, redirecting to home..."));
        history.push('/');
        dispatch(setLoadingPrompt(null));    
    };

    const currentViewingProject = useSelector((state) => state.projectDetail.currentViewingProject);
    const isConnecting = useSelector((state) => state.loading.isConnecting);
    
    const [isUnmounted, setIsUnmounted] = useState(false);

    useEffect(() => {
        return () => {
            setIsUnmounted(true);
        }
    }, []);

    useEffect(() => {
        signalR.on("project-detail-changed", (data) => {
            if(!isUnmounted){
                if(data.projectDetail.isDeleted){
                    dispatch(setLoadingPrompt("Project got deleted, redirecting to index..."));
                    history.push('/');
                    dispatch(setLoadingPrompt(null));
                    return;
                }
                dispatch(setCurrentViewingProject(data.projectDetail));
            }
        });
    }, []);

    useEffect(() => {
        if(!isConnecting){
            dispatch(setLoadingPrompt("Fetching project details...."));
            dispatch(setCurrentPage(PROJECT_DETAIL_PAGE));
            
            const submitRemoveViewingProject = async () => {
                if(signalR.state === SR.HubConnectionState.Disconnected || signalR.state === SR.HubConnectionState.Disconnecting) {
                    return;
                }
                dispatch(setLoadingPrompt("Submitting some data to the server...."));
                try{
                    await signalR.invoke("RemoveFromViewingProject", parseInt(params.project_id))
                }catch(e){
                    setError("A problem occurred while connecting to the server, please check the internet");
                    set_access_token(null);
                }
                dispatch(setCurrentViewingProject(null));
                dispatch(setLoadingPrompt(null));
            }

            const unlisten = history.listen(() => {
                submitRemoveViewingProject();
            });

            getProjectDetail();

            return () => {
                unlisten();
            };
        }
    }, [isConnecting, params.project_id]);

    return (<Container maxWidth="md">
        {
            error?
            <Grid container item xs={12} justify="center">
                <Alert severity="error">
                    {error}
                </Alert>
            </Grid>
            :
            !currentViewingProject ? 
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
                    {/* add new task */}
                    <Grid item>
                        <Tooltip title="Add task">
                            <IconButton size="medium" onClick={() => {
                                dispatch(setParentProject(currentViewingProject));
                                dispatch(setOpenAddModifyTaskDialog(true));
                            }}>
                                <AddCommentOutlined />
                            </IconButton>
                        </Tooltip>
                    </Grid>
                    {/* add child project */}
                    <Grid item>
                        <Tooltip title="Add child project">
                            <IconButton size="medium" onClick={() => {
                                dispatch(setParentProject(currentViewingProject));
                                dispatch(setOpenCreateModifyProjectDialog(true));
                            }}>
                                <PostAddOutlined />
                            </IconButton>
                        </Tooltip>
                    </Grid>
                    {/* modify project infos */}
                    <Grid item>
                        <Tooltip title="Modify project info">
                            <IconButton size="medium" onClick={() => {
                                dispatch(setCurrentModifyingProject(currentViewingProject));
                                dispatch(setOpenCreateModifyProjectDialog(true));
                            }}>
                                <CreateOutlined />
                            </IconButton>
                        </Tooltip>
                    </Grid>
                    <Grid item>
                        <Tooltip title="Participants">
                            <IconButton size="medium" onClick={() => {
                                dispatch(setParentProject(currentViewingProject));
                                dispatch(setOpenAssignUsersDialog(true));
                            }}>
                                <GroupOutlined />
                            </IconButton>
                        </Tooltip>
                    </Grid>
                </Grid>

                { /* List of subprojects and tasks here */ }
                <ProjectItemsList />
            </Grid>
        }
        <Create_ModifyProjectDialog />
        <Add_ModifyTaskDialog />
        <AssignUsersDialog />
    </Container>);
}

export default withWidth()(ProjectDetail);