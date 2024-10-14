// utils.test.js
const { isValidDate, calculateProcessingTime, addProcessingDays } = require('../utils');

describe('util functions', () => {
    describe('isValidDate', () => {
        test('should return true for valid date format', () => {
            expect(isValidDate('2024-01-01')).toBe(true);
            expect(isValidDate('2024-02-29')).toBe(true); // Leap year
            expect(isValidDate('2024-12-31')).toBe(true);
        });

        test('should return false for invalid date format', () => {
            expect(isValidDate('2024-13-01')).toBe(false); // Invalid month
            expect(isValidDate('2024-02-30')).toBe(false); // Invalid day
            expect(isValidDate('2024-04-31')).toBe(false); // April has 30 days
            expect(isValidDate('2024-02-29')).toBe(true); // Valid leap year date
            expect(isValidDate('2023-02-29')).toBe(false); // Invalid non-leap year date
        });

        test('should return false for incorrectly formatted strings', () => {
            expect(isValidDate('01-01-2024')).toBe(false); // Wrong format
            expect(isValidDate('2024/01/01')).toBe(false); // Wrong delimiter
            expect(isValidDate('20240101')).toBe(false); // Missing delimiters
            expect(isValidDate('2024-1-1')).toBe(false); // Invalid month and day format
        });

        test('should return false for non-date strings', () => {
            expect(isValidDate('Hello, World!')).toBe(false);
            expect(isValidDate('')).toBe(false);
            expect(isValidDate(null)).toBe(false);
            expect(isValidDate(undefined)).toBe(false);
        });
    });

    describe('calculateProcessingTime', () => {
        it('should return 2 for creditCard payment method', () => {
            expect(calculateProcessingTime('creditCard')).toBe(2);
        });

        it('should return 3 for bankTransfer payment method', () => {
            expect(calculateProcessingTime('bankTransfer')).toBe(3);
        });

        it('should return 0 for instant payment method', () => {
            expect(calculateProcessingTime('instant')).toBe(0);
        });

        it('should throw an error for invalid payment method', () => {
            expect(() => calculateProcessingTime('cash')).toThrow('Invalid payment method');
        });
    });

    describe('addProcessingDays', () => {
        it('should add the correct number of days to the given date', () => {
            expect(addProcessingDays('2024-10-14', 2)).toBe('2024-10-16');
            expect(addProcessingDays('2024-10-14', 3)).toBe('2024-10-17');
            expect(addProcessingDays('2024-10-14', 0)).toBe('2024-10-14');
        });
    });

})


