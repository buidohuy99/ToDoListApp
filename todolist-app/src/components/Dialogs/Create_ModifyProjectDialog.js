import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';

import { AuthAxios } from '../../contexts/auth';

import { Slide, Dialog, DialogTitle, Grid, TextField, DialogActions, DialogContent, DialogContentText, Button, Hidden } from '@material-ui/core';
import { Alert } from '@material-ui/lab';

import { setLoadingPrompt } from '../../redux/loading/loadingSlice';
import { setCurrentModifyingProject, setOpenState_CreateModifyProjectDialog } from '../../redux/projects/projectsSlice';

const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
});

export function Create_ModifyProjectDialog({open}){
    const dispatch = useDispatch();
    const history = useHistory();

    const [disableForm, setDisableForm] = useState(false);
    
    const [error, setError] = useState(null);

    //Form informations
    const [projectNameField, setProjectNameField] = useState(null);
    const [projectDescriptionField, setProjectDescriptionField] = useState(null);

    const projectToModify = useSelector((state) => state.projects.currentModifyingProject);
    const openDialog = useSelector((state) => state.projects.openCreateModifyProjectDialog);

    const handleCloseDialog = () => {   
        setProjectNameField(null);
        setProjectDescriptionField(null);       
        setError(null);   
        setDisableForm(false);
        if(projectToModify){
            dispatch(setCurrentModifyingProject(null));
        }  
        dispatch(setOpenState_CreateModifyProjectDialog(false)); 
        dispatch(setLoadingPrompt(null));
    };

    useEffect(() => {
        dispatch(setOpenState_CreateModifyProjectDialog(open));
    }, [open]);

    useEffect(() => {
        if(projectToModify){
            setProjectNameField(projectToModify.name);
            setProjectDescriptionField(projectToModify.description);
        }
    }, [projectToModify]);

    return (
        <Dialog
        fullScreen
        open={openDialog}
        TransitionComponent={Transition}
        disableBackdropClick={disableForm}
        onClose={handleCloseDialog}>
            <DialogTitle id="form-dialog-title">{projectToModify ? "Modify" : "Create"} project</DialogTitle>
            <form onSubmit={async (e) => {
                e.preventDefault();
                setDisableForm(true);
                dispatch(setLoadingPrompt("Processing your request...."));

                try {
                    // api call here
                    if(!projectToModify){
                        const newProject = await AuthAxios.post(process.env.REACT_APP_API_URL + "/main-business/v1/project-management/project",
                            {
                                name: projectNameField,
                                description: projectDescriptionField,
                            }
                        );

                        const { data } = newProject.data;    
                    }else{
                        if(!projectToModify.id || !Number.isInteger(projectToModify.id)){
                            throw new Error("project to modify have invalid id");
                        }
                        const modifiedProject = await AuthAxios.patch(process.env.REACT_APP_API_URL + `/main-business/v1/project-management/project/${projectToModify.id}`,
                            {
                                name: projectNameField,
                                description: projectDescriptionField,
                            }
                        );

                        const { data } = modifiedProject.data;
                    }  
                    //dispatch(setLoadingPrompt(null));
                    handleCloseDialog();

                    // const roomLink = `/room/${data[0]._id}`;
                    // history.push(roomLink);
                } catch (e) {
                    //dispatch(setLoadingPrompt(null));
                    setDisableForm(false);
                    setError(`There has been a problem while ${projectToModify ? "modifying" : "creating"} the project, please recheck your fields or internet connection`);
                    return;
                }
            }}>
                <DialogContent>
                <DialogContentText>
                    Enter these information below to {projectToModify ? 'modify' : 'create'} a project:
                    <br />
                </DialogContentText>
                <Grid container item xs={12}>
                    <Grid container item xs={12} sm={8} direction="column">
                        <Grid item>
                            <TextField
                                variant="outlined"
                                required
                                autoFocus
                                id="ProjectName"
                                label="Project's name"
                                fullWidth
                                disabled={disableForm}
                                value={projectNameField ? projectNameField : ""}
                                onChange={(e) => {
                                    e.target.value = e.target.value.slice(
                                        0,
                                        Math.min(100, e.target.value.length)
                                    );
                                    setProjectNameField(e.target.value === "" ? null : e.target.value);
                                }}
                                margin="normal"
                            />
                        </Grid>
                        <Grid item>
                            <TextField
                                variant="outlined"
                                autoFocus
                                id="ProjectDescription"
                                label="Project's description"
                                fullWidth
                                disabled={disableForm}
                                value={projectDescriptionField ? projectDescriptionField : ""}
                                onChange={(e) => {
                                    e.target.value = e.target.value.slice(
                                        0,
                                        Math.min(250, e.target.value.length)
                                    );
                                    setProjectDescriptionField(e.target.value === "" ? null : e.target.value);
                                }}
                                margin="normal"
                            />
                        </Grid>
                    </Grid>
                    <Grid container item xs={12} sm={4} justify="center" alignItems="center">
                        <Hidden xsDown>
                            <Grid item xs={8}>
                                <img
                                src={
                                    process.env.PUBLIC_URL +
                                    "Create_ModifyRoomDialog/green_board.png"
                                }
                                alt="BigCuteImage"
                                width="100%"/>
                            </Grid>       
                        </Hidden>
                    </Grid>
                    {error ? (
                    <Grid container item xs={12} justify="center">
                        <Alert severity="error">{error}</Alert>
                    </Grid>
                    ) : null}
                </Grid>
                </DialogContent>
                <DialogActions>
                <Button onClick={handleCloseDialog} color="secondary">
                    Close
                </Button>
                <Button
                    type="submit"
                    color="primary"
                    disabled={
                    disableForm ||
                    (!projectNameField || projectNameField.length < 10
                        ? true
                        : false)
                    }
                >
                    {projectToModify ? 'Modify' : 'Create'}
                </Button>
                </DialogActions>
            </form>
        </Dialog>
    );
}