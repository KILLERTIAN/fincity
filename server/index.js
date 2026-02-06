require('dotenv').config();
const express = require('express');
const cors = require('cors');
const http = require('http');
const { Server } = require('socket.io');

const { sequelize } = require('./models');
const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/user');
const cityRoutes = require('./routes/city');

const app = express();
const server = http.createServer(app);

// Socket.io setup for real-time features
const io = new Server(server, {
    cors: {
        origin: '*',
        methods: ['GET', 'POST']
    }
});

// Middleware
app.use(cors());
app.use(express.json());

// Request logging
app.use((req, res, next) => {
    console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
    next();
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/user', userRoutes);
app.use('/api/city', cityRoutes);

// Health check
app.get('/api/health', (req, res) => {
    res.json({
        status: 'ok',
        timestamp: new Date().toISOString(),
        database: sequelize.options.dialect
    });
});

// Socket.io connection handling
io.on('connection', (socket) => {
    console.log('Client connected:', socket.id);

    socket.on('join_room', (userId) => {
        socket.join(`user_${userId}`);
        console.log(`User ${userId} joined their room`);
    });

    socket.on('friend_help_request', (data) => {
        io.to(`user_${data.friendId}`).emit('help_request', {
            from: data.userId,
            amount: data.amount,
            message: data.message
        });
    });

    socket.on('building_interaction', (data) => {
        // Broadcast building interactions for multiplayer awareness
        socket.broadcast.emit('city_update', data);
    });

    socket.on('disconnect', () => {
        console.log('Client disconnected:', socket.id);
    });
});

// Error handling
app.use((err, req, res, next) => {
    console.error('Server error:', err);
    res.status(500).json({ error: 'Internal server error' });
});

// Database sync and server start
const PORT = process.env.PORT || 3001;

const startServer = async () => {
    try {
        // Sync database (in development, use { force: true } to recreate tables)
        await sequelize.sync({ alter: true });
        console.log('Database synced successfully');

        server.listen(PORT, () => {
            console.log(`🚀 FinCity Server running on port ${PORT}`);
            console.log(`📊 Database: ${process.env.DB_NAME || 'fincity'}`);
            console.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);
        });
    } catch (error) {
        console.error('Failed to start server:', error);
        process.exit(1);
    }
};

startServer();

module.exports = { app, io };
