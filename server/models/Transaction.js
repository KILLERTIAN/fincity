const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Transaction = sequelize.define('Transaction', {
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
    type: {
        type: DataTypes.ENUM('earn', 'spend', 'lend', 'borrow', 'help', 'deposit', 'withdraw', 'work', 'rest', 'shop'),
        allowNull: false
    },
    amount: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false
    },
    description: {
        type: DataTypes.TEXT
    },
    friendId: {
        type: DataTypes.UUID,
        field: 'friend_id'
    },
    buildingId: {
        type: DataTypes.STRING(50),
        field: 'building_id'
    },
    buildingType: {
        type: DataTypes.STRING(50),
        field: 'building_type'
    }
}, {
    tableName: 'transactions',
    timestamps: true,
    underscored: true
});

module.exports = Transaction;
