import { useEffect, useRef } from 'react';

import { useDispatch } from 'react-redux';
import { setCurrentPage } from '../redux/navigation/navigationSlice';

import { useParams } from 'react-router-dom';

import { TODAY_PAGE, UPCOMING_PAGE, POSSIBLE_TASKS_GROUP } from '../constants/constants';

import NotFoundPage from '../pages/NotFoundPage';

export function TasksCollection(){
    const params = useParams();
    const dispatch = useDispatch();
    
    let hasValidParam = useRef(true);

    useEffect(() => {
        if(!POSSIBLE_TASKS_GROUP.includes(params.tasks_group)){
            hasValidParam = false;
        }
        if(hasValidParam){
            dispatch(setCurrentPage(params.tasks_group === 'today' ? TODAY_PAGE : UPCOMING_PAGE));
        }else{
            dispatch(setCurrentPage(null));
        }
    }, [params.tasks_group]);

    if(!POSSIBLE_TASKS_GROUP.includes(params.tasks_group)){
        hasValidParam = false;
        return <NotFoundPage/>;
    }  

    return (<div>
        {`all tasks that match filter: ${params.tasks_group}`}
    </div>);
}