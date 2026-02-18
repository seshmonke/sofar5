import { Router } from 'express';
import { qrCodeController } from '../controllers/qrCodeController';

const router = Router();

// GET /api/qrcodes - получить все QR-коды
router.get('/', (req, res, next) => qrCodeController.getAllQRCodes(req, res, next));

// GET /api/qrcodes/:productId - получить QR-код по ID товара
router.get('/:productId', (req, res, next) => qrCodeController.getQRCode(req, res, next));

// POST /api/qrcodes/generate - генерировать QR-код
router.post('/generate', (req, res, next) => qrCodeController.generateQRCode(req, res, next));

export default router;
