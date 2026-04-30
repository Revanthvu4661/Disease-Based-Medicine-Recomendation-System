const express = require('express');
const router = express.Router();
const { protect, doctorOnly, patientOnly } = require('../middleware/auth');
const {
  createRecord, getMyRecords, getAllRecords,
  getRecord, getOwnRecord, reviewRecord, deleteRecord, getStats,
  getDeletedRecords, restoreRecord, permanentDelete,
  getPrescription, deleteOwnRecord, markAsCured
} = require('../controllers/recordController');

router.use(protect);

router.post('/', createRecord);

// Specific routes (must come before :id parameter routes)
router.get('/mine', getMyRecords);
router.get('/stats', doctorOnly, getStats);
router.get('/deleted', doctorOnly, getDeletedRecords);

// Parameterized routes with specific suffixes (must come before generic :id)
router.get('/:id/prescription', doctorOnly, getPrescription);

// Generic routes that check role
const roleBasedGetRecord = (req, res) => {
  if (req.user.role === 'patient') {
    return getOwnRecord(req, res);
  } else {
    return getRecord(req, res);
  }
};

router.get('/:id', roleBasedGetRecord);
router.patch('/:id/review', doctorOnly, reviewRecord);
router.patch('/:id/cured', patientOnly, markAsCured);
router.patch('/:id/delete', doctorOnly, deleteRecord);
router.patch('/:id/restore', doctorOnly, restoreRecord);
router.delete('/:id', patientOnly, deleteOwnRecord);
router.delete('/:id/permanent', doctorOnly, permanentDelete);

// Catch-all doctor route
router.get('/', doctorOnly, getAllRecords);

module.exports = router;
