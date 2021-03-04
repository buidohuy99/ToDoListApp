import { Paper } from '@material-ui/core';

export const ComponentPaper = ({childComponent}) => {
    return (
        <Paper component={childComponent}></Paper>
    );
}