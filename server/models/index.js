const sequelize = require('../config/database');
const User = require('./User');
const StockHolding = require('./StockHolding');
const QuizAttempt = require('./QuizAttempt');
const Transaction = require('./Transaction');
const SavingsGoal = require('./SavingsGoal');

// Define associations
User.hasMany(StockHolding, { foreignKey: 'userId', as: 'stocks' });
StockHolding.belongsTo(User, { foreignKey: 'userId' });

User.hasMany(QuizAttempt, { foreignKey: 'userId', as: 'quizAttempts' });
QuizAttempt.belongsTo(User, { foreignKey: 'userId' });

User.hasMany(Transaction, { foreignKey: 'userId', as: 'transactions' });
Transaction.belongsTo(User, { foreignKey: 'userId' });

User.hasMany(SavingsGoal, { foreignKey: 'userId', as: 'savingsGoals' });
SavingsGoal.belongsTo(User, { foreignKey: 'userId' });

module.exports = {
    sequelize,
    User,
    StockHolding,
    QuizAttempt,
    Transaction,
    SavingsGoal
};
