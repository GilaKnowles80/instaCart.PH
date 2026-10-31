import React from 'react';
import type { IUser } from '../../features/auth/auth.context';

interface HeaderProps {
user: IUser | null;
onLogout: () => void;
}

export const Header: React.FC<HeaderProps> = ({ user, onLogout }) => {
return (
<header
style={{
display: 'flex',
justifyContent: 'space-between',
alignItems: 'center',
padding: '16px 4%',
borderBottom: '1px solid #eee',
background: '#fff',
}}
>
<div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
<img
src="/assets/logos/logo-main.png"
alt="instaCart.PH"
style={{ display: 'block', width: '170px', maxWidth: '42vw', height: 'auto' }}
/>
</div>
<div style={{ width: '40%', position: 'relative' }}>
<input
type="text"
placeholder="Search wet markets, supermarkets, or fresh vendors..."
style={{
width: '100%',
padding: '10px 16px',
borderRadius: '20px',
border: '1px solid #ccc',
outline: 'none',
}}
/>
</div>
<div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
{user ? (
<>
<div style={{ fontSize: 13, color: '#6b7c72' }}>
{user.role.charAt(0).toUpperCase() + user.role.slice(1)}
</div>
<button
type="button"
onClick={onLogout}
style={{
background: '#e74c3c',
color: '#fff',
border: 'none',
padding: '8px 14px',
borderRadius: 6,
fontSize: 13,
fontWeight: 700,
cursor: 'pointer',
}}
>
Sign Out
</button>
</>
) : (
<button
type="button"
style={{
background: 'transparent',
border: 'none',
fontSize: '16px',
cursor: 'pointer',
}}
>
🛒 Basket (0)
</button>
)}
</div>
</header>
);
};
