const { isValidDate, calculateProcessingTime, addProcessingDays } = require('./utils');

class RentProcessor {
  constructor(rent) {

    if (!isValidDate(rent.rentStartDate)) {
      throw new Error('Expected format is YYYY-MM-DD.');
    }
    if (!isValidDate(rent.rentEndDate)) {
      throw new Error('Expected format is YYYY-MM-DD.');
    }

    this.rentAmount = rent.rentAmount;
    this.rentFrequency = rent.rentFrequency;
    this.rentStartDate = new Date(rent.rentStartDate);
    this.rentEndDate = new Date(rent.rentEndDate);
    this.rentChange = null;
    this.paymentMethod = rent.paymentMethod;
  }

  applyRentChange(rentChange) {
    if (!isValidDate(rentChange.effectiveDate)) {
      throw new Error('Expected format is YYYY-MM-DD.');
    }

    this.rentChange = {
      amount: rentChange.rentAmount,
      effectiveDate: new Date(rentChange.effectiveDate),
    };
  }


  calculatePaymentDates() {
    let currentDate = new Date(this.rentStartDate);
    const processingTime = calculateProcessingTime(this.paymentMethod);
    const paymentDates = [];

    while (currentDate <= this.rentEndDate) {
      const dateString = currentDate.toISOString().split('T')[0];
      paymentDates.push(dateString);

      switch (this.rentFrequency) {
        case 'weekly':
          currentDate.setDate(currentDate.getDate() + 7);
          break;
        case 'fortnightly':
          currentDate.setDate(currentDate.getDate() + 14);
          break;
        case 'monthly':
          currentDate.setMonth(currentDate.getMonth() + 1);
          break;
        default:
          throw new Error("Invalid rent frequency");
      }
    }

    if (this.rentChange === null) {
      return paymentDates.map(date => ({
        date: addProcessingDays(date, processingTime),
        amount: this.rentAmount,
        method: this.paymentMethod,
      }));
    }


    const paymentWithRent = paymentDates.map(date => {
      const paymentDate = new Date(date);
      const rentAmount = paymentDate >= this.rentChange.effectiveDate ? this.rentChange.amount : this.rentAmount;
      return { 
        date: addProcessingDays(date, processingTime), 
        amount: rentAmount,
        method: this.paymentMethod
      };
    });

    return paymentWithRent;

  }
}

module.exports = RentProcessor;