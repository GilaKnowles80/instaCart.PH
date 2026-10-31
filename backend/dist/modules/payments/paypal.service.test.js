import { describe, it, expect, beforeEach } from 'vitest';
import { calculateFeeSplit, PLATFORM_SERVICE_FEE_PERCENT } from './paypal.service.js';
describe('calculateFeeSplit', () => {
    beforeEach(() => {
    });
    it('should calculate correct fee split for a standard order', () => {
        const result = calculateFeeSplit(1000, 50, 10);
        expect(result.subtotal).toBe(1000);
        expect(result.deliveryFee).toBe(50);
        expect(result.serviceCharge).toBe(20);
        expect(result.vendorPlatformFee).toBe(100);
        expect(result.totalPlatformEarnings).toBe(120);
        expect(result.vendorNet).toBe(900);
        expect(result.grandTotal).toBe(1070);
    });
    it('should calculate correct fee split with zero delivery fee', () => {
        const result = calculateFeeSplit(500, 0, 5);
        expect(result.subtotal).toBe(500);
        expect(result.deliveryFee).toBe(0);
        expect(result.serviceCharge).toBe(10);
        expect(result.vendorPlatformFee).toBe(25);
        expect(result.totalPlatformEarnings).toBe(35);
        expect(result.vendorNet).toBe(475);
        expect(result.grandTotal).toBe(510);
    });
    it('should handle zero subtotal', () => {
        const result = calculateFeeSplit(0, 0, 0);
        expect(result.subtotal).toBe(0);
        expect(result.serviceCharge).toBe(0);
        expect(result.vendorPlatformFee).toBe(0);
        expect(result.totalPlatformEarnings).toBe(0);
        expect(result.vendorNet).toBe(0);
        expect(result.grandTotal).toBe(0);
    });
    it('should round currency to 2 decimal places', () => {
        const result = calculateFeeSplit(100.005, 0, 3.333);
        expect(result.serviceCharge).toBeCloseTo(2, 2);
        expect(result.vendorPlatformFee).toBeCloseTo(3.33, 2);
    });
    it('should export PLATFORM_SERVICE_FEE_PERCENT constant', () => {
        expect(PLATFORM_SERVICE_FEE_PERCENT).toBe(2);
    });
});
//# sourceMappingURL=paypal.service.test.js.map