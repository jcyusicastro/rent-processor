// utils.js

/**
 * Validate if a date string is in "YYYY-MM-DD" format and represents a valid date.
 * @param {string} dateString - The date string to validate.
 * @returns {boolean} - Returns true if the date is valid, false otherwise.
 */
function isValidDate(dateString) {
    const regex = /^\d{4}-\d{2}-\d{2}$/;
    if (!regex.test(dateString)) return false;

    const dateParts = dateString.split('-');
    const year = parseInt(dateParts[0], 10);
    const month = parseInt(dateParts[1], 10);
    const day = parseInt(dateParts[2], 10);

    // Check month validity (1-12)
    if (month < 1 || month > 12) return false;

    // Check day validity based on the month and year
    const daysInMonth = new Date(year, month, 0).getDate();
    return day > 0 && day <= daysInMonth;
}

function calculateProcessingTime(paymentMethod) {
    switch (paymentMethod) {
        case 'creditCard':
            return 2;
        case 'bankTransfer':
            return 3;
        case 'instant':
            return 0;
        default:
            throw new Error('Invalid payment method');
    }
}

function addProcessingDays(date, days) {
    const paymentDate = new Date(date);
    paymentDate.setDate(paymentDate.getDate() + days);
    return paymentDate.toISOString().split('T')[0];
}

module.exports = { isValidDate, calculateProcessingTime, addProcessingDays };
