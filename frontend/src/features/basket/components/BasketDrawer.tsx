import React from 'react';
import { CheckoutButton } from '../../../components/shared/CheckoutButton';
import { useBasket } from '../context/BasketContext';

export const BasketDrawer: React.FC = () => {
  const { cart, removeFromCart, clearCart, getCartTotal } = useBasket();

  return (
    <aside style={{ padding: 20, border: '1px solid #dfe7e2', borderRadius: 8, background: '#fff' }}>
      <h2 style={{ margin: '0 0 16px', color: '#20352a' }}>Your basket</h2>
      {cart.length === 0 ? <p style={{ color: '#6b7c72' }}>Your basket is currently empty.</p> : (
        <>
          <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
            {cart.map((item) => <li key={item.id} style={{ display: 'flex', justifyContent: 'space-between', gap: 10, padding: '8px 0', borderBottom: '1px solid #edf2ee' }}>
              <span>{item.name} x{item.quantity}</span>
              <button type="button" onClick={() => removeFromCart(item.id)} style={{ border: 0, background: 'transparent', color: '#b42318', cursor: 'pointer' }}>Remove</button>
            </li>)}
          </ul>
          <strong style={{ display: 'block', margin: '18px 0' }}>Subtotal: PHP {getCartTotal().toFixed(2)}</strong>
          <CheckoutButton cartItems={cart} userId="user_demo_123" onSuccess={() => clearCart()} />
        </>
      )}
    </aside>
  );
};
