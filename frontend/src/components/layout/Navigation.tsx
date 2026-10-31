import React from 'react';

export type MarketplaceCategory =
| 'All Markets'
| 'Wet Market'
| 'Supermarkets'
| 'Fresh Produce'
| 'Halal Meat'
| 'Wholesale'
| 'Department Stores'
| 'Hardwares'
| 'Pharmacy Vendors';

interface NavigationProps {
activeCategory?: MarketplaceCategory;
onCategoryChange?: (category: MarketplaceCategory) => void;
isVendor?: boolean;
isAdmin?: boolean;
isCustomer?: boolean;
activeTab?: string;
setActiveTab?: (tab: string) => void;
}

export const Navigation: React.FC<NavigationProps> = ({
activeCategory = 'All Markets',
onCategoryChange,
isVendor = false,
isAdmin = false,
isCustomer = false,
activeTab,
setActiveTab,
}) => {
const categories: MarketplaceCategory[] = [
'All Markets',
'Wet Market',
'Supermarkets',
'Fresh Produce',
'Halal Meat',
'Wholesale',
'Department Stores',
'Hardwares',
'Pharmacy Vendors'
];

const isActive = (tab: string) => activeTab === tab;

return (
<nav style={{ background: '#fff', borderBottom: '1px solid #f1f1f1', padding: '8px 4%' }}>
<ul style={{ listStyle: 'none', display: 'flex', gap: '8px', margin: 0, padding: 0, overflowX: 'auto' }}>
{isCustomer && (
<li>
<button
type="button"
onClick={() => setActiveTab?.('customer_dashboard')}
aria-pressed={isActive('customer_dashboard')}
style={navButtonStyle(isActive('customer_dashboard'))}
>
Customer Dashboard
</button>
</li>
)}
{isVendor && (
<li>
<button
type="button"
onClick={() => setActiveTab?.('vendor_dashboard')}
aria-pressed={isActive('vendor_dashboard')}
style={navButtonStyle(isActive('vendor_dashboard'))}
>
Vendor Dashboard
</button>
</li>
)}
{isAdmin && (
<li>
<button
type="button"
onClick={() => setActiveTab?.('admin_dashboard')}
aria-pressed={isActive('admin_dashboard')}
style={navButtonStyle(isActive('admin_dashboard'))}
>
Admin Dashboard
</button>
</li>
)}
{(!isCustomer && !isVendor && !isAdmin) && categories.map((category) => (
<li key={category}>
<button
type="button"
onClick={() => onCategoryChange?.(category)}
aria-pressed={activeCategory === category}
style={categoryButtonStyle(activeCategory === category)}
>
{category}
</button>
</li>
))}
</ul>
</nav>
);
};

const navButtonStyle = (active: boolean) => ({
whiteSpace: 'nowrap',
padding: '7px 14px',
border: 0,
borderRadius: 6,
background: active ? 'var(--brand-surface)' : 'transparent',
color: active ? 'var(--brand-deep)' : '#555',
fontSize: '13px',
fontWeight: active ? 700 : 500,
cursor: 'pointer' as const,
});

const categoryButtonStyle = (active: boolean) => ({
whiteSpace: 'nowrap',
padding: '7px 10px',
border: 0,
borderRadius: 6,
background: active ? 'var(--brand-surface)' : 'transparent',
color: active ? 'var(--brand-deep)' : '#555',
fontSize: '14px',
fontWeight: active ? 700 : 500,
cursor: 'pointer' as const,
});
