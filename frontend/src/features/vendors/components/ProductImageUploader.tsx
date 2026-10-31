import React, { useRef, useState } from 'react';
import type { ChangeEvent, DragEvent } from 'react';

export interface ProductImageUploaderProps {
  value?: string;
  onChange: (imageDataUrl?: string) => void;
  maxSizeInBytes?: number;
}

const DEFAULT_MAX_SIZE = 5 * 1024 * 1024;

export const ProductImageUploader: React.FC<ProductImageUploaderProps> = ({
  value,
  onChange,
  maxSizeInBytes = DEFAULT_MAX_SIZE
}) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState('');

  const readImage = (file?: File) => {
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      setError('Please choose an image file.');
      return;
    }
    if (file.size > maxSizeInBytes) {
      setError(`Image must be smaller than ${Math.round(maxSizeInBytes / 1024 / 1024)} MB.`);
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        setError('');
        onChange(reader.result);
      }
    };
    reader.onerror = () => setError('The image could not be read. Please try again.');
    reader.readAsDataURL(file);
  };

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    readImage(event.target.files?.[0]);
    event.target.value = '';
  };

  const handleDrop = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsDragging(false);
    readImage(event.dataTransfer.files[0]);
  };

  return (
    <div>
      <div
        role="button"
        tabIndex={0}
        onClick={() => inputRef.current?.click()}
        onKeyDown={(event) => {
          if (event.key === 'Enter' || event.key === ' ') inputRef.current?.click();
        }}
        onDragOver={(event) => {
          event.preventDefault();
          setIsDragging(true);
        }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={handleDrop}
        style={{
          ...styles.dropzone,
          ...(isDragging ? styles.dropzoneActive : {}),
          ...(value ? styles.dropzoneWithImage : {})
        }}
      >
        {value ? (
          <img src={value} alt="Selected product preview" style={styles.preview} />
        ) : (
          <>
            <span style={styles.icon} aria-hidden="true">+</span>
            <strong style={styles.title}>Add product image</strong>
            <span style={styles.help}>Drop an image here or browse from your device</span>
            <span style={styles.meta}>PNG, JPG, WEBP up to 5 MB</span>
          </>
        )}
        <input
          ref={inputRef}
          type="file"
          accept="image/png,image/jpeg,image/webp"
          onChange={handleFileChange}
          style={styles.hiddenInput}
          aria-label="Upload product image"
        />
      </div>

      {value && (
        <button type="button" onClick={() => onChange(undefined)} style={styles.removeButton}>
          Remove product image
        </button>
      )}
      {error && <p role="alert" style={styles.error}>{error}</p>}
    </div>
  );
};

const styles: Record<string, React.CSSProperties> = {
  dropzone: {
    display: 'grid',
    justifyItems: 'center',
    gap: 6,
    minHeight: 190,
    padding: 20,
    border: '1px dashed #a9c7b4',
    borderRadius: 8,
    background: '#f7fcf8',
    color: '#53665a',
    cursor: 'pointer',
    textAlign: 'center'
  },
  dropzoneActive: { borderColor: '#16834b', background: '#eaf8ef' },
  dropzoneWithImage: { display: 'block', padding: 8 },
  icon: {
    display: 'grid',
    placeItems: 'center',
    width: 34,
    height: 34,
    borderRadius: '50%',
    background: '#dff3e6',
    color: '#16834b',
    fontSize: 24,
    lineHeight: 1
  },
  title: { color: '#20352a', fontSize: 14 },
  help: { fontSize: 13 },
  meta: { color: '#84948a', fontSize: 11 },
  preview: { display: 'block', width: '100%', height: 190, objectFit: 'cover', borderRadius: 6 },
  hiddenInput: { display: 'none' },
  removeButton: { marginTop: 8, padding: 0, border: 0, background: 'transparent', color: '#b42318', cursor: 'pointer', fontSize: 12 },
  error: { margin: '8px 0 0', color: '#b42318', fontSize: 12 }
};
