const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { User } = require('../models');

const router = express.Router();

// Register new user
router.post('/register', async (req, res) => {
    try {
        const { name, email, password, avatar } = req.body;

        // Check if user exists
        if (email) {
            const existingUser = await User.findOne({ where: { email } });
            if (existingUser) {
                return res.status(400).json({ error: 'Email already registered' });
            }
        }

        // Hash password if provided
        let hashedPassword = null;
        if (password) {
            hashedPassword = await bcrypt.hash(password, 10);
        }

        // Create user
        const user = await User.create({
            name,
            email,
            password: hashedPassword,
            avatar: avatar || 'happy',
            money: 100.00,
            gems: 50,
            level: 1,
            xp: 0,
            trustScore: 50,
            streak: 0,
            energy: 100,
            bankBalance: 0,
            mood: 100
        });

        // Generate token
        const token = jwt.sign(
            { userId: user.id },
            process.env.JWT_SECRET || 'fincity_secret',
            { expiresIn: '30d' }
        );

        res.status(201).json({
            message: 'User created successfully',
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                avatar: user.avatar,
                level: user.level,
                xp: user.xp,
                money: parseFloat(user.money),
                gems: user.gems,
                trustScore: user.trustScore,
                streak: user.streak,
                energy: user.energy,
                bankBalance: parseFloat(user.bankBalance)
            },
            token
        });
    } catch (error) {
        console.error('Register error:', error);
        res.status(500).json({ error: 'Failed to create user' });
    }
});

// Login
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ where: { email } });
        if (!user) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        if (user.password) {
            const validPassword = await bcrypt.compare(password, user.password);
            if (!validPassword) {
                return res.status(401).json({ error: 'Invalid credentials' });
            }
        }

        const token = jwt.sign(
            { userId: user.id },
            process.env.JWT_SECRET || 'fincity_secret',
            { expiresIn: '30d' }
        );

        // Update last active
        await user.update({ lastActiveAt: new Date() });

        res.json({
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                avatar: user.avatar,
                level: user.level,
                xp: user.xp,
                money: parseFloat(user.money),
                gems: user.gems,
                trustScore: user.trustScore,
                streak: user.streak,
                energy: user.energy,
                bankBalance: parseFloat(user.bankBalance)
            },
            token
        });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ error: 'Login failed' });
    }
});

// Guest login (for demo/testing)
router.post('/guest', async (req, res) => {
    try {
        const { name, avatar } = req.body;

        const user = await User.create({
            name: name || `Player_${Date.now().toString(36)}`,
            avatar: avatar || 'happy',
            money: 100.00,
            gems: 50,
            level: 1,
            xp: 0,
            trustScore: 50,
            streak: 0,
            energy: 100,
            bankBalance: 0,
            mood: 100
        });

        const token = jwt.sign(
            { userId: user.id },
            process.env.JWT_SECRET || 'fincity_secret',
            { expiresIn: '30d' }
        );

        res.status(201).json({
            user: {
                id: user.id,
                name: user.name,
                avatar: user.avatar,
                level: user.level,
                xp: user.xp,
                money: parseFloat(user.money),
                gems: user.gems,
                trustScore: user.trustScore,
                streak: user.streak,
                energy: user.energy,
                bankBalance: parseFloat(user.bankBalance),
                mood: user.mood
            },
            token
        });
    } catch (error) {
        console.error('Guest login error:', error);
        res.status(500).json({ error: 'Failed to create guest user' });
    }
});

module.exports = router;
