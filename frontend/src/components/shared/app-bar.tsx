import React, {useState} from 'react';
import {useLocation} from 'react-router';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Button from '@material-ui/core/Button';
import ButtonBase from '@material-ui/core/ButtonBase';
import IconButton from '@material-ui/core/IconButton';
import AccountCircle from '@material-ui/icons/AccountCircle';
import MenuItem from '@material-ui/core/MenuItem';
import Menu from '@material-ui/core/Menu';
import makeStyles from '@material-ui/core/styles/makeStyles';

import {HeaderLogoIcon} from './icons';
import {useAuth, logout} from '../../authProvider'
import Index from './profile-modal';

const useStyles = makeStyles({
    toolbar: {
        justifyContent: 'space-between',
    }
})

const HeaderAppBar = () => {
    const classes = useStyles();
    const location = useLocation();
    const [isAuthenticated] = useAuth();
    const [anchorEl, setAnchorEl] = useState<any>(null);
    const [modalOpened, setModalOpened] = useState(false);
    const menuIsOpened = !!anchorEl;
    
    const handleMenu = (event: React.MouseEvent) => {
        setAnchorEl(event.currentTarget);
    };

    const handleMenuClose = () => {
        setAnchorEl(null);
    };

    const handleLogout = () => {
        handleMenuClose();
        console.log('Logging out...')
        logout();
    }

    return (
        <>
            <AppBar position='static'>
                <Toolbar className={classes.toolbar}>
                    <ButtonBase href='/#'>
                        <HeaderLogoIcon />
                    </ButtonBase>
                    {!(['/login', '/register'].includes(location.pathname) || isAuthenticated) && (
                        <Button color='inherit' href='#/login'>
                            Войти
                        </Button>
                    )}
                    {isAuthenticated && (
                        <div>
                            <IconButton
                                aria-label='Аккаунт пользователя'
                                aria-controls='menu-appbar'
                                aria-haspopup='true'
                                onClick={handleMenu}
                                color='inherit'
                            >
                                <AccountCircle />
                            </IconButton>
                            <Menu
                                id='menu-appbar'
                                anchorEl={anchorEl}
                                anchorOrigin={{
                                    vertical: 'bottom',
                                    horizontal: 'left',
                                }}
                                transformOrigin={{
                                    vertical: 'bottom',
                                    horizontal: 'left',
                                }}
                                open={menuIsOpened}
                                onClose={handleMenuClose}
                                keepMounted
                            >
                                <MenuItem onClick={() => setModalOpened(true)}>
                                    Аккаунт
                                </MenuItem>
                                <MenuItem onClick={handleLogout}>Выйти</MenuItem>
                            </Menu>
                        </div>
                    )}
                </Toolbar>
            </AppBar>
            <Index
                handleClose={() => setModalOpened(false)}
                modalOpened={modalOpened}
            />
        </>
    )
}

export default HeaderAppBar;