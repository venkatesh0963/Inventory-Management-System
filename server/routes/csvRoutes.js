const express = require('express');
const router = express.Router();
const multer = require('multer');
const { exportProducts, importProducts } = require('../controllers/csvController');
const { protect, admin } = require('../middleware/authMiddleware');

const upload = multer({ dest: 'uploads/' });

router.get('/export', protect, admin, exportProducts);
router.post('/import', protect, admin, upload.single('file'), importProducts);

module.exports = router;
