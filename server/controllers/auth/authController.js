const { User, RefreshToken } = require("../../models");
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const { ref } = require("process");

const day5 = 5 * 24 * 60 * 60 * 1000;

function generateTokens(userId, username) {
    const accessToken = jwt.sign(
        {
            id: userId,
            username: username,
        },
        process.env.JWT_SECRET,
        {
            expiresIn: "15m",
        }
    );

    const refreshToken = crypto.randomBytes(64).toString("hex");
    return {accessToken, refreshToken};
}

function setRefreshCookie(res, token) {
    res.cookie('refreshToken', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        path: '/',
        maxAge: day5,
    })
}


function hashToken(token) {
  return crypto.createHash('sha256').update(token).digest('hex');
}

exports.register = async (req, res, next) => {
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
            return res.status(409).json({message: 'Email is already in use'});
        }
        const existingUser = await User.findOne({
            where: {username}
        });
        if (existingUser) {
            return res.status(409).json({message: 'Username is already taken'});
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

        //tokens
        const { accessToken, refreshToken } = generateTokens(user.id, user.username);

        await RefreshToken.create ({
            user_id: user.id,
            token_hash: hashToken(refreshToken),
            expires_at: new Date(Date.now() + day5),
        })

        setRefreshCookie(res, refreshToken);
            
        res.status(201).json({
            user: {
                id: user.id,
                username: user.username,
                email: user.email,
                display_name: user.display_name,
            },
            accessToken: accessToken,
        });

    }
    catch(err) {
        next(err);
    }
    
}

exports.login = async (req, res, next) => {
    try {
        const {email, password} = req.body;
        
        //validation
        if(!email || !password) {
            return res.status(400).json({message: 'Email and password required'});
        }

        const user = await User.findOne({where: {email}});
        if(!user) {
            return res.status(401).json({message: 'Invalid credentials'});
        }

        const valid = await bcrypt.compare(password, user.password_hash);
        if(!valid) {
            return res.status(401).json({message: 'Invalid credentials'});
        }

        //tokens
        const { accessToken, refreshToken } = generateTokens(user.id, user.username);

        await RefreshToken.create({
            user_id: user.id,
            token_hash: hashToken(refreshToken),
            expires_at: new Date(Date.now() + day5),
        });

        await user.update({last_login_at: new Date()});

        setRefreshCookie(res, refreshToken);

        res.status(200).json({
            user: {
                id: user.id,
                username: user.username,
                email: user.email,
                display_name: user.display_name,
            },
            accessToken: accessToken,
        });

    } catch (err) {
        next(err);
    }
}

exports.refresh = async (req, res, next) => {
    try {
        const cookieToken = req.cookies.refreshToken;

        if(!cookieToken) {
            return res.status(401).json({message: 'No refresh token'});
        }

        const tokenHash = hashToken(cookieToken);
        
        const storedToken = await RefreshToken.findOne({
            where: {
                token_hash: tokenHash,
                revoked: false,
            },
            include: [{
                model: User,
                attributes: ['id', 'username', 'email'],
            }],
        });

        if (!storedToken) {
            return res.status(401).json({message: 'Invalid refresh token'});
        }

        if (new Date() > new Date(storedToken.expires_at)) {
            await storedToken.destroy();

            return res.status(401).json({message: 'Refresh token expired, please log in again'});
        }

        const {accessToken, refreshToken: newRefreshToken } = generateTokens(
            storedToken.User.id,
            storedToken.User.username
        );
        await storedToken.destroy();
        
        await RefreshToken.create({
            user_id: storedToken.User.id,
            token_hash: hashToken(newRefreshToken),
            expires_at: new Date(Date.now() + day5),
        });

        setRefreshCookie(res, newRefreshToken);
        
        res.json({accessToken});
    }
    catch(err) {
        next(err);
    }
}

exports.logout = async (req, res, next) => {
    try {
        const cookieToken = req.cookies.refreshToken;
        
        if(cookieToken) {
            const tokenHash = hashToken(cookieToken);

            await RefreshToken.update(
                {revoked: true},
                {where: {token_hash: tokenHash}}
            );
        }

        res.clearCookie('refreshToken', {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            path: '/',
        });

        res.json({message: 'Logged out successfully'});
    }
    catch(err) {
        next(err);
    }
}

exports.me = async (req, res, next) => {
    try {
        const user = await User.findByPk(req.user.id, {
            attributes: ['id', 'username', 'email', 'display_name', 'last_login_at', 'createdAt'],
        });
        
        if(!user) {
            return res.status(404).json({message: 'User not found'});
        }

        res.json({user});
    
    } catch (err) {
        next(err);
    }
}