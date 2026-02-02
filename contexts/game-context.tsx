import React, { createContext, useCallback, useContext, useState } from 'react';

interface Player {
  id: string;
  name: string;
  money: number;
  trustScore: number;
  level: number;
  xp: number;
  requiredXP: number;
  avatar: string;
  monthlyAllowance: number;
  streak: number;
  inventory: InventoryItem[];
  gems: number;
}

interface InventoryItem {
  id: string;
  name: string;
  icon: string;
  category: 'avatar' | 'boost' | 'decoration';
}

interface GameState {
  player: Player;
  friends: Friend[];
  transactions: Transaction[];
  loans: Loan[];
  notifications: Notification[];
  dailyExpenses: DailyExpense[];
  savingsGoals: SavingsGoal[];
  achievements: Achievement[];
  dailyQuests: Quest[];
  unlockedAchievement: Achievement | null;
}

interface Quest {
  id: string;
  title: string;
  description: string;
  progress: number;
  target: number;
  reward: {
    type: 'coins' | 'xp' | 'gems' | 'item';
    amount: number;
  };
  icon: string;
  color: string;
  completed: boolean;
}

interface Friend {
  id: string;
  name: string;
  isOnline: boolean;
  trustScore: number;
  avatar: string;
  level: number;
}

interface Transaction {
  id: string;
  type: 'earn' | 'spend' | 'lend' | 'borrow' | 'help';
  amount: number;
  description: string;
  timestamp: Date;
  friendId?: string;
}

interface Loan {
  id: string;
  lenderId: string;
  borrowerId: string;
  amount: number;
  interestRate: number;
  repaymentAmount: number;
  dueDate: Date;
  status: 'active' | 'repaid' | 'overdue';
}

interface Notification {
  id: string;
  type: 'friend_request' | 'loan_request' | 'help_request' | 'achievement' | 'daily_reward';
  title: string;
  message: string;
  timestamp: Date;
  data?: any;
  read: boolean;
}

interface DailyExpense {
  id: string;
  name: string;
  amount: number;
  category: 'food' | 'transport' | 'entertainment' | 'utilities';
  icon: string;
  isPaid: boolean;
  dueDate: Date;
}

interface SavingsGoal {
  id: string;
  name: string;
  targetAmount: number;
  currentAmount: number;
  icon: string;
  color: string;
}

interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  unlocked: boolean;
  unlockedAt?: Date;
}

interface GameContextType {
  gameState: GameState;
  updatePlayerMoney: (amount: number, type: Transaction['type'], description: string, friendId?: string) => void;
  addFriend: (friend: Friend) => void;
  updateTrustScore: (change: number) => void;
  getTransactionHistory: () => Transaction[];
  lendMoney: (friendId: string, amount: number) => void;
  repayLoan: (loanId: string) => void;
  payExpense: (expenseId: string) => void;
  addToSavingsGoal: (goalId: string, amount: number) => void;
  markNotificationRead: (notificationId: string) => void;
  handleNotificationAction: (notificationId: string, action: 'accept' | 'decline') => void;
  purchaseItem: (itemId: string, price: number) => void;
}

const GameContext = createContext<GameContextType | undefined>(undefined);

export const useGame = () => {
  const context = useContext(GameContext);
  if (!context) {
    throw new Error('useGame must be used within a GameProvider');
  }
  return context;
};

interface GameProviderProps {
  children: React.ReactNode;
}

