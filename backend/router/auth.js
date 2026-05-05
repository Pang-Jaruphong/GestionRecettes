import express from 'express';
import {dbAuth} from '../db/dbAuth.js';
import nodemailer from 'nodemailer';
import bcrypt from 'bcrypt';
import jsonwebtoken from 'jsonwebtoken';
import dotenv from "dotenv";
import path from "path";
import db from "../db/database.js";

dotenv.config({ path: path.resolve(process.cwd(), '../.env') });

const authRouter = express.Router();

// send mail for password
const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 587,
    secure: false,
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

authRouter.get('/', async (req, res) => {
    const users = await dbAuth.getAllUsers();
    res.json(users);
});

authRouter.post('/login', async (req, res) => {
    const { mail, password } = req.body;

    try {
        const user = await dbAuth.getUserByMail(mail);

        if (!user) {
            res.status(401).send({message : 'Identifiant incorrects'})
            return;
        }

        // logique first connexion
        // Aider par Gemini
        if (user.firstCon === 1) {

            try {
                // Generage a token security
                const resetToken = jsonwebtoken.sign(
                    {id: user.id, purpose: 'firstSetup'},
                    process.env.JWT_SECRET,
                    {expiresIn: '1h'}
                );

                // Prepare lien for frontend
                const resetLink = `http://localhost:5000/setupPassword?token=${resetToken}`;

                // Send mail for user
                await transporter.sendMail({
                    from: `"Gestion Recettes" <noreply@gestionrecettes.com>`,
                    to: user.mail,
                    subject: 'Activation de votre compte',
                    html: `
                        <h3>Bonjour ${user.name},</h3>
                        <p>Pour votre première connexion, merci de créer votre mot de passe en cliquant sur le lien ci-dessous :</p>
                        <a href="${resetLink}" style="padding: 10px 20px; background-color: #4CAF50; color: white; text-decoration: none; border-radius: 5px;">
                            Créer mon mot de passe
                        </a>
                        <p>Ce lien expirera dans 1 heure.</p>
                    `
                });

                return res.status(200).json({
                    message: "Première connexion détectée ! Vérifiez vos mails."
                });
            } catch (err) {
                 return res.status(500).json({message: "Erreur lors de l'envoi"});
            }
        }

        // normal connexion ( firstCon === 0)
        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            res.status(401).send({message : 'Identifiant incorrects'})
            return;
        }

        // Generage token without colomn in DB
        // Help by Gemini : how to do with jsonwebtoken
        const token = jsonwebtoken.sign(
            {id: user.id, mail: user.mail},
            process.env.JWT_SECRET,
            { expiresIn: '24h' }
        );

        res.status(200).json({
            message: 'La connexion avec succès ! Bienvenue !',
            token: token, // send token to frontend
            user: {mail : user.mail, name : user.name}
        });
    } catch (err) {
        res.status(500).json({
            message : 'Impossible de connexion aux serveur'})
    }
});

// Create new password
authRouter.post('/setupPassword', async (req, res) => {
    const { token, newPassword, confirmNewPassword } = req.body;

    try {
        // Verify token
        const decoded = jsonwebtoken.verify(token, process.env.JWT_SECRET);

        if (newPassword.length < 8) {
            return res.status(400).send({
                message : 'Echec! Le mot de passe est trop court! Veuillez introduire au minimum 8 caractères'
            });
        }

        if (newPassword !== confirmNewPassword) {
            return res.status(400).json({
                message: 'Echec! Veuillez entrer le nouveau mot de passe identique!'
            });
        }

        // Hash new password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(newPassword, salt);

        // Update to DB
        await dbAuth.updateUserPassword(decoded.id, hashedPassword);

        res.status(200).json({
            message: 'Le mot de passe est mis à jour !'
        })
    } catch (err) {
        res.status(400).json({message : 'Token invalide ou expiré.'})
    }
});

//Change password
authRouter.post('/changePassword', async (req, res) => {
    const { mail,oldPassword, newPassword, confirmNewPassword } = req.body;

    try {
        const user = await dbAuth.getUserByMail(mail);
        if (!user) {
            return res.status(404).json({message : 'Données invalide'});
        }

        const isMatch = await bcrypt.compare(oldPassword, user.password);
        if (!isMatch) {
            res.status(401).send({ message : 'Le mot de passe incorrect'});
        }

        if (newPassword.length < 8) {
            return res.status(400).send({
                message : 'Echec! Le mot de passe est trop court! Veuillez introduire au minimum 8 caractères'
            });
        }

        if (newPassword !== confirmNewPassword) {
            return res.status(400).json({
                message: 'Echec! Veuillez entrer le nouveau mot de passe identique!'
            });
        }
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(newPassword, salt);

        await dbAuth.updateUserPassword(user.id, hashedPassword);

        res.status(200).json({message : 'Succès! Le mot de passe a été modifié!'})
    } catch (err) {
         return res.status(500).json({message : 'Erreur serveur'});
    }
});

// Forget password
authRouter.post('/forgetPassword', async (req, res) => {
    const { mail } = req.body;

    try {
        const user = await dbAuth.getUserByMail(mail);

        if (!user) {
            return res.status(404).json({
                message: "Un message a été envoyé"
            })
        }

        // Generage a token security
        const resetToken = jsonwebtoken.sign(
            {id: user.id, purpose: 'passwordReset'},
            process.env.JWT_SECRET,
            {expiresIn: '20m'}
        );

        // Prepare lien for frontend
        const resetLink = `http://localhost:5000/setupPassword?token=${resetToken}`;

        // Send mail for user
        await transporter.sendMail({
            from: `"Gestion Recettes" <noreply@gestionrecettes.com>`,
            to: user.mail,
            subject: 'Réinitiation de votre mot de passe',
            html: `
                        <h3>Bonjour ${user.name},</h3>
                        <p>Vous avez demandé la réinitialisation de votre mot de passe.</p>
                        <p>Cliquez sur le bouton ci-dessous pour en choisire un nouveau :</p>
                        <a href="${resetLink}" style="padding: 10px 20px; background-color: #4CAF50; color: white; text-decoration: none; border-radius: 5px;">
                            Réinitialiser mon mot de passe
                        </a>
                        <p>Ce lien expirera dans 20 minutes. Si vous n'êtes pas à l'origine de cette demande, ignorez ce mail.</p>
                    `
        });

        return res.status(200).json({
            message: "Mail de réinitialisation envoyé !."
        });
    } catch (err) {
        return res.status(500).json({message: "Erreur lors de l'envoi"});
    }
})
export default authRouter;