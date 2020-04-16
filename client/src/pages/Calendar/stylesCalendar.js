import { makeStyles } from '@material-ui/core/styles';

const useStylesCalendar = makeStyles({
  calendarContainer: {
    display: 'flex',
    justifyContent: 'space-between',
    margin: '5rem auto',
    width: '65%',
    height: '700px',
    maxWidth: '1100px',
  },
  calendar: {
    flex: '1 0 auto',
    fontSize: '1.2rem',
    paddingRight: '2rem',
    '& h5': {
      marginBottom: '1.5rem',
      color: '#484848',
      fontWeight: 'bold',
    },
  },
  eventInfo: {
    flex: '1 0 auto',
    padding: '1.5rem',
    '& h4': {
      color: '#484848',
      letterSpacing: '1px',
      fontWeight: 'bold',
    },
    '& h6': {
      color: 'gray',
      marginBottom: '0.5rem',
    },
  },
  duration: {
    color: 'grey',
    marginTop: '0.5rem',
    display: 'flex',
    '& p': {
      marginLeft: '0.5rem',
    },
  },
  selectDay: {
    display: 'flex',
    padding: '2rem 0 2rem 2rem',
  },
});

export default useStylesCalendar;
