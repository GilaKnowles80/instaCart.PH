import React, { useEffect, useRef } from 'react';

/**
 * Renders a PayPal Hosted Button (Part 2 of the PayPal integration).
 *
 * Part 1 (the PayPal SDK script) is loaded once per page in index.html <head>.
 * This component renders the container div and initializes the hosted button
 * via paypal.HostedButtons once the SDK is available.
 */
export const PayPalHostedButton: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const HOSTED_BUTTON_ID = '5RPZR4LLPPVXU';
  const CONTAINER_ID = `paypal-container-${HOSTED_BUTTON_ID}`;

  useEffect(() => {
    const container = containerRef.current;
    if (!container || typeof window === 'undefined') return;

    const initPayPalButton = () => {
      const paypal = (window as unknown as { paypal?: any }).paypal;
      if (!paypal?.HostedButtons) {
        console.warn('PayPal SDK / HostedButtons not yet available.');
        return;
      }

      paypal.HostedButtons({
        hostedButtonId: HOSTED_BUTTON_ID,
      }).render(`#${CONTAINER_ID}`);
    };

    // The SDK script in index.html is blocking, so paypal should be ready.
    // Guard with a small fallback in case the script loads slightly late.
    if ((window as unknown as { paypal?: any }).paypal?.HostedButtons) {
      initPayPalButton();
    } else {
      const timer = setTimeout(initPayPalButton, 250);
      return () => clearTimeout(timer);
    }
  }, []);

  return <div id={CONTAINER_ID} ref={containerRef} />;
};
