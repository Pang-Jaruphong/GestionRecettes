import {db as pool, db} from "./database.js";

const dbAuth = {
    getAllUsers: async () => {
        const sql = `SELECT * FROM users`;
        const results = await db.query(sql);
        return results;
    },
    getUserByMail : async (mail) => {
        try {
            const sql = "SELECT * FROM users WHERE mail = ?";
            const results = await db.query(sql, [mail]);

            if (results && results.length > 0) {
                return results[0];
            }
            return null;
            // return (results && results.length > 0) ? results[0] : null ; // find only a user
        } catch (err) {
            console.error("Erreur SQL dans getUserByMail:", err);
            throw err;
        }
    },
    // Update new passeword
    updateUserPassword: async (id, hashedPassword) => {
        const sql = `UPDATE users SET password = ?, firstCon = 0 WHERE id = ?`;
        await db.query(sql, [hashedPassword, id]);
    },
}

export {dbAuth};