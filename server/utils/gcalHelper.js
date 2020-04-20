const { google } = require('googleapis');
const calendar = google.calendar('v3');
const oauth2Client = new google.auth.OAuth2(process.env.CLIENT_ID, process.env.CLIENT_SECRET, `postmessage`);
oauth2Client.generateAuthUrl({ access_type: 'offline' });

async function getFreebusy(token, startISO, endISO) {
  oauth2Client.setCredentials({
    access_token: token,
    // refresh_token: user.refresh_token,
  });
  oauth2Client.on('tokens', (tokens) => {
    console.log(tokens);
    //   await oauth2Client.setCredentials(tokens);
    if (tokens.refresh_token) {
      // store the refresh_token in my database!
      console.log(tokens.refresh_token);
    }
    console.log(tokens.access_token);
  });
  try {
    const resp = await calendar.freebusy.query({
      auth: oauth2Client,
      resource: {
        items: [{ id: 'primary' }],
        timeMin: startISO,
        timeMax: endISO,
      },
    });
    return resp.data.calendars.primary.busy;
  } catch (err) {
    throw ('Error at freebusy', err);
  }
}

async function insertEvent(token, startISO, endISO, timeZone, meetingName, guestEmail, guestName, guestComment) {
  oauth2Client.setCredentials({
    access_token: token,
    // refresh_token: user.refresh_token,
  });

  oauth2Client.on('tokens', (tokens) => {
    console.log(tokens);
    //   await oauth2Client.setCredentials(tokens);
    if (tokens.refresh_token) {
      // store the refresh_token in my database!
      console.log(tokens.refresh_token);
    }
    console.log(tokens.access_token);
  });

  var event = {
    summary: meetingName,
    start: {
      dateTime: startISO,
      timeZone: timeZone,
    },
    end: {
      dateTime: endISO,
      timeZone: timeZone,
    },
    attendees: [{ email: guestEmail, displayName: guestName, comment: guestComment }],
    reminders: {
      useDefault: true,
    },
  };
  try {
    await calendar.events.insert({
      auth: oauth2Client,
      calendarId: 'primary',
      sendUpdates: 'all',
      resource: event,
    });
  } catch (err) {
    throw ('Error at insert', err);
  }
}

module.exports = { getFreebusy, insertEvent };
