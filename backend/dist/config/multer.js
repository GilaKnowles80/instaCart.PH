import multer from 'multer';
import path from 'node:path';
import fs from 'node:fs';
import { fileURLToPath } from 'node:url';
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const UPLOAD_DIR = path.resolve(__dirname, '../../uploads');
const KYC_DIR = path.join(UPLOAD_DIR, 'kyc');
fs.mkdirSync(UPLOAD_DIR, { recursive: true });
fs.mkdirSync(KYC_DIR, { recursive: true });
const storage = multer.diskStorage({
    destination: (_req, _file, cb) => {
        cb(null, KYC_DIR);
    },
    filename: (_req, file, cb) => {
        const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
        const ext = path.extname(file.originalname);
        cb(null, `${file.fieldname}-${uniqueSuffix}${ext}`);
    },
});
const fileFilter = (_req, file, cb) => {
    const allowedTypes = /pdf|jpg|jpeg|png|webp/;
    const ext = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mime = allowedTypes.test(file.mimetype);
    if (ext && mime) {
        cb(null, true);
    }
    else {
        cb(new Error('Only PDF, JPG, JPEG, PNG, and WEBP files are allowed.'));
    }
};
export const upload = multer({
    storage,
    fileFilter,
    limits: { fileSize: 10 * 1024 * 1024 },
});
export const kycFields = [
    'businessPermit',
    'dtiPermit',
    'secPermit',
    'birCertificate',
    'nbiClearance',
    'governmentId',
];
export { UPLOAD_DIR, KYC_DIR };
//# sourceMappingURL=multer.js.map