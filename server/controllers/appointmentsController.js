const Appointment = require('../models/Appointment');
const User = require('../models/User');
const { emailUserNewAppt } = require('../utils/emailHelper.js');
const { insertEvent } = require('../utils/gcalHelper.js');
const moment = require('moment-timezone');

const create = async (req, res) => {
  const { guestName, guestEmail, guestComment, guestTz, meetingName, meetTime, apptTime, url } = req.body;
  const endTime = moment(apptTime).add(meetTime, 'm').format();

  try {
    const user = await User.findOne({ url });

    const newAppointment = new Appointment({
      user: user._id,
      guestName: guestName,
      guestEmail: guestEmail,
      guestComment: guestComment,
      guestTz: guestTz,
      meetingName: meetingName,
      meetTime: meetTime,
      apptTime: apptTime,
    });
    const eventTime = `${moment(apptTime).tz(user.timezone).format('h:mma - dddd, MMMM Do YYYY')}
    (${user.timezone.replace('_', ' ')} GMT${moment.tz(user.timezone).format('Z')})`;
    try {
      await insertEvent(
        user.access_token,
        user.refresh_token,
        apptTime,
        endTime,
        user.timezone,
        meetingName,
        guestEmail,
        guestName,
        guestComment,
        url,
      );
      await newAppointment.save();

      await emailUserNewAppt(
        user.email,
        user.given_name,
        guestName,
        guestEmail,
        guestTz.replace('_', ' '),
        guestComment,
        meetingName,
        eventTime,
      );

      res.status(201).send('New event created');
    } catch (err) {
      console.error(err);
      res.status(500).send(err);
    }
  } catch (err) {
    console.error(err);
    res.status(400).json(err);
  }
};

const userIndex = async (req, res) => {
  try {
    const resp = await Appointment.find({ user: req.params.user_id });
    res.status(200).send(resp);
  } catch (err) {
    res.status(404).json({ Error: 'User does not exist' });
  }
};

module.exports = { create, userIndex };
