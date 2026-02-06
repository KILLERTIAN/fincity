const express = require('express');
const { User, Transaction } = require('../models');
const authMiddleware = require('../middleware/auth');

const router = express.Router();

// Building interaction configurations
const BUILDING_ACTIONS = {
    bank: {
        name: 'FinCity Bank',
        actions: ['deposit', 'withdraw', 'view_balance'],
        icon: 'business'
    },
    market: {
        name: 'City Market',
        actions: ['buy_food', 'buy_supplies'],
        foodCost: 15,
        suppliesCost: 25,
        icon: 'cart'
    },
    home: {
        name: 'Your Home',
        actions: ['rest', 'view_stats'],
        restEnergy: 30,
        icon: 'home'
    },
    guild: {
        name: 'Office Building',
        actions: ['work', 'relax', 'invest'],
        workReward: { min: 30, max: 70 },
        workEnergyCost: 20,
        workMoodCost: 10,
        relaxCost: 20,
        relaxMoodBoost: 25,
        investMinCost: 100,
        investXpBoost: 50,
        icon: 'briefcase'
    },
    hospital: {
        name: 'City Hospital',
        actions: ['heal', 'emergency_fund'],
        healCost: 30,
        healEnergy: 100,
        icon: 'medical'
    },
    gym: {
        name: 'Fitness Center',
        actions: ['workout'],
        workoutCost: 10,
        workoutXp: 15,
        icon: 'fitness'
    },
    store: {
        name: 'General Store',
        actions: ['shop'],
        icon: 'storefront'
    }
};

// Get building info
router.get('/:buildingType/info', (req, res) => {
    const { buildingType } = req.params;
    const building = BUILDING_ACTIONS[buildingType];

    if (!building) {
        return res.status(404).json({ error: 'Building type not found' });
    }

    res.json(building);
});

// Interact with building
router.post('/:buildingType/interact', authMiddleware, async (req, res) => {
    try {
        const { buildingType } = req.params;
        const { action, amount } = req.body;
        const user = await User.findByPk(req.userId);

        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        const building = BUILDING_ACTIONS[buildingType];
        if (!building) {
            return res.status(404).json({ error: 'Building type not found' });
        }

        let result = { success: false };

        switch (buildingType) {
            case 'bank':
                result = await handleBankAction(user, action, amount);
                break;
            case 'market':
                result = await handleMarketAction(user, action, building);
                break;
            case 'home':
                result = await handleHomeAction(user, action, building);
                break;
            case 'guild':
                result = await handleOfficeAction(user, action, building, amount);
                break;
            case 'hospital':
                result = await handleHospitalAction(user, action, building);
                break;
            case 'gym':
                result = await handleGymAction(user, action, building);
                break;
            default:
                return res.status(400).json({ error: 'Invalid building type' });
        }

        if (result.success && result.transaction) {
            await Transaction.create({
                userId: req.userId,
                type: result.transaction.type,
                amount: result.transaction.amount,
                description: result.transaction.description,
                buildingId: buildingType,
                buildingType
            });
        }

        res.json(result);
    } catch (error) {
        console.error('Building interaction error:', error);
        res.status(500).json({ error: 'Interaction failed' });
    }
});

// Bank actions
async function handleBankAction(user, action, amount) {
    switch (action) {
        case 'deposit':
            if (parseFloat(user.money) < amount) {
                return { success: false, error: 'Insufficient funds' };
            }
            await user.update({
                money: parseFloat(user.money) - amount,
                bankBalance: parseFloat(user.bankBalance) + amount
            });
            return {
                success: true,
                message: `Deposited ₹${amount}`,
                newBalance: parseFloat(user.money) - amount,
                bankBalance: parseFloat(user.bankBalance) + amount,
                transaction: {
                    type: 'deposit',
                    amount: -amount,
                    description: `Bank deposit`
                }
            };

        case 'withdraw':
            if (parseFloat(user.bankBalance) < amount) {
                return { success: false, error: 'Insufficient bank balance' };
            }
            await user.update({
                money: parseFloat(user.money) + amount,
                bankBalance: parseFloat(user.bankBalance) - amount
            });
            return {
                success: true,
                message: `Withdrew ₹${amount}`,
                newBalance: parseFloat(user.money) + amount,
                bankBalance: parseFloat(user.bankBalance) - amount,
                transaction: {
                    type: 'withdraw',
                    amount: amount,
                    description: `Bank withdrawal`
                }
            };

        case 'view_balance':
            return {
                success: true,
                walletBalance: parseFloat(user.money),
                bankBalance: parseFloat(user.bankBalance),
                totalAssets: parseFloat(user.money) + parseFloat(user.bankBalance)
            };

        default:
            return { success: false, error: 'Invalid action' };
    }
}

// Market actions
async function handleMarketAction(user, action, config) {
    let cost = 0;
    let description = '';

    switch (action) {
        case 'buy_food':
            cost = config.foodCost;
            description = 'Bought food at market';
            break;
        case 'buy_supplies':
            cost = config.suppliesCost;
            description = 'Bought supplies at market';
            break;
        default:
            return { success: false, error: 'Invalid action' };
    }

    if (parseFloat(user.money) < cost) {
        return { success: false, error: 'Insufficient funds' };
    }

    // Buying food restores some energy
    const energyBoost = action === 'buy_food' ? 15 : 5;
    await user.update({
        money: parseFloat(user.money) - cost,
        energy: Math.min(100, user.energy + energyBoost)
    });

    return {
        success: true,
        message: description,
        newBalance: parseFloat(user.money) - cost,
        newEnergy: Math.min(100, user.energy + energyBoost),
        transaction: {
            type: 'shop',
            amount: -cost,
            description
        }
    };
}

