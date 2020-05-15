import React from 'react';
import {useLocation} from 'react-router';
import {useSelector} from 'react-redux';
import AppBar from '@material-ui/core/AppBar/AppBar';
import Toolbar from '@material-ui/core/Toolbar/Toolbar';
import Button from '@material-ui/core/Button/Button';
import ButtonBase from '@material-ui/core/ButtonBase/ButtonBase';
import makeStyles from '@material-ui/core/styles/makeStyles';

import {HeaderLogoIcon} from './icons';

const useStyles = makeStyles({
    toolbar: {
        justifyContent: 'space-between',
    }
})

const HeaderAppBar = () => {
    const classes = useStyles();
    const location = useLocation();
    const {authenticated} = useSelector((state: any) => state.auth);

    return (
        <AppBar position='static'>
            <Toolbar className={classes.toolbar}>
                <ButtonBase href='/#'>
                    <HeaderLogoIcon />
                </ButtonBase>
                {!(['/login', '/register'].includes(location.pathname) || authenticated) && (
                    <Button color="inherit" href='#/login'>
                        Войти
                    </Button>
                )}
            </Toolbar>
        </AppBar>
    )
}

export default HeaderAppBar;