import jwt from "jsonwebtoken"

const jwtToken = (userId , res)=>{
    const token = jwt.sign({ userId }, process.env.JWT_SECRET, {
        expiresIn: '30d'
    });

    res.cookie('jwt', token, {
        maxAge: 30 * 24 * 60 * 60 * 1000,
        httpOnly: true,
        // Cross-site cookie required when frontend and backend are on different domains
        sameSite: "none",
        secure: true
    });

    return token; // 👈 return it so you can use it later
}

export default jwtToken;
