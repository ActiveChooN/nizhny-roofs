import React, {useEffect} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import CircularProgress from '@material-ui/core/CircularProgress';
import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import Grid from '@material-ui/core/Grid';
import Person from '@material-ui/icons/Person';
import TextField from '@material-ui/core/TextField';
import AddAPhoto from '@material-ui/icons/AddAPhoto';
import makeStyles from '@material-ui/core/styles/makeStyles';

import {RootState} from '../../store';
import {getProfile, postAvatar, patchProfile} from '../../store/actions/profile'
import {useFormik} from 'formik';


interface ProfileModalProps {
    handleClose: (() => void);
    modalOpened: boolean;
}

const useStyles = makeStyles((theme) => ({
    dialogButton: {
        margin: theme.spacing(1),
    },
    profileAvatar: {
        width: theme.spacing(17),
        height: theme.spacing(17),
        '& svg': {
            fontSize: 72,
        },
    },
    addPhotoButton: {
        marginTop: theme.spacing(3)
    },
    form: {
        marginTop: theme.spacing(1),
        '& .MuiFormControl-root': {
            marginTop: theme.spacing(2),
        }
    },
    circular: {
        marginRight: theme.spacing(1),
    },
}));

const ProfileModal = (props: ProfileModalProps) => {
    const {handleClose, modalOpened} = props;
    const classes = useStyles();
    const dispatch = useDispatch();
    const {profile, isUpdating} = useSelector((state: RootState) => state.profile);

    const formik = useFormik({
        initialValues: {
            email: profile?.email || '',
            firstName: profile?.first_name || '',
            lastName: profile?.last_name || '',
        },
        validate: values => {
            const errors: any = {};

            if (!values.email) {
                errors.email = 'Поле обязательно';
            } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(values.email)) {
                errors.email = 'Неверный email адрес';
            }

            if (!values.firstName) {
                errors.firstName = 'Поле обязательно'
            } else if (!/[\w\dА-я]+/.test(values.firstName)) {
                errors.firstName = 'Неверный формат имени'
            }

            if (!/[\w\dА-я]*/.test(values.lastName)) {
                errors.lastName = 'Неверный формат фамилии'
            }

            return errors;
        },
        onSubmit: values => {
            dispatch(patchProfile(
                values.email || undefined,
                values.firstName || undefined,
                values.lastName || undefined,
            ));
        },
    });

    useEffect(() => {
        dispatch(getProfile());
    }, [dispatch]);

    useEffect(() => {
        formik.setFieldValue('email', profile?.email, false);
        formik.setFieldValue('firstName', profile?.first_name, false);
        formik.setFieldValue('lastName', profile?.last_name, false);
    // eslint-disable-next-line
    }, [profile]);

    useEffect(() => {
        formik.setSubmitting(isUpdating);
    // eslint-disable-next-line
    }, [isUpdating]);

    const postProfilePhoto = (photo: File | null) => {
        if (photo) dispatch(postAvatar(photo));
    }

    return (
        <Dialog
            open={modalOpened}
            onClose={handleClose}
        >
            <DialogTitle>Профиль</DialogTitle>
            <DialogContent>
                <Grid container spacing={1} justify='space-between'>
                    <Grid item container md={4} xs={12} direction='column' alignItems='center'>
                        <Grid item>
                            {profile?.avatar ? (
                                <Avatar src={profile?.avatar} className={classes.profileAvatar}/>
                            ) : (
                                <Avatar className={classes.profileAvatar}>
                                    <Person />
                                </Avatar>
                            )}
                        </Grid>
                        <Grid item>
                            <input
                                accept='image/*'
                                style={{ display: 'none' }}
                                id='upload-profile-photo-button-input'
                                type='file'
                                onChange={(event => {event.target.files
                                    && postProfilePhoto(event.target.files.item(0))})}
                            />
                            <label htmlFor='upload-profile-photo-button-input'>
                                <Button
                                    startIcon={<AddAPhoto />}
                                    variant='contained'
                                    color='secondary'
                                    className={classes.addPhotoButton}
                                    component='span'
                                >
                                    Загрузить
                                </Button>
                            </label>
                        </Grid>
                    </Grid>
                    <Grid item md={6} xs={12} className={classes.form}>
                        <TextField
                            name='email'
                            label='Email'
                            variant='outlined'
                            onChange={formik.handleChange}
                            value={formik.values.email}
                            helperText={formik.errors.email}
                            error={!!formik.errors.email}
                            fullWidth
                        />
                        <TextField
                            name='firstName'
                            label='Имя'
                            variant='outlined'
                            onChange={formik.handleChange}
                            value={formik.values.firstName}
                            helperText={formik.errors.firstName}
                            error={!!formik.errors.firstName}
                            fullWidth
                        />
                        <TextField
                            name='lastName'
                            label='Фамилия'
                            variant='outlined'
                            onChange={formik.handleChange}
                            value={formik.values.lastName}
                            helperText={formik.errors.lastName}
                            error={!!formik.errors.lastName}
                            fullWidth
                        />
                    </Grid>
                </Grid>
            </DialogContent>
            <DialogActions>
                <Button
                    onClick={handleClose}
                    color='primary'
                    className={classes.dialogButton}
                >
                    Отменить
                </Button>
                <Button
                    onClick={() => formik.handleSubmit()}
                    color='secondary'
                    className={classes.dialogButton}
                    disabled={!formik.isValid || formik.isSubmitting}
                    autoFocus
                >
                    {formik.isSubmitting && (<CircularProgress size={16} className={classes.circular}/>)}
                    Сохранить
                </Button>
            </DialogActions>
        </Dialog>
    )
}

export default ProfileModal;