# FinCity Backend & Feature Implementation Plan

## Overview
This plan implements the backend with PostgreSQL, interactive city buildings, user profile, and game audio.

## Phase 1: Backend Setup with PostgreSQL

### 1.1 Server Setup
- Add `pg` and `sequelize` to server dependencies
- Create database configuration
- Set up connection pool

### 1.2 Database Schema
```sql
-- Users table
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(100) NOT NULL,
    email VARCHAR(255) UNIQUE,
    avatar VARCHAR(50) DEFAULT 'happy',
    level INTEGER DEFAULT 1,
    xp INTEGER DEFAULT 0,
    money DECIMAL(10,2) DEFAULT 0,
    gems INTEGER DEFAULT 0,
    trust_score INTEGER DEFAULT 50,
    streak INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Stocks/Investments
CREATE TABLE stocks_held (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id),
    stock_symbol VARCHAR(20) NOT NULL,
    quantity DECIMAL(10,4) NOT NULL,
    buy_price DECIMAL(10,2) NOT NULL,
    bought_at TIMESTAMP DEFAULT NOW()
);

-- Quiz attempts
CREATE TABLE quiz_attempts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id),
    quiz_id VARCHAR(50) NOT NULL,
    score INTEGER NOT NULL,
    total_questions INTEGER NOT NULL,
    xp_earned INTEGER DEFAULT 0,
    completed_at TIMESTAMP DEFAULT NOW()
);

-- Transactions (spending history)
CREATE TABLE transactions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id),
    type VARCHAR(20) NOT NULL, -- earn, spend, lend, borrow, help
    amount DECIMAL(10,2) NOT NULL,
    description TEXT,
    friend_id UUID REFERENCES users(id),
    building_id VARCHAR(50), -- for city interactions
    created_at TIMESTAMP DEFAULT NOW()
);

-- Savings goals
CREATE TABLE savings_goals (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id),
    name VARCHAR(100) NOT NULL,
    target_amount DECIMAL(10,2) NOT NULL,
    current_amount DECIMAL(10,2) DEFAULT 0,
    icon VARCHAR(50),
    color VARCHAR(20),
    created_at TIMESTAMP DEFAULT NOW()
);
```

### 1.3 API Endpoints
- POST /api/auth/register
- POST /api/auth/login
- GET /api/user/profile
- PUT /api/user/profile
- GET /api/user/transactions
- POST /api/user/transactions
- GET /api/user/stocks
- POST /api/user/stocks/buy
- POST /api/user/stocks/sell
- GET /api/quiz/attempts
- POST /api/quiz/complete
- POST /api/city/interact

## Phase 2: City Building Interactions

### Buildings & Actions:
1. **Bank** - Deposit/Withdraw money, view balance
2. **Market** - Buy food (spend money)
3. **Home** - Rest to restore energy, view stats
4. **Office** - Work to earn money (time-based)
5. **Hospital** - Emergency fund usage
6. **Gym** - Boost stats (costs money)

## Phase 3: User Profile Screen

- Clickable avatar on home screen
- Profile modal with:
  - Avatar selection
  - Name editing
  - Stats display (level, XP, money, streak)
  - Achievement badges
  - Settings

## Phase 4: Game Audio

- Background music (toggleable)
- Button click sounds
- Success/achievement sounds
- Audio context provider

## Implementation Order:
1. Backend server with PostgreSQL
2. API service for frontend
3. City building interactions
4. User profile screen
5. Audio system
