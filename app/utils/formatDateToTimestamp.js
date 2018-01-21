import moment from 'moment';

export const formatDateToTimestamp = (date, format = 'ddd MMM DD HH:mm:ss +ZZ YYYY') =>
    moment(date, format).format('x')