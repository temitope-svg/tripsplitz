import moment from 'moment';

export const formatDateRange = (startDate: string, endDate: string) => {
    const start = moment(startDate);
    const end = moment(endDate);
    
    // Check if dates are in the same year
    const sameYear = start.year() === end.year();
    
    const startFormat = `MMM Do`;
    const endFormat = sameYear ? `MMM Do / YYYY` : `MMM Do / YYYY`;
    
    return `${start.format(startFormat)} - ${end.format(endFormat)}`;
}

export const formatDate = (date: string, format: string) => {
    return moment(date).format(format);
}