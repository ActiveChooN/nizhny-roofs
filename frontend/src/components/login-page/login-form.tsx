import React from 'react';
import { useHistory } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { Formik, Form, Field } from 'formik';
import Button from '@material-ui/core/Button/Button';
import Grid from '@material-ui/core/Grid/Grid';
import Link from '@material-ui/core/Link/Link';
import { TextField, CheckboxWithLabel } from 'formik-material-ui';
import makeStyles from '@material-ui/core/styles/makeStyles';

import { authenticationSucceed } from '../../store/slices/auth';

interface inputValues {
    email: string;
    password: string;
    remember: boolean;
}

const defaultInputValues = {
    email: '',
    password: '',
    remember: false,
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
                dispatch(authenticationSucceed({authToken: '', refreshToken: ''}));
                setSubmitting(false);
                history.push('/');
            }}
        >
            {({submitForm, isSubmitting}): JSX.Element => (
                <Form className={classes.form}>
                    <Field
                        component={TextField}
                        name='email'
                        type='email'
                        label='Email'
                        variant='outlined'
                        fullWidth
                    />
                    <Field
                        component={TextField}
                        name='password'
                        type='password'
                        label='Пароль'
                        variant='outlined'
                        fullWidth
                    />
                    <Field
                        component={CheckboxWithLabel}
                        name='remember'
                        type='checkbox'
                        Label={{label: 'Запомнить меня'}}
                        color='primary'
                    />
                    <Button
                        variant='contained'
                        className={classes.submit}
                        onClick={submitForm}
                        disabled={isSubmitting}
                        fullWidth
                    >
                        Войти
                    </Button>
                    <Grid container>
                        <Grid item xs>
                        <Link href='#' variant='body2'>
                            Забыли пароль?
                        </Link>
                        </Grid>
                        <Grid item>
                        <Link href='#/register' variant='body2'>
                            {'Нет аккаунта? Зарегистрируйтесь!'}
                        </Link>
                        </Grid>
                    </Grid>
                </Form>
            )}
        </Formik>
    )
}

export default LoginForm;