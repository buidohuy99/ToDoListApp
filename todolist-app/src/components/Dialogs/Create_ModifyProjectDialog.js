import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { APIWorker } from '../../services/axios';

import { Dialog, DialogTitle, Grid, TextField, DialogActions, DialogContent, DialogContentText, Button, Hidden } from '@material-ui/core';
import { Alert } from '@material-ui/lab';

import { setLoadingPrompt } from '../../redux/loading/loadingSlice';
import { setCurrentModifyingProject, setOpenCreateModifyProjectDialog, setParentProject } from '../../redux/dialogs/dialogSlice';

export function Create_ModifyProjectDialog({open}){
    const dispatch = useDispatch();

    const [disableForm, setDisableForm] = useState(false);
    const [error, setError] = useState(null);

    //Form informations
    const [projectNameField, setProjectNameField] = useState(null);
    const [projectDescriptionField, setProjectDescriptionField] = useState(null);

    const projectToModify = useSelector((state) => state.dialog.currentModifyingProject);
    const parentProjectOfDialog = useSelector((state) => state.dialog.parentProject);
    const openDialog = useSelector((state) => state.dialog.openCreateModifyProjectDialog);

    const handleCloseDialog = () => {   
        dispatch(setOpenCreateModifyProjectDialog(false));
        dispatch(setLoadingPrompt(null));
    };

    useEffect(() => {
        dispatch(setOpenCreateModifyProjectDialog(open));
    }, [open]);

    useEffect(() => {
        if(projectToModify){
            setProjectNameField(projectToModify.name);
            setProjectDescriptionField(projectToModify.description);
        }
    }, [projectToModify]);

    return (
        <Dialog 
        style={{
            zIndex: 8,
        }}
        open={openDialog}
        disableBackdropClick={disableForm}
        onClose={() => {
            handleCloseDialog();         
        }}
        onExited={() => {
            setProjectNameField(null);
            setProjectDescriptionField(null);       
            setError(null);     
            setDisableForm(false);
            if(projectToModify){
                dispatch(setCurrentModifyingProject(null));
            }
            if(parentProjectOfDialog){
                dispatch(setParentProject(null));
            }
        }}>
            <DialogTitle id="form-dialog-title">{parentProjectOfDialog ? "Tasks collection" : "Project"}</DialogTitle>
            <form onSubmit={async (e) => {
                e.preventDefault();
                setDisableForm(true);
                dispatch(setLoadingPrompt("Processing your request...."));

                try {
                    // api call here
                    if(!projectToModify){
                        const newProject = await APIWorker.postAPI("/main-business/v1/project-management/project", {
                            name: projectNameField,
                            description: projectDescriptionField,
                            parentId: parentProjectOfDialog && parentProjectOfDialog.id && Number.isInteger(parentProjectOfDialog.id) ? parseInt(parentProjectOfDialog.id) : undefined
                        });

                        const { data } = newProject.data;    
                    }else{
                        if(!projectToModify.id || !Number.isInteger(projectToModify.id)){
                            throw new Error("Item to modify have invalid id");
                        }
                        const modifiedProject = await APIWorker.patchAPI(`/main-business/v1/project-management/project/${projectToModify.id}`,{
                            name: projectNameField,
                            description: projectDescriptionField,
                            parentId: parentProjectOfDialog && parentProjectOfDialog.id && Number.isInteger(parentProjectOfDialog.id) ? parseInt(parentProjectOfDialog.id) : undefined
                        });

                        const { data } = modifiedProject.data;
                    }  
                    handleCloseDialog();

                    // const roomLink = `/room/${data[0]._id}`;
                    // history.push(roomLink);
                } catch (e) {
                    dispatch(setLoadingPrompt(null));
                    setDisableForm(false);
                    setError(`There has been a problem while ${projectToModify ? "modifying" : "creating"} the item, please recheck your fields or internet connection`);
                    return;
                }
            }}>
                <DialogContent>
                <DialogContentText>
                    {
                        `Enter these information below to ${projectToModify ? 'modify' : 'create'} a ${parentProjectOfDialog ? 'tasks collection' : 'project'} :`
                    }
                </DialogContentText>
                <Grid container item xs={12}>
                    <Grid container item xs={12} sm={8} direction="column">
                        <Grid item>
                            <TextField
                                variant="outlined"
                                required
                                id="ProjectName"
                                label="Name"
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
                        <Grid item style={{
                            display: parentProjectOfDialog ? 'none' : 'block'
                        }}>
                            <TextField
                                variant="outlined"
                                id="ProjectDescription"
                                label="Description"
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
                                    "/green_board.png"
                                }
                                alt="BigCuteImage"
                                width="100%"/>
                            </Grid>       
                        </Hidden>
                    </Grid>
                    {error ? (<Grid container item xs={12} justify="center">
                        <Alert severity="error">{error}</Alert>
                    </Grid>) : null}
                </Grid>
                </DialogContent>
                <DialogActions>
                <Button onClick={() => {
                    handleCloseDialog();
                }} color="secondary">
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