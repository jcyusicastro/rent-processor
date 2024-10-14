const RentProcessor = require('../RentProcessor');

describe('RentProcessor constructor invalid dates', () => {
  test('should throw an error for invalid start date format', () => {
    const rentDetails = {
      rentAmount: 500,
      rentFrequency: 'weekly',
      rentStartDate: '01-01-2024',
      rentEndDate: '2024-01-31'
    };

    expect(() => {
      new RentProcessor(rentDetails);
    }).toThrow();
  });

  test('should throw an error for invalid end date format', () => {
    const rentDetails = {
      rentAmount: 500,
      rentFrequency: 'weekly',
      rentStartDate: '2024-01-01',
      rentEndDate: '01-01-2024'
    };

    expect(() => {
      new RentProcessor(rentDetails);
    }).toThrow();
  });
});

describe('RentProcessor calculatePaymentDates', () => {
  test('should return correct weekly payment dates', () => {
    const rentDetails = {
      rentAmount: 500,
      rentFrequency: 'weekly',
      rentStartDate: '2024-01-01',
      rentEndDate: '2024-01-31',
      paymentMethod: 'instant'
    };

    const rentProcessor = new RentProcessor(rentDetails);
    const paymentDates = rentProcessor.calculatePaymentDates();

    const expectedDates = [
      { date: '2024-01-01', amount: 500, method: 'instant' },
      { date: '2024-01-08', amount: 500, method: 'instant' },
      { date: '2024-01-15', amount: 500, method: 'instant' },
      { date: '2024-01-22', amount: 500, method: 'instant' },
      { date: '2024-01-29', amount: 500, method: 'instant' },
    ];

    expect(paymentDates).toEqual(expectedDates);
  });

  test('should return correct fortnightly payment dates', () => {
    const rentDetails = {
      rentAmount: 500,
      rentFrequency: 'fortnightly',
      rentStartDate: '2024-01-01',
      rentEndDate: '2024-02-28',
      paymentMethod: 'instant'
    };

    const rentProcessor = new RentProcessor(rentDetails);
    const paymentDates = rentProcessor.calculatePaymentDates();

    const expectedDates = [
      { date: '2024-01-01', amount: 500, method: 'instant' },
      { date: '2024-01-15', amount: 500, method: 'instant' },
      { date: '2024-01-29', amount: 500, method: 'instant' },
      { date: '2024-02-12', amount: 500, method: 'instant' },
      { date: '2024-02-26', amount: 500, method: 'instant' },
    ];

    expect(paymentDates).toEqual(expectedDates);
  });

  test('should return correct monthly payment dates', () => {
    const rentDetails = {
      rentAmount: 500,
      rentFrequency: 'monthly',
      rentStartDate: '2024-01-01',
      rentEndDate: '2024-06-01',
      paymentMethod: 'instant'
    };

    const rentProcessor = new RentProcessor(rentDetails);
    const paymentDates = rentProcessor.calculatePaymentDates();

    const expectedDates = [
      { date: '2024-01-01', amount: 500, method: 'instant' },
      { date: '2024-02-01', amount: 500, method: 'instant' },
      { date: '2024-03-01', amount: 500, method: 'instant' },
      { date: '2024-04-01', amount: 500, method: 'instant' },
      { date: '2024-05-01', amount: 500, method: 'instant' },
      { date: '2024-06-01', amount: 500, method: 'instant' },
    ];

    expect(paymentDates).toEqual(expectedDates);
  });

  test('should handle invalid frequency', () => {
    const rentDetails = {
      rentAmount: 1000,
      rentFrequency: 'yearly',
      rentStartDate: '2024-01-01',
      rentEndDate: '2024-12-31',
      paymentMethod: 'instant'
    };

    const rentProcessor = new RentProcessor(rentDetails);

    expect(() => rentProcessor.calculatePaymentDates()).toThrow("Invalid rent frequency");
  });

});

