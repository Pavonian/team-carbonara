import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import { TextField, FormControl } from '@material-ui/core';
import { Autocomplete } from '@material-ui/lab';

const moment = require('moment-timezone');

const styles = {
  root: {
    // margin: theme.spacing.unit * 2,
    // border: "2px solid black",
    display: 'inline',
    width: '100%',
  },
};

function FormTimeZone(props) {
  const { classes, setTimeZone } = props;

  return (
    // <FormControl>
    <Autocomplete
      className={classes.root}
      options={moment.tz.names()}
      getOptionLabel={(option) => option + ' (GMT' + moment.tz(option).format('Z') + ')'}
      renderInput={(params) => <TextField {...params} label="Type a city or zone" variant="outlined" />}
      onChange={(e, v) => setTimeZone(v)}
    />
    // </FormControl>
  );
}

export default withStyles(styles)(FormTimeZone);
