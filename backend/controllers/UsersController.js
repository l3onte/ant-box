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

const login = async (req, res) => {
    try {
        const { username, password } = req.body;

        const user = await UserModel.findUsername(username);
        if (!user) return res.status(400).json({ message: 'Usuario no encontrado' });

        const match = await bcrypt.compare(password, user.password);
        if (!match) return res.status(400).json({ message: 'Contraseña incorrecta' });

        const safeUser = {
            id: user.id,
            nombre: user.nombre,
            apellido: user.apellido,
            correo: user.correo,
            username: user.username,
            rol: user.rol
        }

        return res.json({ user: safeUser });
    } catch (error) {
        res.status(500).json({ error: error.message || 'Server Error' });
    }
};

export default {
    newAssociation,
    login
};