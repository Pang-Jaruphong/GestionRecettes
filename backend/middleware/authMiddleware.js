import jwt from "jsonwebtoken";

export const verifyToken = (req, res, next) => {

    console.log(req.headers);

    const token = req.headers.authorization;

    console.log(token);
    if (!token) {
        return res.status(403).json({
            message: "Token manquant"
        });
    }

    try {

        const verified = jwt.verify(
            token,
            process.env.JWT_SECRET
        );

        req.user = verified;

        next();

    } catch (err) {

        return res.status(401).json({
            message: "Token invalide"
        });
    }
};