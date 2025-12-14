const express = require('express');
const { getOrders, getOrder, createOrder, updateOrder, deleteOrder } = require('../controllers/orderController');
const { authenticate, authorize } = require('../middleware/auth');

const router = express.Router();

// All routes require authentication
router.use(authenticate);

// Get all orders
router.get('/', getOrders);

// Get single order
router.get('/:id', getOrder);

// Create order (staff and admin)
router.post('/', authorize('staff', 'admin'), createOrder);

// Update order (admin or order creator)
router.put('/:id', updateOrder);

// Delete order (admin or order creator)
router.delete('/:id', deleteOrder);

module.exports = router;
