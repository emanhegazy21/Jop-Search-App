import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

export const generateTokens = (user) => {
    const payload = { id: user._id, email: user.email };
    const accessToken = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "1h" });
    const refreshToken = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "7d" });

    return { accessToken, refreshToken };
};
