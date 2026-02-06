const express = require('express');
const { User, Transaction, StockHolding, QuizAttempt, SavingsGoal } = require('../models');
const authMiddleware = require('../middleware/auth');

const router = express.Router();

// Get user profile
router.get('/profile', authMiddleware, async (req, res) => {
    try {
        const user = await User.findByPk(req.userId, {
            include: [
                { model: SavingsGoal, as: 'savingsGoals' }
            ]
        });

        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        res.json({
            id: user.id,
            name: user.name,
            email: user.email,
            avatar: user.avatar,
            level: user.level,
            xp: user.xp,
            requiredXp: user.requiredXp,
            money: parseFloat(user.money),
            gems: user.gems,
            trustScore: user.trustScore,
            streak: user.streak,
            energy: user.energy,
            bankBalance: parseFloat(user.bankBalance),
            savingsGoals: user.savingsGoals,
            createdAt: user.createdAt
        });
    } catch (error) {
        console.error('Get profile error:', error);
        res.status(500).json({ error: 'Failed to get profile' });
    }
});

// Update user profile
router.put('/profile', authMiddleware, async (req, res) => {
    try {
        const { name, avatar } = req.body;
        const user = await User.findByPk(req.userId);

        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        await user.update({
            name: name || user.name,
            avatar: avatar || user.avatar
        });

        res.json({
            message: 'Profile updated',
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
                bankBalance: parseFloat(user.bankBalance)
            }
        });
    } catch (error) {
        console.error('Update profile error:', error);
        res.status(500).json({ error: 'Failed to update profile' });
    }
});

// Get transaction history
router.get('/transactions', authMiddleware, async (req, res) => {
    try {
        const { limit = 50, offset = 0, type } = req.query;

        const where = { userId: req.userId };
        if (type) where.type = type;

        const transactions = await Transaction.findAll({
            where,
            order: [['createdAt', 'DESC']],
            limit: parseInt(limit),
            offset: parseInt(offset)
        });

        res.json(transactions);
    } catch (error) {
        console.error('Get transactions error:', error);
        res.status(500).json({ error: 'Failed to get transactions' });
    }
});

// Create transaction
router.post('/transactions', authMiddleware, async (req, res) => {
    try {
        const { type, amount, description, buildingId, buildingType } = req.body;
        const user = await User.findByPk(req.userId);

        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        // Update user money based on transaction type
        const newMoney = parseFloat(user.money) + parseFloat(amount);
        if (newMoney < 0) {
            return res.status(400).json({ error: 'Insufficient funds' });
        }

        await user.update({ money: newMoney });

        const transaction = await Transaction.create({
            userId: req.userId,
            type,
            amount,
            description,
            buildingId,
            buildingType
        });

        res.status(201).json({
            transaction,
            newBalance: newMoney
        });
    } catch (error) {
        console.error('Create transaction error:', error);
        res.status(500).json({ error: 'Failed to create transaction' });
    }
});

// Get stocks held
router.get('/stocks', authMiddleware, async (req, res) => {
    try {
        const stocks = await StockHolding.findAll({
            where: { userId: req.userId },
            order: [['createdAt', 'DESC']]
        });

        res.json(stocks);
    } catch (error) {
        console.error('Get stocks error:', error);
        res.status(500).json({ error: 'Failed to get stocks' });
    }
});

// Buy stock
router.post('/stocks/buy', authMiddleware, async (req, res) => {
    try {
        const { stockSymbol, stockName, quantity, price } = req.body;
        const user = await User.findByPk(req.userId);

        const totalCost = quantity * price;
        if (parseFloat(user.money) < totalCost) {
            return res.status(400).json({ error: 'Insufficient funds' });
        }

        // Deduct money
        await user.update({ money: parseFloat(user.money) - totalCost });

        // Check if already holding this stock
        let holding = await StockHolding.findOne({
            where: { userId: req.userId, stockSymbol }
        });

        if (holding) {
            // Update existing holding (average buy price)
            const newQuantity = parseFloat(holding.quantity) + quantity;
            const avgPrice = ((parseFloat(holding.quantity) * parseFloat(holding.buyPrice)) + (quantity * price)) / newQuantity;
            await holding.update({ quantity: newQuantity, buyPrice: avgPrice });
        } else {
            // Create new holding
            holding = await StockHolding.create({
                userId: req.userId,
                stockSymbol,
                stockName,
                quantity,
                buyPrice: price
            });
        }

        // Record transaction
        await Transaction.create({
            userId: req.userId,
            type: 'spend',
            amount: -totalCost,
            description: `Bought ${quantity} ${stockSymbol}`
        });

        res.status(201).json({
            message: 'Stock purchased',
            holding,
            newBalance: parseFloat(user.money) - totalCost
        });
    } catch (error) {
        console.error('Buy stock error:', error);
        res.status(500).json({ error: 'Failed to buy stock' });
    }
});

