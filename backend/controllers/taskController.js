const db = require('../config/db');
const Joi = require('joi');

// Validation schemas
const taskSchema = Joi.object({
  title: Joi.string().min(1).max(200).required(),
  description: Joi.string().max(1000).allow('', null),
  status: Joi.string().valid('pending', 'in-progress', 'completed').optional(),
});

// Get all tasks (with RBAC)
const getTasks = (req, res) => {
  try {
    const { page = 1, limit = 10, status, search } = req.query;
    const offset = (page - 1) * limit;
    const userId = req.user.id;
    const userRole = req.user.role;

    let query = '';
    let params = [];

    // Build query based on role
    if (userRole === 'admin') {
      // Admin can see all tasks
      query = 'SELECT t.*, u.username as createdByUsername FROM tasks t LEFT JOIN users u ON t.createdBy = u.id WHERE 1=1';
    } else {
      // Regular users can only see their own tasks
      query = 'SELECT t.*, u.username as createdByUsername FROM tasks t LEFT JOIN users u ON t.createdBy = u.id WHERE t.createdBy = ?';
      params.push(userId);
    }

    // Add status filter
    if (status) {
      query += ' AND t.status = ?';
      params.push(status);
    }

    // Add search filter
    if (search) {
      query += ' AND (t.title LIKE ? OR t.description LIKE ?)';
      const searchTerm = `%${search}%`;
      params.push(searchTerm, searchTerm);
    }

    // Add ordering and pagination
    query += ' ORDER BY t.createdAt DESC LIMIT ? OFFSET ?';
    params.push(parseInt(limit), parseInt(offset));

    // Get total count for pagination
    let countQuery = userRole === 'admin'
      ? 'SELECT COUNT(*) as total FROM tasks WHERE 1=1'
      : 'SELECT COUNT(*) as total FROM tasks WHERE createdBy = ?';
    let countParams = userRole === 'admin' ? [] : [userId];

    if (status) {
      countQuery += ' AND status = ?';
      countParams.push(status);
    }

    if (search) {
      countQuery += ' AND (title LIKE ? OR description LIKE ?)';
      const searchTerm = `%${search}%`;
      countParams.push(searchTerm, searchTerm);
    }

    db.get(countQuery, countParams, (err, countResult) => {
      if (err) {
        return res.status(500).json({ message: 'Database error', error: err.message });
      }

      const total = countResult.total;

      db.all(query, params, (err, tasks) => {
        if (err) {
          return res.status(500).json({ message: 'Database error', error: err.message });
        }

        res.json({
          tasks,
          pagination: {
            page: parseInt(page),
            limit: parseInt(limit),
            total,
            totalPages: Math.ceil(total / limit),
          },
        });
      });
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get single task
const getTask = (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;
    const userRole = req.user.role;

    let query = 'SELECT t.*, u.username as createdByUsername FROM tasks t LEFT JOIN users u ON t.createdBy = u.id WHERE t.id = ?';
    let params = [id];

    // If not admin, ensure user can only access their own tasks
    if (userRole !== 'admin') {
      query += ' AND t.createdBy = ?';
      params.push(userId);
    }

    db.get(query, params, (err, task) => {
      if (err) {
        return res.status(500).json({ message: 'Database error', error: err.message });
      }

      if (!task) {
        return res.status(404).json({ message: 'Task not found' });
      }

      res.json(task);
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Create new task
const createTask = (req, res) => {
  try {
    // Validate input
    const { error, value } = taskSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }

    const { title, description, status = 'pending' } = value;
    const createdBy = req.user.id;

    db.run(
      'INSERT INTO tasks (title, description, status, createdBy) VALUES (?, ?, ?, ?)',
      [title, description || '', status, createdBy],
      function (err) {
        if (err) {
          return res.status(500).json({ message: 'Error creating task', error: err.message });
        }

        // Fetch the created task
        db.get(
          'SELECT t.*, u.username as createdByUsername FROM tasks t LEFT JOIN users u ON t.createdBy = u.id WHERE t.id = ?',
          [this.lastID],
          (err, task) => {
            if (err) {
              return res.status(500).json({ message: 'Error fetching created task', error: err.message });
            }

            res.status(201).json({
              message: 'Task created successfully',
              task,
            });
          }
        );
      }
    );
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Update task
const updateTask = (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;
    const userRole = req.user.role;

    // Validate input
    const { error, value } = taskSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }

    // First, check if task exists and user has permission
    let checkQuery = 'SELECT * FROM tasks WHERE id = ?';
    let checkParams = [id];

    if (userRole !== 'admin') {
      checkQuery += ' AND createdBy = ?';
      checkParams.push(userId);
    }

    db.get(checkQuery, checkParams, (err, task) => {
      if (err) {
        return res.status(500).json({ message: 'Database error', error: err.message });
      }

      if (!task) {
        return res.status(404).json({ message: 'Task not found or access denied' });
      }

      // Update task
      const { title, description, status } = value;
      db.run(
        'UPDATE tasks SET title = ?, description = ?, status = ? WHERE id = ?',
        [title, description || '', status || task.status, id],
        function (err) {
          if (err) {
            return res.status(500).json({ message: 'Error updating task', error: err.message });
          }

          // Fetch updated task
          db.get(
            'SELECT t.*, u.username as createdByUsername FROM tasks t LEFT JOIN users u ON t.createdBy = u.id WHERE t.id = ?',
            [id],
            (err, updatedTask) => {
              if (err) {
                return res.status(500).json({ message: 'Error fetching updated task', error: err.message });
              }

              res.json({
                message: 'Task updated successfully',
                task: updatedTask,
              });
            }
          );
        }
      );
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Delete task
const deleteTask = (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;
    const userRole = req.user.role;

    // Check if task exists and user has permission
    let checkQuery = 'SELECT * FROM tasks WHERE id = ?';
    let checkParams = [id];

    if (userRole !== 'admin') {
      // Regular users can only delete their own tasks
      checkQuery += ' AND createdBy = ?';
      checkParams.push(userId);
    }

    db.get(checkQuery, checkParams, (err, task) => {
      if (err) {
        return res.status(500).json({ message: 'Database error', error: err.message });
      }

      if (!task) {
        return res.status(404).json({ message: 'Task not found or access denied' });
      }

      // Delete task
      db.run('DELETE FROM tasks WHERE id = ?', [id], function (err) {
        if (err) {
          return res.status(500).json({ message: 'Error deleting task', error: err.message });
        }

        res.json({ message: 'Task deleted successfully' });
      });
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

module.exports = {
  getTasks,
  getTask,
  createTask,
  updateTask,
  deleteTask,
};




