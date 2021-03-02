import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';

import { Grid, withWidth, CircularProgress } from '@material-ui/core';
import { Pagination, Alert } from '@material-ui/lab';

import { ProjectGridItem } from './ProjectGridItem';

import { AuthAxios } from '../../contexts/auth';

import { setCurrentProjects } from '../../redux/projects/projectsSlice';

import signalR from '../../utils/signalR';

function ProjectsGrid({width}){
    const dispatch = useDispatch();

    const maxProjectPerPage = /sm|md/.test(width) ? 8 : /xs/.test(width) ? 10 : 9;
    const [numOfPages, setNumOfPages] = useState(1);
    const [currentPage, setCurrentPage] = useState(1);
    
    const [isProjectsLoading, setProjectsLoading] = useState(true);
    const [isPagesLoading, setPagesLoading] = useState(true);
    const [error, setError] = useState(null);

    const viewingProjects = useSelector((state) => state.projects.currentProjects);
    const searchString = useSelector((state) => state.projects.searchString);

    useEffect(() => {
        (async() => {   
            setPagesLoading(true);
            setProjectsLoading(true);
            try{      
                const query = `PageNumber=${currentPage}&ItemPerPage=${maxProjectPerPage}`;
                const search = searchString ? `&ProjectName=${searchString}` : '';
                const results = await AuthAxios.get(process.env.REACT_APP_API_URL + `/main-business/v1/project-management/projects?` + query + search);
                const {data} = results.data;
                dispatch(setCurrentProjects(data.projects));
                setNumOfPages(data.totalPages);
            }catch(e){    
                if(e.response && e.response.status === 400 && e.response.data && e.response.data.data.newMaxPage){        
                    (async() => {
                        try{
                            const query = `PageNumber=${e.response.data.data.newMaxPage}&ItemPerPage=${maxProjectPerPage}`;
                            const search = searchString ? `&ProjectName=${searchString}` : '';
                            const refetch = await AuthAxios.get(process.env.REACT_APP_API_URL + `/main-business/v1/project-management/projects?` + query + search); 
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
        if(parseInt(pageNumber) === parseInt(currentPage)) return;
        setPagesLoading(true);
        setProjectsLoading(true);
        try{
            const query = `PageNumber=${pageNumber}&ItemPerPage=${maxProjectPerPage}`;
            const search = searchString ? `&ProjectName=${searchString}` : '';
            const results = await AuthAxios.get(process.env.REACT_APP_API_URL + `/main-business/v1/project-management/projects?` + query + search);
            const {data} = results.data;
            dispatch(setCurrentProjects(data.projects));
            setCurrentPage(pageNumber);
            setNumOfPages(data.totalPages);       
        }catch(e){
            if(e.response && e.response.status === 400 && e.response.data && e.response.data.data.newMaxPage){
                (async() => {
                    try{
                        const query = `PageNumber=${e.response.data.data.newMaxPage}&ItemPerPage=${maxProjectPerPage}`;
                        const search = searchString ? `&ProjectName=${searchString}` : '';
                        const refetch = AuthAxios.get(process.env.REACT_APP_API_URL + `/main-business/v1/project-management/projects?` + query + search); 
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
            setPagesLoading(true);
            if(searchString){
                console.log('aaaaaaaaaa');
                projects = projects.filter((value) => value.name.includes(searchString))
            }
            const pagesCount = parseInt(Math.ceil(projects.length/maxProjectPerPage));
            setNumOfPages(pagesCount);
            if(currentPage >= pagesCount){
                setProjectsLoading(true);
                const newCurrentPage = currentPage > pagesCount ? pagesCount : currentPage;
                const start = (currentPage - 1)*maxProjectPerPage;
                dispatch(setCurrentProjects(projects.slice(start, Math.min(start + maxProjectPerPage, projects.length))));
                if(newCurrentPage !== currentPage){
                    setCurrentPage(newCurrentPage);
                }
                setProjectsLoading(false);
            }         
            setPagesLoading(false);
        }

        signalR.on("projects-list-changed", (data) => {
            updateGridStatus(data.projects);
        });
    }, [searchString]);

    return (
    <>
        <Grid container item xs={12} spacing={2}>
            {error ? 
            <Grid container item xs={12} justify="center">
                <Alert severity="error">{error}</Alert>
            </Grid>    
            :
            isProjectsLoading ? 
            <Grid container item xs={12} justify="center">
                <CircularProgress color='primary' variant='indeterminate'>
                </CircularProgress>
            </Grid>
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
    </>);
}

export default withWidth()(ProjectsGrid);