const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const StockHolding = sequelize.define('StockHolding', {
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
    stockSymbol: {
        type: DataTypes.STRING(20),
        allowNull: false,
        field: 'stock_symbol'
    },
    stockName: {
        type: DataTypes.STRING(100),
        allowNull: false,
        field: 'stock_name'
    },
    quantity: {
        type: DataTypes.DECIMAL(10, 4),
        allowNull: false
    },
    buyPrice: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
        field: 'buy_price'
    }
}, {
    tableName: 'stocks_held',
    timestamps: true,
    underscored: true
});

module.exports = StockHolding;
