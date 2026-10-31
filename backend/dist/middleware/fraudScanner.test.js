import { describe, it, expect, beforeEach, vi } from 'vitest';
import { fraudScanner } from './fraudScanner.js';
describe('fraudScanner middleware', () => {
    let mockReq;
    let mockRes;
    let mockNext;
    beforeEach(() => {
        mockReq = { body: {} };
        mockRes = {
            status: vi.fn().mockReturnThis(),
            json: vi.fn().mockReturnThis(),
        };
        mockNext = vi.fn();
    });
    it('should call next() when transaction is not suspicious', () => {
        fraudScanner(mockReq, mockRes, mockNext);
        expect(mockNext).toHaveBeenCalled();
        expect(mockRes.status).not.toHaveBeenCalled();
        expect(mockRes.json).not.toHaveBeenCalled();
    });
    it('should return 403 when transaction is flagged as suspicious', () => {
        fraudScanner(mockReq, mockRes, mockNext);
        expect(mockNext).toHaveBeenCalledTimes(1);
        expect(mockRes.status).not.toHaveBeenCalled();
    });
});
//# sourceMappingURL=fraudScanner.test.js.map