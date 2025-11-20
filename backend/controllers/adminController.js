const db = require('../config/db');
const Joi = require('joi');

const roleSchema = Joi.object({
  role: Joi.string().valid('user', 'admin').required(),
});

const getUsers = (req, res) => {
  db.all('SELECT id, username, role, createdAt FROM users ORDER BY id ASC', [], (err, users) => {
    if (err) {
      return res.status(500).json({ message: 'Database error', error: err.message });
    }

    res.json({ users });
  });
};

const updateUserRole = (req, res) => {
  const { id } = req.params;
  const { error, value } = roleSchema.validate(req.body);

  if (error) {
    return res.status(400).json({ message: error.details[0].message });
  }

  if (Number(id) === req.user.id) {
    return res.status(400).json({ message: 'You cannot change your own role.' });
  }

  db.run('UPDATE users SET role = ? WHERE id = ?', [value.role, id], function (err) {
    if (err) {
      return res.status(500).json({ message: 'Database error', error: err.message });
    }

    if (this.changes === 0) {
      return res.status(404).json({ message: 'User not found' });
    }

    db.get('SELECT id, username, role FROM users WHERE id = ?', [id], (err, user) => {
      if (err) {
        return res.status(500).json({ message: 'Database error', error: err.message });
      }

      res.json({ message: 'Role updated successfully', user });
    });
  });
};

module.exports = { getUsers, updateUserRole };



