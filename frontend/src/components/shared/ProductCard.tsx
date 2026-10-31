import React from 'react';

interface ProductCardProps {
	id: string;
	name: string;
	price: number;
	imageUrl?: string;
	vendorName: string;
	onAddToBasket: (productId: string) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({
	name,
	price,
	imageUrl,
	vendorName,
	onAddToBasket,
	id,
}) => {
	return (
		<div style={{ border: '1px solid #e0e0e0', borderRadius: '8px', padding: '16px', maxWidth: '280px' }}>
			<div style={{ background: '#f5f5f5', height: '150px', borderRadius: '4px', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
				{imageUrl ? (
					<img src={imageUrl} alt={name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
				) : (
					<span style={{ fontSize: '12px', color: '#888' }}>Product Image Window</span>
				)}
			</div>
			<p style={{ margin: '8px 0 2px', fontSize: '12px', color: 'var(--brand-primary)', fontWeight: 'bold' }}>{vendorName}</p>
			<h3 style={{ margin: '0 0 8px', fontSize: '16px' }}>{name}</h3>
			<div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
				<span style={{ fontWeight: 'bold' }}>₱{price.toFixed(2)}</span>
				<button
					onClick={() => onAddToBasket(id)}
					style={{ background: 'var(--brand-primary)', color: 'white', border: 'none', borderRadius: '4px', padding: '6px 12px', cursor: 'pointer' }}
				>
					Add to Cart
				</button>
			</div>
		</div>
	);
};
