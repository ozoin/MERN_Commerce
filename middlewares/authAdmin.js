import User from "../modules/userModel.js";

export const authAdmin = async (req,res,next) => {
    try {
        const user = await User.findOne({
            _id:req.user
        });
        if (user.role === 0) return res.status(400).json({msg:"User is not an admin"});
        next();
    } catch (err) {
        return res.status(500).json({msg:err.message})
    }
}
