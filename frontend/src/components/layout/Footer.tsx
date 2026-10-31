import React from 'react';

export const Footer: React.FC = () => {
	return (
		<footer style={{ background: '#f9f9f9', padding: '32px 4%', borderTop: '1px solid #eee', marginTop: 'auto', textAlign: 'center', fontSize: '14px', color: '#7f8c8d' }}>
			<p>© {new Date().getFullYear()} instaCart.PH. All rights reserved. Locally sourcing fresh ingredients across the Philippines.</p>
		</footer>
	);
};
