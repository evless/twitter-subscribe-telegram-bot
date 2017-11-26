import moment from 'moment';

export const formatDateToTimestamp = (date, format = 'ddd MMM DD HH:mm:ss') =>
    moment(date, format).format('x')