// Sell stock
router.post('/stocks/sell', authMiddleware, async (req, res) => {
    try {
        const { stockSymbol, quantity, price } = req.body;
        const user = await User.findByPk(req.userId);

        const holding = await StockHolding.findOne({
            where: { userId: req.userId, stockSymbol }
        });

        if (!holding || parseFloat(holding.quantity) < quantity) {
            return res.status(400).json({ error: 'Insufficient stock quantity' });
        }

        const totalValue = quantity * price;
        const newQuantity = parseFloat(holding.quantity) - quantity;

        // Update or delete holding
        if (newQuantity <= 0) {
            await holding.destroy();
        } else {
            await holding.update({ quantity: newQuantity });
        }

        // Add money
        await user.update({ money: parseFloat(user.money) + totalValue });

        // Record transaction
        await Transaction.create({
            userId: req.userId,
            type: 'earn',
            amount: totalValue,
            description: `Sold ${quantity} ${stockSymbol}`
        });

        res.json({
            message: 'Stock sold',
            newBalance: parseFloat(user.money) + totalValue
        });
    } catch (error) {
        console.error('Sell stock error:', error);
        res.status(500).json({ error: 'Failed to sell stock' });
    }
});

// Get quiz attempts
router.get('/quizzes', authMiddleware, async (req, res) => {
    try {
        const attempts = await QuizAttempt.findAll({
            where: { userId: req.userId },
            order: [['createdAt', 'DESC']]
        });

        res.json(attempts);
    } catch (error) {
        console.error('Get quiz attempts error:', error);
        res.status(500).json({ error: 'Failed to get quiz attempts' });
    }
});

// Submit quiz result
router.post('/quizzes/complete', authMiddleware, async (req, res) => {
    try {
        const { quizId, quizTitle, score, totalQuestions, xpEarned, timeTaken } = req.body;
        const user = await User.findByPk(req.userId);

        // Record attempt
        const attempt = await QuizAttempt.create({
            userId: req.userId,
            quizId,
            quizTitle,
            score,
            totalQuestions,
            xpEarned,
            timeTaken
        });

        // Update user XP and potentially level
        let newXp = user.xp + xpEarned;
        let newLevel = user.level;
        let newRequiredXp = user.requiredXp;

        while (newXp >= newRequiredXp) {
            newXp -= newRequiredXp;
            newLevel++;
            newRequiredXp = Math.floor(newRequiredXp * 1.5);
        }

        await user.update({
            xp: newXp,
            level: newLevel,
            requiredXp: newRequiredXp
        });

        res.status(201).json({
            attempt,
            levelUp: newLevel > user.level,
            newLevel,
            newXp,
            newRequiredXp
        });
    } catch (error) {
        console.error('Complete quiz error:', error);
        res.status(500).json({ error: 'Failed to record quiz result' });
    }
});

// Add to savings goal
router.post('/savings/:goalId/add', authMiddleware, async (req, res) => {
    try {
        const { goalId } = req.params;
        const { amount } = req.body;
        const user = await User.findByPk(req.userId);

        if (parseFloat(user.money) < amount) {
            return res.status(400).json({ error: 'Insufficient funds' });
        }

        const goal = await SavingsGoal.findOne({
            where: { id: goalId, userId: req.userId }
        });

        if (!goal) {
            return res.status(404).json({ error: 'Savings goal not found' });
        }

        const newCurrent = Math.min(
            parseFloat(goal.currentAmount) + amount,
            parseFloat(goal.targetAmount)
        );
        const isCompleted = newCurrent >= parseFloat(goal.targetAmount);

        await goal.update({
            currentAmount: newCurrent,
            isCompleted
        });

        await user.update({
            money: parseFloat(user.money) - amount
        });

        await Transaction.create({
            userId: req.userId,
            type: 'spend',
            amount: -amount,
            description: `Saved for: ${goal.name}`
        });

        res.json({
            goal,
            newBalance: parseFloat(user.money) - amount,
            completed: isCompleted
        });
    } catch (error) {
        console.error('Add to savings error:', error);
        res.status(500).json({ error: 'Failed to add to savings' });
    }
});

module.exports = router;
