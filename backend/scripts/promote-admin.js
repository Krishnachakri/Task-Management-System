const db = require('../config/db');

const username = process.argv[2];

if (!username) {
  console.error('Usage: node scripts/promote-admin.js <username>');
  process.exit(1);
}

db.run(
  "UPDATE users SET role = 'admin' WHERE username = ?",
  [username],
  function (err) {
    if (err) {
      console.error('Failed to promote user:', err.message);
      process.exit(1);
    }

    if (this.changes === 0) {
      console.log('No user found with that username.');
      process.exit(0);
    }

    console.log(`User "${username}" is now an admin.`);
    process.exit(0);
  }
);



