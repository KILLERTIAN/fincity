import { useGame } from '@/contexts/game-context';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { LinearGradient } from 'expo-linear-gradient';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import LottieView from 'lottie-react-native';
import React, { useEffect, useRef, useState } from 'react';
import { Alert, Dimensions, Pressable, StyleSheet, Text, View } from 'react-native';
import Animated, {
    FadeIn,
    FadeInUp,
    SlideInRight,
    useAnimatedStyle,
    useSharedValue,
    withSequence,
    withTiming
} from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';
import Svg, { Circle } from 'react-native-svg';

const { width, height } = Dimensions.get('window');

// Quiz data
const QUIZZES = {
    'budgeting': {
        id: 'budgeting',
        title: 'Budgeting Basics',
        icon: 'receipt',
        color: '#B8FF66',
        xpReward: 50,
        questions: [
            {
                id: 1,
                question: "What is a budget?",
                options: [
                    "A plan for spending and saving money",
                    "A type of bank account",
                    "A credit card",
                    "A loan from the bank"
                ],
                correct: 0,
                explanation: "A budget is a plan that helps you track your income and expenses!"
            },
            {
                id: 2,
                question: "Which is the BEST way to save money?",
                options: [
                    "Spend everything you earn",
                    "Save a little from every allowance",
                    "Never buy anything",
                    "Borrow from friends"
                ],
                correct: 1,
                explanation: "Saving a portion regularly is the smartest way to build wealth over time!"
            },
            {
                id: 3,
                question: "What does 'needs vs wants' mean?",
                options: [
                    "Things you need are always expensive",
                    "Wants are things you must buy first",
                    "Needs are essential, wants are extras",
                    "There's no difference between them"
                ],
                correct: 2,
                explanation: "Needs are essentials like food and shelter. Wants are nice-to-haves!"
            },
            {
                id: 4,
                question: "Why should you track your spending?",
                options: [
                    "To impress your friends",
                    "To know where your money goes",
                    "It's not important",
                    "To spend more money"
                ],
                correct: 1,
                explanation: "Tracking helps you understand your habits and find ways to save!"
            },
            {
                id: 5,
                question: "What's the 50-30-20 rule?",
                options: [
                    "50% needs, 30% wants, 20% savings",
                    "50% wants, 30% savings, 20% needs",
                    "A secret money code",
                    "A type of bank account"
                ],
                correct: 0,
                explanation: "The 50-30-20 rule is a simple budgeting guideline for managing money!"
            }
        ]
    },
    'tax': {
        id: 'tax',
        title: 'Tax Saving 101',
        icon: 'calculator',
        color: '#FFD700',
        xpReward: 80,
        questions: [
            {
                id: 1,
                question: "What is tax?",
                options: [
                    "Free money from the government",
                    "Money paid to the government",
                    "A type of savings account",
                    "A loan"
                ],
                correct: 1,
                explanation: "Tax is money citizens pay to fund public services like roads and schools!"
            },
            {
                id: 2,
                question: "What is income tax?",
                options: [
                    "Tax on the money you earn",
                    "Tax on things you buy",
                    "Tax on your house",
                    "Tax on your pets"
                ],
                correct: 0,
                explanation: "Income tax is calculated on the money you earn from work or investments!"
            },
            {
                id: 3,
                question: "What is GST?",
                options: [
                    "Great Savings Tax",
                    "Government Salary Tax",
                    "Goods and Services Tax",
                    "General Spending Target"
                ],
                correct: 2,
                explanation: "GST is applied when you buy goods or services in India!"
            },
            {
                id: 4,
                question: "Why do we pay taxes?",
                options: [
                    "To make the government rich",
                    "For public services and infrastructure",
                    "Because we have to",
                    "To reduce our savings"
                ],
                correct: 1,
                explanation: "Taxes fund hospitals, schools, roads, and other public services!"
            },
            {
                id: 5,
                question: "What is a tax deduction?",
                options: [
                    "Extra tax you pay",
                    "Amount subtracted from taxable income",
                    "A type of punishment",
                    "Money you donate"
                ],
                correct: 1,
                explanation: "Tax deductions reduce the amount of income that gets taxed!"
            }
        ]
    },
    'compound': {
        id: 'compound',
        title: 'Power of Compound',
        icon: 'trending-up',
        color: '#FF6B35',
        xpReward: 120,
        questions: [
            {
                id: 1,
                question: "What is compound interest?",
                options: [
                    "Interest only on your original amount",
                    "Interest on interest",
                    "No interest at all",
                    "A type of loan"
                ],
                correct: 1,
                explanation: "Compound interest means you earn interest on your interest too!"
            },
            {
                id: 2,
                question: "Who called compound interest the 8th wonder?",
                options: [
                    "Bill Gates",
                    "Elon Musk",
                    "Albert Einstein",
                    "Warren Buffett"
                ],
                correct: 2,
                explanation: "Einstein is often credited with calling it the 8th wonder of the world!"
            },
            {
                id: 3,
                question: "₹1000 at 10% for 2 years (compounded yearly) becomes?",
                options: [
                    "₹1100",
                    "₹1200",
                    "₹1210",
                    "₹1300"
                ],
                correct: 2,
                explanation: "Year 1: ₹1100, Year 2: ₹1100 + ₹110 = ₹1210. That's compound magic!"
            },
            {
                id: 4,
                question: "Starting early with compound interest is?",
                options: [
                    "Not important",
                    "Only for adults",
                    "Very beneficial",
                    "A waste of time"
                ],
                correct: 2,
                explanation: "Starting early gives your money more time to grow exponentially!"
            },
            {
                id: 5,
                question: "What's the Rule of 72?",
                options: [
                    "A game rule",
                    "Divide 72 by interest rate to find doubling time",
                    "Save ₹72 daily",
                    "A tax rule"
                ],
                correct: 1,
                explanation: "At 6% interest, 72÷6 = 12 years to double your money!"
            }
        ]
    },
    'crypto': {
        id: 'crypto',
        title: 'Crypto Fundamentals',
        icon: 'logo-bitcoin',
        color: '#F7931A',
        xpReward: 100,
        questions: [
            {
                id: 1,
                question: "What is cryptocurrency?",
                options: [
                    "Physical coins made of gold",
                    "Digital currency using cryptography",
                    "A type of bank account",
                    "Government-issued money"
                ],
                correct: 1,
                explanation: "Cryptocurrency is digital money secured by cryptography on a blockchain!"
            },
            {
                id: 2,
                question: "What is Bitcoin?",
                options: [
                    "The first cryptocurrency",
                    "A gaming currency",
                    "A stock market index",
                    "A bank in the US"
                ],
                correct: 0,
                explanation: "Bitcoin was created in 2009 as the first decentralized cryptocurrency!"
            },
            {
                id: 3,
                question: "What is a blockchain?",
                options: [
                    "A chain of computer servers",
                    "A distributed ledger technology",
                    "A type of video game",
                    "A social media platform"
                ],
                correct: 1,
                explanation: "Blockchain is a decentralized ledger that records all transactions!"
            },
            {
                id: 4,
                question: "What makes crypto investments risky?",
                options: [
                    "They are guaranteed to lose value",
                    "High volatility and price swings",
                    "The government controls them",
                    "They cannot be sold"
                ],
                correct: 1,
                explanation: "Crypto prices can change dramatically in short periods!"
            },
            {
                id: 5,
                question: "What is a crypto wallet?",
                options: [
                    "A physical wallet for coins",
                    "A bank account number",
                    "Software to store crypto keys",
                    "A credit card"
                ],
                correct: 2,
                explanation: "A crypto wallet stores your private keys to access your crypto!"
            }
        ]
    },
    'stocks': {
        id: 'stocks',
        title: 'Stock Market Basics',
        icon: 'stats-chart',
        color: '#4CAF50',
        xpReward: 90,
        questions: [
            {
                id: 1,
                question: "What is a stock?",
                options: [
                    "A loan to a company",
                    "Ownership share in a company",
                    "A type of savings account",
                    "A government bond"
                ],
                correct: 1,
                explanation: "When you buy stock, you own a small piece of that company!"
            },
            {
                id: 2,
                question: "What is a dividend?",
                options: [
                    "Tax on stock profits",
                    "Company profit shared with shareholders",
                    "A stock market fee",
                    "Government subsidy"
                ],
                correct: 1,
                explanation: "Dividends are portions of company profits paid to shareholders!"
            },
            {
                id: 3,
                question: "What does 'bull market' mean?",
                options: [
                    "Market is falling",
                    "Market is rising",
                    "Market is closed",
                    "Only bulls can invest"
                ],
                correct: 1,
                explanation: "A bull market means stock prices are generally rising!"
            },
            {
                id: 4,
                question: "Why diversify investments?",
                options: [
                    "To make investing more complex",
                    "To reduce risk across assets",
                    "To pay more fees",
                    "To focus on one stock"
                ],
                correct: 1,
                explanation: "Diversification spreads risk across many investments!"
            },
            {
                id: 5,
                question: "What is an IPO?",
                options: [
                    "Indian Portfolio Office",
                    "Initial Public Offering",
                    "International Price Order",
                    "Internal Profit Operations"
                ],
                correct: 1,
                explanation: "IPO is when a company first sells shares to the public market!"
            }
        ]
    },
    'insurance': {
        id: 'insurance',
        title: 'Insurance 101',
        icon: 'shield-checkmark',
        color: '#2196F3',
        xpReward: 70,
        questions: [
            {
                id: 1,
                question: "What is insurance?",
                options: [
                    "Free money from companies",
                    "Protection against financial loss",
                    "A type of investment",
                    "Government charity program"
                ],
                correct: 1,
                explanation: "Insurance protects you from major financial losses!"
            },
            {
                id: 2,
                question: "What is a premium?",
                options: [
                    "Extra coverage for free",
                    "Regular payment for insurance",
                    "Bonus from insurance company",
                    "Discount on coverage"
                ],
                correct: 1,
                explanation: "Premium is the amount you pay to keep your insurance active!"
            },
            {
                id: 3,
                question: "What is a deductible?",
                options: [
                    "Money you pay before insurance kicks in",
                    "Money the insurance pays you",
                    "Tax on insurance",
                    "Refund from insurance"
                ],
                correct: 0,
                explanation: "You pay the deductible first, then insurance covers the rest!"
            },
            {
                id: 4,
                question: "What is term life insurance?",
                options: [
                    "Insurance forever",
                    "Insurance for a specific period",
                    "Stock market investment",
                    "Real estate insurance"
                ],
                correct: 1,
                explanation: "Term life covers you for a set number of years (like 20 or 30)!"
            },
            {
                id: 5,
                question: "Why buy health insurance?",
                options: [
                    "It's mandatory everywhere",
                    "To afford medical emergencies",
                    "To get free medicine",
                    "To avoid going to doctors"
                ],
                correct: 1,
                explanation: "Health insurance helps pay for expensive medical treatments!"
            }
        ]
    },
    'credit': {
        id: 'credit',
        title: 'Credit Score Mastery',
        icon: 'card',
        color: '#9C27B0',
        xpReward: 110,
        questions: [
            {
                id: 1,
                question: "What is a credit score?",
                options: [
                    "Your bank balance",
                    "A number showing creditworthiness",
                    "Your total debt",
                    "Your annual income"
                ],
                correct: 1,
                explanation: "Credit scores help lenders decide if they should lend you money!"
            },
            {
                id: 2,
                question: "A good credit score in India is usually above?",
                options: [
                    "300",
                    "500",
                    "750",
                    "1000"
                ],
                correct: 2,
                explanation: "750+ is considered excellent in India's credit scoring system!"
            },
            {
                id: 3,
                question: "What hurts your credit score?",
                options: [
                    "Paying bills on time",
                    "Missing loan payments",
                    "Having a savings account",
                    "Checking your score"
                ],
                correct: 1,
                explanation: "Missing payments is one of the biggest credit score killers!"
            },
            {
                id: 4,
                question: "What is credit utilization?",
                options: [
                    "How much credit you've used vs available",
                    "Number of credit cards you own",
                    "Your credit card limit",
                    "Annual credit fee"
                ],
                correct: 0,
                explanation: "Keep credit utilization below 30% for a healthy score!"
            },
            {
                id: 5,
                question: "How often should you check your credit report?",
                options: [
                    "Never",
                    "Once every 10 years",
                    "At least once a year",
                    "Only when denied credit"
                ],
                correct: 2,
                explanation: "Check yearly to catch errors and monitor your financial health!"
            }
        ]
    },
    'retirement': {
        id: 'retirement',
        title: 'Retirement Planning',
        icon: 'wallet',
        color: '#E91E63',
        xpReward: 130,
        questions: [
            {
                id: 1,
                question: "When should you start saving for retirement?",
                options: [
                    "After 50 years old",
                    "As early as possible",
                    "Only after marriage",
                    "When you retire"
                ],
                correct: 1,
                explanation: "Starting early gives compound interest more time to work for you!"
            },
            {
                id: 2,
                question: "What is PPF in India?",
                options: [
                    "Private Pizza Fund",
                    "Public Provident Fund",
                    "Personal Pension Fee",
                    "Partial Payment Fund"
                ],
                correct: 1,
                explanation: "PPF is a government-backed savings scheme with tax benefits!"
            },
            {
                id: 3,
                question: "What is NPS?",
                options: [
                    "National Pension System",
                    "New Payment Service",
                    "North Pole Savings",
                    "None Payment Scheme"
                ],
                correct: 0,
                explanation: "NPS is a voluntary pension scheme for retirement savings!"
            },
            {
                id: 4,
                question: "What percentage of income should go to retirement?",
                options: [
                    "1-5%",
                    "10-15%",
                    "50-60%",
                    "Everything"
                ],
                correct: 1,
                explanation: "Financial experts recommend saving 10-15% for retirement!"
            },
            {
                id: 5,
                question: "What is the power of starting retirement savings at 25 vs 35?",
                options: [
                    "No difference",
                    "10 extra years of compound growth",
                    "You save less at 25",
                    "Banks give higher interest at 35"
                ],
                correct: 1,
                explanation: "Those 10 extra years can potentially double your retirement corpus!"
            }
        ]
    }
};

