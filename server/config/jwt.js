import jwt from "jsonwebtoken";

const generateToken = async (user) => {
    try {
        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
            expiresIn: "30d",
        });
        return token;
    } catch (error) {
        console.error(error);
        throw new Error("Error generating token");
    }
}

export default generateToken;