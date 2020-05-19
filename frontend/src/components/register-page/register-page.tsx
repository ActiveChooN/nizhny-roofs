import React from 'react';
import {Redirect} from 'react-router-dom';
import Container from '@material-ui/core/Container/Container';
import Avatar from '@material-ui/core/Avatar/Avatar';
import Typography from '@material-ui/core/Typography/Typography';
import makeStyles from '@material-ui/core/styles/makeStyles';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';

import AppBar from '../shared/app-bar';
import RegisterForm from './register-form';
import Copyright from '../shared/copyright';
import {useAuth} from '../../authProvider';

const useStyles = makeStyles((theme) => ({
    paper: {
        marginTop: theme.spacing(8),
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
    },
    avatar: {
        margin: theme.spacing(1),
        backgroundColor: theme.palette.secondary.main,
    },
    copyright: {
        marginTop: theme.spacing(1),
    }
}))

const LoginPage = () => {
    const classes = useStyles();
    const [isAuthenticated] = useAuth();

    if (isAuthenticated) {
        return (
            <Redirect to='/'/>
        )
    }

    return (
        <>
            <AppBar />
            <Container maxWidth='xs'>
                <div className={classes.paper}>
                    <Avatar className={classes.avatar}>
                        <LockOutlinedIcon />
                    </Avatar>
                    <Typography component="h1" variant="h5">
                        Зарегистрироваться
                    </Typography>
                    <RegisterForm />
                </div>
            </Container>
            <Copyright/>
        </>
    )
}

export default LoginPage;