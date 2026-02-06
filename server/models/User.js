const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const User = sequelize.define('User', {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
    },
    name: {
        type: DataTypes.STRING(100),
        allowNull: false
    },
    email: {
        type: DataTypes.STRING(255),
        unique: true,
        allowNull: true
    },
    password: {
        type: DataTypes.STRING(255),
        allowNull: true
    },
    avatar: {
        type: DataTypes.STRING(50),
        defaultValue: 'happy'
    },
    level: {
        type: DataTypes.INTEGER,
        defaultValue: 1
    },
    xp: {
        type: DataTypes.INTEGER,
        defaultValue: 0
    },
    requiredXp: {
        type: DataTypes.INTEGER,
        defaultValue: 100
    },
    money: {
        type: DataTypes.DECIMAL(10, 2),
        defaultValue: 100.00
    },
    gems: {
        type: DataTypes.INTEGER,
        defaultValue: 50
    },
    trustScore: {
        type: DataTypes.INTEGER,
        defaultValue: 50
    },
    streak: {
        type: DataTypes.INTEGER,
        defaultValue: 0
    },
    lastActiveAt: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW
    },
    energy: {
        type: DataTypes.INTEGER,
        defaultValue: 100
    },
    bankBalance: {
        type: DataTypes.DECIMAL(10, 2),
        defaultValue: 0
    },
    mood: {
        type: DataTypes.INTEGER,
        defaultValue: 100
    }
}, {
    tableName: 'users',
    timestamps: true,
    underscored: true
});

module.exports = User;
