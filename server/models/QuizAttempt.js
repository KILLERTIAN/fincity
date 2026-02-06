const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const QuizAttempt = sequelize.define('QuizAttempt', {
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
    quizId: {
        type: DataTypes.STRING(50),
        allowNull: false,
        field: 'quiz_id'
    },
    quizTitle: {
        type: DataTypes.STRING(100),
        allowNull: false,
        field: 'quiz_title'
    },
    score: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    totalQuestions: {
        type: DataTypes.INTEGER,
        allowNull: false,
        field: 'total_questions'
    },
    xpEarned: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
        field: 'xp_earned'
    },
    timeTaken: {
        type: DataTypes.INTEGER, // in seconds
        field: 'time_taken'
    }
}, {
    tableName: 'quiz_attempts',
    timestamps: true,
    underscored: true
});

module.exports = QuizAttempt;
