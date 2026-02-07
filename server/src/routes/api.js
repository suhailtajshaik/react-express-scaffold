import { Router } from 'express';
import { body, param, validationResult } from 'express-validator';
import { query } from '../config/database.js';
import { loadEmailTemplate } from '../utils/emailTemplate.js';

const router = Router();

// Validation helper
function validate(req, res, next) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
}

// Health check
router.get('/health', async (req, res) => {
  try {
    const dbResult = await query('SELECT NOW()');
    res.json({
      status: 'healthy',
      timestamp: new Date().toISOString(),
      database: {
        connected: true,
        time: dbResult.rows[0].now,
      },
      uptime: process.uptime(),
    });
  } catch (err) {
    res.status(503).json({
      status: 'unhealthy',
      timestamp: new Date().toISOString(),
      database: { connected: false, error: err.message },
    });
  }
});

// List all items
router.get('/items', async (req, res, next) => {
  try {
    const result = await query('SELECT * FROM items ORDER BY created_at DESC');
    res.json({ data: result.rows });
  } catch (err) {
    next(err);
  }
});

// Get single item
router.get(
  '/items/:id',
  param('id').isInt({ min: 1 }),
  validate,
  async (req, res, next) => {
    try {
      const result = await query('SELECT * FROM items WHERE id = $1', [req.params.id]);
      if (result.rows.length === 0) {
        return res.status(404).json({ error: 'Item not found' });
      }
      res.json({ data: result.rows[0] });
    } catch (err) {
      next(err);
    }
  }
);

// Create item
router.post(
  '/items',
  body('name').trim().notEmpty().withMessage('Name is required'),
  body('description').optional().trim(),
  validate,
  async (req, res, next) => {
    try {
      const { name, description } = req.body;
      const result = await query(
        'INSERT INTO items (name, description) VALUES ($1, $2) RETURNING *',
        [name, description || null]
      );
      res.status(201).json({ data: result.rows[0] });
    } catch (err) {
      next(err);
    }
  }
);

// Update item
router.put(
  '/items/:id',
  param('id').isInt({ min: 1 }),
  body('name').optional().trim().notEmpty(),
  body('description').optional().trim(),
  validate,
  async (req, res, next) => {
    try {
      const { name, description } = req.body;
      const result = await query(
        `UPDATE items SET
          name = COALESCE($1, name),
          description = COALESCE($2, description),
          updated_at = NOW()
        WHERE id = $3 RETURNING *`,
        [name || null, description || null, req.params.id]
      );
      if (result.rows.length === 0) {
        return res.status(404).json({ error: 'Item not found' });
      }
      res.json({ data: result.rows[0] });
    } catch (err) {
      next(err);
    }
  }
);

// Delete item
router.delete(
  '/items/:id',
  param('id').isInt({ min: 1 }),
  validate,
  async (req, res, next) => {
    try {
      const result = await query('DELETE FROM items WHERE id = $1 RETURNING *', [req.params.id]);
      if (result.rows.length === 0) {
        return res.status(404).json({ error: 'Item not found' });
      }
      res.json({ message: 'Item deleted', data: result.rows[0] });
    } catch (err) {
      next(err);
    }
  }
);

// Example: Load email template
router.get('/templates/welcome', async (req, res, next) => {
  try {
    const html = await loadEmailTemplate('welcome', {
      username: 'Demo User',
      actionUrl: 'https://example.com/get-started',
      year: new Date().getFullYear().toString(),
    });
    res.type('html').send(html);
  } catch (err) {
    next(err);
  }
});

export default router;
