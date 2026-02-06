import { userApi } from '@/utils/api';
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
  mood: number;
  energy: number;
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
  updatePlayerStats: (stats: Partial<Pick<Player, 'money' | 'xp' | 'trustScore' | 'level' | 'energy' | 'mood' | 'gems'>>) => void;
  refreshProfile: () => Promise<void>;
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
      name: 'Loading...',
      money: 0,
      trustScore: 85,
      level: 1,
      xp: 0,
      requiredXP: 100,
      avatar: 'boy2',
      monthlyAllowance: 100,
      streak: 0,
      inventory: [],
      gems: 0,
      mood: 100,
      energy: 100,
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
    notifications: [],
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
    ],
    savingsGoals: [],
    achievements: [
      {
        id: '1',
        name: 'First Saver',
        description: 'Save your first ₹100',
        icon: 'wallet',
        unlocked: true,
        unlockedAt: new Date(Date.now() - 86400000),
      },
    ],
    dailyQuests: [
      {
        id: 'quest1',
        title: 'Earn ₹100',
        description: 'Make ₹100 today',
        progress: 10,
        target: 10,
        reward: { type: 'xp', amount: 50 },
        icon: 'cash',
        color: '#58CC02',
        completed: true,
      },
    ],
    unlockedAchievement: null,
  });

  const refreshProfile = useCallback(async () => {
    try {
      // Only fetch profile if user has a token
      const AsyncStorage = (await import('@react-native-async-storage/async-storage')).default;
      const token = await AsyncStorage.getItem('authToken');

      if (!token) {
        // No token, skip fetching profile (user not logged in)
        return;
      }

      const profile = await userApi.getProfile();
      setGameState(prev => ({
        ...prev,
        player: {
          ...prev.player,
          id: profile.id,
          name: profile.name,
          money: profile.money,
          level: profile.level,
          xp: profile.xp,
          requiredXP: profile.requiredXp || 100,
          avatar: profile.avatar || 'boy2',
          gems: profile.gems,
          trustScore: profile.trustScore,
          streak: profile.streak,
          energy: profile.energy,
          mood: profile.mood || 100,
        },
        savingsGoals: profile.savingsGoals || [],
      }));
    } catch (err: any) {
      // Silently handle 401 errors (user logged out)
      if (err?.response?.status !== 401) {
        console.log('Failed to fetch profile:', err);
      }
    }
  }, []);

  React.useEffect(() => {
    refreshProfile();
  }, [refreshProfile]);

  const updatePlayerMoney = useCallback((
    amount: number,
    type: Transaction['type'],
    description: string,
    friendId?: string
  ) => {
    // Optimistic UI update
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
      return {
        ...prev,
        player: {
          ...prev.player,
          money: Math.max(0, newMoney),
        },
        transactions: [newTransaction, ...prev.transactions].slice(0, 50),
      };
    });

    // Real update - in a real app, you'd call the API here
    // userApi.createTransaction({ type, amount, description })
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

  const updatePlayerStats = useCallback((stats: Partial<Pick<Player, 'money' | 'xp' | 'trustScore' | 'level' | 'energy' | 'mood' | 'gems'>>) => {
    setGameState(prev => ({
      ...prev,
      player: {
        ...prev.player,
        ...stats,
      },
    }));
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
    updatePlayerStats,
    refreshProfile,
  };

  return (
    <GameContext.Provider value={value}>
      {children}
    </GameContext.Provider>
  );
};