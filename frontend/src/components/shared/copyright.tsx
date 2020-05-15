import React from 'react';
import Typography from '@material-ui/core/Typography';
import Link from '@material-ui/core/Link';
import makeStyles from '@material-ui/core/styles/makeStyles';


const useStyles = makeStyles((theme) => ({
    copyrightText: {
        marginTop: theme.spacing(2),
    }
}))

const Copyright = () =>  {
    const classes = useStyles();

    return (
      <Typography variant="body2" color="textSecondary" align="center" className={classes.copyrightText}>
        {'Copyright © '}
        <Link color="inherit" href="https://github.com/ActiveChooN">
          ActiveChoon
        </Link>{' '}
        {new Date().getFullYear()}
        {'.'}
      </Typography>
    );
  }

export default Copyright;