const TIMER_DURATION = 15; // seconds per question

// Circular Timer Component
const CircularTimer = ({ progress, color }: { progress: number, color: string }) => {
    const size = 60;
    const strokeWidth = 6;
    const radius = (size - strokeWidth) / 2;
    const circumference = 2 * Math.PI * radius;
    const strokeDashoffset = circumference * (1 - progress);

    return (
        <View style={styles.timerContainer}>
            <Svg width={size} height={size}>
                <Circle
                    cx={size / 2}
                    cy={size / 2}
                    r={radius}
                    stroke="#E5E5E5"
                    strokeWidth={strokeWidth}
                    fill="none"
                />
                <Circle
                    cx={size / 2}
                    cy={size / 2}
                    r={radius}
                    stroke={color}
                    strokeWidth={strokeWidth}
                    fill="none"
                    strokeLinecap="round"
                    strokeDasharray={circumference}
                    strokeDashoffset={strokeDashoffset}
                    transform={`rotate(-90, ${size / 2}, ${size / 2})`}
                />
            </Svg>
            <Text style={[styles.timerText, { color }]}>
                {Math.ceil(progress * TIMER_DURATION)}
            </Text>
        </View>
    );
};

export default function QuizScreen() {
    const router = useRouter();
    const params = useLocalSearchParams();
    const { gameState, updatePlayerMoney } = useGame();
    const { player } = gameState;

    const quizId = (params.id as string) || 'budgeting';
    const quiz = QUIZZES[quizId as keyof typeof QUIZZES] || QUIZZES.budgeting;

    const [currentQuestion, setCurrentQuestion] = useState(0);
    const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
    const [showResult, setShowResult] = useState(false);
    const [score, setScore] = useState(0);
    const [answers, setAnswers] = useState<(number | null)[]>([]);
    const [timeLeft, setTimeLeft] = useState(TIMER_DURATION);
    const [quizComplete, setQuizComplete] = useState(false);
    const [showExplanation, setShowExplanation] = useState(false);

    const confettiRef = useRef<LottieView>(null);
    const shake = useSharedValue(0);

    const question = quiz.questions[currentQuestion];
    const totalQuestions = quiz.questions.length;
    const progress = (currentQuestion + 1) / totalQuestions;
    const timerProgress = timeLeft / TIMER_DURATION;

    // Timer effect
    useEffect(() => {
        if (quizComplete || showExplanation) return;

        const timer = setInterval(() => {
            setTimeLeft(prev => {
                if (prev <= 1) {
                    // Time's up - auto submit null answer
                    handleTimeUp();
                    return TIMER_DURATION;
                }
                return prev - 1;
            });
        }, 1000);

        return () => clearInterval(timer);
    }, [currentQuestion, quizComplete, showExplanation]);

    const handleTimeUp = () => {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
        setAnswers(prev => [...prev, null]);

        // Shake animation
        shake.value = withSequence(
            withTiming(10, { duration: 50 }),
            withTiming(-10, { duration: 50 }),
            withTiming(10, { duration: 50 }),
            withTiming(0, { duration: 50 })
        );

        moveToNext();
    };

    const handleAnswer = (index: number) => {
        if (selectedAnswer !== null) return;

        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
        setSelectedAnswer(index);
        setShowExplanation(true);

        const isCorrect = index === question.correct;
        if (isCorrect) {
            setScore(prev => prev + 1);
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        } else {
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
        }

        setAnswers(prev => [...prev, index]);
    };

    const moveToNext = () => {
        if (currentQuestion < totalQuestions - 1) {
            setCurrentQuestion(prev => prev + 1);
            setSelectedAnswer(null);
            setShowExplanation(false);
            setTimeLeft(TIMER_DURATION);
        } else {
            // Quiz complete
            setQuizComplete(true);
            confettiRef.current?.play();
        }
    };

    const handleContinue = () => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        moveToNext();
    };

    const handleFinish = () => {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        // Award XP based on score
        const earnedXP = Math.round((score / totalQuestions) * quiz.xpReward);
        updatePlayerMoney(earnedXP * 0.1, 'earn', `Quiz: ${quiz.title}`);

        // Use setTimeout to ensure navigation happens after state updates
        setTimeout(() => {
            try {
                router.push('/(tabs)/quests');
            } catch (error) {
                console.error('Navigation error:', error);
                // Fallback: try going back
                router.back();
            }
        }, 100);
    };

    const shakeStyle = useAnimatedStyle(() => ({
        transform: [{ translateX: shake.value }]
    }));

    const getResultMessage = () => {
        const percentage = (score / totalQuestions) * 100;
        if (percentage === 100) return { icon: 'trophy', text: 'PERFECT SCORE!', color: '#FFD700' };
        if (percentage >= 80) return { icon: 'star', text: 'EXCELLENT!', color: '#58CC02' };
        if (percentage >= 60) return { icon: 'thumbs-up', text: 'GOOD JOB!', color: '#1CB0F6' };
        if (percentage >= 40) return { icon: 'book', text: 'KEEP LEARNING!', color: '#FF9600' };
        return { icon: 'barbell', text: 'TRY AGAIN!', color: '#FF4B4B' };
    };

    // Quiz Complete Screen
    if (quizComplete) {
        const result = getResultMessage();
        const earnedXP = Math.round((score / totalQuestions) * quiz.xpReward);
        const percentage = (score / totalQuestions) * 100;
        const showConfetti = percentage >= 80; // Show confetti for 80%+ scores

        return (
            <View style={styles.container}>
                <StatusBar style="dark" />

                {/* Confetti Animation - only for high scores */}
                {showConfetti && (
                    <LottieView
                        ref={confettiRef}
                        source={require('@/assets/animations/confetti.json')}
                        style={styles.confetti}
                        autoPlay
                        loop={false}
                    />
                )}

                <SafeAreaView style={styles.safeArea}>
                    <Animated.View
                        style={styles.resultContainer}
                        entering={FadeInUp.delay(200).duration(500)}
                    >
                        {/* Result Icon */}
                        <View style={[styles.resultIconCircle, { backgroundColor: result.color + '20' }]}>
                            <Ionicons name={result.icon as any} size={60} color={result.color} />
                        </View>

                        <Text style={[styles.resultTitle, { color: result.color }]}>{result.text}</Text>

                        {/* Score Card - Redesigned */}
                        <View style={styles.scoreCardNew}>
                            <View style={styles.scoreCircle}>
                                <Text style={styles.scorePercentage}>{Math.round(percentage)}%</Text>
                                <Text style={styles.scoreSubtext}>{score}/{totalQuestions} correct</Text>
                            </View>
                        </View>

                        {/* XP Earned Card */}
                        <LinearGradient
                            colors={['#FFB800', '#FF9600']}
                            style={styles.xpCardNew}
                            start={{ x: 0, y: 0 }}
                            end={{ x: 1, y: 0 }}
                        >
                            <View style={styles.xpIconBox}>
                                <Ionicons name="star" size={28} color="#FFB800" />
                            </View>
                            <View style={styles.xpTextBox}>
                                <Text style={styles.xpLabelNew}>XP EARNED</Text>
                                <Text style={styles.xpValueNew}>+{earnedXP} XP</Text>
                            </View>
                        </LinearGradient>

                        {/* Question Review */}
                        <Text style={styles.reviewTitle}>Question Review</Text>
                        <View style={styles.reviewGrid}>
                            {quiz.questions.map((q, idx) => {
                                const userAnswer = answers[idx];
                                const isCorrect = userAnswer === q.correct;
                                const bgColor = userAnswer === null ? '#AFAFAF' : isCorrect ? '#58CC02' : '#FF4B4B';
                                const icon = userAnswer === null ? 'time-outline' : isCorrect ? 'checkmark' : 'close';

                                return (
                                    <View
                                        key={idx}
                                        style={[styles.reviewDot, { backgroundColor: bgColor }]}
                                    >
                                        <Ionicons name={icon as any} size={18} color="white" />
                                    </View>
                                );
                            })}
                        </View>

                        {/* Action Buttons */}
                        <View style={styles.resultActions}>
                            <Pressable
                                style={({ pressed }) => [
                                    styles.retryBtn,
                                    { transform: [{ scale: pressed ? 0.96 : 1 }] }
                                ]}
                                onPress={() => {
                                    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
                                    // Reset quiz
                                    setCurrentQuestion(0);
                                    setSelectedAnswer(null);
                                    setShowResult(false);
                                    setScore(0);
                                    setAnswers([]);
                                    setTimeLeft(TIMER_DURATION);
                                    setQuizComplete(false);
                                    setShowExplanation(false);
                                }}
                            >
                                <Ionicons name="refresh" size={22} color="#1CB0F6" />
                                <Text style={styles.retryBtnText}>Try Again</Text>
                            </Pressable>

                            <Pressable
                                style={({ pressed }) => [
                                    styles.finishBtn,
                                    { transform: [{ scale: pressed ? 0.96 : 1 }] }
                                ]}
                                onPress={handleFinish}
                            >
                                <Text style={styles.finishBtnText}>Done</Text>
                                <Ionicons name="checkmark-circle" size={22} color="white" />
                            </Pressable>
                        </View>
                    </Animated.View>
                </SafeAreaView>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <StatusBar style="dark" />
            <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>

                {/* Header */}
                <View style={styles.header}>
                    <Pressable
                        style={({ pressed }) => [styles.closeBtn, { opacity: pressed ? 0.6 : 1 }]}
                        onPress={() => {
                            Alert.alert(
                                'Quit Quiz?',
                                'Your progress will be lost.',
                                [
                                    { text: 'Cancel', style: 'cancel' },
                                    { text: 'Quit', style: 'destructive', onPress: () => router.back() }
                                ]
                            );
                        }}
                    >
                        <Ionicons name="close" size={28} color="#1F1F1F" />
                    </Pressable>

                    <View style={styles.progressBarContainer}>
                        <View style={styles.progressBar}>
                            <Animated.View
                                style={[
                                    styles.progressFill,
                                    { width: `${progress * 100}%`, backgroundColor: quiz.color }
                                ]}
                            />
                        </View>
                        <View style={styles.progressBadgeRow}>
                            <View style={[styles.miniBadge, { backgroundColor: quiz.color + '20' }]}>
                                <Text style={[styles.miniBadgeText, { color: quiz.color }]}>{currentQuestion + 1}/{totalQuestions}</Text>
                                <Ionicons name={quiz.icon as any} size={12} color={quiz.color} />
                            </View>
                        </View>
                    </View>

                    <CircularTimer progress={timerProgress} color={timeLeft <= 5 ? '#FF4B4B' : quiz.color} />
                </View>

                {/* Question Card */}
                <Animated.View
                    style={[styles.questionContainer, shakeStyle]}
                    key={currentQuestion}
                    entering={SlideInRight.duration(300)}
                >
                    <View style={[styles.questionIconBox, { backgroundColor: quiz.color + '30' }]}>
                        <Ionicons name={quiz.icon as any} size={32} color={quiz.color.replace('66', '')} />
                    </View>

                    <Text style={styles.questionText}>{question.question}</Text>

                    {/* Options */}
                    <View style={styles.optionsContainer}>
                        {question.options.map((option, idx) => {
                            const isSelected = selectedAnswer === idx;
                            const isCorrect = idx === question.correct;
                            const showFeedback = showExplanation;

                            let bgColor = 'white';
                            let borderColor = '#E5E5E5';
                            let textColor = '#1F1F1F';

                            if (showFeedback) {
                                if (isCorrect) {
                                    bgColor = '#E8F5E9';
                                    borderColor = '#58CC02';
                                    textColor = '#46A302';
                                } else if (isSelected && !isCorrect) {
                                    bgColor = '#FFEBEE';
                                    borderColor = '#FF4B4B';
                                    textColor = '#D33131';
                                }
                            } else if (isSelected) {
                                borderColor = quiz.color;
                            }

                            return (
                                <Pressable
                                    key={idx}
                                    style={[
                                        styles.optionBtn,
                                        { backgroundColor: bgColor, borderColor }
                                    ]}
                                    onPress={() => handleAnswer(idx)}
                                    disabled={showExplanation}
                                >
                                    <View style={[
                                        styles.optionLetter,
                                        showFeedback && isCorrect && { backgroundColor: '#58CC02' },
                                        showFeedback && isSelected && !isCorrect && { backgroundColor: '#FF4B4B' }
                                    ]}>
                                        <Text style={[
                                            styles.optionLetterText,
                                            (showFeedback && (isCorrect || isSelected)) && { color: 'white' }
                                        ]}>
                                            {String.fromCharCode(65 + idx)}
                                        </Text>
                                    </View>
                                    <Text style={[styles.optionText, { color: textColor }]}>{option}</Text>
                                    {showFeedback && isCorrect && (
                                        <Ionicons name="checkmark-circle" size={24} color="#58CC02" />
                                    )}
                                    {showFeedback && isSelected && !isCorrect && (
                                        <Ionicons name="close-circle" size={24} color="#FF4B4B" />
                                    )}
                                </Pressable>
                            );
                        })}
                    </View>

                    {/* Explanation */}
                    {showExplanation && (
                        <Animated.View
                            entering={FadeIn.duration(300)}
                            style={styles.explanationCard}
                        >
                            <Ionicons name="bulb" size={20} color="#F59E0B" />
                            <Text style={styles.explanationText}>{question.explanation}</Text>
                        </Animated.View>
                    )}
                </Animated.View>

                {/* Continue Button */}
                {showExplanation && (
                    <Animated.View
                        entering={FadeInUp.duration(300)}
                        style={styles.continueContainer}
                    >
                        <Pressable
                            style={({ pressed }) => [
                                styles.continueBtn,
                                { backgroundColor: quiz.color, transform: [{ scale: pressed ? 0.96 : 1 }] }
                            ]}
                            onPress={handleContinue}
                        >
                            <Text style={styles.continueBtnText}>
                                {currentQuestion < totalQuestions - 1 ? 'Continue' : 'See Results'}
                            </Text>
                            <Ionicons name="arrow-forward" size={24} color="#1F1F1F" />
                        </Pressable>
                    </Animated.View>
                )}

            </SafeAreaView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F8FBFF',
    },
    safeArea: {
        flex: 1,
    },
    confetti: {
        position: 'absolute',
        width: width,
        height: height,
        zIndex: 10,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingVertical: 16,
        gap: 16,
    },
    closeBtn: {
        width: 44,
        height: 44,
        borderRadius: 22,
        backgroundColor: 'white',
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 4,
        elevation: 2,
    },
    progressBarContainer: {
        flex: 1,
        gap: 4,
    },
    progressBar: {
        height: 12,
        backgroundColor: '#E5E5E5',
        borderRadius: 6,
        overflow: 'hidden',
    },
    progressFill: {
        height: '100%',
        borderRadius: 6,
    },
    progressText: {
        fontSize: 12,
        fontWeight: '700',
        color: '#8B8B8B',
        textAlign: 'center',
    },
    timerContainer: {
        alignItems: 'center',
        justifyContent: 'center',
    },
    timerText: {
        position: 'absolute',
        fontSize: 18,
        fontWeight: '900',
    },
    questionContainer: {
        flex: 1,
        paddingHorizontal: 20,
    },
    questionIconBox: {
        width: 64,
        height: 64,
        borderRadius: 22,
        alignItems: 'center',
        justifyContent: 'center',
        alignSelf: 'center',
        marginBottom: 24,
    },
    questionText: {
        fontSize: 24,
        fontWeight: '900',
        color: '#1F1F1F',
        textAlign: 'center',
        marginBottom: 32,
        lineHeight: 32,
    },
    optionsContainer: {
        gap: 12,
    },
    optionBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 16,
        borderRadius: 20,
        borderWidth: 3,
        gap: 14,
    },
    optionLetter: {
        width: 36,
        height: 36,
        borderRadius: 18,
        backgroundColor: '#F0F0F0',
        alignItems: 'center',
        justifyContent: 'center',
    },
    optionLetterText: {
        fontSize: 16,
        fontWeight: '900',
        color: '#8B8B8B',
    },
    optionText: {
        flex: 1,
        fontSize: 16,
        fontWeight: '700',
    },
    explanationCard: {
        flexDirection: 'row',
        backgroundColor: '#FFF9E6',
        padding: 16,
        borderRadius: 16,
        marginTop: 24,
        gap: 12,
        borderWidth: 2,
        borderColor: '#FFE0A3',
    },
    explanationText: {
        flex: 1,
        fontSize: 14,
        fontWeight: '600',
        color: '#8B6914',
        lineHeight: 20,
    },
    continueContainer: {
        paddingHorizontal: 20,
        paddingBottom: 30,
    },
    continueBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 18,
        borderRadius: 20,
        gap: 10,
        borderBottomWidth: 4,
        borderColor: 'rgba(0,0,0,0.15)',
    },
    continueBtnText: {
        fontSize: 18,
        fontWeight: '900',
        color: '#1F1F1F',
    },
    // Results screen
    resultContainer: {
        flex: 1,
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingTop: 40,
    },
    resultEmoji: {
        fontSize: 80,
        marginBottom: 16,
    },
    resultTitle: {
        fontSize: 32,
        fontWeight: '900',
        marginBottom: 32,
    },
    scoreCard: {
        width: '100%',
        padding: 24,
        borderRadius: 28,
        marginBottom: 20,
    },
    scoreRow: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center',
    },
    scoreItem: {
        alignItems: 'center',
    },
    scoreLabel: {
        fontSize: 14,
        fontWeight: '700',
        color: '#8B8B8B',
        marginBottom: 4,
    },
    scoreValue: {
        fontSize: 32,
        fontWeight: '900',
        color: '#1F1F1F',
    },
    progressBadgeRow: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginTop: 8,
    },
    miniBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 12,
        gap: 6,
    },
    miniBadgeText: {
        fontSize: 12,
        fontWeight: '900',
    },
    scoreDivider: {
        width: 2,
        height: 50,
        backgroundColor: '#F0F0F0',
    },
    xpCard: {
        flexDirection: 'row',
        alignItems: 'center',
        width: '100%',
        padding: 20,
        borderRadius: 24,
        marginBottom: 32,
        gap: 16,
    },
    xpLabel: {
        fontSize: 12,
        fontWeight: '900',
        color: 'rgba(255,255,255,0.8)',
        letterSpacing: 1,
    },
    xpValue: {
        fontSize: 28,
        fontWeight: '900',
        color: 'white',
    },
    reviewTitle: {
        fontSize: 18,
        fontWeight: '900',
        color: '#1F1F1F',
        marginBottom: 16,
    },
    reviewGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'center',
        gap: 12,
        marginBottom: 32,
    },
    reviewDot: {
        width: 44,
        height: 44,
        borderRadius: 22,
        alignItems: 'center',
        justifyContent: 'center',
    },
    reviewDotText: {
        fontSize: 16,
        fontWeight: '900',
        color: 'white',
    },
    finishBtn: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#58CC02',
        paddingVertical: 16,
        borderRadius: 20,
        gap: 8,
        borderBottomWidth: 4,
        borderColor: '#46A302',
    },
    finishBtnText: {
        fontSize: 16,
        fontWeight: '900',
        color: 'white',
    },
    // New result screen styles
    resultIconCircle: {
        width: 100,
        height: 100,
        borderRadius: 50,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 16,
    },
    scoreCardNew: {
        width: '100%',
        backgroundColor: 'white',
        borderRadius: 24,
        padding: 24,
        marginBottom: 16,
        alignItems: 'center',
        borderWidth: 2,
        borderColor: '#F0F0F0',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.08,
        shadowRadius: 12,
        elevation: 4,
    },
    scoreCircle: {
        alignItems: 'center',
    },
    scorePercentage: {
        fontSize: 48,
        fontWeight: '900',
        color: '#1F1F1F',
    },
    scoreSubtext: {
        fontSize: 16,
        fontWeight: '700',
        color: '#8B8B8B',
        marginTop: 4,
    },
    xpCardNew: {
        flexDirection: 'row',
        alignItems: 'center',
        width: '100%',
        padding: 16,
        borderRadius: 20,
        marginBottom: 24,
        gap: 14,
    },
    xpIconBox: {
        width: 48,
        height: 48,
        borderRadius: 24,
        backgroundColor: 'white',
        alignItems: 'center',
        justifyContent: 'center',
    },
    xpTextBox: {
        flex: 1,
    },
    xpLabelNew: {
        fontSize: 11,
        fontWeight: '800',
        color: 'rgba(255,255,255,0.8)',
        letterSpacing: 1,
    },
    xpValueNew: {
        fontSize: 24,
        fontWeight: '900',
        color: 'white',
    },
    resultActions: {
        flexDirection: 'row',
        width: '100%',
        gap: 12,
        marginTop: 'auto',
        paddingBottom: 20,
    },
    retryBtn: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#E6F4FF',
        paddingVertical: 16,
        borderRadius: 20,
        gap: 8,
        borderWidth: 2,
        borderColor: '#1CB0F6',
    },
    retryBtnText: {
        fontSize: 16,
        fontWeight: '900',
        color: '#1CB0F6',
    },
});

