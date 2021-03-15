import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';

import { Grid, withWidth, useTheme } from '@material-ui/core';
import { Pagination, Alert } from '@material-ui/lab';

import { ProjectGridItem } from './ProjectGridItem';

import { setCurrentProjects } from '../../redux/projects/projectsSlice';

import { useSignalR }  from '../../services/signalR';

import { GetAllProjects_Action } from '../../services/actions/projects/GetAllProjects_Action';
import { setLoadingPrompt } from '../../redux/loading/loadingSlice';

function ProjectsGrid({width}){
    const dispatch = useDispatch();
    const theme = useTheme();

    const { signalR } = useSignalR();

    const maxProjectPerPage = /sm|md/.test(width) ? 8 : /xs/.test(width) ? 10 : 9;
    const [numOfPages, setNumOfPages] = useState(1);
    const [currentPage, setCurrentPage] = useState(1);
    
    const [isProjectsLoading, setProjectsLoading] = useState(true);
    const [isPagesLoading, setPagesLoading] = useState(true);
    const [error, setError] = useState(null);

    const viewingProjects = useSelector((state) => state.projects.currentProjects);
    const searchString = useSelector((state) => state.projects.searchString);

    const [isUnmounted, setIsUnmounted] = useState(false);

    useEffect(() => {
        return () => {
            setIsUnmounted(true);
        }
    }, []);

    useEffect(() => {
        (async() => {   
            setPagesLoading(true);
            setProjectsLoading(true);
            try{      
                const results = await GetAllProjects_Action(currentPage, maxProjectPerPage, searchString);
                const {data} = results.data;
                dispatch(setCurrentProjects(data.projects));
                setNumOfPages(data.totalPages);
            }catch(e){    
                if(e.response && e.response.status === 400 && e.response.data && e.response.data.data.newMaxPage){        
                    (async() => {
                        try{
                            const refetch = await GetAllProjects_Action(e.response.data.data.newMaxPage, maxProjectPerPage, searchString);
                            const {data} = refetch.data;
                            dispatch(setCurrentProjects(data.projects));
                            setCurrentPage(e.response.data.data.newMaxPage);
                            setNumOfPages(e.response.data.data.newMaxPage);
                        }catch(ex){
                            setError('An error occured while fetching the rooms page, try refreshing');
                        }
                        setProjectsLoading(false);
                        setPagesLoading(false);
                    })();
                    return;
                }
                setError('There has been a problem with loading projects, please try refreshing...')
            }
            setProjectsLoading(false);
            setPagesLoading(false);
        })();
    }, [maxProjectPerPage, searchString]);

    const handleOnPaginationChange = async(event, pageNumber) => {
        setPagesLoading(true);
        setProjectsLoading(true);
        try{
            const results = await GetAllProjects_Action(pageNumber, maxProjectPerPage, searchString); 
            const {data} = results.data;
            dispatch(setCurrentProjects(data.projects));
            setCurrentPage(pageNumber);
            setNumOfPages(data.totalPages);       
        }catch(e){
            if(e.response && e.response.status === 400 && e.response.data && e.response.data.data.newMaxPage){
                (async() => {
                    try{
                        const refetch = await GetAllProjects_Action(e.response.data.data.newMaxPage, maxProjectPerPage, searchString); 
                        const {data} = refetch.data;
                        dispatch(setCurrentProjects(data.projects));
                        setCurrentPage(e.response.data.data.newMaxPage);
                        setNumOfPages(e.response.data.data.newMaxPage);
                    }catch(e){
                        setError('An error occured while fetching the rooms page, try refreshing');
                    }
                    setProjectsLoading(false);
                    setPagesLoading(false);
                })();
                return;
            }
            setError('An error occured while fetching the rooms page, try refreshing');
        }
        setProjectsLoading(false);
        setPagesLoading(false);
    }

    useEffect(() => {
        const updateGridStatus = (projects) => {
            dispatch(setLoadingPrompt("Information about your projects came from the server..."));
            setPagesLoading(true);
            setProjectsLoading(true);
            (async() => {
                if(searchString){
                    projects = projects.filter((value) => value.name.includes(searchString))
                }
                const pagesCount = Math.max(1, parseInt(Math.ceil(projects.length/maxProjectPerPage)));
                setNumOfPages(pagesCount);
                
                const newCurrentPage = currentPage > pagesCount ? pagesCount : currentPage;
                const start = (newCurrentPage - 1)*maxProjectPerPage;
                dispatch(setCurrentProjects(projects.slice(start, Math.min(start + maxProjectPerPage, projects.length))));
                setCurrentPage(newCurrentPage);
                setProjectsLoading(false);
                setPagesLoading(false);
                dispatch(setLoadingPrompt(null));
            })();
        }

        signalR.on("projects-list-changed", (data) => {
            if(!isUnmounted){
                updateGridStatus(data.projects);
            }
        });
    }, [searchString, maxProjectPerPage, currentPage]);

    return (
    <React.Fragment>
        <Grid container item xs={12} spacing={2}>
            {error ? 
            <Grid container item xs={12} justify="center">
                <Alert severity="error">{error}</Alert>
            </Grid>    
            :
            isProjectsLoading ? 
            null
            :
            viewingProjects.length <= 0 ? 
            <Grid container item xs={12} justify="center">
                <Alert severity="info">There seems to be no projects here ¯\_(ツ)_/¯</Alert>
            </Grid>
            : viewingProjects.map((item, idx) => 
                <ProjectGridItem key={"ProjectGridItem"+ idx} project={item}/>
            )
            }
        </Grid>
        {
            error ? 
            null 
            :
            isPagesLoading?
            null
            :
            <Grid container item xs={11} justify="center">
                <Pagination variant="outlined"
                boundaryCount={2} 
                color="primary"
                count={numOfPages}
                defaultPage={1}
                page={currentPage}
                onChange={(e, p) => handleOnPaginationChange(e, p)}/>
            </Grid>
        }
    </React.Fragment>);
}

export default withWidth()(ProjectsGrid);