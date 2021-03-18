import { useEffect, useState } from 'react';

import { useDispatch, useSelector } from 'react-redux';
import { setCurrentPage } from '../redux/navigation/navigationSlice';
import { setLoadingPrompt, setGlobalError }  from '../redux/loading/loadingSlice';
import { setCurrentViewingProject, setParticipantsOfViewingProject, setCanUserDoAssignment } from '../redux/projectDetail/projectDetailSlice';
import { setOpenAddModifyTaskDialog, setOpenCreateModifyProjectDialog, setParentProject, setCurrentModifyingProject, setOpenAssignUsersDialog} from '../redux/dialogs/dialogSlice';

import { useHistory, useParams } from 'react-router-dom';

import { PROJECT_DETAIL_PAGE } from '../constants/constants';

import { ProjectItemsList } from '../components/ProjectDetail/ProjectItemsList';

import { Container, Grid, Typography, withWidth, useTheme, IconButton, Tooltip, Button } from '@material-ui/core';
import { Alert } from '@material-ui/lab';
import { AddCommentOutlined, PostAddOutlined, CreateOutlined, GroupOutlined, DeleteSweep } from '@material-ui/icons';

import { Create_ModifyProjectDialog } from '../components/Dialogs/Create_ModifyProjectDialog';
import { Add_ModifyTaskDialog } from '../components/Dialogs/Add_ModifyTaskDialog';
import { AssignUsersDialog } from '../components/Dialogs/AssignUsersDialog/AssignUsersDialog';
import { AssignUserToTaskDialog } from '../components/Dialogs/AssignUserToTaskDialog';

import { APIWorker } from '../services/axios';

import { useSignalR, signalR as SR } from '../services/signalR';
import { useAuth } from '../services/auth';

function ProjectDetail({width}){
    const dispatch = useDispatch();
    const params = useParams();
    const theme = useTheme();
    const history = useHistory();
    const { signalR } = useSignalR();
    const { set_access_token, current_user } = useAuth();

    const [error, setError] = useState(null);

    const canUserDoAssignment = useSelector((state) => state.projectDetail.canUserDoAssignment);
    const participantsOfProject = useSelector((state) => state.projectDetail.participantsOfViewingProject);
    const currentViewingProject = useSelector((state) => state.projectDetail.currentViewingProject);
    const isConnecting = useSelector((state) => state.loading.isConnecting);
    
    const [isUnmounted, setIsUnmounted] = useState(false);
    
    const getProjectDetail = async() => {
        dispatch(setLoadingPrompt("Loading project's details..."));
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

    const getParticipants = async() => {
        dispatch(setLoadingPrompt("Loading participants in project..."));
        try{
            if(!currentViewingProject || !currentViewingProject.id){
                throw new Error("No project specified to get participants");
            }
            const query = `ProjectId=${currentViewingProject.id}`;
            const result = await APIWorker.callAPI('get', '/main-business/v1/participation-management/participations?' + query);
            const { data } = result.data;
            dispatch(setParticipantsOfViewingProject(data.users));
        }catch(e){
            console.log(e);
            setError("A problem occurred while fetching participants of this project");
        }
        dispatch(setLoadingPrompt(null));
    };

    const deleteProject = async() => {
        dispatch(setLoadingPrompt("Processing your deletion request..."));
        try{
            if(!currentViewingProject || !currentViewingProject.id){
                throw new Error("No project specified to delete");
            }
            const result = await APIWorker.callAPI('delete', `/main-business/v1/project-management/project/${parseInt(currentViewingProject.id)}`);
            const { data } = result.data;
        }catch(e){
            console.log(e);
            dispatch(setGlobalError("Project deletion request encountered an error ~"));
        }
        dispatch(setLoadingPrompt(null));
    };

    useEffect(() => {
        return () => {
            setIsUnmounted(true);
        }
    }, []);

    useEffect(() => {
        if(signalR.state === SR.HubConnectionState.Disconnected || signalR.state === SR.HubConnectionState.Disconnecting) {
            return;
        }
        if(participantsOfProject){
            dispatch(setLoadingPrompt("Checking your permissions..."));
            (async() => {
                const currentUser = current_user;
                if(currentUser){
                    const entry = participantsOfProject.find((value) => parseInt(value.userDetail.id) === parseInt(currentUser));
                    if(entry){
                        // only allow user with PM, Leader or Owner to assign users
                        const foundAllow = entry.rolesInProject.find(role => parseInt(role.id) < 4);
                        if(foundAllow){
                            
                            dispatch(setCanUserDoAssignment(true));
                            dispatch(setLoadingPrompt(null));
                            return;
                        }
                    }
                    dispatch(setCanUserDoAssignment(false));
                }
                dispatch(setLoadingPrompt(null));
            })();
        }
    }, [participantsOfProject, current_user]);

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
    }, [isUnmounted]);

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

    useEffect(() => {
        if(currentViewingProject){
            getParticipants();
        }
    }, [currentViewingProject]);

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
                        {
                        canUserDoAssignment ? 
                        <Tooltip title="Add task">
                            <IconButton size="medium" onClick={() => {
                                dispatch(setParentProject(currentViewingProject));
                                dispatch(setOpenAddModifyTaskDialog(true));
                            }}>
                                <AddCommentOutlined />
                            </IconButton>
                        </Tooltip> : null
                        }
                    </Grid>
                    {/* add child project */}
                    <Grid item>
                        {canUserDoAssignment ?
                        <Tooltip title="Add a task collection">
                            <IconButton size="medium" onClick={() => {
                                dispatch(setParentProject(currentViewingProject));
                                dispatch(setOpenCreateModifyProjectDialog(true));
                            }}>
                                <PostAddOutlined />
                            </IconButton>
                        </Tooltip>
                        : null
                        }
                    </Grid>
                    {/* modify project infos */}
                    <Grid item>
                        {
                        canUserDoAssignment ? 
                        <Tooltip title="Modify project info">
                            <IconButton size="medium" onClick={() => {
                                dispatch(setCurrentModifyingProject(currentViewingProject));
                                dispatch(setOpenCreateModifyProjectDialog(true));
                            }}>
                                <CreateOutlined />
                            </IconButton>
                        </Tooltip> : null
                        }
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
                <Grid container item xs={12} justify="center">
                    <Tooltip title="Delete this project ?" placement="top">
                        <IconButton style={{
                            position: 'fixed',
                            bottom: theme.spacing(2),
                            right: theme.spacing(2),
                            background: theme.palette.primary.main,
                            zIndex: 5,
                        }} onClick={() => {
                            deleteProject();
                        }}>
                            <DeleteSweep fontSize="large" style={{ color : 'white' }}/>
                        </IconButton>
                    </Tooltip>
                </Grid>

                { /* List of subprojects and tasks here */ }
                <ProjectItemsList />
            </Grid>
        }
        <Create_ModifyProjectDialog />
        <Add_ModifyTaskDialog />
        <AssignUsersDialog />
        <AssignUserToTaskDialog />
    </Container>);
}

export default withWidth()(ProjectDetail);