describe('RentProcessor calculatePaymentDates with rentChange', () => {
  test('should throw an error for invalid date in rentChange', () => {
    const rentDetails = {
      rentAmount: 500,
      rentFrequency: 'weekly',
      rentStartDate: '2024-01-01',
      rentEndDate: '2024-03-31',
      paymentMethod: 'instant'
    };

    const rentChange = {
      rentAmount: 1200,
      effectiveDate: "01-01-2020"
    };

    const rentProcessor = new RentProcessor(rentDetails);

    expect(() => {
      rentProcessor.applyRentChange(rentChange);
    }).toThrow();
  });

  test('should return correct weekly payment dates', () => {
    const rentDetails = {
      rentAmount: 500,
      rentFrequency: 'weekly',
      rentStartDate: '2024-01-01',
      rentEndDate: '2024-03-31',
      paymentMethod: 'instant'
    };

    const rentChange = {
      rentAmount: 1200,
      effectiveDate: "2024-02-15"
    };

    const rentProcessor = new RentProcessor(rentDetails);
    rentProcessor.applyRentChange(rentChange);
    const paymentDates = rentProcessor.calculatePaymentDates();

    const expectedDatesWithRentChange = [
      { date: '2024-01-01', amount: 500, method: 'instant' },
      { date: '2024-01-08', amount: 500, method: 'instant' },
      { date: '2024-01-15', amount: 500, method: 'instant' },
      { date: '2024-01-22', amount: 500, method: 'instant' },
      { date: '2024-01-29', amount: 500, method: 'instant' },
      { date: '2024-02-05', amount: 500, method: 'instant' },
      { date: '2024-02-12', amount: 500, method: 'instant' },
      { date: '2024-02-19', amount: 1200, method: 'instant' },
      { date: '2024-02-26', amount: 1200, method: 'instant' },
      { date: '2024-03-04', amount: 1200, method: 'instant' },
      { date: '2024-03-11', amount: 1200, method: 'instant' },
      { date: '2024-03-18', amount: 1200, method: 'instant' },
      { date: '2024-03-25', amount: 1200, method: 'instant' }
    ];

    expect(paymentDates).toEqual(expectedDatesWithRentChange);
  });

  test('should return correct fortnightly payment dates', () => {
    const rentDetails = {
      rentAmount: 500,
      rentFrequency: 'fortnightly',
      rentStartDate: '2024-01-01',
      rentEndDate: '2024-06-30',
      paymentMethod: 'instant'
    };

    const rentChange = {
      rentAmount: 1200,
      effectiveDate: "2024-03-15"
    };

    const rentProcessor = new RentProcessor(rentDetails);
    rentProcessor.applyRentChange(rentChange);
    const paymentDates = rentProcessor.calculatePaymentDates();

    const expectedDatesWithRentChange = [
      { date: '2024-01-01', amount: 500, method: 'instant' },
      { date: '2024-01-15', amount: 500, method: 'instant' },
      { date: '2024-01-29', amount: 500, method: 'instant' },
      { date: '2024-02-12', amount: 500, method: 'instant' },
      { date: '2024-02-26', amount: 500, method: 'instant' },
      { date: '2024-03-11', amount: 500, method: 'instant' },
      { date: '2024-03-25', amount: 1200, method: 'instant' },
      { date: '2024-04-08', amount: 1200, method: 'instant' },
      { date: '2024-04-22', amount: 1200, method: 'instant' },
      { date: '2024-05-06', amount: 1200, method: 'instant' },
      { date: '2024-05-20', amount: 1200, method: 'instant' },
      { date: '2024-06-03', amount: 1200, method: 'instant' },
      { date: '2024-06-17', amount: 1200, method: 'instant' }
    ];

    expect(paymentDates).toEqual(expectedDatesWithRentChange);
  });

  test('should return correct monthly payment dates', () => {
    const rentDetails = {
      rentAmount: 500,
      rentFrequency: 'monthly',
      rentStartDate: '2024-01-01',
      rentEndDate: '2024-06-30',
      paymentMethod: 'instant'
    };

    const rentChange = {
      rentAmount: 1200,
      effectiveDate: "2024-03-15"
    };

    const rentProcessor = new RentProcessor(rentDetails);
    rentProcessor.applyRentChange(rentChange);
    const paymentDates = rentProcessor.calculatePaymentDates();

    const expectedDatesWithRentChange = [
      { date: '2024-01-01', amount: 500, method: 'instant' },
      { date: '2024-02-01', amount: 500, method: 'instant' },
      { date: '2024-03-01', amount: 500, method: 'instant' },
      { date: '2024-04-01', amount: 1200, method: 'instant' },
      { date: '2024-05-01', amount: 1200, method: 'instant' },
      { date: '2024-06-01', amount: 1200, method: 'instant' }
    ];

    expect(paymentDates).toEqual(expectedDatesWithRentChange);
  });

  test('should handle date before rentStartDate', () => {
    const rentDetails = {
      rentAmount: 500,
      rentFrequency: 'monthly',
      rentStartDate: '2024-01-01',
      rentEndDate: '2024-06-30',
      paymentMethod: 'instant'
    };

    const rentChange = {
      rentAmount: 1200,
      effectiveDate: "2023-12-31"
    };

    const rentProcessor = new RentProcessor(rentDetails);
    rentProcessor.applyRentChange(rentChange);
    const paymentDates = rentProcessor.calculatePaymentDates();
    const expectedDatesWithRentChange = [
      { date: '2024-01-01', amount: 1200, method: 'instant' },
      { date: '2024-02-01', amount: 1200, method: 'instant' },
      { date: '2024-03-01', amount: 1200, method: 'instant' },
      { date: '2024-04-01', amount: 1200, method: 'instant' },
      { date: '2024-05-01', amount: 1200, method: 'instant' },
      { date: '2024-06-01', amount: 1200, method: 'instant' }
    ];

    expect(paymentDates).toEqual(expectedDatesWithRentChange);
  });

  test('should handle date after rentEndDate', () => {
    const rentDetails = {
      rentAmount: 500,
      rentFrequency: 'monthly',
      rentStartDate: '2024-01-01',
      rentEndDate: '2024-06-30',
      paymentMethod: 'instant'
    };

    const rentChange = {
      rentAmount: 1200,
      effectiveDate: "2024-07-31"
    };

    const rentProcessor = new RentProcessor(rentDetails);
    rentProcessor.applyRentChange(rentChange);
    const paymentDates = rentProcessor.calculatePaymentDates();
    const expectedDatesWithRentChange = [
      { date: '2024-01-01', amount: 500, method: 'instant' },
      { date: '2024-02-01', amount: 500, method: 'instant' },
      { date: '2024-03-01', amount: 500, method: 'instant' },
      { date: '2024-04-01', amount: 500, method: 'instant' },
      { date: '2024-05-01', amount: 500, method: 'instant' },
      { date: '2024-06-01', amount: 500, method: 'instant' }
    ];

    expect(paymentDates).toEqual(expectedDatesWithRentChange);
  });
});

