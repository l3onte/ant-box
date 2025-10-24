import UserModel from "../models/UserModel.js";
import bcrypt from 'bcrypt';

const newAssociation = async(req, res) => {
    try {
        const { userData, storeData } = req.body;
        
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(userData.password, saltRounds);

        const result = await UserModel.newAssociation(userData, hashedPassword, storeData);
        return res.send(result);
    } catch (error) {
        res.status(500).json({ error: error.message || 'Server Error' });
    };
};

export default {
    newAssociation
};