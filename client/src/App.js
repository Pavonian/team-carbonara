import React from 'react';
import { ThemeProvider, CssBaseline } from '@material-ui/core';
import { withStyles } from '@material-ui/core/styles';
import { BrowserRouter, Switch, Route, Redirect } from 'react-router-dom';
import { theme } from './themes/theme';
import Form from './components/Form/Form';
import OnBoarding from './pages/OnBoarding';
import Dashboard from './pages/Dashboard/dashboard';
import PrivateRoute from './components/PrivateRoute/PrivateRoute';
import Calendar from './pages/Calendar/Calendar';
import Confirm from './components/NewAppointment/Confirm';
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';

const stylesApp = (theme) => ({
  appName: {
    margin: '5rem 0 3rem 0',
    color: '#ff6d00',
    textAlign: 'center',
    '& span': {
      color: 'rgba(0, 0, 0, 0.87)',
    },
  },
});

const stripePromise = loadStripe(process.env.REACT_APP_STRIPE_KEY);

function App({ classes }) {
  return (
    <Elements stripe={stripePromise}>
      <React.Fragment>
        <BrowserRouter>
          <ThemeProvider theme={theme}>
            <CssBaseline />
            <Switch>
              <Route exact path="/:url/:eventDuration/confirm" component={Confirm} />
              <Route exact path="/:url/:eventDuration" component={Calendar} />
              <PrivateRoute path="/dashboard" component={Dashboard} />
              <React.Fragment>
                <h1 id="appName" className={classes.appName}>
                  calend
                  <span>app</span>
                </h1>
                <Switch>
                  <Redirect exact from="/" to="/login" />
                  <Route path="/login">
                    <Form type="login" />
                  </Route>
                  <Route path="/signup">
                    <Form type="signup" />
                  </Route>
                  <PrivateRoute path="/profile_settings" type="profile" activeStep={0} component={OnBoarding} />
                  <PrivateRoute path="/confirm" type="confirm" activeStep={50} component={OnBoarding} />
                  <PrivateRoute path="/availability" type="availability" activeStep={100} component={OnBoarding} />
                </Switch>
              </React.Fragment>
            </Switch>
          </ThemeProvider>
        </BrowserRouter>
      </React.Fragment>
    </Elements>
  );
}

export default withStyles(stylesApp)(App);
