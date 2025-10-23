import UserModel from "../models/UserModel.js";
import bcrypt from 'bcrypt';

const postUser = async(req, res) => {
    try {
        const userData = req.body;
        
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(userData.password, saltRounds);

        const result = await UserModel.postUser(userData, hashedPassword);
        return res.send(result);
    } catch (error) {
        res.status(500).json({ error: error.message || 'Server Error' });
    };
};

export default {
    postUser
};