import React, { useState } from 'react';
import type { FormEvent } from 'react';
import type { VendorEnrollment, PayoutChannel, VendorCategory } from '../sharedVendorEnrollment';
import { ProductImageUploader } from './ProductImageUploader';

export interface EnrollmentFormProps {
  onSubmit?: (enrollment: SubmittedEnrollment) => void | Promise<void>;
  initialValues?: Partial<SubmittedEnrollment>;
  initialProductImageUrl?: string;
  submitting?: boolean;
}

type SubmittedEnrollment = {
  businessName: string;
  category: VendorCategory;
  payoutMethod: PayoutChannel;
  payoutAccountDetails: string;
  basePlatformFeePercentage: number;
  notes: string;
  productImageUrl?: string;
};

interface PayoutChannelOption {
  id: PayoutChannel;
  name: string;
  color: string;
  subtitle: string;
}

const PLATFORM_FEES: Record<VendorCategory, number> = {
  WET_MARKET: 3.5,
  RESTAURANT: 10,
  PHARMACY: 5,
  HARDWARE: 6,
  DRY_GOODS: 4.5,
  DEPARTMENT_STORE: 8
};

const CATEGORY_LABELS: Record<VendorCategory, string> = {
  WET_MARKET: 'Wet market',
  RESTAURANT: 'Restaurant',
  PHARMACY: 'Pharmacy',
  HARDWARE: 'Hardware',
  DRY_GOODS: 'Dry goods',
  DEPARTMENT_STORE: 'Department store'
};

const PAYOUT_LABELS: Record<PayoutChannel, string> = {
  PAYPAL: 'PayPal',
  BPI_BANK: 'BPI bank account',
  GCASH: 'GCash',
  MAYA: 'Maya',
  PAYMONGO: 'PayMongo'
};

const DEFAULT_CATEGORY: VendorCategory = 'WET_MARKET';
const DEFAULT_PAYOUT: PayoutChannel = 'GCASH';

const PAYOUT_CHANNELS: PayoutChannelOption[] = [
  { id: 'GCASH', name: 'GCash', color: '#0052cc', subtitle: 'e-Wallet (09xx...)' },
  { id: 'MAYA', name: 'Maya', color: '#16834b', subtitle: 'e-Wallet (09xx...)' },
  { id: 'BPI_BANK', name: 'BPI Bank', color: '#7a3e9d', subtitle: 'Account number' },
  { id: 'PAYMONGO', name: 'PayMongo', color: '#d96d0b', subtitle: 'Merchant gateway ID' },
  { id: 'PAYPAL', name: 'PayPal', color: '#1469a8', subtitle: 'Email address' }
];

export const EnrollmentForm: React.FC<EnrollmentFormProps> = ({
  onSubmit,
  initialValues,
  initialProductImageUrl,
  submitting = false
}) => {
  const [businessName, setBusinessName] = useState(initialValues?.businessName || '');
  const [category, setCategory] = useState<VendorCategory>(initialValues?.category || DEFAULT_CATEGORY);
  const [payoutMethod, setPayoutMethod] = useState<PayoutChannel>(
    initialValues?.payoutMethod || DEFAULT_PAYOUT
  );
  const [payoutAccountDetails, setPayoutAccountDetails] = useState(
    initialValues?.payoutAccountDetails || ''
  );
  const [error, setError] = useState('');
  const [productImageUrl, setProductImageUrl] = useState(initialProductImageUrl);
  const [submittedData, setSubmittedData] = useState<SubmittedEnrollment | null>(null);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const normalizedBusinessName = businessName.trim();
    const normalizedAccount = payoutAccountDetails.trim();

    if (!normalizedBusinessName || !normalizedAccount) {
      setError('Business name and payout account details are required.');
      return;
    }

    const payload: SubmittedEnrollment = {
      businessName: normalizedBusinessName,
      category,
      payoutMethod,
      payoutAccountDetails: normalizedAccount,
      basePlatformFeePercentage: PLATFORM_FEES[category],
      notes: `Platform splits ${PLATFORM_FEES[category]}% off checkout gross totals directly to instaCart.PH escrow collections.`,
      productImageUrl
    };

    setError('');
    setSubmittedData(payload);
    await onSubmit?.(payload);
  };

  return (
    <form onSubmit={handleSubmit} style={styles.form} noValidate>
      <div style={styles.header}>
        <div>
          <p style={styles.eyebrow}>Vendor onboarding</p>
          <h2 style={styles.title}>Set up your marketplace account</h2>
          <p style={styles.subtitle}>Connect your business and payout destination.</p>
        </div>
        <span style={styles.badge}>Secure setup</span>
      </div>

      <label style={styles.field}>
        <span style={styles.label}>Business name</span>
        <input
          value={businessName}
          onChange={(event) => setBusinessName(event.target.value)}
          placeholder="e.g. Quinta Wet Market"
          autoComplete="organization"
          style={styles.input}
        />
      </label>

      <label style={styles.field}>
        <span style={styles.label}>Business category</span>
        <select
          value={category}
          onChange={(event) => setCategory(event.target.value as VendorCategory)}
          style={styles.input}
        >
          {(Object.keys(CATEGORY_LABELS) as VendorCategory[]).map((option) => (
            <option key={option} value={option}>
              {CATEGORY_LABELS[option]}
            </option>
          ))}
        </select>
      </label>

      <div style={styles.sectionHeading}>Payout destination</div>
      <div style={styles.payoutGrid}>
        {PAYOUT_CHANNELS.map((channel) => {
          const isSelected = payoutMethod === channel.id;
          return (
            <label
              key={channel.id}
              style={{
                ...styles.payoutOption,
                ...(isSelected ? styles.payoutOptionActive : {}),
                ...(isSelected ? { borderColor: channel.color } : {})
              }}
            >
              <input
                type="radio"
                name="payoutMethod"
                value={channel.id}
                checked={isSelected}
                onChange={() => setPayoutMethod(channel.id)}
                style={styles.radio}
              />
              <span>
                <strong style={{ display: 'block', color: isSelected ? channel.color : 'inherit' }}>
                  {channel.name}
                </strong>
                <small style={styles.channelSubtitle}>{channel.subtitle}</small>
              </span>
            </label>
          );
        })}
      </div>

      <label style={styles.field}>
        <span style={styles.label}>Payout account details</span>
        <input
          value={payoutAccountDetails}
          onChange={(event) => setPayoutAccountDetails(event.target.value)}
          placeholder={`Provide ${PAYOUT_LABELS[payoutMethod]} account details`}
          autoComplete="off"
          style={styles.input}
        />
      </label>

      <div style={styles.field}>
        <span style={styles.label}>Product image</span>
        <ProductImageUploader value={productImageUrl} onChange={setProductImageUrl} />
      </div>

      <div style={styles.feeSummary}>
        <div>
          <span style={styles.summaryLabel}>Platform service fee</span>
          <strong style={styles.feeValue}>{PLATFORM_FEES[category].toFixed(1)}%</strong>
        </div>
        <span style={styles.summaryNote}>Applied automatically for this category</span>
      </div>

      {error && <p role="alert" style={styles.error}>{error}</p>}

      <button type="submit" disabled={submitting} style={styles.button}>
        {submitting ? 'Submitting enrollment...' : 'Submit vendor enrollment'}
      </button>

      {submittedData && (
        <div role="status" style={styles.success}>
          <strong>Enrollment profile ready</strong>
          <span>
            {submittedData.businessName} is configured for {PAYOUT_LABELS[submittedData.payoutMethod as PayoutChannel]} at a{' '}
            {submittedData.basePlatformFeePercentage}% platform fee.
          </span>
          <button type="button" onClick={() => setSubmittedData(null)} style={styles.resetButton}>
            Modify enrollment
          </button>
        </div>
      )}
    </form>
  );
};