export const GameProvider: React.FC<GameProviderProps> = ({ children }) => {
  const [gameState, setGameState] = useState<GameState>({
    player: {
      id: '1',
      name: 'KILLERTIAN',
      money: 124.50,
      trustScore: 85,
      level: 5,
      xp: 450,
      requiredXP: 500,
      avatar: 'K',
      monthlyAllowance: 100,
      streak: 7,
      inventory: [],
      gems: 250,
    },
    friends: [
      { id: '1', name: 'Candy', isOnline: true, trustScore: 92, avatar: 'C', level: 10 },
      { id: '2', name: 'KraPex', isOnline: true, trustScore: 88, avatar: 'K', level: 8 },
      { id: '3', name: 'Necrosma', isOnline: true, trustScore: 85, avatar: 'N', level: 12 },
      { id: '4', name: 'Baigan', isOnline: true, trustScore: 78, avatar: 'B', level: 8 },
      { id: '5', name: 'Astral Monk', isOnline: false, trustScore: 95, avatar: 'M', level: 5 },
      { id: '6', name: 'Ansh', isOnline: false, trustScore: 82, avatar: 'A', level: 15 },
      { id: '7', name: 'STARLEX', isOnline: false, trustScore: 76, avatar: 'S', level: 4 },
    ],
    transactions: [],
    loans: [],
    notifications: [
      {
        id: '1',
        type: 'loan_request',
        title: 'Loan Request',
        message: 'Leo wants to borrow $5 for a snack',
        timestamp: new Date(Date.now() - 300000),
        data: { friendId: '8', amount: 5 },
        read: false,
      },
      {
        id: '2',
        type: 'achievement',
        title: 'Achievement Unlocked!',
        message: 'You reached a 7-day streak!',
        timestamp: new Date(Date.now() - 600000),
        read: false,
      },
    ],
    dailyExpenses: [
      {
        id: '1',
        name: 'Lunch',
        amount: 8,
        category: 'food',
        icon: 'fast-food',
        isPaid: false,
        dueDate: new Date(),
      },
      {
        id: '2',
        name: 'Bus Fare',
        amount: 3,
        category: 'transport',
        icon: 'bus',
        isPaid: false,
        dueDate: new Date(),
      },
    ],
    savingsGoals: [
      {
        id: '1',
        name: 'New Bike',
        targetAmount: 150,
        currentAmount: 75,
        icon: 'bicycle',
        color: '#FF9500',
      },
      {
        id: '2',
        name: 'Gaming Console',
        targetAmount: 300,
        currentAmount: 45,
        icon: 'game-controller',
        color: '#CE82FF',
      },
    ],
    achievements: [
      {
        id: '1',
        name: 'First Saver',
        description: 'Save your first $10',
        icon: 'wallet',
        unlocked: true,
        unlockedAt: new Date(Date.now() - 86400000),
      },
      {
        id: '2',
        name: 'Generous Friend',
        description: 'Help a friend 5 times',
        icon: 'heart',
        unlocked: false,
      },
      {
        id: '3',
        name: 'Week Warrior',
        description: 'Maintain a 7-day streak',
        icon: 'flame',
        unlocked: true,
        unlockedAt: new Date(),
      },
    ],
    dailyQuests: [
      {
        id: 'quest1',
        title: 'Earn $10',
        description: 'Make $10 today',
        progress: 10,
        target: 10,
        reward: { type: 'xp', amount: 50 },
        icon: 'cash',
        color: '#58CC02',
        completed: true,
      },
      {
        id: 'quest2',
        title: 'Save $5',
        description: 'Add to your savings',
        progress: 3,
        target: 5,
        reward: { type: 'coins', amount: 5 },
        icon: 'wallet',
        color: '#1CB0F6',
        completed: false,
      },
      {
        id: 'quest3',
        title: 'Help a Friend',
        description: 'Lend money to a friend',
        progress: 0,
        target: 1,
        reward: { type: 'gems', amount: 25 },
        icon: 'heart',
        color: '#FF6B35',
        completed: false,
      },
    ],
    unlockedAchievement: null,
  });

  const updatePlayerMoney = useCallback((
    amount: number,
    type: Transaction['type'],
    description: string,
    friendId?: string
  ) => {
    setGameState(prev => {
      const newTransaction: Transaction = {
        id: Date.now().toString(),
        type,
        amount,
        description,
        timestamp: new Date(),
        friendId,
      };

      const newMoney = prev.player.money + amount;

      // Update trust score based on transaction type
      let trustScoreChange = 0;
      if (type === 'help' && amount < 0) trustScoreChange = 2;
      if (type === 'lend' && amount < 0) trustScoreChange = 1;
      if (type === 'borrow' && amount > 0) trustScoreChange = -1;

      return {
        ...prev,
        player: {
          ...prev.player,
          money: Math.max(0, newMoney),
          trustScore: Math.min(100, Math.max(0, prev.player.trustScore + trustScoreChange)),
        },
        transactions: [newTransaction, ...prev.transactions].slice(0, 50),
      };
    });
  }, []);

  const lendMoney = useCallback((friendId: string, amount: number) => {
    setGameState(prev => {
      const newLoan: Loan = {
        id: Date.now().toString(),
        lenderId: prev.player.id,
        borrowerId: friendId,
        amount,
        interestRate: 5,
        repaymentAmount: amount * 1.05,
        dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
        status: 'active',
      };

      const newTransaction: Transaction = {
        id: Date.now().toString(),
        type: 'lend',
        amount: -amount,
        description: `Lent to ${prev.friends.find(f => f.id === friendId)?.name}`,
        timestamp: new Date(),
        friendId,
      };

      return {
        ...prev,
        player: {
          ...prev.player,
          money: prev.player.money - amount,
          trustScore: Math.min(100, prev.player.trustScore + 1),
        },
        loans: [newLoan, ...prev.loans],
        transactions: [newTransaction, ...prev.transactions].slice(0, 50),
      };
    });
  }, []);

  const repayLoan = useCallback((loanId: string) => {
    setGameState(prev => {
      const loan = prev.loans.find(l => l.id === loanId);
      if (!loan) return prev;

      return {
        ...prev,
        loans: prev.loans.map(l =>
          l.id === loanId ? { ...l, status: 'repaid' as const } : l
        ),
        player: {
          ...prev.player,
          money: prev.player.money + loan.repaymentAmount,
          trustScore: Math.min(100, prev.player.trustScore + 2),
        },
      };
    });
  }, []);

  const payExpense = useCallback((expenseId: string) => {
    setGameState(prev => {
      const expense = prev.dailyExpenses.find(e => e.id === expenseId);
      if (!expense || expense.isPaid) return prev;

      const newTransaction: Transaction = {
        id: Date.now().toString(),
        type: 'spend',
        amount: -expense.amount,
        description: expense.name,
        timestamp: new Date(),
      };

      return {
        ...prev,
        player: {
          ...prev.player,
          money: prev.player.money - expense.amount,
        },
        dailyExpenses: prev.dailyExpenses.map(e =>
          e.id === expenseId ? { ...e, isPaid: true } : e
        ),
        transactions: [newTransaction, ...prev.transactions].slice(0, 50),
      };
    });
  }, []);

  const addToSavingsGoal = useCallback((goalId: string, amount: number) => {
    setGameState(prev => {
      return {
        ...prev,
        savingsGoals: prev.savingsGoals.map(g =>
          g.id === goalId
            ? { ...g, currentAmount: Math.min(g.targetAmount, g.currentAmount + amount) }
            : g
        ),
        player: {
          ...prev.player,
          money: prev.player.money - amount,
        },
      };
    });
  }, []);

  const markNotificationRead = useCallback((notificationId: string) => {
    setGameState(prev => ({
      ...prev,
      notifications: prev.notifications.map(n =>
        n.id === notificationId ? { ...n, read: true } : n
      ),
    }));
  }, []);

  const handleNotificationAction = useCallback((notificationId: string, action: 'accept' | 'decline') => {
    setGameState(prev => {
      const notification = prev.notifications.find(n => n.id === notificationId);
      if (!notification) return prev;

      // Remove the notification
      const newNotifications = prev.notifications.filter(n => n.id !== notificationId);

      if (action === 'accept' && notification.type === 'loan_request') {
        // Handle loan acceptance
        const { friendId, amount } = notification.data;
        // This would trigger lendMoney in a real scenario
      }

      return {
        ...prev,
        notifications: newNotifications,
      };
    });
  }, []);

  const purchaseItem = useCallback((itemId: string, price: number) => {
    setGameState(prev => {
      if (prev.player.money < price) return prev;

      const newItem: InventoryItem = {
        id: itemId,
        name: 'New Item',
        icon: 'star',
        category: 'decoration',
      };

      return {
        ...prev,
        player: {
          ...prev.player,
          money: prev.player.money - price,
          inventory: [...prev.player.inventory, newItem],
        },
      };
    });
  }, []);

  const addFriend = useCallback((friend: Friend) => {
    setGameState(prev => ({
      ...prev,
      friends: [...prev.friends, friend],
    }));
  }, []);

  const updateTrustScore = useCallback((change: number) => {
    setGameState(prev => ({
      ...prev,
      player: {
        ...prev.player,
        trustScore: Math.min(100, Math.max(0, prev.player.trustScore + change)),
      },
    }));
  }, []);

  const getTransactionHistory = useCallback(() => {
    return gameState.transactions;
  }, [gameState.transactions]);

  const value: GameContextType = {
    gameState,
    updatePlayerMoney,
    addFriend,
    updateTrustScore,
    getTransactionHistory,
    lendMoney,
    repayLoan,
    payExpense,
    addToSavingsGoal,
    markNotificationRead,
    handleNotificationAction,
    purchaseItem,
  };

  return (
    <GameContext.Provider value={value}>
      {children}
    </GameContext.Provider>
  );
};