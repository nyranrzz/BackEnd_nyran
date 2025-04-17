const bcrypt = require('bcryptjs');
const db = require('../config/database');

async function hashPasswords() {
    try {
        // Get all users
        const [users] = await db.execute('SELECT id, email, password FROM users');
        console.log(`Found ${users.length} users to process`);
        
        // Hash each user's password
        for (const user of users) {
            try {
                // Check if password is already hashed
                if (user.password.length < 30) { // Unhashed passwords are typically shorter
                    const hashedPassword = await bcrypt.hash(user.password, 10);
                    
                    // Update password in database
                    await db.execute(
                        'UPDATE users SET password = ? WHERE id = ?',
                        [hashedPassword, user.id]
                    );
                    
                    console.log(`Password hashed for user ${user.email} (ID: ${user.id})`);
                } else {
                    console.log(`Password already hashed for user ${user.email} (ID: ${user.id})`);
                }
            } catch (err) {
                console.error(`Error processing user ${user.email}:`, err);
            }
        }
        
        console.log('Password hashing completed successfully');
        process.exit(0);
    } catch (error) {
        console.error('Error:', error);
        process.exit(1);
    }
}

// Run the script
hashPasswords(); 