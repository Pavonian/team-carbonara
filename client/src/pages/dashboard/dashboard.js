import React, { useState, useEffect } from 'react';
import Navbar from '../../components/Navbar/Navbar';
import useStylesDashboard from './stylesDashboard';
import { withTheme } from '@material-ui/core/styles';
import { Tabs, Tab, Button, Avatar } from '@material-ui/core';
import { Route, Switch } from 'react-router-dom';
import DashPanel from '../../components/DashPanel/DashPanel';
import Event from '../../components/Event/Event';
import handleFetchErrors from '../../utils/handleFetchErrors';
import NewEventDialog from '../../components/NewEventDialog/NewEventDialog';
import auth from '../../auth';
import Upgrade from '../Upgrade/Upgrade';
import Checkout from '../Checkout/Checkout';

function Dashboard() {
  const classes = useStylesDashboard();

  const [user, setUser] = useState({ meetings: [] });
  //Tracks active tab
  const [value, setValue] = useState(0);
  //dialog state
  const [open, setOpen] = useState(false);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  //POSSIBLE TODO: find another way to render the new meeting in UI
  function renderNewMeeting(meeting) {
    const userClone = Object.assign({}, user);
    userClone.meetings.push(meeting);
    setUser(userClone);
  }

  useEffect(() => {
    //google sub id
    const subId = auth.getSub();

    //fetch user info
    fetch(`http://localhost:3001/api/user/${subId}`)
      .then(handleFetchErrors)
      .then((res) => res.json())
      .then((data) => {
        setUser(data);
      })
      .catch((e) => {
        console.error('Error: ' + e);
      });
  }, []);

  return (
    <div className={classes.container}>
      <Navbar picture={user.picture} name={user.given_name} />
      <Switch>
        <Route exact path="/dashboard/user/upgrade">
          <Upgrade sub={user.sub} subscriber={user.subscriber} />
        </Route>
        <Route exact path="/dashboard/user/upgrade/checkout">
          <Checkout email={user.email} sub={user.sub} />
        </Route>
        <Route path="/">
          <main className={classes.dashBody}>
            <div className={classes.subHeader}>
              <h1>My CalendApp</h1>
              <Tabs value={value} onChange={handleChange} indicatorColor="primary" textColor="primary">
                <Tab label="Event Types" />
                <Tab label="Scheduled Events" />
              </Tabs>
            </div>
            <DashPanel value={value} index={0}>
              <header className={classes.panelHeader}>
                <div className={classes.profileContainer}>
                  <Avatar src={user.picture} />
                  <div className={classes.profileInfo}>
                    <span>{user.given_name}</span>
                    <span>calendapp.com/{user.url}</span>
                  </div>
                </div>
                <Button onClick={handleClickOpen} className={classes.addEventBtn} size="large" variant="outlined">
                  + New Event Type
                </Button>
                <NewEventDialog
                  renderNewMeeting={renderNewMeeting}
                  sub={user.sub}
                  open={open}
                  handleClose={handleClose}
                />
              </header>
              <section className={classes.events}>
                {user.meetings.map((meeting, index) => (
                  <Event
                    url={user.url}
                    user={`${user.given_name} ${user.family_name}`}
                    key={index}
                    duration={meeting.duration}
                    meetingName={meeting.meetingName}
                  />
                ))}
              </section>
              <Button size="large" variant="contained" className={classes.getStartedBtn}>
                Getting Started Guide
              </Button>
            </DashPanel>
          </main>
        </Route>
      </Switch>
    </div>
  );
}

export default withTheme(Dashboard);
