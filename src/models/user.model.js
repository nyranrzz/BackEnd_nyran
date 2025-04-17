const db = require('../config/database');
const bcrypt = require('bcryptjs');

class User {
    static async findByEmail(email) {
        try {
            const [rows] = await db.execute(
                'SELECT * FROM users WHERE email = ?',
                [email]
            );
            return rows[0];
        } catch (error) {
            throw error;
        }
    }

    static async findById(id) {
        try {
            const [rows] = await db.execute(
                'SELECT id, email, name, role FROM users WHERE id = ?',
                [id]
            );
            return rows[0];
        } catch (error) {
            throw error;
        }
    }

    static async verifyPassword(plainPassword, hashedPassword) {
        return await bcrypt.compare(plainPassword, hashedPassword);
    }

    static async getAllMarkets() {
        try {
            const [rows] = await db.execute(
                'SELECT id, name FROM users WHERE role = ?',
                ['market']
            );
            return rows;
        } catch (error) {
            throw error;
        }
    }

    static async createUser(userData) {
        try {
            const hashedPassword = await bcrypt.hash(userData.password, 10);
            const [result] = await db.execute(
                'INSERT INTO users (email, password, name, role) VALUES (?, ?, ?, ?)',
                [userData.email, hashedPassword, userData.name, userData.role]
            );
            return result.insertId;
        } catch (error) {
            throw error;
        }
    }

    static async updatePassword(userId, newPassword) {
        try {
            const hashedPassword = await bcrypt.hash(newPassword, 10);
            await db.execute(
                'UPDATE users SET password = ? WHERE id = ?',
                [hashedPassword, userId]
            );
            return true;
        } catch (error) {
            throw error;
        }
    }
}

module.exports = User; 