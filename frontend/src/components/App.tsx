import React from 'react';
import {Provider}  from 'react-redux';
import {Router, Switch, Route} from 'react-router-dom';
import {ThemeProvider} from '@material-ui/core/styles';

import {store} from '../store';
import history from '../history';
import MapPage from './map-page/map-page';
import LoginPage from './login-page/login-page';
import RegisterPage from './register-page/register-page';
import theme from './shared/theme';

function App() {
  return (
    <Provider store={store}>
      <Router history={history}>
        <ThemeProvider theme={theme}>
          <Switch>
            <Route exact path="/" component={MapPage}/>
            <Route exact path="/login" component={LoginPage}/>
            <Route exact path="/register" component={RegisterPage}/>
            <Route exact path="/roof/:id" component={LoginPage}/>
          </Switch>
        </ThemeProvider>
      </Router>
    </Provider>
  );
}

export default App;
