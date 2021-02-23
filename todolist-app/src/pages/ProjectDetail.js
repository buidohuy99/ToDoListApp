import { useEffect } from 'react';

import { useDispatch } from 'react-redux';
import { setCurrentPage } from '../redux/navigation/navigationSlice';

import { PROJECT_DETAIL_PAGE } from '../constants/constants';

export function ProjectDetail(){
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(setCurrentPage(PROJECT_DETAIL_PAGE));
    }, []);

    return (<div>
        this is project detail
    </div>);
}