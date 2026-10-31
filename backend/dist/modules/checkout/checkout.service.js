export class CheckoutService {
    static async processOrder(cartItems, userId) {
        return {
            success: true,
            transactionId: `TXN-${Math.random().toString(36).substr(2, 9).toUpperCase()}`,
            itemsCount: cartItems.length
        };
    }
}
//# sourceMappingURL=checkout.service.js.map