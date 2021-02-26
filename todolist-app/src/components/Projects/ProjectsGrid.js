import { useEffect, useState } from 'react';

import { Grid, withWidth, CircularProgress } from '@material-ui/core';
import { Pagination, Alert } from '@material-ui/lab';

import { ProjectGridItem } from './ProjectGridItem';

import { AuthAxios } from '../../contexts/auth';

function ProjectsGrid({searchString, width}){
    const maxRoomPerPage = /sm|md/.test(width) ? 8 : /xs/.test(width) ? 10 : 9;
    const [numOfPages, setNumOfPages] = useState(1);
    const [currentPage, setCurrentPage] = useState(1);
    const [viewingProjects, setViewingProjects] = useState([]);
    const [isProjectsLoading, setProjectsLoading] = useState(true);
    const [isPagesLoading, setPagesLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        (async() => {   
            try{
                const query = `PageNumber=${currentPage}&ItemPerPage=${maxRoomPerPage}`;
                const results = await AuthAxios.get(process.env.REACT_APP_API_URL + `/main-business/v1/project-management/projects?` + query);
                const {data} = results.data;
                setViewingProjects(data.projects);
                setNumOfPages(data.totalPages);
                setPagesLoading(false);
            }catch(e){
                setError('There has been a problem with loading projects, please try refreshing...')
            }
            setProjectsLoading(false);
        })();
    }, [currentPage]);

    const handleOnPaginationChange = async(event, pageNumber) => {
        if(pageNumber === currentPage) return;
        setPagesLoading(true);
        setProjectsLoading(true);
        try{
            const query = `PageNumber=${currentPage}&ItemPerPage=${maxRoomPerPage}`;
            const results = await AuthAxios.get(process.env.REACT_APP_API_URL + `/main-business/v1/project-management/projects?` + query);
            const {data} = results.data;
            setViewingProjects(data.projects);
            setCurrentPage(pageNumber);
            setNumOfPages(data.totalPages);       
        }catch(e){
            if(e.response && e.response.status === 400 && e.response.data && e.response.data.data.newMaxPage){
                (async() => {
                    try{
                        const query = `PageNumber=${e.response.data.data.newMaxPage}&ItemPerPage=${maxRoomPerPage}`;
                        const refetch = AuthAxios.get(process.env.REACT_APP_API_URL + `/main-business/v1/project-management/projects?` + query); 
                        const {data} = refetch.data;
                        setViewingProjects(data.projects);
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
                <Alert severity="info">Currently you have no projects, try creating a new one!!!!!</Alert>
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