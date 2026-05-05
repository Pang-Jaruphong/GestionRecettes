import {db as pool, db} from "./database.js";

const dbAuth = {
    getAllUsers: async () => {
        const sql = `SELECT * FROM users`;
        const results = await db.query(sql);
        return results;
    },
    getUserByMail : async (mail) => {
        const sql = "SELECT * FROM users WHERE mail = ?";
        const results = await db.query(sql, [mail]);
        return results[0]; // find only a user
    },
    // Update new passeword
    updateUserPassword: async (id, hashedPassword) => {
        const sql = `UPDATE users SET password = ?, firstCon = 0 WHERE id = ?`;
        await db.query(sql, [hashedPassword, id]);
    },
}

export {dbAuth};