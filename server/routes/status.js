const express = require('express');
const router = express.Router();
const {addStatus, fetchStatus, viewStatus} = require('../controllers/status');
const upload = require('../utils/multerConfig');

router.post('/add', upload.array('files', 10), (req, res, next) => {
    console.log('Request Body:', req.body);
    console.log('Uploaded Files:', req.files);
    next();
}, addStatus);
router.get('/fetch',fetchStatus );
router.put('/viewStatus/:statusId',viewStatus );
router.put('/archive/:statusId', (req, res) => {
    res.json({ message: 'Archive status route placeholder' });
});

module.exports = router;
