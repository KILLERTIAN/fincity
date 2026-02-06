const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const SavingsGoal = sequelize.define('SavingsGoal', {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
    },
    userId: {
        type: DataTypes.UUID,
        allowNull: false,
        field: 'user_id'
    },
    name: {
        type: DataTypes.STRING(100),
        allowNull: false
    },
    targetAmount: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
        field: 'target_amount'
    },
    currentAmount: {
        type: DataTypes.DECIMAL(10, 2),
        defaultValue: 0,
        field: 'current_amount'
    },
    icon: {
        type: DataTypes.STRING(50),
        defaultValue: 'wallet'
    },
    color: {
        type: DataTypes.STRING(20),
        defaultValue: '#FF9500'
    },
    isCompleted: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
        field: 'is_completed'
    }
}, {
    tableName: 'savings_goals',
    timestamps: true,
    underscored: true
});

module.exports = SavingsGoal;
