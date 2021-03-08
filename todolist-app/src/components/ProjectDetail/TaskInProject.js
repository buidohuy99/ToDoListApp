import clsx from 'clsx';

import { Paper, ListItem, ListItemIcon, ListItemText, makeStyles, IconButton, Typography } from '@material-ui/core';
import { FiberManualRecord } from '@material-ui/icons';

const useStyles = makeStyles((theme) => ({
    root: {
      width: '100%',
    },
    nested: {
        paddingLeft: theme.spacing(4),
    },
}));

export function TaskInProject({isNested, task}){
    const classes = useStyles();

    return (
       <ListItem className={clsx(classes.root, {
           [classes.nested]: isNested
       })} component={!isNested ? Paper : null} elevation={3}>
            <ListItemIcon>
                <IconButton size="small">
                    <FiberManualRecord/>
                </IconButton>
            </ListItemIcon>
            <ListItemText style={{
                userSelect: 'none'
            }}>
                <Typography variant="body1" style={{
                    fontStyle: task && task.name ? 'normal' : 'italic',
                }}>
                    {task && task.name ? task.name : "This task is empty"}
                </Typography>
            </ListItemText>
        </ListItem>
    );
}