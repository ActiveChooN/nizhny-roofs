import React from 'react';
import {useDispatch} from 'react-redux';
import {useHistory} from 'react-router-dom';
import { Formik, Form, Field } from 'formik';
import Button from '@material-ui/core/Button';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import Grid from '@material-ui/core/Grid';
import {TextField} from 'formik-material-ui';
import makeStyles from '@material-ui/core/styles/makeStyles';

import {showErrorSuccessMessageOnFetch} from '../../store/slices/alertMessage';
import {register} from '../../api/auth';

interface inputValues {
    email: string;
    password: string;
    passwordConfirmation: string,
    firstName: string;
    lastName: string;
}

const defaultInputValues = {
    email: '',
    password: '',
    passwordConfirmation: '',
    firstName: '',
    lastName: '',
}

const formValidator = (values: any) => {
    const errors: any = {};
    if (!values.email) {
        errors.email = 'Поле обязательно';
    } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(values.email)) {
        errors.email = 'Неверный email адрес';
    }

    if (!values.password) {
        errors.password = 'Поле обязательно';
    }

    if (!values.passwordConfirmation) {
        errors.passwordConfirmation = 'Поле обязательно';
    } else if (values.password !== values.passwordConfirmation) {
        errors.passwordConfirmation = 'Пароли не совпадают';
        errors.password = 'Пароли не совпадают';
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

}

const useStyles = makeStyles((theme) => ({
    form: {
        width: '100%', // Fix IE 11 issue.
        marginTop: theme.spacing(1),
        '& .MuiFormControl-root': {
            marginTop: theme.spacing(1),
        }
    },
    submit: {
        margin: theme.spacing(3, 0, 2),
        padding: theme.spacing(1, 0),
        backgroundColor: theme.palette.secondary.main,
        color: 'white',
        '&:hover': {
            backgroundColor: theme.palette.secondary.light,
        },
    },
}))

const LoginForm = () => {
    const classes = useStyles();
    const history = useHistory();
    const dispatch = useDispatch();

    return (
        <Formik
            initialValues={defaultInputValues}
            validate={formValidator}
            onSubmit={(values, {setSubmitting}) => {
                dispatch(showErrorSuccessMessageOnFetch(
                    register(values.email, values.password, values.firstName, values.lastName)
                        .then(() => {history.push('/login')})
                        .catch((e) => {
                            setSubmitting(false);
                            throw e;
                        }), 'Вы успешно зарегистрировались!'
                ));
            }}
        >
            {({submitForm, isSubmitting}): JSX.Element => (
                <Form className={classes.form}>
                    <Grid container spacing={1}>
                        <Grid item xs>
                            <Field
                                component={TextField}
                                name='firstName'
                                type='text'
                                label='Имя'
                                variant='outlined'
                                fullWidth
                                required
                            />
                        </Grid>
                        <Grid item xs>
                            <Field
                                component={TextField}
                                name='lastName'
                                type='text'
                                label='Фамилия'
                                variant='outlined'
                            />
                        </Grid>
                    </Grid>
                    <Field
                        component={TextField}
                        name='email'
                        type='email'
                        label='Email'
                        variant='outlined'
                        fullWidth
                        required
                    />
                    <Field
                        component={TextField}
                        name='password'
                        type='password'
                        label='Пароль'
                        variant='outlined'
                        fullWidth
                        required
                    />
                    <Field
                        component={TextField}
                        name='passwordConfirmation'
                        type='password'
                        label='Повторите пароль'
                        variant='outlined'
                        fullWidth
                        required
                    />
                    <FormControlLabel
                        control={<Checkbox value='notification' color='primary' />}
                        label='Получать обновления по почте'
                    />
                    <Button
                        variant='contained'
                        className={classes.submit}
                        onClick={submitForm}
                        disabled={isSubmitting}
                        fullWidth
                    >
                        Зарегистрироваться
                    </Button>
                </Form>
            )}
        </Formik>
    )
}

export default LoginForm;