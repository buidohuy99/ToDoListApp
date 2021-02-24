import { useState } from 'react';
import { TextField, InputAdornment, IconButton, FormControl, Input } from '@material-ui/core';
import { Search as SearchIcon } from '@material-ui/icons';

export function SearchBar({searchBarPlaceholder, callbackOnSearch}){
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
                        callbackOnSearch(searchString);
                    }}>          
                        <SearchIcon/>                          
                    </IconButton>
                </InputAdornment>
                }
            />
        </FormControl>
    );
}