// Home actions
async function handleHomeAction(user, action, config) {
    switch (action) {
        case 'rest':
            const newEnergy = Math.min(100, user.energy + config.restEnergy);
            await user.update({ energy: newEnergy });
            return {
                success: true,
                message: `Rested at home. Energy restored!`,
                newEnergy,
                transaction: {
                    type: 'rest',
                    amount: 0,
                    description: 'Rested at home'
                }
            };

        case 'view_stats':
            return {
                success: true,
                stats: {
                    name: user.name,
                    level: user.level,
                    xp: user.xp,
                    money: parseFloat(user.money),
                    bankBalance: parseFloat(user.bankBalance),
                    energy: user.energy,
                    trustScore: user.trustScore,
                    streak: user.streak
                }
            };

        default:
            return { success: false, error: 'Invalid action' };
    }
}

// Office actions
async function handleOfficeAction(user, action, config, amount = 0) {
    switch (action) {
        case 'work':
            if (user.energy < config.workEnergyCost) {
                return { success: false, error: 'Not enough energy to work!' };
            }

            const reward = Math.floor(Math.random() * (config.workReward.max - config.workReward.min + 1)) + config.workReward.min;
            const newMood = Math.max(0, user.mood - config.workMoodCost);

            await user.update({
                money: parseFloat(user.money) + reward,
                energy: user.energy - config.workEnergyCost,
                mood: newMood,
                xp: user.xp + 15
            });

            return {
                success: true,
                message: `Worked hard! Earned ₹${reward}`,
                reward,
                newBalance: parseFloat(user.money) + reward,
                newEnergy: user.energy - config.workEnergyCost,
                newMood,
                transaction: {
                    type: 'work',
                    amount: reward,
                    description: 'Earned from office work'
                }
            };

        case 'relax':
            if (parseFloat(user.money) < config.relaxCost) {
                return { success: false, error: 'Insufficient funds for relaxing' };
            }

            const moodBoost = Math.min(100, user.mood + config.relaxMoodBoost);
            await user.update({
                money: parseFloat(user.money) - config.relaxCost,
                mood: moodBoost
            });

            return {
                success: true,
                message: `Took a break! Feeling better.`,
                newBalance: parseFloat(user.money) - config.relaxCost,
                newMood: moodBoost,
                transaction: {
                    type: 'spend',
                    amount: -config.relaxCost,
                    description: 'Relaxed at office cafe'
                }
            };

        case 'invest':
            const investAmount = amount || config.investMinCost;
            if (parseFloat(user.money) < investAmount) {
                return { success: false, error: 'Not enough money to invest!' };
            }

            await user.update({
                money: parseFloat(user.money) - investAmount,
                xp: user.xp + config.investXpBoost,
                trustScore: Math.min(100, user.trustScore + 5)
            });

            return {
                success: true,
                message: `Invested ₹${investAmount}. XP and Trust increased!`,
                newBalance: parseFloat(user.money) - investAmount,
                transaction: {
                    type: 'spend',
                    amount: -investAmount,
                    description: `Invested in business`
                }
            };

        default:
            return { success: false, error: 'Invalid office action' };
    }
}

// Hospital actions
async function handleHospitalAction(user, action, config) {
    switch (action) {
        case 'heal':
            if (parseFloat(user.money) < config.healCost) {
                return { success: false, error: 'Insufficient funds for healing' };
            }
            await user.update({
                money: parseFloat(user.money) - config.healCost,
                energy: config.healEnergy
            });
            return {
                success: true,
                message: 'Fully healed!',
                newBalance: parseFloat(user.money) - config.healCost,
                newEnergy: config.healEnergy,
                transaction: {
                    type: 'spend',
                    amount: -config.healCost,
                    description: 'Hospital healing'
                }
            };

        case 'emergency_fund':
            // Only if energy is critically low
            if (user.energy > 20) {
                return { success: false, error: 'Emergency fund only for critical situations' };
            }
            await user.update({ energy: 50 });
            return {
                success: true,
                message: 'Emergency treatment provided',
                newEnergy: 50
            };

        default:
            return { success: false, error: 'Invalid action' };
    }
}

// Gym actions
async function handleGymAction(user, action, config) {
    if (action !== 'workout') {
        return { success: false, error: 'Invalid action' };
    }

    if (parseFloat(user.money) < config.workoutCost) {
        return { success: false, error: 'Insufficient funds' };
    }

    if (user.energy < 10) {
        return { success: false, error: 'Too tired to workout!' };
    }

    await user.update({
        money: parseFloat(user.money) - config.workoutCost,
        xp: user.xp + config.workoutXp,
        trustScore: Math.min(100, user.trustScore + 1),
        energy: Math.max(0, user.energy - 10)
    });

    return {
        success: true,
        message: `Workout complete! +${config.workoutXp} XP`,
        newBalance: parseFloat(user.money) - config.workoutCost,
        xpEarned: config.workoutXp,
        newEnergy: Math.max(0, user.energy - 10),
        transaction: {
            type: 'spend',
            amount: -config.workoutCost,
            description: 'Gym workout'
        }
    };
}

module.exports = router;
