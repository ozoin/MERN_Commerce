import jwt from "jsonwebtoken";

export const auth = (req,res,next) => {
    var JWT_TOKEN = "password123";
    try {

    const token = req.header("x-auth-token");
    if (!token) return res.status(401).json({errors: "No authentication token, authorisation denied."});

    const verified = jwt.verify(token,JWT_TOKEN);
    if (!verified) return res.status(401).json({errors: "Token verification failed."});

    req.user = verified.id;
    next();
    } catch(err) {
        res.status(500).json({errors:err.message})
    }
}
