const { use } = require("react");
const { User } = require("../../models");
const bcrypt = require('bcrypt');

exports.register = async (req, res) => {
    try {
        const {
            username,
            email,
            password,
            display_name,
        } = req.body;
        
        //validation
        if(!username || !email || !password) {
            return res.status(400).json({ message: 'username, email and password are required' });
        }
        const existingEmail = await User.findOne({
            where: {email}
        });
        if (existingEmail) {
            return res.status(409).json({message: "Email is already in use"});
        }
        const existingUser = await User.findOne({
            where: {username}
        });
        if (existingUser) {
            return res.status(409).json({message: "Username is already taken"});
        }

        //create user
        const salt = await bcrypt.genSalt();
        const password_hash = await bcrypt.hash(password, salt);

        const user = await User.create({
            username,
            email,
            password_hash,
            display_name: display_name || username,
        });






        res.status(201).json({
            user: {
                id: user.id,
                username: user.username,
                email: user.email,
                display_name: user.display_name,
                password_hash: user.password_hash,
            },
        });
    }
    catch(err) {
        res.status(500).json({message: err.message});
    }
    
}