describe('RentProcessor calculatePaymentDates with rentChange and paymentMethod', () => {
  test('should return correct payment date and schedule when payment method is creditCard', () => {
    const rentDetails = {
      rentAmount: 500,
      rentFrequency: 'monthly',
      rentStartDate: '2024-01-01',
      rentEndDate: '2024-06-30',
      paymentMethod: 'creditCard'
    };

    const rentChange = {
      rentAmount: 1200,
      effectiveDate: "2024-03-31"
    };

    const rentProcessor = new RentProcessor(rentDetails);
    rentProcessor.applyRentChange(rentChange);
    const paymentDates = rentProcessor.calculatePaymentDates();

    const expectedDatesWithRentChange = [
      { date: '2024-01-03', amount: 500, method: 'creditCard' },
      { date: '2024-02-03', amount: 500, method: 'creditCard' },
      { date: '2024-03-03', amount: 500, method: 'creditCard' },
      { date: '2024-04-03', amount: 1200, method: 'creditCard' },
      { date: '2024-05-03', amount: 1200, method: 'creditCard' },
      { date: '2024-06-03', amount: 1200, method: 'creditCard' }
    ];

    expect(paymentDates).toEqual(expectedDatesWithRentChange);
  });

  test('should return correct payment date and schedule when payment method is bankTransfer', () => {
    const rentDetails = {
      rentAmount: 500,
      rentFrequency: 'monthly',
      rentStartDate: '2024-01-01',
      rentEndDate: '2024-06-30',
      paymentMethod: 'bankTransfer'
    };

    const rentChange = {
      rentAmount: 1200,
      effectiveDate: "2024-03-31"
    };

    const rentProcessor = new RentProcessor(rentDetails);
    rentProcessor.applyRentChange(rentChange);
    const paymentDates = rentProcessor.calculatePaymentDates();

    const expectedDatesWithRentChange = [
      { date: '2024-01-04', amount: 500, method: 'bankTransfer' },
      { date: '2024-02-04', amount: 500, method: 'bankTransfer' },
      { date: '2024-03-04', amount: 500, method: 'bankTransfer' },
      { date: '2024-04-04', amount: 1200, method: 'bankTransfer' },
      { date: '2024-05-04', amount: 1200, method: 'bankTransfer' },
      { date: '2024-06-04', amount: 1200, method: 'bankTransfer' }
    ];

    expect(paymentDates).toEqual(expectedDatesWithRentChange);
  });

  test('should return correct payment date and schedule when payment method is instant', () => {
    const rentDetails = {
      rentAmount: 500,
      rentFrequency: 'monthly',
      rentStartDate: '2024-01-01',
      rentEndDate: '2024-06-30',
      paymentMethod: 'instant'
    };

    const rentChange = {
      rentAmount: 1200,
      effectiveDate: "2024-03-31"
    };

    const rentProcessor = new RentProcessor(rentDetails);
    rentProcessor.applyRentChange(rentChange);
    const paymentDates = rentProcessor.calculatePaymentDates();

    const expectedDatesWithRentChange = [
      { date: '2024-01-01', amount: 500, method: 'instant' },
      { date: '2024-02-01', amount: 500, method: 'instant' },
      { date: '2024-03-01', amount: 500, method: 'instant' },
      { date: '2024-04-01', amount: 1200, method: 'instant' },
      { date: '2024-05-01', amount: 1200, method: 'instant' },
      { date: '2024-06-01', amount: 1200, method: 'instant' }
    ];

    expect(paymentDates).toEqual(expectedDatesWithRentChange);
  });

  test('should throw exception when paymentMethod is invalid', () => {
    const rentDetails = {
      rentAmount: 500,
      rentFrequency: 'weekly',
      rentStartDate: '2024-01-01',
      rentEndDate: '2024-03-31',
      paymentMethod: 'remittance'
    };

    const rentChange = {
      rentAmount: 1200,
      effectiveDate: "2024-03-31"
    };

    const rentProcessor = new RentProcessor(rentDetails);
    rentProcessor.applyRentChange(rentChange);

    expect(() => {
      rentProcessor.calculatePaymentDates();
    }).toThrow();
  })
});