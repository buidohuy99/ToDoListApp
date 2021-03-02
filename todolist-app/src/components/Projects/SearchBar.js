import { useState } from 'react';
import { InputAdornment, IconButton, FormControl, Input } from '@material-ui/core';
import { Search as SearchIcon } from '@material-ui/icons';

import { useDispatch } from 'react-redux';

import { setSearchString as setGlobalSearchString } from '../../redux/projects/projectsSlice';

export function SearchBar({searchBarPlaceholder}){
    const dispatch = useDispatch();
    const [searchString, setSearchString] = useState(null);

    return (
        <FormControl fullWidth>
            <Input color='secondary'
                placeholder={searchBarPlaceholder ? searchBarPlaceholder : 'Type in what you want to search'}
                value={searchString ? searchString : ''}
                onChange={(event) => {
                    const value = event.target.value;
                    setSearchString(value === '' ? null : value);
                }}
                endAdornment={
                <InputAdornment position="end">
                    <IconButton
                    aria-label="toggle password visibility"
                    onClick={() => {
                        console.log('searched');
                        dispatch(setGlobalSearchString(searchString));
                    }}>          
                        <SearchIcon/>                          
                    </IconButton>
                </InputAdornment>
                }
            />
        </FormControl>
    );
}