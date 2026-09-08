const jwt = require("jsonwebtoken");

const authenticateStudent = (req, res, next) => {
    try {

        const authHeader = req.headers.authorization;

        if (!authHeader) {
            return res.status(401).json({
                message: "Authorization token is required"
            });
        }

        const token = authHeader.startsWith("Bearer ")
            ? authHeader.split(" ")[1]
            : authHeader;

        if (!token) {
            return res.status(401).json({
                message: "Token is missing"
            });
        }

        if (!process.env.JWT_SECRET) {
            return res.status(500).json({
                message: "JWT_SECRET is missing"
            });
        }

        const decoded = jwt.verify(
            token,
            process.env.JWT_SECRET
        );

        req.user = decoded;

        next();

    } catch (error) {

        console.error("AUTH ERROR:", error);

        return res.status(401).json({
            message: "Invalid or expired token"
        });
    }
};

module.exports = authenticateStudent;