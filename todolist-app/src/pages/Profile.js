import { useEffect } from 'react';

import { useDispatch } from 'react-redux';
import { setCurrentPage } from '../redux/navigation/navigationSlice';

import { PROFILE_PAGE } from '../constants/constants';

export function Profile(){
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(setCurrentPage(PROFILE_PAGE));
    }, []);

    return (
        <div>
            this is the profile
        </div>
    );
}