const styles: Record<string, React.CSSProperties> = {
  form: {
    maxWidth: 640,
    margin: '0 auto',
    padding: 32,
    border: '1px solid #dfe7e2',
    borderRadius: 8,
    background: '#ffffff',
    boxShadow: '0 12px 30px rgba(30, 75, 53, 0.08)',
    color: '#20352a'
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    gap: 20,
    alignItems: 'flex-start',
    marginBottom: 28
  },
  eyebrow: {
    margin: '0 0 8px',
    color: '#16834b',
    fontSize: 12,
    fontWeight: 700,
    letterSpacing: '0.08em',
    textTransform: 'uppercase'
  },
  title: { margin: 0, fontSize: 26, lineHeight: 1.2 },
  subtitle: { margin: '8px 0 0', color: '#6b7c72', fontSize: 14 },
  badge: {
    flexShrink: 0,
    padding: '7px 10px',
    borderRadius: 999,
    background: '#e6f6ed',
    color: '#16834b',
    fontSize: 12,
    fontWeight: 700
  },
  field: { display: 'grid', gap: 8, marginBottom: 20 },
  label: { color: '#34493c', fontSize: 13, fontWeight: 700 },
  input: {
    boxSizing: 'border-box',
    width: '100%',
    minHeight: 46,
    padding: '11px 13px',
    border: '1px solid #cbd8d0',
    borderRadius: 6,
    background: '#fbfdfb',
    color: '#20352a',
    fontSize: 14
  },
  sectionHeading: {
    margin: '6px 0 12px',
    color: '#34493c',
    fontSize: 13,
    fontWeight: 700
  },
  payoutGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(145px, 1fr))',
    gap: 10,
    marginBottom: 20
  },
  payoutOption: {
    display: 'flex',
    alignItems: 'center',
    gap: 8,
    minHeight: 42,
    padding: '0 10px',
    border: '1px solid #cbd8d0',
    borderRadius: 6,
    color: '#53665a',
    cursor: 'pointer',
    fontSize: 13
  },
  payoutOptionActive: { borderColor: '#16834b', background: '#effaf3', color: '#12673b' },
  radio: { accentColor: '#16834b' },
  channelSubtitle: { display: 'block', marginTop: 3, color: '#7a8b81', fontSize: 10, fontWeight: 400 },
  feeSummary: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 16,
    padding: 16,
    margin: '4px 0 20px',
    borderLeft: '3px solid #2ecc71',
    background: '#f2faf5'
  },
  summaryLabel: { display: 'block', color: '#617268', fontSize: 12, marginBottom: 4 },
  feeValue: { color: '#16834b', fontSize: 22 },
  summaryNote: { color: '#6b7c72', fontSize: 12, textAlign: 'right' },
  error: { margin: '0 0 16px', color: '#b42318', fontSize: 13 },
  success: {
    display: 'grid',
    gap: 6,
    marginTop: 18,
    padding: 14,
    border: '1px solid #bfe5cc',
    borderRadius: 6,
    background: '#f1fbf4',
    color: '#24613d',
    fontSize: 13
  },
  resetButton: {
    justifySelf: 'start',
    marginTop: 4,
    padding: 0,
    border: 0,
    background: 'transparent',
    color: '#16834b',
    cursor: 'pointer',
    fontSize: 12,
    fontWeight: 700
  },
  button: {
    width: '100%',
    minHeight: 48,
    border: 0,
    borderRadius: 6,
    background: '#16834b',
    color: '#ffffff',
    cursor: 'pointer',
    fontSize: 14,
    fontWeight: 700
  }
};
