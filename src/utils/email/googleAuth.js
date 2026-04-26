import { OAuth2Client } from "google-auth-library";
import dotenv from "dotenv";
import { catchAsync } from "../errorHandling.js";

dotenv.config();

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

export const verifyGoogleToken = async (token) => {
    try {
    const ticket = await client.verifyIdToken({
    idToken: token,
    audience: process.env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();
    return payload; // Contains user details like email, name, picture, etc.
    } catch (error) {
    throw new Error("Invalid Google token");
    }
};
export const googleAuth = catchAsync(async (req, res, next) => {
    const { token } = req.body;
    const tokens = await authService.googleLogin(token);
    res.json(tokens);
});
