import { useEffect } from 'react';

import { useDispatch } from 'react-redux';
import { setCurrentPage } from '../redux/navigation/navigationSlice';

import { PROJECTS_PAGE } from '../constants/constants';

export function ProjectsView(){
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(setCurrentPage(PROJECTS_PAGE));
    }, []);

    return(<div>
        all projects
    </div>);
}