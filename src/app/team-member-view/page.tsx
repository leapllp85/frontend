'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
    Box,
    VStack,
    HStack,
    Text,
    Heading,
    Card,
    SimpleGrid,
    Spinner,
    Badge,
    Button,
    Input,
    Flex,
    IconButton
} from '@chakra-ui/react';
import { LoadingScreen } from '@/components/common/LoadingScreen';
import { DailyCheckInModal } from '@/components/common/DailyCheckInModal';
import { TrendModal } from '@/components/common/TrendModal';
import { 
    FolderKanban, 
    Bell, 
    BarChart3, 
    MessageSquare,
    Send,
    AlertCircle,
    CheckCircle,
    Clock,
    TrendingUp,
    FileText,
    Package,
    Calendar,
    HelpCircle,
    User,
    Award,
    Code,
    Bookmark as BookmarkIcon,
    BookmarkCheck as BookmarkCheckIcon,
    MapPin as MapPinIcon,
    X as XIcon,
    Sparkles as SparklesIcon,
    Gift,
    ClipboardList,
    ArrowRight,
    LogOut,
    MessageCircle,
    BookOpen,
    Heart,
    Users,
    AlertTriangle,
    Target,
    Zap
} from 'lucide-react';
import { Line, Pie, Scatter } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    ArcElement,
    Title,
    Tooltip,
    Legend,
    Filler
} from 'chart.js';

// Register ChartJS components
ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    ArcElement,
    Title,
    Tooltip,
    Legend,
    Filler
);

interface Project {
    id: string;
    name: string;
    status: 'active' | 'pending' | 'completed';
    progress: number;
    deadline: string;
    priority: 'high' | 'medium' | 'low';
    allocation: number; // Percentage of time allocated to this project
}

interface Notification {
    id: string;
    title: string;
    message: string;
    type: 'info' | 'warning' | 'success';
    timestamp: string;
    read: boolean;
}

interface ChatMessage {
    id: string;
    sender: 'user' | 'system';
    message: string;
    timestamp: string;
}

interface Testimony {
    id: string;
    author: string;
    role: string;
    message: string;
    date: string;
}

interface Skill {
    id: string;
    name: string;
    level: number; // 1-5 rating
    category: 'frontend' | 'backend' | 'database' | 'tools' | 'other';
}

interface CalendarEvent {
    id: string;
    title: string;
    description: string;
    date: string;
    time: string;
    location: string;
    category: 'csr' | 'yoga' | 'wellness';
    spots: number;
    spotsAvailable: number;
    isBookmarked: boolean;
    isRegistered: boolean;
    recommended?: boolean;
    image: string;
}

export default function TeamMemberView() {
    console.log('🚀 TeamMemberView component loaded');
    
    const router = useRouter();
    const [loading, setLoading] = useState(true);
    const [showLoadingScreen, setShowLoadingScreen] = useState(true);
    const [isCalendarOpen, setIsCalendarOpen] = useState(false);
    const [isHelpModalOpen, setIsHelpModalOpen] = useState(false);
    const [isConcernModalOpen, setIsConcernModalOpen] = useState(false);
    const [concernText, setConcernText] = useState('');
    const [isSkillAnalysisOpen, setIsSkillAnalysisOpen] = useState(false);
    const [activeTab, setActiveTab] = useState<'overview' | 'recommendations' | 'market' | 'learning' | 'wellness'>('overview');
    const [skillModalTab, setSkillModalTab] = useState<'skills' | 'wellness'>('skills');
    const [bookmarkedSkills, setBookmarkedSkills] = useState<string[]>([]);
    const [isExpertChatOpen, setIsExpertChatOpen] = useState(false);
    const [isAnonymous, setIsAnonymous] = useState(false);
    const [isConnecting, setIsConnecting] = useState(false);
    const [showWelcome, setShowWelcome] = useState(false);
    const [isSurveyModalOpen, setIsSurveyModalOpen] = useState(false);
    const [isContentModalOpen, setIsContentModalOpen] = useState(false);
    const [projects, setProjects] = useState<Project[]>([]);
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
    const [newMessage, setNewMessage] = useState('');
    const [testimonies, setTestimonies] = useState<Testimony[]>([]);
    const [skills, setSkills] = useState<Skill[]>([]);
    const [events, setEvents] = useState<CalendarEvent[]>([]);
    const [selectedCategory, setSelectedCategory] = useState<'all' | 'csr' | 'yoga' | 'wellness'>('all');
    const [showDailyCheckIn, setShowDailyCheckIn] = useState(false);
    const [showTrendModal, setShowTrendModal] = useState(false);
    
    console.log('📊 State initialized, showDailyCheckIn:', showDailyCheckIn);
    
    // User profile data
    const userProfile = {
        name: 'John Doe',
        designation: 'Senior Software Engineer',
        avatar: 'https://i.pravatar.cc/150?img=12' // Sample avatar image
    };

    // Request notification permission on mount
    useEffect(() => {
        console.log('Notification support:', 'Notification' in window);
        console.log('Current permission:', Notification?.permission);
        
        if ('Notification' in window) {
            if (Notification.permission === 'default') {
                console.log('Requesting notification permission...');
                Notification.requestPermission().then(permission => {
                    console.log('Notification permission result:', permission);
                });
            }
        }
    }, []);

    // Function to send browser notification
    const sendNotification = async () => {
        console.log('=== NOTIFICATION DEBUG START ===');
        console.log('1. Notification available:', 'Notification' in window);
        
        if (!('Notification' in window)) {
            console.error('Notifications not supported in this browser');
            alert('Your browser does not support notifications');
            return;
        }
        
        console.log('2. Current permission:', Notification.permission);
        
        // Request permission if needed
        if (Notification.permission === 'default') {
            console.log('3. Requesting permission...');
            const permission = await Notification.requestPermission();
            console.log('4. Permission result:', permission);
            
            if (permission !== 'granted') {
                console.error('Permission denied by user');
                alert('Please allow notifications to receive check-in reminders');
                return;
            }
        }
        
        if (Notification.permission === 'denied') {
            console.error('Notifications are blocked. Please enable them in browser settings.');
            alert('Notifications are blocked. Please enable them in your browser settings:\nChrome: Settings → Privacy → Site Settings → Notifications');
            return;
        }
        
        if (Notification.permission === 'granted') {
            console.log('5. Permission granted, creating notification...');
            try {
                // Enhanced notification with attention-grabbing text
                const notification = new Notification('🔔 DAILY CHECK-IN REQUIRED!', {
                    body: '⚡ Action Needed: Share how you\'re feeling today!\n\n👆 Click here to complete your check-in now!',
                    requireInteraction: true,
                    tag: 'daily-checkin',
                    silent: false
                });

                notification.onclick = () => {
                    console.log('6. Notification clicked - opening check-in popup');
                    notification.close();
                    
                    // Open check-in modal in a popup window
                    const popupWidth = 750;
                    const popupHeight = 700;
                    const left = (screen.width - popupWidth) / 2;
                    const top = (screen.height - popupHeight) / 2;
                    
                    const popup = window.open(
                        '/team-member-view/checkin',
                        'DailyCheckIn',
                        `width=${popupWidth},height=${popupHeight},left=${left},top=${top},frame=no,titlebar=no,resizable=no,scrollbars=no,status=no,toolbar=no,menubar=no,location=no,chrome=no`
                    );
                    
                    if (popup) {
                        popup.focus();
                    } else {
                        // Fallback: if popup blocked, show modal in current window
                        window.focus();
                        setShowDailyCheckIn(true);
                    }
                };
                
                notification.onerror = (error) => {
                    console.error('7. Notification error:', error);
                };
                
                console.log('8. Notification created successfully:', notification);
                console.log('=== NOTIFICATION DEBUG END ===');
            } catch (error) {
                console.error('9. Error creating notification:', error);
                alert('Error creating notification: ' + error);
            }
        }
    };

    // Check for pending check-in when page becomes visible
    useEffect(() => {
        const handleVisibilityChange = () => {
            if (!document.hidden) {
                const lastCheckIn = localStorage.getItem('lastDailyCheckIn');
                const today = new Date().toDateString();
                
                if (lastCheckIn !== today && !showDailyCheckIn) {
                    setShowDailyCheckIn(true);
                    sendNotification();
                }
            }
        };

        document.addEventListener('visibilitychange', handleVisibilityChange);
        
        return () => {
            document.removeEventListener('visibilitychange', handleVisibilityChange);
        };
    }, [showDailyCheckIn]);

    // Periodic check for daily check-in (every 5 minutes when tab is active)
    useEffect(() => {
        const checkInterval = setInterval(() => {
            const lastCheckIn = localStorage.getItem('lastDailyCheckIn');
            const today = new Date().toDateString();
            
            if (lastCheckIn !== today && !showDailyCheckIn) {
                setShowDailyCheckIn(true);
                sendNotification();
            }
        }, 5 * 60 * 1000); // Check every 5 minutes

        return () => clearInterval(checkInterval);
    }, [showDailyCheckIn]);

    // Check if daily check-in has been completed today
    useEffect(() => {
        const lastCheckIn = localStorage.getItem('lastDailyCheckIn');
        const today = new Date().toDateString();
        
        console.log('Check-in status:', { lastCheckIn, today, loading, match: lastCheckIn === today });
        
        if (lastCheckIn !== today && !loading) {
            console.log('Showing daily check-in modal...');
            // Show modal after a short delay for better UX
            setTimeout(() => {
                setShowDailyCheckIn(true);
                console.log('Modal state set to true');
                // Send browser notification
                sendNotification();
                
                // Show on-screen alert
                if (typeof window !== 'undefined') {
                    // Create custom on-screen notification
                    const alertDiv = document.createElement('div');
                    alertDiv.id = 'daily-checkin-alert';
                    alertDiv.style.cssText = `
                        position: fixed;
                        top: 20px;
                        right: 20px;
                        background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%);
                        color: white;
                        padding: 24px 28px;
                        border-radius: 20px;
                        box-shadow: 0 20px 60px rgba(99, 102, 241, 0.6), 0 0 0 1px rgba(255,255,255,0.2);
                        z-index: 10000;
                        max-width: 380px;
                        animation: slideInBounce 0.8s cubic-bezier(0.68, -0.55, 0.265, 1.55), pulse 2s ease-in-out 0.8s infinite;
                        font-family: system-ui, -apple-system, sans-serif;
                        backdrop-filter: blur(10px);
                        border: 2px solid rgba(255,255,255,0.3);
                        cursor: pointer;
                        transition: transform 0.3s ease;
                    `;
                    
                    alertDiv.onmouseenter = () => {
                        alertDiv.style.transform = 'scale(1.05) translateY(-5px)';
                        alertDiv.style.boxShadow = '0 25px 70px rgba(99, 102, 241, 0.8), 0 0 0 1px rgba(255,255,255,0.3)';
                    };
                    
                    alertDiv.onmouseleave = () => {
                        alertDiv.style.transform = 'scale(1) translateY(0)';
                        alertDiv.style.boxShadow = '0 20px 60px rgba(99, 102, 241, 0.6), 0 0 0 1px rgba(255,255,255,0.2)';
                    };
                    
                    alertDiv.innerHTML = `
                        <div style="display: flex; align-items: start; gap: 16px;">
                            <div style="
                                font-size: 40px;
                                animation: bounce 1s ease-in-out infinite;
                                filter: drop-shadow(0 4px 8px rgba(0,0,0,0.3));
                            ">📋</div>
                            <div style="flex: 1;">
                                <div style="
                                    font-weight: bold;
                                    font-size: 18px;
                                    margin-bottom: 6px;
                                    text-shadow: 0 2px 4px rgba(0,0,0,0.2);
                                    animation: glow 2s ease-in-out infinite;
                                ">
                                    Daily Check-In Required ✨
                                </div>
                                <div style="
                                    font-size: 14px;
                                    opacity: 0.95;
                                    line-height: 1.5;
                                ">
                                    Please share how you're feeling today
                                </div>
                                <div style="
                                    margin-top: 12px;
                                    padding: 8px 12px;
                                    background: rgba(255,255,255,0.2);
                                    border-radius: 8px;
                                    font-size: 12px;
                                    font-weight: 600;
                                    text-align: center;
                                    animation: shimmer 2s ease-in-out infinite;
                                ">
                                    👆 Click to complete
                                </div>
                            </div>
                            <button id="close-alert" style="
                                background: rgba(255,255,255,0.25);
                                border: none;
                                color: white;
                                width: 28px;
                                height: 28px;
                                border-radius: 50%;
                                cursor: pointer;
                                font-size: 18px;
                                display: flex;
                                align-items: center;
                                justify-content: center;
                                transition: all 0.3s ease;
                                font-weight: bold;
                            " onmouseover="this.style.background='rgba(255,255,255,0.4)'; this.style.transform='rotate(90deg) scale(1.1)'" onmouseout="this.style.background='rgba(255,255,255,0.25)'; this.style.transform='rotate(0deg) scale(1)'">×</button>
                        </div>
                    `;
                    
                    // Add animation keyframes
                    if (!document.getElementById('alert-animations')) {
                        const style = document.createElement('style');
                        style.id = 'alert-animations';
                        style.textContent = `
                            @keyframes slideInBounce {
                                0% {
                                    transform: translateX(500px) scale(0.5);
                                    opacity: 0;
                                }
                                60% {
                                    transform: translateX(-20px) scale(1.05);
                                    opacity: 1;
                                }
                                80% {
                                    transform: translateX(10px) scale(0.98);
                                }
                                100% {
                                    transform: translateX(0) scale(1);
                                    opacity: 1;
                                }
                            }
                            @keyframes slideOutRight {
                                0% {
                                    transform: translateX(0) scale(1);
                                    opacity: 1;
                                }
                                100% {
                                    transform: translateX(500px) scale(0.8);
                                    opacity: 0;
                                }
                            }
                            @keyframes pulse {
                                0%, 100% {
                                    box-shadow: 0 20px 60px rgba(99, 102, 241, 0.6), 0 0 0 1px rgba(255,255,255,0.2);
                                }
                                50% {
                                    box-shadow: 0 25px 70px rgba(99, 102, 241, 0.8), 0 0 0 2px rgba(255,255,255,0.4), 0 0 30px rgba(99, 102, 241, 0.6);
                                }
                            }
                            @keyframes bounce {
                                0%, 100% {
                                    transform: translateY(0) rotate(0deg);
                                }
                                25% {
                                    transform: translateY(-10px) rotate(-5deg);
                                }
                                75% {
                                    transform: translateY(-5px) rotate(5deg);
                                }
                            }
                            @keyframes glow {
                                0%, 100% {
                                    text-shadow: 0 2px 4px rgba(0,0,0,0.2);
                                }
                                50% {
                                    text-shadow: 0 2px 4px rgba(0,0,0,0.2), 0 0 20px rgba(255,255,255,0.5);
                                }
                            }
                            @keyframes shimmer {
                                0% {
                                    background: rgba(255,255,255,0.2);
                                    transform: scale(1);
                                }
                                50% {
                                    background: rgba(255,255,255,0.35);
                                    transform: scale(1.02);
                                }
                                100% {
                                    background: rgba(255,255,255,0.2);
                                    transform: scale(1);
                                }
                            }
                        `;
                        document.head.appendChild(style);
                    }
                    
                    document.body.appendChild(alertDiv);
                    
                    // Close button handler
                    const closeBtn = document.getElementById('close-alert');
                    if (closeBtn) {
                        closeBtn.onclick = () => {
                            alertDiv.style.animation = 'slideOutRight 0.3s ease-in';
                            setTimeout(() => alertDiv.remove(), 300);
                        };
                    }
                    
                    // Auto-remove after 10 seconds
                    setTimeout(() => {
                        if (alertDiv && alertDiv.parentNode) {
                            alertDiv.style.animation = 'slideOutRight 0.3s ease-in';
                            setTimeout(() => alertDiv.remove(), 300);
                        }
                    }, 10000);
                }
            }, 1000);
        }
    }, [loading]);

    const handleCheckInComplete = (data: { energy: string; workload: string }) => {
        console.log('Daily check-in completed:', data);
        
        // Get historical data
        const historyStr = localStorage.getItem('checkInHistory');
        const history = historyStr ? JSON.parse(historyStr) : [];
        
        // Add today's data
        const today = {
            date: new Date().toISOString().split('T')[0],
            energy: data.energy,
            workload: data.workload,
            timestamp: new Date().toISOString()
        };
        
        history.push(today);
        
        // Keep only last 30 days
        const last30Days = history.slice(-30);
        localStorage.setItem('checkInHistory', JSON.stringify(last30Days));
        
        // Save to localStorage (legacy support)
        localStorage.setItem('lastDailyCheckIn', new Date().toDateString());
        localStorage.setItem('todayEnergy', data.energy);
        localStorage.setItem('todayWorkload', data.workload);
        
        // Remove on-screen alert if it exists
        const alertDiv = document.getElementById('daily-checkin-alert');
        if (alertDiv) {
            alertDiv.remove();
        }
        
        // Calculate 7-day trend
        const last7Days = last30Days.slice(-7);
        const energyTrend = calculateTrend(last7Days.map((d: any) => d.energy));
        const workloadTrend = calculateWorkloadTrend(last7Days.map((d: any) => d.workload));
        
        // Show trend notification
        showTrendNotification(last7Days, energyTrend, workloadTrend);
        
        // Show trend in application
        setShowTrendModal(true);
        
        // Here you would typically send this data to your backend
        // await saveCheckInData(data);
        
        setShowDailyCheckIn(false);
    };
    
    // Calculate energy trend
    const calculateTrend = (energyData: string[]) => {
        const values = energyData.map(e => e === 'high' ? 3 : e === 'medium' ? 2 : 1);
        const avg = values.reduce((a, b) => a + b, 0) / values.length;
        
        if (avg >= 2.5) return { status: 'improving', emoji: '📈', color: '#10b981' };
        if (avg >= 1.8) return { status: 'stable', emoji: '➡️', color: '#f59e0b' };
        return { status: 'declining', emoji: '📉', color: '#ef4444' };
    };
    
    // Calculate workload trend
    const calculateWorkloadTrend = (workloadData: string[]) => {
        const yesCount = workloadData.filter(w => w === 'yes').length;
        const percentage = (yesCount / workloadData.length) * 100;
        
        if (percentage >= 70) return { status: 'manageable', emoji: '✅', color: '#10b981' };
        if (percentage >= 40) return { status: 'moderate', emoji: '⚠️', color: '#f59e0b' };
        return { status: 'overwhelming', emoji: '🔴', color: '#ef4444' };
    };
    
    // Show trend notification
    const showTrendNotification = (last7Days: any[], energyTrend: any, workloadTrend: any) => {
        if ('Notification' in window && Notification.permission === 'granted') {
            const notification = new Notification('📊 Your 7-Day Wellness Trend', {
                body: `Energy: ${energyTrend.emoji} ${energyTrend.status.toUpperCase()}\n` +
                      `Workload: ${workloadTrend.emoji} ${workloadTrend.status.toUpperCase()}\n\n` +
                      `Keep tracking your wellbeing! 💪`,
                requireInteraction: false,
                tag: 'trend-summary',
                silent: true
            });
            
            notification.onclick = () => {
                window.focus();
                setShowTrendModal(true);
                notification.close();
            };
            
            // Auto-close after 8 seconds
            setTimeout(() => notification.close(), 8000);
        }
    };

    // Add CSS animation for tab transitions
    useEffect(() => {
        const styleId = 'fadeInSlide-animation';
        if (!document.getElementById(styleId)) {
            const style = document.createElement('style');
            style.id = styleId;
            style.textContent = `
                @keyframes fadeInSlide {
                    from {
                        opacity: 0;
                        transform: translateY(10px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }
                @keyframes growthPulse {
                    0%, 100% {
                        transform: scale(1);
                        background-color: rgba(240, 253, 250, 1);
                        border-color: rgba(153, 246, 228, 1);
                    }
                    50% {
                        transform: scale(1.02);
                        background-color: rgba(204, 251, 241, 1);
                        border-color: rgba(94, 234, 212, 1);
                    }
                }
                @keyframes bounceChat {
                    0%, 100% {
                        transform: translateY(0);
                    }
                    50% {
                        transform: translateY(-8px);
                    }
                }
                @keyframes shimmerExpert {
                    0% {
                        transform: translateX(-100%);
                    }
                    100% {
                        transform: translateX(100%);
                    }
                }
                @keyframes ping {
                    0% {
                        transform: scale(1);
                        opacity: 1;
                    }
                    75%, 100% {
                        transform: scale(1.5);
                        opacity: 0;
                    }
                }
                @keyframes pulse {
                    0%, 100% {
                        opacity: 1;
                    }
                    50% {
                        opacity: 0.7;
                    }
                }
                @keyframes bounce {
                    0%, 100% {
                        transform: translateY(0);
                    }
                    50% {
                        transform: translateY(-10px);
                    }
                }
                @keyframes pulseButton {
                    0%, 100% {
                        box-shadow: 0 2px 8px rgba(102, 126, 234, 0.4);
                    }
                    50% {
                        box-shadow: 0 4px 16px rgba(102, 126, 234, 0.6);
                    }
                }
                @keyframes glowPulse {
                    0%, 100% {
                        box-shadow: inset 0 0 10px rgba(255, 255, 255, 0.2);
                    }
                    50% {
                        box-shadow: inset 0 0 20px rgba(255, 255, 255, 0.4);
                    }
                }
                @keyframes scroll {
                    0% {
                        transform: translateX(0);
                    }
                    100% {
                        transform: translateX(-50%);
                    }
                }
            `;
            document.head.appendChild(style);
        }
    }, []);


    // Show loading screen on initial load
    useEffect(() => {
        const timer = setTimeout(() => {
            setShowLoadingScreen(false);
        }, 2000);
        
        return () => clearTimeout(timer);
    }, []);

    // Mock data - Replace with actual API calls
    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            
            // Simulate API call
            setTimeout(() => {
                setProjects([
                    {
                        id: '1',
                        name: 'Frontend Development',
                        status: 'active',
                        progress: 75,
                        deadline: '2025-12-15',
                        priority: 'high',
                        allocation: 50
                    },
                    {
                        id: '2',
                        name: 'API Integration',
                        status: 'active',
                        progress: 60,
                        deadline: '2025-11-30',
                        priority: 'medium',
                        allocation: 30
                    },
                    {
                        id: '3',
                        name: 'Database Optimization',
                        status: 'pending',
                        progress: 30,
                        deadline: '2025-12-01',
                        priority: 'medium',
                        allocation: 20
                    }
                ]);

                setNotifications([
                    {
                        id: '1',
                        title: 'Project Deadline Approaching',
                        message: 'EWS Frontend Development deadline is in 2 weeks',
                        type: 'warning',
                        timestamp: '2 hours ago',
                        read: true
                    },
                    {
                        id: '2',
                        title: 'Task Completed',
                        message: 'Your code review has been approved',
                        type: 'success',
                        timestamp: '5 hours ago',
                        read: true
                    },
                    {
                        id: '3',
                        title: 'New Assignment',
                        message: 'You have been assigned to Database Optimization project',
                        type: 'info',
                        timestamp: '1 day ago',
                        read: true
                    }
                ]);

                setChatMessages([
                    {
                        id: '1',
                        sender: 'system',
                        message: 'Welcome to the team chat! How can I help you today?',
                        timestamp: new Date().toISOString()
                    }
                ]);

                setTestimonies([
                    {
                        id: '1',
                        author: 'Sarah Johnson',
                        role: 'Project Manager',
                        message: 'John consistently delivers high-quality work and is always willing to help team members. His expertise in React has been invaluable to our projects.',
                        date: '2025-01-15'
                    },
                    {
                        id: '2',
                        author: 'Michael Chen',
                        role: 'Tech Lead',
                        message: 'Excellent problem-solving skills and great attention to detail. John\'s contributions to our frontend architecture have significantly improved our codebase.',
                        date: '2024-12-20'
                    },
                    {
                        id: '3',
                        author: 'Emily Rodriguez',
                        role: 'Senior Developer',
                        message: 'A pleasure to work with! John is proactive, communicates well, and always meets deadlines. His code reviews are thorough and constructive.',
                        date: '2024-11-10'
                    }
                ]);

                setSkills([
                    {
                        id: '1',
                        name: 'React',
                        level: 5,
                        category: 'frontend'
                    },
                    {
                        id: '2',
                        name: 'TypeScript',
                        level: 5,
                        category: 'frontend'
                    },
                    {
                        id: '3',
                        name: 'Next.js',
                        level: 4,
                        category: 'frontend'
                    },
                    {
                        id: '4',
                        name: 'Node.js',
                        level: 4,
                        category: 'backend'
                    },
                    {
                        id: '5',
                        name: 'PostgreSQL',
                        level: 3,
                        category: 'database'
                    },
                    {
                        id: '6',
                        name: 'MongoDB',
                        level: 4,
                        category: 'database'
                    },
                    {
                        id: '7',
                        name: 'Git',
                        level: 5,
                        category: 'tools'
                    },
                    {
                        id: '8',
                        name: 'Docker',
                        level: 3,
                        category: 'tools'
                    }
                ]);

                // Initialize events with personalized recommendations
                setEvents([
                    {
                        id: 'e1',
                        title: 'Beach Cleanup Drive',
                        description: 'Join us for a community beach cleanup initiative. Help preserve our coastline and marine life.',
                        date: 'Nov 10, 2025',
                        time: '9:00 AM - 12:00 PM',
                        location: 'Marina Beach',
                        category: 'csr',
                        spots: 50,
                        spotsAvailable: 23,
                        isBookmarked: false,
                        isRegistered: false,
                        recommended: true,
                        image: 'https://images.unsplash.com/photo-1618477461853-cf6ed80faba5?w=800&q=80'
                    },
                    {
                        id: 'e2',
                        title: 'Morning Yoga Session',
                        description: 'Start your day with energizing yoga poses and breathing exercises. Perfect for desk workers!',
                        date: 'Nov 5, 2025',
                        time: '7:00 AM - 8:00 AM',
                        location: 'Office Wellness Center',
                        category: 'yoga',
                        spots: 30,
                        spotsAvailable: 12,
                        isBookmarked: false,
                        isRegistered: false,
                        recommended: true,
                        image: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=800&q=80'
                    },
                    {
                        id: 'e3',
                        title: 'Mental Wellness Workshop',
                        description: 'Learn practical techniques for managing stress and maintaining mental health in tech roles.',
                        date: 'Nov 8, 2025',
                        time: '2:00 PM - 4:00 PM',
                        location: 'Conference Room A',
                        category: 'wellness',
                        spots: 40,
                        spotsAvailable: 18,
                        isBookmarked: false,
                        isRegistered: false,
                        recommended: true,
                        image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=800&q=80'
                    },
                    {
                        id: 'e4',
                        title: 'Tree Plantation Drive',
                        description: 'Be part of our green initiative. Plant trees and contribute to a sustainable future.',
                        date: 'Nov 12, 2025',
                        time: '8:00 AM - 11:00 AM',
                        location: 'City Park',
                        category: 'csr',
                        spots: 60,
                        spotsAvailable: 35,
                        isBookmarked: false,
                        isRegistered: false,
                        image: 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=800&q=80'
                    },
                    {
                        id: 'e5',
                        title: 'Power Yoga for Strength',
                        description: 'Build strength and flexibility with this intensive power yoga session.',
                        date: 'Nov 7, 2025',
                        time: '6:00 PM - 7:00 PM',
                        location: 'Office Wellness Center',
                        category: 'yoga',
                        spots: 25,
                        spotsAvailable: 8,
                        isBookmarked: false,
                        isRegistered: false,
                        image: 'https://images.unsplash.com/photo-1599901860904-17e6ed7083a0?w=800&q=80'
                    },
                    {
                        id: 'e6',
                        title: 'Nutrition & Wellness Talk',
                        description: 'Expert nutritionist shares tips for healthy eating and lifestyle choices for busy professionals.',
                        date: 'Nov 15, 2025',
                        time: '1:00 PM - 2:30 PM',
                        location: 'Virtual - Teams',
                        category: 'wellness',
                        spots: 100,
                        spotsAvailable: 67,
                        isBookmarked: false,
                        isRegistered: false,
                        image: 'https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=800&q=80'
                    },
                    {
                        id: 'e7',
                        title: 'Orphanage Visit & Donation',
                        description: 'Spend time with children and contribute to their education and wellbeing.',
                        date: 'Nov 18, 2025',
                        time: '10:00 AM - 3:00 PM',
                        location: 'Rainbow Orphanage',
                        category: 'csr',
                        spots: 30,
                        spotsAvailable: 15,
                        isBookmarked: false,
                        isRegistered: false,
                        image: 'https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?w=800&q=80'
                    },
                    {
                        id: 'e8',
                        title: 'Meditation & Mindfulness',
                        description: 'Guided meditation session to enhance focus and inner peace. Great for developers!',
                        date: 'Nov 9, 2025',
                        time: '5:30 PM - 6:30 PM',
                        location: 'Office Wellness Center',
                        category: 'wellness',
                        spots: 35,
                        spotsAvailable: 20,
                        isBookmarked: false,
                        isRegistered: false,
                        image: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=800&q=80'
                    }
                ]);

                setLoading(false);
            }, 1000);
        };

        fetchData();
    }, []);

    const handleBookmark = (eventId: string) => {
        setEvents(events.map(event => 
            event.id === eventId ? { ...event, isBookmarked: !event.isBookmarked } : event
        ));
    };

    const handleRegister = (eventId: string) => {
        setEvents(events.map(event => 
            event.id === eventId ? { ...event, isRegistered: !event.isRegistered } : event
        ));
    };

    const filteredEvents = selectedCategory === 'all' 
        ? events 
        : events.filter(event => event.category === selectedCategory);

    const recommendedEvents = events.filter(event => event.recommended);

    const getCategoryColor = (category: string) => {
        switch (category) {
            case 'csr': return 'teal';
            case 'yoga': return 'purple';
            case 'wellness': return 'blue';
            default: return 'gray';
        }
    };

    const getCategoryLabel = (category: string) => {
        switch (category) {
            case 'csr': return 'CSR Activity';
            case 'yoga': return 'Yoga Class';
            case 'wellness': return 'Wellness Session';
            default: return category;
        }
    };

    const getCategoryGradient = (category: string) => {
        switch (category) {
            case 'csr': return 'linear-gradient(135deg, #14b8a6 0%, #0d9488 100%)';
            case 'yoga': return 'linear-gradient(135deg, #9333ea 0%, #7e22ce 100%)';
            case 'wellness': return 'linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)';
            default: return 'linear-gradient(135deg, #6b7280 0%, #4b5563 100%)';
        }
    };

    const handleSendMessage = () => {
        if (!newMessage.trim()) return;

        const userMessage: ChatMessage = {
            id: Date.now().toString(),
            sender: 'user',
            message: newMessage,
            timestamp: new Date().toISOString()
        };

        setChatMessages(prev => [...prev, userMessage]);
        setNewMessage('');

        // Simulate system response
        setTimeout(() => {
            const systemMessage: ChatMessage = {
                id: (Date.now() + 1).toString(),
                sender: 'system',
                message: 'Thank you for your message. A team member will respond shortly.',
                timestamp: new Date().toISOString()
            };
            setChatMessages(prev => [...prev, systemMessage]);
        }, 1000);
    };

    const toggleSkillBookmark = (skillName: string) => {
        if (bookmarkedSkills.includes(skillName)) {
            setBookmarkedSkills(bookmarkedSkills.filter(s => s !== skillName));
        } else {
            setBookmarkedSkills([...bookmarkedSkills, skillName]);
            // Add to notifications
            const newNotification: Notification = {
                id: Date.now().toString(),
                type: 'info',
                title: 'Skill Bookmarked',
                message: `${skillName} added to your upskilling to-do list`,
                timestamp: new Date().toISOString(),
                read: false
            };
            setNotifications([newNotification, ...notifications]);
        }
    };

    const markAsRead = (notificationId: string) => {
        setNotifications(prev =>
            prev.map(notif =>
                notif.id === notificationId ? { ...notif, read: true } : notif
            )
        );
    };

    // Project Allocation Pie Chart Data
    const pieChartData = {
        labels: projects.map(p => p.name),
        datasets: [
            {
                data: projects.map(p => p.allocation),
                backgroundColor: [
                    'rgba(168, 85, 247, 0.8)',
                    'rgba(59, 130, 246, 0.8)',
                    'rgba(16, 185, 129, 0.8)',
                    'rgba(245, 158, 11, 0.8)',
                    'rgba(239, 68, 68, 0.8)',
                ],
                borderColor: [
                    'rgb(168, 85, 247)',
                    'rgb(59, 130, 246)',
                    'rgb(16, 185, 129)',
                    'rgb(245, 158, 11)',
                    'rgb(239, 68, 68)',
                ],
                borderWidth: 2
            }
        ]
    };

    const pieChartOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                display: false
            },
            tooltip: {
                callbacks: {
                    label: function(context: any) {
                        return context.label + ': ' + context.parsed + '%';
                    }
                }
            }
        },
        // 3D effect simulation through offset and shadow
        offset: 10,
        borderWidth: 3,
        borderColor: '#fff',
        hoverOffset: 20
    };

    // Project Occupancy Chart Data
    const chartData = {
        labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4', 'Week 5', 'Week 6'],
        datasets: [
            {
                label: 'Project Occupancy (%)',
                data: [65, 70, 75, 80, 78, 85],
                borderColor: 'rgb(168, 85, 247)',
                backgroundColor: 'rgba(168, 85, 247, 0.1)',
                fill: true,
                tension: 0.4
            }
        ]
    };

    const chartOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                display: false
            },
            title: {
                display: false
            }
        },
        scales: {
            y: {
                beginAtZero: true,
                max: 100,
                ticks: {
                    callback: function(value: any) {
                        return value + '%';
                    }
                }
            }
        }
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'active': return 'green';
            case 'pending': return 'orange';
            case 'completed': return 'blue';
            default: return 'gray';
        }
    };

    const getPriorityColor = (priority: string) => {
        switch (priority) {
            case 'high': return 'red';
            case 'medium': return 'orange';
            case 'low': return 'blue';
            default: return 'gray';
        }
    };

    const getNotificationIcon = (type: string) => {
        switch (type) {
            case 'warning': return AlertCircle;
            case 'success': return CheckCircle;
            case 'info': return Bell;
            default: return Bell;
        }
    };

    const getNotificationColor = (type: string) => {
        switch (type) {
            case 'warning': return 'orange';
            case 'success': return 'green';
            case 'info': return 'blue';
            default: return 'gray';
        }
    };

    // Show animated loading screen
    if (showLoadingScreen) {
        return <LoadingScreen />;
    }

    if (loading) {
        return (
            <Box
                w="full"
                h="full"
                bg="linear-gradient(135deg, #667eea 0%, #764ba2 100%)"
                position="relative"
                overflow="hidden"
            >
                {/* Animated background circles */}
                <Box
                    position="absolute"
                    top="-10%"
                    right="-10%"
                    w="400px"
                    h="400px"
                    bg="whiteAlpha.200"
                    borderRadius="full"
                    style={{ animation: 'pulse 3s ease-in-out infinite' }}
                />
                <Box
                    position="absolute"
                    bottom="-15%"
                    left="-15%"
                    w="500px"
                    h="500px"
                    bg="whiteAlpha.100"
                    borderRadius="full"
                    style={{ animation: 'pulse 4s ease-in-out infinite' }}
                />
                
                <Flex justify="center" align="center" h="full" position="relative" zIndex={1}>
                    <VStack gap={6}>
                        {/* Animated spinner container */}
                        <Box position="relative">
                            {/* Outer ring */}
                            <Box
                                w="120px"
                                h="120px"
                                border="4px solid"
                                borderColor="whiteAlpha.300"
                                borderRadius="full"
                                position="absolute"
                                top="-10px"
                                left="-10px"
                                style={{ animation: 'spin 3s linear infinite' }}
                            />
                            {/* Inner spinner */}
                            <Box
                                w="100px"
                                h="100px"
                                border="6px solid"
                                borderColor="white"
                                borderTopColor="transparent"
                                borderRadius="full"
                                style={{ animation: 'spin 1s linear infinite' }}
                            />
                            {/* Center icon */}
                            <Box
                                position="absolute"
                                top="50%"
                                left="50%"
                                transform="translate(-50%, -50%)"
                                style={{ animation: 'bounce 2s ease-in-out infinite' }}
                            >
                                <SparklesIcon size={32} color="white" />
                            </Box>
                        </Box>
                        
                        {/* Loading text */}
                        <VStack gap={2} style={{ animation: 'fadeIn 1s ease-out' }}>
                            <Text color="white" fontSize="xl" fontWeight="bold">
                                Loading your dashboard...
                            </Text>
                            <Text color="whiteAlpha.800" fontSize="sm">
                                Please wait while we prepare your experience
                            </Text>
                        </VStack>
                        
                        {/* Loading dots */}
                        <HStack gap={2}>
                            <Box
                                w={3}
                                h={3}
                                bg="white"
                                borderRadius="full"
                                style={{ animation: 'bounce 1.4s ease-in-out infinite' }}
                            />
                            <Box
                                w={3}
                                h={3}
                                bg="white"
                                borderRadius="full"
                                style={{ animation: 'bounce 1.4s ease-in-out 0.2s infinite' }}
                            />
                            <Box
                                w={3}
                                h={3}
                                bg="white"
                                borderRadius="full"
                                style={{ animation: 'bounce 1.4s ease-in-out 0.4s infinite' }}
                            />
                        </HStack>
                    </VStack>
                </Flex>
            </Box>
        );
    }

    return (
        <Box
            w="full"
            h="100vh"
            bg="linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)"
            overflow="hidden"
            display="flex"
            flexDirection="column"
            style={{ animation: 'fadeIn 0.5s ease-out' }}
        >
            {/* Main Content with Employee Info Card */}
            <Box 
                flex="1"
                overflow="auto" 
                p={{ base: 3, md: 4 }}
                style={{ animation: 'fadeInUp 0.7s ease-out' }}
            >
                <SimpleGrid 
                    columns={{ base: 1, md: 2, lg: 3 }} 
                    gap={{ base: 3, md: 4 }}
                    h="full"
                    gridTemplateRows={{ lg: "1fr 1fr" }}
                >
                    {/* Quadrant 1: Employee Details + My Space (Larger - spans 2 columns on large screens) */}
                    <Card.Root
                        gridColumn={{ base: "1", lg: "1 / 3" }}
                        bg="white"
                        border="1px solid"
                        borderColor="gray.200"
                        borderRadius="xl"
                        shadow="md"
                        overflow="hidden"
                        h="full"
                        display="flex"
                        flexDirection="column"
                    >
                        <Card.Header 
                            p={{ base: 3, md: 4 }} 
                            pb={3} 
                            borderBottom="1px solid" 
                            borderColor="gray.100"
                            bg="gradient-to-r from-teal.50 to-blue.50"
                        >
                            <HStack justify="space-between">
                                <HStack gap={3}>
                                    <Box p={2} bg="teal.500" borderRadius="lg">
                                        <User size={20} color="white" />
                                    </Box>
                                    <VStack align="start" gap={0}>
                                        <Heading size={{ base: "sm", md: "md" }} color="gray.800" fontWeight="700">
                                            Employee Profile
                                        </Heading>
                                        <Text fontSize="xs" color="gray.600" fontWeight="500">
                                            Your information & quick actions
                                        </Text>
                                    </VStack>
                                </HStack>
                                <HStack gap={2}>
                                    {/* Ultra Simple Notification Test */}
                                    <Button
                                        size="sm"
                                        bg="linear-gradient(135deg, #ef4444 0%, #dc2626 100%)"
                                        color="white"
                                        borderRadius="lg"
                                        fontSize="xs"
                                        px={3}
                                        _hover={{
                                            transform: "translateY(-2px)",
                                            shadow: "lg"
                                        }}
                                        onClick={async () => {
                                            console.log('🔴 Testing basic notification with popup...');
                                            
                                            // Request permission if needed
                                            if (Notification.permission === 'default') {
                                                const perm = await Notification.requestPermission();
                                                console.log('Permission:', perm);
                                            }
                                            
                                            // Create notification with click handler
                                            if (Notification.permission === 'granted') {
                                                try {
                                                    const n = new Notification('🔔 DAILY CHECK-IN REQUIRED!', {
                                                        body: '⚡ Action Needed: Share how you\'re feeling today!\n\n👆 Click here to complete your check-in now!',
                                                        requireInteraction: true,
                                                        tag: 'daily-checkin',
                                                        silent: false
                                                    });
                                                    
                                                    n.onclick = () => {
                                                        console.log('✅ Notification clicked - opening popup');
                                                        n.close();
                                                        
                                                        // Open popup
                                                        const popupWidth = 750;
                                                        const popupHeight = 700;
                                                        const left = (screen.width - popupWidth) / 2;
                                                        const top = (screen.height - popupHeight) / 2;
                                                        
                                                        const popup = window.open(
                                                            '/team-member-view/checkin',
                                                            'DailyCheckIn',
                                                            `width=${popupWidth},height=${popupHeight},left=${left},top=${top},resizable=yes,scrollbars=no,status=no,toolbar=no,menubar=no,location=no`
                                                        );
                                                        
                                                        if (popup) {
                                                            popup.focus();
                                                        }
                                                    };
                                                    
                                                    console.log('✅ Notification created! Click it to open popup.');
                                                    alert('✅ Notification object created successfully!\n\n' +
                                                        'If you DON\'T see a notification in bottom-right corner:\n\n' +
                                                        '1. Windows is blocking notifications\n' +
                                                        '2. Press Win+A to open Action Center\n' +
                                                        '3. Check if notification is there\n\n' +
                                                        'To fix:\n' +
                                                        '• Win+I → System → Notifications\n' +
                                                        '• Enable "Get notifications..."\n' +
                                                        '• Enable your browser in the list\n' +
                                                        '• Turn OFF Focus Assist (Win+A)\n\n' +
                                                        'Or use PURPLE "Test Popup Window" button instead!');
                                                } catch (e) {
                                                    console.error('❌ Error:', e);
                                                    alert('❌ Error creating notification:\n' + e);
                                                }
                                            } else {
                                                alert('⚠️ Notification Permission: ' + Notification.permission + '\n\nPlease allow notifications in browser settings!');
                                            }
                                        }}
                                    >
                                        Basic Notify Test
                                    </Button>
                                    
                                    {/* Test Daily Check-in Button */}
                                    <Button
                                        size="sm"
                                        bg="linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)"
                                        color="white"
                                        borderRadius="lg"
                                        fontSize="xs"
                                        px={3}
                                        _hover={{
                                            transform: "translateY(-2px)",
                                            shadow: "lg"
                                        }}
                                        onClick={() => {
                                            console.log('🟣 Test button clicked - clearing localStorage and showing modal');
                                            localStorage.removeItem('lastDailyCheckIn');
                                            setShowDailyCheckIn(true);
                                            sendNotification();
                                        }}
                                    >
                                        Test Check-In
                                    </Button>
                                    
                                    {/* Check Permission Button */}
                                    <Button
                                        size="sm"
                                        bg="linear-gradient(135deg, #10b981 0%, #059669 100%)"
                                        color="white"
                                        borderRadius="lg"
                                        fontSize="xs"
                                        px={3}
                                        _hover={{
                                            transform: "translateY(-2px)",
                                            shadow: "lg"
                                        }}
                                        onClick={() => {
                                            const permission = Notification?.permission || 'not supported';
                                            const message = `Notification Status:\n\n` +
                                                `Supported: ${'Notification' in window ? 'Yes ✓' : 'No ✗'}\n` +
                                                `Permission: ${permission}\n\n` +
                                                (permission === 'granted' ? '✓ Notifications are enabled!' :
                                                 permission === 'denied' ? '✗ Notifications are blocked. Enable in browser settings.' :
                                                 permission === 'default' ? '⚠ Click OK to grant permission' : 
                                                 '✗ Notifications not supported');
                                            
                                            alert(message);
                                            
                                            if (permission === 'default') {
                                                Notification.requestPermission().then(p => {
                                                    alert(`Permission ${p === 'granted' ? 'granted ✓' : 'denied ✗'}`);
                                                });
                                            }
                                        }}
                                    >
                                        Check Permission
                                    </Button>
                                    
                                    {/* Test Popup Directly */}
                                    <Button
                                        size="sm"
                                        bg="linear-gradient(135deg, #8b5cf6 0%, #6366f1 100%)"
                                        color="white"
                                        borderRadius="lg"
                                        fontSize="xs"
                                        px={3}
                                        _hover={{
                                            transform: "translateY(-2px)",
                                            shadow: "lg"
                                        }}
                                        onClick={() => {
                                            console.log('Opening check-in popup directly...');
                                            
                                            // Open check-in modal in a popup window
                                            const popupWidth = 750;
                                            const popupHeight = 700;
                                            const left = (screen.width - popupWidth) / 2;
                                            const top = (screen.height - popupHeight) / 2;
                                            
                                            const popup = window.open(
                                                '/team-member-view/checkin',
                                                'DailyCheckIn',
                                                `width=${popupWidth},height=${popupHeight},left=${left},top=${top},resizable=yes,scrollbars=no,status=no,toolbar=no,menubar=no,location=no`
                                            );
                                            
                                            if (popup) {
                                                popup.focus();
                                                console.log('✅ Popup opened successfully');
                                            } else {
                                                alert('Popup blocked! Please allow popups for this site.');
                                                console.error('❌ Popup was blocked');
                                            }
                                        }}
                                    >
                                        Test Popup Window
                                    </Button>
                                    
                                    {/* Test Notification with Delay */}
                                    <Button
                                        size="sm"
                                        bg="linear-gradient(135deg, #f59e0b 0%, #d97706 100%)"
                                        color="white"
                                        borderRadius="lg"
                                        fontSize="xs"
                                        px={3}
                                        _hover={{
                                            transform: "translateY(-2px)",
                                            shadow: "lg"
                                        }}
                                        onClick={() => {
                                            console.log('Delayed notification test - you have 5 seconds to switch tabs!');
                                            alert('Notification will appear in 5 seconds. Switch to another tab now!');
                                            setTimeout(() => {
                                                console.log('Sending delayed notification...');
                                                sendNotification();
                                            }, 5000);
                                        }}
                                    >
                                        Test System Notify
                                    </Button>
                                    
                                    {/* My Concern Icon Button */}
                                    <IconButton
                                        aria-label="Raise Concern"
                                        size="lg"
                                        bg="linear-gradient(135deg, #fb923c 0%, #f97316 100%)"
                                        color="white"
                                        borderRadius="xl"
                                        shadow="md"
                                        _hover={{
                                            transform: "translateY(-2px) scale(1.05)",
                                            shadow: "xl",
                                            bg: "linear-gradient(135deg, #f97316 0%, #ea580c 100%)"
                                        }}
                                        _active={{
                                            transform: "translateY(0px)"
                                        }}
                                        transition="all 0.3s ease"
                                        title="Raise a Concern"
                                        onClick={() => setIsConcernModalOpen(true)}
                                    >
                                        <AlertCircle size={22} />
                                    </IconButton>
                                    {/* Logout Icon Button */}
                                    <IconButton
                                        aria-label="Logout"
                                        size="lg"
                                        bg="linear-gradient(135deg, #ef4444 0%, #dc2626 100%)"
                                        color="white"
                                        borderRadius="xl"
                                        shadow="md"
                                        _hover={{
                                            transform: "translateY(-2px) scale(1.05)",
                                            shadow: "xl",
                                            bg: "linear-gradient(135deg, #dc2626 0%, #b91c1c 100%)"
                                        }}
                                        _active={{
                                            transform: "translateY(0px)"
                                        }}
                                        transition="all 0.3s ease"
                                        onClick={() => {
                                            localStorage.clear();
                                            sessionStorage.clear();
                                            window.location.href = '/login';
                                        }}
                                        title="Logout"
                                    >
                                        <LogOut size={22} />
                                    </IconButton>
                                </HStack>
                            </HStack>
                        </Card.Header>
                        <Card.Body p={{ base: 3, md: 4 }} flex={1} overflow="auto">
                            <VStack gap={3} align="stretch">
                                {/* Employee Info Section with Engagement Meter */}
                                <HStack gap={4} align="start" flexWrap={{ base: "wrap", lg: "nowrap" }}>
                                    {/* Profile Picture - Bigger */}
                                    <Box
                                        w={{ base: "160px", md: "180px" }}
                                        h={{ base: "160px", md: "180px" }}
                                        borderRadius="2xl"
                                        overflow="hidden"
                                        border="5px solid"
                                        borderColor="teal.400"
                                        shadow="2xl"
                                        flexShrink={0}
                                        position="relative"
                                        _hover={{
                                            transform: "scale(1.02)",
                                            borderColor: "teal.500"
                                        }}
                                        transition="all 0.3s ease"
                                    >
                                        <img 
                                            src={userProfile.avatar} 
                                            alt={userProfile.name}
                                            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                        />
                                    </Box>
                                    
                                    {/* Employee Details */}
                                    <VStack align="start" gap={1.5} flex={1} minW="200px">
                                        <Heading size={{ base: "lg", md: "xl" }} color="gray.800" fontWeight="700">
                                            {userProfile.name}
                                        </Heading>
                                        <Badge 
                                            bg="teal.100" 
                                            color="teal.700" 
                                            px={3} 
                                            py={1} 
                                            borderRadius="full"
                                            fontSize="sm"
                                            fontWeight="600"
                                        >
                                            Active
                                        </Badge>
                                        <Text color="gray.600" fontSize={{ base: "md", md: "lg" }} fontWeight="500">
                                            {userProfile.designation}
                                        </Text>
                                        <HStack gap={2} mt={1}>
                                            <Box p={1.5} bg="blue.50" borderRadius="md">
                                                <User size={16} color="#3182CE" />
                                            </Box>
                                            <Text color="gray.700" fontSize="md" fontWeight="600">
                                                Employee ID: <Text as="span" fontWeight="400">EMP-2024-001</Text>
                                            </Text>
                                        </HStack>
                                    </VStack>

                                    {/* Engagement Meter - Half Donut */}
                                    <VStack gap={2} align="center" minW="600px" flexShrink={0}>
                                        <Text fontSize="sm" fontWeight="700" color="gray.700">
                                            Engagement Meter
                                        </Text>
                                        
                                        {/* Half Donut Chart */}
                                        <Box position="relative" w="180px" h="100px">
                                            <svg width="180" height="100" viewBox="0 0 180 100">
                                                {/* Background Arc */}
                                                <path
                                                    d="M 20 90 A 70 70 0 0 1 160 90"
                                                    fill="none"
                                                    stroke="#e5e7eb"
                                                    strokeWidth="20"
                                                    strokeLinecap="round"
                                                />
                                                {/* Progress Arc */}
                                                <path
                                                    d="M 20 90 A 70 70 0 0 1 160 90"
                                                    fill="none"
                                                    stroke="url(#halfGradient)"
                                                    strokeWidth="20"
                                                    strokeLinecap="round"
                                                    strokeDasharray={`${(projects.reduce((sum, p) => sum + p.allocation, 0) / 100) * 220} 220`}
                                                    style={{ transition: 'stroke-dasharray 1s ease' }}
                                                />
                                                <defs>
                                                    <linearGradient id="halfGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                                                        <stop offset="0%" style={{ stopColor: '#a855f7', stopOpacity: 1 }} />
                                                        <stop offset="100%" style={{ stopColor: '#3b82f6', stopOpacity: 1 }} />
                                                    </linearGradient>
                                                </defs>
                                            </svg>
                                            {/* Center Text */}
                                            <VStack
                                                position="absolute"
                                                bottom="-15px"
                                                left="52%"
                                                transform="translateX(-50%)"
                                                gap={0}
                                            >
                                                <Text fontSize="3xl" fontWeight="800" color="purple.600" lineHeight="1">
                                                    {projects.reduce((sum, p) => sum + p.allocation, 0)}%
                                                </Text>
                                                <Text fontSize="xs" color="gray.600" fontWeight="600">
                                                    Occupied
                                                </Text>
                                            </VStack>
                                        </Box>

                                        {/* Legend */}
                                        <HStack gap={3} justify="center" mt={3}>
                                            <HStack gap={1.5}>
                                                <Box w={2.5} h={2.5} bg="linear-gradient(90deg, #a855f7 0%, #3b82f6 100%)" borderRadius="sm" />
                                                <Text fontSize="xs" color="gray.700" fontWeight="600">
                                                    {projects.reduce((sum, p) => sum + p.allocation, 0)}%
                                                </Text>
                                            </HStack>
                                            <HStack gap={1.5}>
                                                <Box w={2.5} h={2.5} bg="gray.300" borderRadius="sm" />
                                                <Text fontSize="xs" color="gray.700" fontWeight="600">
                                                    {100 - projects.reduce((sum, p) => sum + p.allocation, 0)}%
                                                </Text>
                                            </HStack>
                                        </HStack>
                                    </VStack>
                                </HStack>

                                {/* My Space Quick Actions */}
                                <Box>
                                    <Text fontSize="sm" fontWeight="700" color="gray.700" mb={2}>
                                        Quick Actions
                                    </Text>
                                    <SimpleGrid columns={{ base: 2, md: 4 }} gap={2} w="full">
                                        {/* View Survey */}
                                        <Button
                                            variant="outline"
                                            minH="70px"
                                            h="auto"
                                            borderRadius="lg"
                                            border="2px solid"
                                            borderColor="purple.200"
                                            bg="purple.100"
                                            transform="translateY(-4px)"
                                            boxShadow="0 8px 20px rgba(128, 90, 213, 0.2), 0 4px 8px rgba(0, 0, 0, 0.1), inset 0 -2px 4px rgba(0, 0, 0, 0.05)"
                                            _hover={{ bg: "purple.200", borderColor: "purple.300", transform: "translateY(-8px)", boxShadow: "0 12px 30px rgba(128, 90, 213, 0.3), 0 6px 12px rgba(0, 0, 0, 0.15), inset 0 -2px 4px rgba(0, 0, 0, 0.05)" }}
                                            display="flex"
                                            flexDirection="column"
                                            gap={2}
                                            p={3}
                                            onClick={() => setIsSurveyModalOpen(true)}
                                            transition="all 0.3s ease"
                                        >
                                            <Box p={1.5} bg="purple.100" borderRadius="md">
                                                <FileText size={20} color="#805AD5" />
                                            </Box>
                                            <Text fontWeight="600" color="gray.800" fontSize="sm">
                                                View Survey
                                            </Text>
                                        </Button>

                                        {/* Access Offering */}
                                        <Button
                                            variant="outline"
                                            minH="70px"
                                            h="auto"
                                            borderRadius="lg"
                                            border="2px solid"
                                            borderColor="blue.200"
                                            bg="blue.100"
                                            transform="translateY(-4px)"
                                            boxShadow="0 8px 20px rgba(49, 130, 206, 0.2), 0 4px 8px rgba(0, 0, 0, 0.1), inset 0 -2px 4px rgba(0, 0, 0, 0.05)"
                                            _hover={{ bg: "blue.200", borderColor: "blue.300", transform: "translateY(-8px)", boxShadow: "0 12px 30px rgba(49, 130, 206, 0.3), 0 6px 12px rgba(0, 0, 0, 0.15), inset 0 -2px 4px rgba(0, 0, 0, 0.05)" }}
                                            display="flex"
                                            flexDirection="column"
                                            gap={2}
                                            p={3}
                                            onClick={() => setIsContentModalOpen(true)}
                                            transition="all 0.3s ease"
                                        >
                                            <Box p={1.5} bg="blue.100" borderRadius="md">
                                                <Package size={20} color="#3182CE" />
                                            </Box>
                                            <Text fontWeight="600" color="gray.800" fontSize="sm">
                                                Content Library
                                            </Text>
                                        </Button>

                                        {/* Event Calendar */}
                                        <Button
                                            variant="outline"
                                            minH="70px"
                                            h="auto"
                                            borderRadius="lg"
                                            border="2px solid"
                                            borderColor="green.200"
                                            bg="green.100"
                                            transform="translateY(-4px)"
                                            boxShadow="0 8px 20px rgba(56, 161, 105, 0.2), 0 4px 8px rgba(0, 0, 0, 0.1), inset 0 -2px 4px rgba(0, 0, 0, 0.05)"
                                            _hover={{ bg: "green.200", borderColor: "green.300", transform: "translateY(-8px)", boxShadow: "0 12px 30px rgba(56, 161, 105, 0.3), 0 6px 12px rgba(0, 0, 0, 0.15), inset 0 -2px 4px rgba(0, 0, 0, 0.05)" }}
                                            display="flex"
                                            flexDirection="column"
                                            gap={2}
                                            p={3}
                                            onClick={() => setIsCalendarOpen(true)}
                                            transition="all 0.3s ease"
                                        >
                                            <Box p={1.5} bg="green.100" borderRadius="md">
                                                <Calendar size={20} color="#38A169" />
                                            </Box>
                                            <Text fontWeight="600" color="gray.800" fontSize="sm">
                                                Event Calendar
                                            </Text>
                                        </Button>

                                        {/* Analyze Skill */}
                                        <Button
                                            variant="outline"
                                            minH="70px"
                                            h="auto"
                                            borderRadius="lg"
                                            border="2px solid"
                                            borderColor="teal.200"
                                            bg="teal.100"
                                            transform="translateY(-4px)"
                                            boxShadow="0 8px 20px rgba(56, 178, 172, 0.2), 0 4px 8px rgba(0, 0, 0, 0.1), inset 0 -2px 4px rgba(0, 0, 0, 0.05)"
                                            _hover={{ bg: "teal.200", borderColor: "teal.300", transform: "translateY(-8px)", boxShadow: "0 12px 30px rgba(56, 178, 172, 0.3), 0 6px 12px rgba(0, 0, 0, 0.15), inset 0 -2px 4px rgba(0, 0, 0, 0.05)" }}
                                            display="flex"
                                            flexDirection="column"
                                            gap={2}
                                            p={3}
                                            onClick={() => setIsSkillAnalysisOpen(true)}
                                            style={{
                                                animation: 'growthPulse 3s ease-in-out infinite'
                                            }}
                                        >
                                            <Box p={1.5} bg="teal.100" borderRadius="md">
                                                <TrendingUp size={20} color="#0D9488" />
                                            </Box>
                                            <Text fontWeight="600" color="gray.800" fontSize="sm">
                                                My Growth & Health
                                            </Text>
                                        </Button>
                                    </SimpleGrid>
                                </Box>
                            </VStack>
                        </Card.Body>
                    </Card.Root>

                    {/* Quadrant 2: My Projects */}
                    <Card.Root
                        bg="white"
                        border="1px solid"
                        borderColor="gray.200"
                        borderRadius="xl"
                        shadow="sm"
                        h="full"
                        display="flex"
                        flexDirection="column"
                        overflow="hidden"
                    >
                        <Card.Header 
                            p={{ base: 2, md: 3 }} 
                            pb={2} 
                            borderBottom="1px solid" 
                            borderColor="gray.100"
                            bg="gradient-to-r from-purple.50 to-purple.100"
                        >
                            <HStack gap={3}>
                                <Box p={2} bg="purple.500" borderRadius="lg">
                                    <FolderKanban size={18} color="white" />
                                </Box>
                                <VStack align="start" gap={0}>
                                    <Heading size={{ base: "sm", md: "md" }} color="gray.800" fontWeight="700">
                                        My Projects
                                    </Heading>
                                    <Text fontSize="xs" color="gray.600" fontWeight="500">
                                        Active assignments
                                    </Text>
                                    <Text fontSize="2xs" color="gray.600">
                                        {projects.length} active
                                    </Text>
                                </VStack>
                            </HStack>
                        </Card.Header>
                        <Card.Body p={{ base: 2, md: 3 }} flex={1} overflow="auto">
                            <VStack gap={2} align="stretch">
                                {projects.map((project, index) => {
                                    const colorSchemes = [
                                        { bg: 'purple.50', border: 'purple.200', bar: 'purple.500', text: 'purple.700' },
                                        { bg: 'blue.50', border: 'blue.200', bar: 'blue.500', text: 'blue.700' },
                                        { bg: 'green.50', border: 'green.200', bar: 'green.500', text: 'green.700' },
                                        { bg: 'orange.50', border: 'orange.200', bar: 'orange.500', text: 'orange.700' },
                                        { bg: 'pink.50', border: 'pink.200', bar: 'pink.500', text: 'pink.700' }
                                    ];
                                    const scheme = colorSchemes[index];
                                    return (
                                        <Box
                                            key={project.id}
                                            p={2.5}
                                            bg={scheme.bg}
                                            borderRadius="lg"
                                            border="1px solid"
                                            borderColor={scheme.border}
                                            transition="all 0.2s ease"
                                            _hover={{
                                                shadow: "sm",
                                                borderColor: scheme.bar
                                            }}
                                        >
                                            <HStack justify="space-between" mb={1.5}>
                                                <Text fontSize="sm" color="gray.800" fontWeight="600">
                                                    {project.name}
                                                </Text>
                                                <Badge bg={scheme.bar} color="white" px={2} py={0.5} borderRadius="md" fontSize="xs" fontWeight="700">
                                                    {project.allocation}%
                                                </Badge>
                                            </HStack>
                                            <Box
                                                w="full"
                                                h="6px"
                                                bg="white"
                                                borderRadius="full"
                                                overflow="hidden"
                                            >
                                                <Box
                                                    w={`${project.allocation}%`}
                                                    h="full"
                                                    bg={scheme.bar}
                                                    borderRadius="full"
                                                    transition="width 0.8s ease"
                                                />
                                            </Box>
                                        </Box>
                                    );
                                })}
                            </VStack>
                        </Card.Body>
                    </Card.Root>

                    {/* Quadrant 3: Immediate Focus */}
                    <Card.Root
                        bg="white"
                        border="1px solid"
                        borderColor="gray.200"
                        borderRadius="lg"
                        shadow="sm"
                        h="full"
                        display="flex"
                        flexDirection="column"
                    >
                        <Card.Header p={{ base: 2, md: 3 }} pb={2} borderBottom="1px solid" borderColor="gray.100">
                            <HStack gap={2}>
                                <Box p={1} bg="red.100" borderRadius="md">
                                    <AlertTriangle size={16} color="#DC2626" />
                                </Box>
                                <VStack align="start" gap={0}>
                                    <Heading size={{ base: "xs", md: "sm" }} color="gray.800" fontWeight="bold">
                                        Immediate Focus
                                    </Heading>
                                    <Text fontSize="2xs" color="gray.600">
                                        4 priority actions
                                    </Text>
                                </VStack>
                            </HStack>
                        </Card.Header>
                        <Card.Body p={{ base: 2, md: 3 }} flex={1} overflow="hidden">
                            <VStack gap={2} align="stretch">
                                {/* Skills Priority Actions */}
                                <Box
                                    p={{ base: 2, md: 3 }}
                                    bg="blue.50"
                                    borderRadius="md"
                                    border="1px solid"
                                    borderColor="blue.200"
                                    transition="all 0.2s"
                                    _hover={{ bg: "blue.100", transform: "translateY(-2px)", shadow: "md" }}
                                    cursor="pointer"
                                >
                                    <HStack gap={2} align="start">
                                        <Box mt={0.5}>
                                            <BookOpen size={14} color="#2563EB" />
                                        </Box>
                                        <VStack align="start" gap={0.5} flex={1}>
                                            <Text fontWeight="bold" color="gray.800" fontSize={{ base: "xs", md: "sm" }}>
                                                Complete React Advanced Course
                                            </Text>
                                            <Text fontSize="2xs" color="gray.600">
                                                Module 3: State Management - Due in 2 days
                                            </Text>
                                        </VStack>
                                    </HStack>
                                </Box>

                                <Box
                                    p={{ base: 2, md: 3 }}
                                    bg="blue.50"
                                    borderRadius="md"
                                    border="1px solid"
                                    borderColor="blue.200"
                                    transition="all 0.2s"
                                    _hover={{ bg: "blue.100", transform: "translateY(-2px)", shadow: "md" }}
                                    cursor="pointer"
                                >
                                    <HStack gap={2} align="start">
                                        <Box mt={0.5}>
                                            <Target size={14} color="#2563EB" />
                                        </Box>
                                        <VStack align="start" gap={0.5} flex={1}>
                                            <Text fontWeight="bold" color="gray.800" fontSize={{ base: "xs", md: "sm" }}>
                                                Practice TypeScript Exercises
                                            </Text>
                                            <Text fontSize="2xs" color="gray.600">
                                                Complete 5 coding challenges this week
                                            </Text>
                                        </VStack>
                                    </HStack>
                                </Box>

                                {/* Mental Health Priority Actions */}
                                <Box
                                    p={{ base: 2, md: 3 }}
                                    bg="pink.50"
                                    borderRadius="md"
                                    border="1px solid"
                                    borderColor="pink.200"
                                    transition="all 0.2s"
                                    _hover={{ bg: "pink.100", transform: "translateY(-2px)", shadow: "md" }}
                                    cursor="pointer"
                                >
                                    <HStack gap={2} align="start">
                                        <Box mt={0.5}>
                                            <Heart size={14} color="#EC4899" />
                                        </Box>
                                        <VStack align="start" gap={0.5} flex={1}>
                                            <Text fontWeight="bold" color="gray.800" fontSize={{ base: "xs", md: "sm" }}>
                                                Schedule 1-on-1 with Manager
                                            </Text>
                                            <Text fontSize="2xs" color="gray.600">
                                                Discuss workload concerns - This week
                                            </Text>
                                        </VStack>
                                    </HStack>
                                </Box>

                                <Box
                                    p={{ base: 2, md: 3 }}
                                    bg="pink.50"
                                    borderRadius="md"
                                    border="1px solid"
                                    borderColor="pink.200"
                                    transition="all 0.2s"
                                    _hover={{ bg: "pink.100", transform: "translateY(-2px)", shadow: "md" }}
                                    cursor="pointer"
                                >
                                    <HStack gap={2} align="start">
                                        <Box mt={0.5}>
                                            <Zap size={14} color="#EC4899" />
                                        </Box>
                                        <VStack align="start" gap={0.5} flex={1}>
                                            <Text fontWeight="bold" color="gray.800" fontSize={{ base: "xs", md: "sm" }}>
                                                Join Wellness Session
                                            </Text>
                                            <Text fontSize="2xs" color="gray.600">
                                                Stress Management Workshop - Tomorrow 2 PM
                                            </Text>
                                        </VStack>
                                    </HStack>
                                </Box>
                            </VStack>
                        </Card.Body>
                    </Card.Root>

                    {/* Quadrant 4: Notifications */}
                    <Card.Root
                        bg="white"
                        border="1px solid"
                        borderColor="gray.200"
                        borderRadius="xl"
                        shadow="sm"
                        h="full"
                        display="flex"
                        flexDirection="column"
                        overflow="hidden"
                    >
                        <Card.Header 
                            p={{ base: 2, md: 3 }} 
                            pb={2} 
                            borderBottom="1px solid" 
                            borderColor="gray.100"
                            bg="gradient-to-r from-blue.50 to-blue.100"
                        >
                            <HStack gap={3}>
                                <Box p={2} bg="blue.500" borderRadius="lg">
                                    <Bell size={18} color="white" />
                                </Box>
                                <VStack align="start" gap={0}>
                                    <Heading size={{ base: "sm", md: "md" }} color="gray.800" fontWeight="700">
                                        Notifications
                                    </Heading>
                                    <Text fontSize="xs" color="gray.600" fontWeight="500">
                                        Stay updated
                                    </Text>
                                    <Text fontSize="2xs" color="gray.600">
                                        {notifications.filter(n => !n.read).length} unread
                                    </Text>
                                </VStack>
                            </HStack>
                        </Card.Header>
                        <Card.Body p={{ base: 2, md: 3 }} flex={1} overflow="hidden">
                            <VStack gap={1} align="stretch">
                                {notifications.map((notification) => {
                                    const Icon = getNotificationIcon(notification.type);
                                    return (
                                        <Box
                                            key={notification.id}
                                            p={{ base: 2, md: 3 }}
                                            bg={notification.read ? "white" : "linear-gradient(135deg, #dbeafe 0%, #bfdbfe 100%)"}
                                            borderRadius="xl"
                                            border="1px solid"
                                            borderColor={notification.read ? "gray.200" : "blue.300"}
                                            cursor="pointer"
                                            onClick={() => markAsRead(notification.id)}
                                            shadow="none"
                                            position="relative"
                                            overflow="hidden"
                                            _before={!notification.read ? {
                                                content: '""',
                                                position: 'absolute',
                                                top: 0,
                                                left: 0,
                                                w: "4px",
                                                h: "full",
                                                bg: "blue.500",
                                                borderRadius: "0 4px 4px 0"
                                            } : {}}
                                        >
                                            <HStack align="start" gap={3}>
                                                <Box
                                                    p={2}
                                                    bg={`${getNotificationColor(notification.type)}.500`}
                                                    borderRadius="lg"
                                                    flexShrink={0}
                                                    display="flex"
                                                    alignItems="center"
                                                    justifyContent="center"
                                                >
                                                    <Icon size={14} color="white" />
                                                </Box>
                                                <VStack align="start" gap={0.5} flex={1}>
                                                    <HStack justify="space-between" w="full">
                                                        <Text
                                                            fontWeight="semibold"
                                                            color="gray.800"
                                                            fontSize={{ base: "2xs", md: "xs" }}
                                                            lineClamp={1}
                                                        >
                                                            {notification.title}
                                                        </Text>
                                                        {!notification.read && (
                                                            <Box
                                                                w={1.5}
                                                                h={1.5}
                                                                bg="blue.500"
                                                                borderRadius="full"
                                                                flexShrink={0}
                                                            />
                                                        )}
                                                    </HStack>
                                                    <Text fontSize="2xs" color="gray.600" lineClamp={2}>
                                                        {notification.message}
                                                    </Text>
                                                </VStack>
                                            </HStack>
                                        </Box>
                                    );
                                })}
                            </VStack>
                        </Card.Body>
                    </Card.Root>

                    {/* Quadrant 5: Technical Skills */}
                    <Card.Root
                        bg="white"
                        border="1px solid"
                        borderColor="gray.200"
                        borderRadius="lg"
                        shadow="sm"
                        h="full"
                        display="flex"
                        flexDirection="column"
                    >
                        <Card.Header p={{ base: 2, md: 3 }} pb={2} borderBottom="1px solid" borderColor="gray.100">
                            <HStack gap={2}>
                                <Box p={1} bg="cyan.100" borderRadius="md">
                                    <Code size={16} color="#0891B2" />
                                </Box>
                                <VStack align="start" gap={0}>
                                    <Heading size={{ base: "xs", md: "sm" }} color="gray.800" fontWeight="bold">
                                        Technical Skills
                                    </Heading>
                                    <Text fontSize="2xs" color="gray.600">
                                        {skills.length} skills
                                    </Text>
                                </VStack>
                            </HStack>
                        </Card.Header>
                        <Card.Body p={{ base: 2, md: 3 }} flex={1} overflow="auto">
                            <VStack gap={2} align="stretch">
                                {skills.map((skill) => {
                                    const categoryColors = {
                                        frontend: { bg: 'purple.100', text: 'purple.700', dot: 'purple.500' },
                                        backend: { bg: 'blue.100', text: 'blue.700', dot: 'blue.500' },
                                        database: { bg: 'green.100', text: 'green.700', dot: 'green.500' },
                                        tools: { bg: 'orange.100', text: 'orange.700', dot: 'orange.500' }
                                    };
                                    const colors = categoryColors[skill.category as keyof typeof categoryColors] || 
                                                   { bg: 'gray.100', text: 'gray.700', dot: 'gray.500' };
                                    
                                    return (
                                        <HStack
                                            key={skill.id}
                                            gap={3}
                                            px={3}
                                            py={2}
                                            bg={colors.bg}
                                            borderRadius="lg"
                                            transition="all 0.2s ease"
                                            _hover={{
                                                shadow: "sm",
                                                transform: "translateX(2px)"
                                            }}
                                            justify="space-between"
                                        >
                                            <Text fontSize="sm" fontWeight="600" color={colors.text} minW="120px">
                                                {skill.name}
                                            </Text>
                                            <HStack gap={0.5} flexShrink={0}>
                                                {[1, 2, 3, 4, 5].map((level) => (
                                                    <Box
                                                        key={level}
                                                        w={2.5}
                                                        h={2.5}
                                                        borderRadius="full"
                                                        bg={level <= skill.level ? colors.dot : 'gray.300'}
                                                    />
                                                ))}
                                            </HStack>
                                        </HStack>
                                    );
                                })}
                            </VStack>
                        </Card.Body>
                    </Card.Root>

                </SimpleGrid>
            </Box>

            {/* Enhanced Event Calendar Modal Overlay */}
            {isCalendarOpen && (
                <Box
                    position="fixed"
                    top={0}
                    left={0}
                    right={0}
                    bottom={0}
                    bg="rgba(0, 0, 0, 0.6)"
                    backdropFilter="blur(10px)"
                    zIndex={1000}
                    display="flex"
                    alignItems="center"
                    justifyContent="center"
                    onClick={() => setIsCalendarOpen(false)}
                    animation="fadeIn 0.3s ease-out"
                    css={{
                        '@keyframes fadeIn': {
                            from: { opacity: 0 },
                            to: { opacity: 1 }
                        }
                    }}
                >
                    <Box
                        bg="white"
                        borderRadius="2xl"
                        boxShadow="2xl"
                        w={{ base: "95%", md: "90%", lg: "85%" }}
                        maxW="1400px"
                        maxH="92vh"
                        overflow="hidden"
                        onClick={(e) => e.stopPropagation()}
                        style={{
                            animation: 'slideUp 0.4s cubic-bezier(0.16, 1, 0.3, 1)'
                        }}
                    >
                        {/* Modal Header with Gradient */}
                        <Box
                            bg="linear-gradient(to right, #a78bfa, #60a5fa, #5eead4)"
                            color="white"
                            p={4}
                            display="flex"
                            justifyContent="space-between"
                            alignItems="center"
                        >
                            <HStack gap={3}>
                                <Box
                                    p={1.5}
                                    bg="whiteAlpha.200"
                                    borderRadius="md"
                                    backdropFilter="blur(10px)"
                                >
                                    <Calendar size={24} />
                                </Box>
                                <VStack align="start" gap={0}>
                                    <Heading size="lg">Event Calendar</Heading>
                                    <Text fontSize="sm" opacity={0.9}>
                                        Discover events tailored for you
                                    </Text>
                                </VStack>
                            </HStack>
                            <IconButton
                                aria-label="Close modal"
                                onClick={() => setIsCalendarOpen(false)}
                                bg="whiteAlpha.200"
                                color="white"
                                size="md"
                                _hover={{ 
                                    bg: 'whiteAlpha.400',
                                    transform: 'rotate(90deg)'
                                }}
                                transition="all 0.3s"
                                borderRadius="full"
                                border="1.5px solid"
                                borderColor="whiteAlpha.300"
                            >
                                <XIcon size={20} strokeWidth={2.5} />
                            </IconButton>
                        </Box>

                        {/* Personalized Recommendations Banner */}
                        {recommendedEvents.length > 0 && (
                            <Box
                                bg="gradient-to-r from-amber-50 to-orange-50"
                                borderBottom="2px solid"
                                borderColor="orange.200"
                                p={4}
                            >
                                <HStack gap={3} align="center">
                                    <Box
                                        p={2}
                                        bg="orange.100"
                                        borderRadius="lg"
                                    >
                                        <SparklesIcon size={24} color="#f97316" />
                                    </Box>
                                    <VStack align="start" gap={0} flex={1}>
                                        <Heading size="sm" color="orange.800">
                                            Recommended For You
                                        </Heading>
                                        <Text fontSize="sm" color="orange.700">
                                            Based on your role as {userProfile.designation}, we suggest these {recommendedEvents.length} events
                                        </Text>
                                    </VStack>
                                </HStack>
                            </Box>
                        )}

                        {/* Category Filter with Colorful Buttons */}
                        <Box p={4} borderBottom="1px solid" borderColor="gray.200" bg="gray.50">
                            <HStack gap={3} flexWrap="wrap">
                                <Button
                                    size="md"
                                    variant={selectedCategory === 'all' ? 'solid' : 'outline'}
                                    colorScheme="gray"
                                    onClick={() => setSelectedCategory('all')}
                                    fontWeight="bold"
                                    borderWidth={2}
                                >
                                    All Events ({events.length})
                                </Button>
                                <Button
                                    size="sm"
                                    bg={selectedCategory === 'csr' ? 'teal.50' : 'white'}
                                    color={selectedCategory === 'csr' ? 'teal.600' : 'gray.500'}
                                    border="1px solid"
                                    borderColor={selectedCategory === 'csr' ? 'teal.200' : 'gray.200'}
                                    onClick={() => setSelectedCategory('csr')}
                                    fontWeight="normal"
                                    _hover={{ bg: 'teal.50', borderColor: 'teal.300' }}
                                >
                                    🌱 CSR Activities
                                </Button>
                                <Button
                                    size="sm"
                                    bg={selectedCategory === 'yoga' ? 'purple.50' : 'white'}
                                    color={selectedCategory === 'yoga' ? 'purple.600' : 'gray.500'}
                                    border="1px solid"
                                    borderColor={selectedCategory === 'yoga' ? 'purple.200' : 'gray.200'}
                                    onClick={() => setSelectedCategory('yoga')}
                                    fontWeight="normal"
                                    _hover={{ bg: 'purple.50', borderColor: 'purple.300' }}
                                >
                                    🧘 Yoga Classes
                                </Button>
                                <Button
                                    size="sm"
                                    bg={selectedCategory === 'wellness' ? 'blue.50' : 'white'}
                                    color={selectedCategory === 'wellness' ? 'blue.600' : 'gray.500'}
                                    border="1px solid"
                                    borderColor={selectedCategory === 'wellness' ? 'blue.200' : 'gray.200'}
                                    onClick={() => setSelectedCategory('wellness')}
                                    fontWeight="normal"
                                    _hover={{ bg: 'blue.50', borderColor: 'blue.300' }}
                                >
                                    💚 Wellness Sessions
                                </Button>
                            </HStack>
                        </Box>

                        {/* Events List with Enhanced Cards */}
                        <Box p={5} maxH="calc(92vh - 280px)" overflow="auto" bg="gray.50">
                            <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} gap={4}>
                                {filteredEvents.map((event) => {
                                    const categoryColor = getCategoryColor(event.category);
                                    return (
                                    <Box
                                        key={event.id}
                                        borderRadius="2xl"
                                        overflow="hidden"
                                        bg="white"
                                        border="1px solid"
                                        borderColor={event.recommended ? 'orange.300' : 'gray.200'}
                                        position="relative"
                                        shadow="sm"
                                        _before={event.recommended ? {
                                            content: '"✨ Recommended"',
                                            position: 'absolute',
                                            top: 3,
                                            right: 3,
                                            bg: 'linear-gradient(135deg, #f59e0b, #d97706)',
                                            color: 'white',
                                            fontSize: 'xs',
                                            fontWeight: 'bold',
                                            px: 2,
                                            py: 1,
                                            borderRadius: 'full',
                                            zIndex: 10
                                        } : {}}
                                    >
                                        {/* Enhanced Event Image */}
                                        <Box
                                            h="220px"
                                            w="full"
                                            overflow="hidden"
                                            position="relative"
                                            _after={{
                                                content: '""',
                                                position: 'absolute',
                                                top: 0,
                                                left: 0,
                                                right: 0,
                                                bottom: 0,
                                                bg: 'linear-gradient(180deg, transparent 0%, rgba(0,0,0,0.1) 50%, rgba(0,0,0,0.3) 100%)',
                                                zIndex: 1
                                            }}
                                        >
                                            <img
                                                src={event.image}
                                                alt={event.title}
                                                style={{
                                                    width: '100%',
                                                    height: '100%',
                                                    objectFit: 'cover',
                                                    transition: 'transform 0.4s ease',
                                                    filter: 'brightness(1.1) contrast(1.1)'
                                                }}
                                            />
                                            <Box
                                                position="absolute"
                                                top={0}
                                                left={0}
                                                right={0}
                                                bottom={0}
                                                bgGradient={`linear(to-b, transparent, ${categoryColor}.900)`}
                                                opacity={0.3}
                                            />
                                        </Box>

                                        {/* Recommended Badge */}
                                        {event.recommended && (
                                            <Box
                                                position="absolute"
                                                top={2}
                                                right={2}
                                                bg="orange.100"
                                                color="orange.700"
                                                px={2}
                                                py={1}
                                                borderRadius="full"
                                                fontSize="xs"
                                                fontWeight="medium"
                                                display="flex"
                                                alignItems="center"
                                                gap={1}
                                                zIndex={1}
                                                border="1px solid"
                                                borderColor="orange.200"
                                            >
                                                <SparklesIcon size={12} />
                                                Recommended
                                            </Box>
                                        )}

                                        <Box p={4}>
                                            <Flex justify="space-between" align="start" mb={3}>
                                                <Badge
                                                    bg={`${categoryColor}.100`}
                                                    color={`${categoryColor}.700`}
                                                    fontSize="xs"
                                                    px={3}
                                                    py={1}
                                                    borderRadius="full"
                                                    fontWeight="medium"
                                                    border="1px solid"
                                                    borderColor={`${categoryColor}.200`}
                                                >
                                                    {getCategoryLabel(event.category)}
                                                </Badge>
                                                <IconButton
                                                    aria-label="Bookmark event"
                                                    size="sm"
                                                    variant="ghost"
                                                    color={event.isBookmarked ? 'yellow.500' : 'gray.400'}
                                                    onClick={() => handleBookmark(event.id)}
                                                    _hover={{ bg: 'yellow.50' }}
                                                >
                                                    {event.isBookmarked ? (
                                                        <BookmarkCheckIcon size={22} fill="currentColor" />
                                                    ) : (
                                                        <BookmarkIcon size={22} />
                                                    )}
                                                </IconButton>
                                            </Flex>

                                            <Heading size="md" mb={2} color="gray.800" lineClamp={2}>
                                                {event.title}
                                            </Heading>

                                            <Text fontSize="sm" color="gray.600" mb={4} lineClamp={2}>
                                                {event.description}
                                            </Text>

                                            <VStack align="start" gap={2} mb={4}>
                                                <HStack gap={2}>
                                                    <Box
                                                        p={1}
                                                        bg={`${getCategoryColor(event.category)}.50`}
                                                        borderRadius="md"
                                                    >
                                                        <Calendar size={14} color={`var(--chakra-colors-${getCategoryColor(event.category)}-600)`} />
                                                    </Box>
                                                    <Text fontSize="sm" color="gray.700" fontWeight="medium">
                                                        {event.date}
                                                    </Text>
                                                </HStack>
                                                <HStack gap={2}>
                                                    <Box
                                                        p={1}
                                                        bg={`${getCategoryColor(event.category)}.50`}
                                                        borderRadius="md"
                                                    >
                                                        <Clock size={14} color={`var(--chakra-colors-${getCategoryColor(event.category)}-600)`} />
                                                    </Box>
                                                    <Text fontSize="sm" color="gray.700" fontWeight="medium">
                                                        {event.time}
                                                    </Text>
                                                </HStack>
                                                <HStack gap={2}>
                                                    <Box
                                                        p={1}
                                                        bg={`${getCategoryColor(event.category)}.50`}
                                                        borderRadius="md"
                                                    >
                                                        <MapPinIcon size={14} color={`var(--chakra-colors-${getCategoryColor(event.category)}-600)`} />
                                                    </Box>
                                                    <Text fontSize="sm" color="gray.700" fontWeight="medium" lineClamp={1}>
                                                        {event.location}
                                                    </Text>
                                                </HStack>
                                            </VStack>

                                            <Box
                                                mb={3}
                                                p={2}
                                                bg={event.spotsAvailable < 10 ? 'red.50' : 'green.50'}
                                                borderRadius="md"
                                                border="1px solid"
                                                borderColor={event.spotsAvailable < 10 ? 'red.200' : 'green.200'}
                                            >
                                                <Text fontSize="xs" color={event.spotsAvailable < 10 ? 'red.700' : 'green.700'} fontWeight="bold" textAlign="center">
                                                    {event.spotsAvailable < 10 ? '⚠️ ' : '✓ '}
                                                    {event.spotsAvailable} of {event.spots} spots available
                                                </Text>
                                            </Box>

                                            <Button
                                                w="full"
                                                size="md"
                                                bg={event.isRegistered ? 'gray.50' : `${getCategoryColor(event.category)}.100`}
                                                color={event.isRegistered ? `${getCategoryColor(event.category)}.600` : `${getCategoryColor(event.category)}.700`}
                                                border="1px solid"
                                                borderColor={`${getCategoryColor(event.category)}.300`}
                                                onClick={() => handleRegister(event.id)}
                                                disabled={!event.isRegistered && event.spotsAvailable === 0}
                                                fontWeight="normal"
                                                _hover={{
                                                    bg: event.isRegistered ? `${getCategoryColor(event.category)}.50` : `${getCategoryColor(event.category)}.200`,
                                                    borderColor: `${getCategoryColor(event.category)}.400`
                                                }}
                                                _active={{
                                                    transform: 'scale(0.98)'
                                                }}
                                                transition="all 0.2s"
                                            >
                                                {event.isRegistered ? '✓ Registered - Click to Cancel' : 'Register Now'}
                                            </Button>
                                        </Box>
                                    </Box>
                                    );
                                })}
                            </SimpleGrid>

                            {filteredEvents.length === 0 && (
                                <Box textAlign="center" py={12}>
                                    <VStack gap={3}>
                                        <Box fontSize="4xl">📅</Box>
                                        <Heading size="md" color="gray.600">No events found</Heading>
                                        <Text color="gray.500">Try selecting a different category</Text>
                                    </VStack>
                                </Box>
                            )}
                        </Box>
                    </Box>
                </Box>
            )}

            {/* Get Help Modal */}
            {isHelpModalOpen && (
                <Box
                    position="fixed"
                    top={0}
                    left={0}
                    right={0}
                    bottom={0}
                    bg="blackAlpha.600"
                    backdropFilter="blur(8px)"
                    zIndex={9999}
                    display="flex"
                    alignItems="center"
                    justifyContent="center"
                    onClick={() => setIsHelpModalOpen(false)}
                    style={{
                        animation: 'fadeIn 0.3s ease-out'
                    }}
                >
                    <Box
                        bg="white"
                        borderRadius="2xl"
                        maxW="900px"
                        w="90%"
                        maxH="90vh"
                        overflow="hidden"
                        onClick={(e) => e.stopPropagation()}
                        style={{
                            animation: 'slideUp 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)'
                        }}
                        shadow="2xl"
                    >
                        {/* Modal Header */}
                        <Box
                            bg="linear-gradient(135deg, #667eea 0%, #764ba2 100%)"
                            p={6}
                            position="relative"
                        >
                            <HStack justify="space-between" align="start">
                                <VStack align="start" gap={1}>
                                    <Heading size="lg" color="white">
                                        How We Can Help You
                                    </Heading>
                                    <Text color="whiteAlpha.900" fontSize="sm">
                                        Explore resources designed to support your wellbeing and growth
                                    </Text>
                                </VStack>
                                <IconButton
                                    aria-label="Close"
                                    onClick={() => setIsHelpModalOpen(false)}
                                    borderRadius="lg"
                                    bg="gray.100"
                                    color="gray.600"
                                    _hover={{ bg: 'gray.200' }}
                                    size="md"
                                >
                                    <XIcon size={20} />
                                </IconButton>
                            </HStack>
                        </Box>

                        {/* Modal Body */}
                        <Box p={6} maxH="calc(90vh - 140px)" overflow="auto">
                            <VStack gap={4} align="stretch">
                                {/* Event Calendar */}
                                <Card.Root
                                    bg="green.50"
                                    border="2px solid"
                                    borderColor="green.200"
                                    borderRadius="xl"
                                    overflow="hidden"
                                    transition="all 0.3s"
                                    _hover={{ transform: 'translateY(-2px)', shadow: 'lg', borderColor: 'green.300' }}
                                    cursor="pointer"
                                    onClick={() => {
                                        setIsHelpModalOpen(false);
                                        setIsCalendarOpen(true);
                                    }}
                                >
                                    <Card.Body p={5}>
                                        <HStack gap={4} align="start">
                                            <Box p={3} bg="green.100" borderRadius="xl" flexShrink={0}>
                                                <Calendar size={32} color="#38A169" />
                                            </Box>
                                            <VStack align="start" gap={2} flex={1}>
                                                <HStack justify="space-between" w="full">
                                                    <Heading size="md" color="green.800">
                                                        Event Calendar
                                                    </Heading>
                                                    <ArrowRight size={20} color="#38A169" />
                                                </HStack>
                                                <Text color="gray.700" fontSize="sm" lineHeight="1.6">
                                                    <strong>Participate in wellness activities</strong> designed to promote your physical and mental health. Join CSR initiatives, yoga sessions, and wellness workshops tailored to your interests.
                                                </Text>
                                                <HStack gap={2} flexWrap="wrap">
                                                    <Badge bg="green.100" color="green.700" px={2} py={1} borderRadius="md" fontSize="xs">
                                                        🧘 Yoga Classes
                                                    </Badge>
                                                    <Badge bg="green.100" color="green.700" px={2} py={1} borderRadius="md" fontSize="xs">
                                                        🌱 CSR Activities
                                                    </Badge>
                                                    <Badge bg="green.100" color="green.700" px={2} py={1} borderRadius="md" fontSize="xs">
                                                        💚 Wellness Sessions
                                                    </Badge>
                                                </HStack>
                                            </VStack>
                                        </HStack>
                                    </Card.Body>
                                </Card.Root>

                                {/* Surveys */}
                                <Card.Root
                                    bg="blue.50"
                                    border="2px solid"
                                    borderColor="blue.200"
                                    borderRadius="xl"
                                    overflow="hidden"
                                    transition="all 0.3s"
                                    _hover={{ transform: 'translateY(-2px)', shadow: 'lg', borderColor: 'blue.300' }}
                                    cursor="pointer"
                                    onClick={() => {
                                        setIsHelpModalOpen(false);
                                        setIsSurveyModalOpen(true);
                                    }}
                                >
                                    <Card.Body p={5}>
                                        <HStack gap={4} align="start">
                                            <Box p={3} bg="blue.100" borderRadius="xl" flexShrink={0}>
                                                <ClipboardList size={32} color="#3182ce" />
                                            </Box>
                                            <VStack align="start" gap={2} flex={1}>
                                                <HStack justify="space-between" w="full">
                                                    <Heading size="md" color="blue.800">
                                                        View Surveys
                                                    </Heading>
                                                    <ArrowRight size={20} color="#3182ce" />
                                                </HStack>
                                                <Text color="gray.700" fontSize="sm" lineHeight="1.6">
                                                    <strong>Share your feedback and concerns</strong> through confidential surveys. View your past responses, manager feedback, and action plans. Track how your input drives positive changes.
                                                </Text>
                                                <HStack gap={2} flexWrap="wrap">
                                                    <Badge bg="blue.100" color="blue.700" px={2} py={1} borderRadius="md" fontSize="xs">
                                                        📝 Wellness Surveys
                                                    </Badge>
                                                    <Badge bg="blue.100" color="blue.700" px={2} py={1} borderRadius="md" fontSize="xs">
                                                        💬 Feedback Forms
                                                    </Badge>
                                                    <Badge bg="blue.100" color="blue.700" px={2} py={1} borderRadius="md" fontSize="xs">
                                                        📊 Engagement Tracking
                                                    </Badge>
                                                </HStack>
                                            </VStack>
                                        </HStack>
                                    </Card.Body>
                                </Card.Root>

                                {/* Access Offerings */}
                                <Card.Root
                                    bg="purple.50"
                                    border="2px solid"
                                    borderColor="purple.200"
                                    borderRadius="xl"
                                    overflow="hidden"
                                    transition="all 0.3s"
                                    _hover={{ transform: 'translateY(-2px)', shadow: 'lg', borderColor: 'purple.300' }}
                                    cursor="pointer"
                                    onClick={() => {
                                        setIsHelpModalOpen(false);
                                        setIsContentModalOpen(true);
                                    }}
                                >
                                    <Card.Body p={5}>
                                        <HStack gap={4} align="start">
                                            <Box p={3} bg="purple.100" borderRadius="xl" flexShrink={0}>
                                                <Gift size={32} color="#9333ea" />
                                            </Box>
                                            <VStack align="start" gap={2} flex={1}>
                                                <HStack justify="space-between" w="full">
                                                    <Heading size="md" color="purple.800">
                                                        Content Library
                                                    </Heading>
                                                    <ArrowRight size={20} color="#9333ea" />
                                                </HStack>
                                                <Text color="gray.700" fontSize="sm" lineHeight="1.6">
                                                    <strong>Discover exclusive benefits and resources</strong> curated for your development. Access learning materials, wellness programs, mental health support, and professional growth opportunities.
                                                </Text>
                                                <HStack gap={2} flexWrap="wrap">
                                                    <Badge bg="purple.100" color="purple.700" px={2} py={1} borderRadius="md" fontSize="xs">
                                                        📚 Learning Resources
                                                    </Badge>
                                                    <Badge bg="purple.100" color="purple.700" px={2} py={1} borderRadius="md" fontSize="xs">
                                                        🎯 Career Development
                                                    </Badge>
                                                    <Badge bg="purple.100" color="purple.700" px={2} py={1} borderRadius="md" fontSize="xs">
                                                        🧠 Mental Health Support
                                                    </Badge>
                                                </HStack>
                                            </VStack>
                                        </HStack>
                                    </Card.Body>
                                </Card.Root>

                                {/* Additional Help */}
                                <Box bg="orange.50" p={4} borderRadius="lg" border="1px solid" borderColor="orange.200">
                                    <HStack gap={3}>
                                        <Box p={2} bg="orange.100" borderRadius="lg">
                                            <HelpCircle size={20} color="#DD6B20" />
                                        </Box>
                                        <VStack align="start" gap={0}>
                                            <Text fontWeight="semibold" color="gray.800" fontSize="sm">
                                                Need More Help?
                                            </Text>
                                            <Text color="gray.600" fontSize="xs">
                                                Contact your manager or HR team for personalized support
                                            </Text>
                                        </VStack>
                                    </HStack>
                                </Box>
                            </VStack>
                        </Box>
                    </Box>
                </Box>
            )}

            {/* Skill Analysis Modal - With Shadow Effect */}
            {isSkillAnalysisOpen && (
                <Box
                    position="fixed"
                    top={0}
                    left={0}
                    right={0}
                    bottom={0}
                    bg="rgba(0, 0, 0, 0.5)"
                    backdropFilter="blur(4px)"
                    zIndex={9999}
                    style={{ animation: 'fadeIn 0.3s ease-out' }}
                    display="flex"
                    alignItems="center"
                    justifyContent="center"
                    p={6}
                >
                    <Box
                        bg="white"
                        borderRadius="2xl"
                        maxW="1600px"
                        w="95%"
                        h="92vh"
                        display="flex"
                        flexDirection="column"
                        overflow="hidden"
                        shadow="2xl"
                        style={{ animation: 'scaleIn 0.3s ease-out' }}
                    >
                        {/* Modal Header - Compact Design */}
                        <Box bg="white" borderBottom="1px solid" borderColor="gray.200">
                            <Box p={3} pb={2}>
                                <HStack justify="space-between">
                                    <HStack gap={2}>
                                        <Box p={2} bg="gray.100" borderRadius="lg">
                                            <TrendingUp size={18} color="#6b7280" />
                                        </Box>
                                        <VStack align="start" gap={0}>
                                            <Heading size="sm" color="gray.800" fontWeight="600">
                                                {skillModalTab === 'skills' ? 'Skill Analysis & Career Growth' : 'Wellness Management'}
                                            </Heading>
                                            <Text fontSize="sm" color="gray.500">
                                                {skillModalTab === 'skills' ? 'Personalized insights based on market trends' : 'Your mental health and wellness resources'}
                                            </Text>
                                        </VStack>
                                    </HStack>
                                    <IconButton
                                        aria-label="Close modal"
                                        onClick={() => {
                                            setIsSkillAnalysisOpen(false);
                                            setActiveTab('overview');
                                            setSkillModalTab('skills');
                                        }}
                                        borderRadius="lg"
                                        variant="ghost"
                                        colorScheme="gray"
                                        size="md"
                                    >
                                        <XIcon size={20} />
                                    </IconButton>
                                </HStack>
                            </Box>
                            
                            {/* Tab Navigation with Hover */}
                            <HStack gap={0} px={3}>
                                <Box
                                    px={3}
                                    py={2}
                                    cursor="pointer"
                                    borderBottom="3px solid"
                                    borderColor={skillModalTab === 'skills' ? 'purple.500' : 'transparent'}
                                    color={skillModalTab === 'skills' ? 'purple.600' : 'gray.500'}
                                    fontWeight={skillModalTab === 'skills' ? '600' : '500'}
                                    fontSize="sm"
                                    transition="all 0.3s ease"
                                    onMouseEnter={() => setSkillModalTab('skills')}
                                    _hover={{
                                        color: 'purple.600',
                                        bg: 'purple.50'
                                    }}
                                    position="relative"
                                >
                                    <HStack gap={2}>
                                        <TrendingUp size={16} />
                                        <Text>Skill Analysis & Growth</Text>
                                    </HStack>
                                </Box>
                                <Box
                                    px={3}
                                    py={2}
                                    cursor="pointer"
                                    borderBottom="3px solid"
                                    borderColor={skillModalTab === 'wellness' ? 'green.500' : 'transparent'}
                                    color={skillModalTab === 'wellness' ? 'green.600' : 'gray.500'}
                                    fontWeight={skillModalTab === 'wellness' ? '600' : '500'}
                                    fontSize="sm"
                                    transition="all 0.3s ease"
                                    onMouseEnter={() => setSkillModalTab('wellness')}
                                    _hover={{
                                        color: 'green.600',
                                        bg: 'green.50'
                                    }}
                                    position="relative"
                                >
                                    <HStack gap={2}>
                                        <SparklesIcon size={16} />
                                        <Text>Wellness Management</Text>
                                    </HStack>
                                </Box>
                            </HStack>
                        </Box>

                        {/* Modal Body - Clean Layout */}
                        <Box flex={1} overflow="hidden" bg="#fafafa" p={3}>
                            {/* Skill Analysis Tab Content */}
                            {skillModalTab === 'skills' && (
                                <Box 
                                    h="full"
                                    style={{ 
                                        animation: 'fadeInSlide 0.4s ease-out',
                                        opacity: 1
                                    }}
                                >
                                    <SimpleGrid columns={{ base: 1, lg: 2 }} gap={3} h="full">
                                {/* Left Column */}
                                <VStack gap={3} align="stretch" overflowY="auto" pr={2}>
                                    {/* Current Skills - Subtle */}
                                    <Box p={3} bg="white" borderRadius="lg" border="1px solid" borderColor="gray.200">
                                        <HStack gap={2} mb={2}>
                                            <Award size={16} color="#9ca3af" />
                                            <Heading size="sm" color="gray.700" fontWeight="600">Your Skills</Heading>
                                        </HStack>
                                        <SimpleGrid columns={2} gap={2}>
                                            {skills.map((skill) => (
                                                <HStack key={skill.id} justify="space-between" p={2} bg="gray.50" borderRadius="md">
                                                    <Text fontSize="xs" fontWeight="600" color="gray.800">{skill.name}</Text>
                                                    <HStack gap={0.5}>
                                                        {[1, 2, 3, 4, 5].map((level) => (
                                                            <Box key={level} w={1.5} h={1.5} borderRadius="full" bg={level <= skill.level ? 'teal.500' : 'gray.300'} />
                                                        ))}
                                                    </HStack>
                                                </HStack>
                                            ))}
                                        </SimpleGrid>
                                    </Box>
                                    
                                    {/* Quick Stats - Subtle */}
                                    <SimpleGrid columns={4} gap={2}>
                                        <Box p={2} bg="white" borderRadius="lg" border="1px solid" borderColor="gray.200" textAlign="center">
                                            <Text fontSize="xl" fontWeight="700" color="gray.700">{skills.length}</Text>
                                            <Text fontSize="2xs" color="gray.500" fontWeight="500">Skills</Text>
                                        </Box>
                                        <Box p={2} bg="white" borderRadius="lg" border="1px solid" borderColor="gray.200" textAlign="center">
                                            <Text fontSize="xl" fontWeight="700" color="gray.700">{skills.filter(s => s.level === 5).length}</Text>
                                            <Text fontSize="2xs" color="gray.500" fontWeight="500">Expert</Text>
                                        </Box>
                                        <Box p={2} bg="white" borderRadius="lg" border="1px solid" borderColor="gray.200" textAlign="center">
                                            <Text fontSize="xl" fontWeight="700" color="gray.700">{projects.length}</Text>
                                            <Text fontSize="2xs" color="gray.500" fontWeight="500">Projects</Text>
                                        </Box>
                                        <Box p={2} bg="white" borderRadius="lg" border="1px solid" borderColor="gray.200" textAlign="center">
                                            <Text fontSize="xl" fontWeight="700" color="gray.700">{projects.reduce((sum, p) => sum + p.allocation, 0)}%</Text>
                                            <Text fontSize="2xs" color="gray.500" fontWeight="500">Engaged</Text>
                                        </Box>
                                    </SimpleGrid>

                                    {/* Recommendations Section - Clean UX */}
                                    <Box p={3} bg="white" borderRadius="lg" border="1px solid" borderColor="gray.200" display="flex" flexDirection="column">
                                        <HStack justify="space-between" mb={2}>
                                            <VStack align="start" gap={0}>
                                                <Heading size="sm" color="gray.700" fontWeight="600">Skills to Learn Next</Heading>
                                                <Text fontSize="xs" color="gray.500">Based on market demand & your profile</Text>
                                            </VStack>
                                            <Badge bg="gray.100" color="gray.700" fontSize="2xs" px={2} py={1} borderRadius="md" fontWeight="600">
                                                6 Recommendations
                                            </Badge>
                                        </HStack>
                                        <VStack gap={1.5} align="stretch">
                                            {/* Skill Card 1 - Advanced React */}
                                            <HStack 
                                                p={2} 
                                                bg="purple.50" 
                                                borderRadius="md" 
                                                border="1px solid" 
                                                borderColor="purple.200"
                                                transition="all 0.2s"
                                                _hover={{ borderColor: "purple.400", bg: "purple.100" }}
                                                cursor="pointer"
                                                justify="space-between"
                                            >
                                                <HStack gap={2} flex={1}>
                                                    <Box p={1.5} bg="purple.200" borderRadius="md">
                                                        <Code size={16} color="#7c3aed" />
                                                    </Box>
                                                    <VStack align="start" gap={0} flex={1}>
                                                        <Text fontWeight="700" color="purple.900" fontSize="xs">Advanced React</Text>
                                                        <Text fontSize="2xs" color="gray.600">Hooks, Performance, Patterns</Text>
                                                    </VStack>
                                                </HStack>
                                                <HStack gap={1.5}>
                                                    <Badge colorScheme="red" fontSize="2xs" px={1.5} py={0.5}>95%</Badge>
                                                    <IconButton
                                                        aria-label="Bookmark"
                                                        size="xs"
                                                        variant="ghost"
                                                        colorScheme="purple"
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            toggleSkillBookmark('Advanced React');
                                                        }}
                                                    >
                                                        {bookmarkedSkills.includes('Advanced React') ? <BookmarkCheckIcon size={12} /> : <BookmarkIcon size={12} />}
                                                    </IconButton>
                                                </HStack>
                                            </HStack>

                                            {/* Skill Card 2 - GraphQL */}
                                            <HStack 
                                                p={2} 
                                                bg="blue.50" 
                                                borderRadius="md" 
                                                border="1px solid" 
                                                borderColor="blue.200"
                                                transition="all 0.2s"
                                                _hover={{ borderColor: "blue.400", bg: "blue.100" }}
                                                cursor="pointer"
                                                justify="space-between"
                                            >
                                                <HStack gap={2} flex={1}>
                                                    <Box p={1.5} bg="blue.200" borderRadius="md">
                                                        <BarChart3 size={16} color="#2563eb" />
                                                    </Box>
                                                    <VStack align="start" gap={0} flex={1}>
                                                        <Text fontWeight="700" color="blue.900" fontSize="xs">GraphQL & APIs</Text>
                                                        <Text fontSize="2xs" color="gray.600">Apollo, Schema, Resolvers</Text>
                                                    </VStack>
                                                </HStack>
                                                <HStack gap={1.5}>
                                                    <Badge colorScheme="orange" fontSize="2xs" px={1.5} py={0.5}>82%</Badge>
                                                    <IconButton
                                                        aria-label="Bookmark"
                                                        size="xs"
                                                        variant="ghost"
                                                        colorScheme="blue"
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            toggleSkillBookmark('GraphQL & APIs');
                                                        }}
                                                    >
                                                        {bookmarkedSkills.includes('GraphQL & APIs') ? <BookmarkCheckIcon size={12} /> : <BookmarkIcon size={12} />}
                                                    </IconButton>
                                                </HStack>
                                            </HStack>

                                            {/* Skill Card 3 - AI/ML */}
                                            <HStack 
                                                p={2} 
                                                bg="red.50" 
                                                borderRadius="md" 
                                                border="1px solid" 
                                                borderColor="red.200"
                                                transition="all 0.2s"
                                                _hover={{ borderColor: "red.400", bg: "red.100" }}
                                                cursor="pointer"
                                                justify="space-between"
                                            >
                                                <HStack gap={2} flex={1}>
                                                    <Box p={1.5} bg="red.200" borderRadius="md">
                                                        <TrendingUp size={16} color="#dc2626" />
                                                    </Box>
                                                    <VStack align="start" gap={0} flex={1}>
                                                        <HStack gap={1}>
                                                            <Text fontWeight="700" color="red.900" fontSize="xs">AI/ML Integration</Text>
                                                            <Text fontSize="xs">🔥</Text>
                                                        </HStack>
                                                        <Text fontSize="2xs" color="gray.600">ChatGPT, TensorFlow, LangChain</Text>
                                                    </VStack>
                                                </HStack>
                                                <HStack gap={1.5}>
                                                    <Badge colorScheme="red" fontSize="2xs" px={1.5} py={0.5}>99%</Badge>
                                                    <IconButton
                                                        aria-label="Bookmark"
                                                        size="xs"
                                                        variant="ghost"
                                                        colorScheme="red"
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            toggleSkillBookmark('AI/ML Integration');
                                                        }}
                                                    >
                                                        {bookmarkedSkills.includes('AI/ML Integration') ? <BookmarkCheckIcon size={12} /> : <BookmarkIcon size={12} />}
                                                    </IconButton>
                                                </HStack>
                                            </HStack>

                                            {/* Skill Card 4 - Python */}
                                            <HStack 
                                                p={2} 
                                                bg="orange.50" 
                                                borderRadius="md" 
                                                border="1px solid" 
                                                borderColor="orange.200"
                                                transition="all 0.2s"
                                                _hover={{ borderColor: "orange.400", bg: "orange.100" }}
                                                cursor="pointer"
                                                justify="space-between"
                                            >
                                                <HStack gap={2} flex={1}>
                                                    <Box p={1.5} bg="orange.200" borderRadius="md">
                                                        <Code size={16} color="#d97706" />
                                                    </Box>
                                                    <VStack align="start" gap={0} flex={1}>
                                                        <Text fontWeight="700" color="orange.900" fontSize="xs">Python & Data Science</Text>
                                                        <Text fontSize="2xs" color="gray.600">Pandas, NumPy, Scikit-learn</Text>
                                                    </VStack>
                                                </HStack>
                                                <HStack gap={1.5}>
                                                    <Badge colorScheme="red" fontSize="2xs" px={1.5} py={0.5}>98%</Badge>
                                                    <IconButton
                                                        aria-label="Bookmark"
                                                        size="xs"
                                                        variant="ghost"
                                                        colorScheme="orange"
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            toggleSkillBookmark('Python & Data Science');
                                                        }}
                                                    >
                                                        {bookmarkedSkills.includes('Python & Data Science') ? <BookmarkCheckIcon size={12} /> : <BookmarkIcon size={12} />}
                                                    </IconButton>
                                                </HStack>
                                            </HStack>

                                            {/* Skill Card 5 - Kubernetes */}
                                            <HStack 
                                                p={2} 
                                                bg="teal.50" 
                                                borderRadius="md" 
                                                border="1px solid" 
                                                borderColor="teal.200"
                                                transition="all 0.2s"
                                                _hover={{ borderColor: "teal.400", bg: "teal.100" }}
                                                cursor="pointer"
                                                justify="space-between"
                                            >
                                                <HStack gap={2} flex={1}>
                                                    <Box p={1.5} bg="teal.200" borderRadius="md">
                                                        <TrendingUp size={16} color="#0d9488" />
                                                    </Box>
                                                    <VStack align="start" gap={0} flex={1}>
                                                        <Text fontWeight="700" color="teal.900" fontSize="xs">Kubernetes & Docker</Text>
                                                        <Text fontSize="2xs" color="gray.600">Container Orchestration</Text>
                                                    </VStack>
                                                </HStack>
                                                <HStack gap={1.5}>
                                                    <Badge colorScheme="orange" fontSize="2xs" px={1.5} py={0.5}>88%</Badge>
                                                    <IconButton
                                                        aria-label="Bookmark"
                                                        size="xs"
                                                        variant="ghost"
                                                        colorScheme="teal"
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            toggleSkillBookmark('Kubernetes & Docker');
                                                        }}
                                                    >
                                                        {bookmarkedSkills.includes('Kubernetes & Docker') ? <BookmarkCheckIcon size={12} /> : <BookmarkIcon size={12} />}
                                                    </IconButton>
                                                </HStack>
                                            </HStack>

                                            {/* Skill Card 6 - Cloud */}
                                            <HStack 
                                                p={2} 
                                                bg="cyan.50" 
                                                borderRadius="md" 
                                                border="1px solid" 
                                                borderColor="cyan.200"
                                                transition="all 0.2s"
                                                _hover={{ borderColor: "cyan.400", bg: "cyan.100" }}
                                                cursor="pointer"
                                                justify="space-between"
                                            >
                                                <HStack gap={2} flex={1}>
                                                    <Box p={1.5} bg="cyan.200" borderRadius="md">
                                                        <Code size={16} color="#0891b2" />
                                                    </Box>
                                                    <VStack align="start" gap={0} flex={1}>
                                                        <Text fontWeight="700" color="cyan.900" fontSize="xs">AWS & Cloud Services</Text>
                                                        <Text fontSize="2xs" color="gray.600">EC2, Lambda, S3</Text>
                                                    </VStack>
                                                </HStack>
                                                <HStack gap={1.5}>
                                                    <Badge colorScheme="orange" fontSize="2xs" px={1.5} py={0.5}>85%</Badge>
                                                    <IconButton
                                                        aria-label="Bookmark"
                                                        size="xs"
                                                        variant="ghost"
                                                        colorScheme="cyan"
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            toggleSkillBookmark('AWS & Cloud Services');
                                                        }}
                                                    >
                                                        {bookmarkedSkills.includes('AWS & Cloud Services') ? <BookmarkCheckIcon size={12} /> : <BookmarkIcon size={12} />}
                                                    </IconButton>
                                                </HStack>
                                            </HStack>
                                        </VStack>
                                    </Box>
                                </VStack>
                                
                                {/* Right Column */}
                                <VStack gap={3} align="stretch" overflowY="auto" pr={2}>

                                    {/* Consolidated Skills Analysis with Learning Curve */}
                                    <Box 
                                        p={3} 
                                        bg="white" 
                                        borderRadius="lg" 
                                        border="1px solid" 
                                        borderColor="gray.200"
                                    >
                                        <HStack gap={2} mb={2}>
                                            <TrendingUp size={16} color="#9ca3af" />
                                            <VStack align="start" gap={0}>
                                                <Heading size="sm" color="gray.700" fontWeight="600">Overall Skill Positioning</Heading>
                                                <Text fontSize="xs" color="gray.500">Your Consolidated Skills vs Market Standard</Text>
                                            </VStack>
                                        </HStack>
                                        
                                        {/* Main Consolidated Chart */}
                                        <Box p={3} bg="gray.50" borderRadius="lg" border="2px solid" borderColor="gray.200">
                                            {/* Stats Summary */}
                                            <HStack justify="space-around" mb={3} p={2} bg="white" borderRadius="lg" shadow="sm">
                                                <VStack gap={0}>
                                                    <Text fontSize="xl" fontWeight="800" color="green.600">65%</Text>
                                                    <Text fontSize="2xs" color="gray.600" fontWeight="600">Your Skills</Text>
                                                </VStack>
                                                
                                                
                                                <Box w="1px" h="30px" bg="gray.300" />
                                                <VStack gap={0}>
                                                    <Text fontSize="xl" fontWeight="800" color="orange.600">35%</Text>
                                                    <Text fontSize="2xs" color="gray.600" fontWeight="600">Gp to Close</Text>
                                                </VStack>
                                            </HStack>
                                            
                                            {/* Comparative Bars with Area Graph */}
                                            <Box position="relative" h="180px" p={2}>
                                                {/* Y-axis labels */}
                                                <VStack position="absolute" left={0} top={0} bottom={0} justify="space-between" align="end" pr={2}>
                                                    <Text fontSize="2xs" color="gray.500" fontWeight="600">100%</Text>
                                                    <Text fontSize="2xs" color="gray.500" fontWeight="600">75%</Text>
                                                    <Text fontSize="2xs" color="gray.500" fontWeight="600">50%</Text>
                                                    <Text fontSize="2xs" color="gray.500" fontWeight="600">25%</Text>
                                                    <Text fontSize="2xs" color="gray.500" fontWeight="600">0%</Text>
                                                </VStack>
                                                
                                                {/* Grid lines */}
                                                <Box position="absolute" left="50px" right="30px" top={0} bottom={0}>
                                                    {[0, 25, 50, 75, 100].map((val, idx) => (
                                                        <Box 
                                                            key={idx}
                                                            position="absolute"
                                                            left={0}
                                                            right={0}
                                                            top={`${100 - val}%`}
                                                            h="1px"
                                                            bg="gray.200"
                                                            opacity={0.5}
                                                        />
                                                    ))}
                                                </Box>
                                                
                                                {/* Chart Content */}
                                                <Box position="absolute" left="50px" right="30px" top="20px" bottom="30px">
                                                    {/* Learning Curve Area Graph - Full Width */}
                                                    <Box
                                                        w="full"
                                                        h="full"
                                                        position="relative"
                                                        cursor="pointer"
                                                    >
                                                        {/* SVG Area Graph - Extended to 100% */}
                                                        <svg width="100%" height="100%" viewBox="0 0 100 100" preserveAspectRatio="none">
                                                            <defs>
                                                                <linearGradient id="areaGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                                                                    <stop offset="0%" stopColor="rgb(251, 146, 60)" stopOpacity={0.7} />
                                                                    <stop offset="100%" stopColor="rgb(251, 146, 60)" stopOpacity={0.15} />
                                                                </linearGradient>
                                                            </defs>
                                                            <path
                                                                d="M 0,35 L 0,100 L 100,100 L 100,0 Q 90,8 80,18 Q 60,32 40,42 Q 20,52 0,60 Z"
                                                                fill="url(#areaGradient)"
                                                                opacity={0.9}
                                                            />
                                                            <path
                                                                d="M 0,35 Q 20,52 40,42 Q 60,32 80,18 Q 90,8 100,0"
                                                                fill="none"
                                                                stroke="rgb(249, 115, 22)"
                                                                strokeWidth={0.5}
                                                                vectorEffect="non-scaling-stroke"
                                                            />
                                                        </svg>
                                                        
                                                        {/* Green Dot at 65% (Your Current Level) */}
                                                        <Box
                                                            position="absolute"
                                                            left="-8px"
                                                            top="35%"
                                                            w="16px"
                                                            h="16px"
                                                            bg="linear-gradient(135deg, rgba(34, 197, 94, 1), rgba(22, 163, 74, 1))"
                                                            borderRadius="full"
                                                            border="3px solid white"
                                                            shadow="xl"
                                                            zIndex={2}
                                                            transition="all 0.3s"
                                                            _hover={{ transform: "scale(1.3)", shadow: "2xl" }}
                                                        />
                                                        <VStack
                                                            position="absolute"
                                                            left="-40px"
                                                            top="35%"
                                                            transform="translateY(-50%)"
                                                            gap={0}
                                                            align="end"
                                                        >
                                                            <Text fontSize="xs" fontWeight="800" color="green.700">65%</Text>
                                                            <Text fontSize="2xs" fontWeight="600" color="gray.600">You</Text>
                                                        </VStack>
                                                        
                                                        {/* Technology Names at Intervals */}
                                                        <VStack position="absolute" left="12%" top="48%" transform="translateY(-50%)" gap={0} pointerEvents="none">
                                                            <Text fontSize="xs" fontWeight="800" color="red.700">AI/ML</Text>
                                                            <Text fontSize="2xs" color="red.600">Critical</Text>
                                                        </VStack>
                                                        
                                                        <VStack position="absolute" left="30%" top="38%" transform="translateY(-50%)" gap={0} pointerEvents="none">
                                                            <Text fontSize="xs" fontWeight="800" color="red.700">Kubernetes</Text>
                                                            <Text fontSize="2xs" color="red.600">High Priority</Text>
                                                        </VStack>
                                                        
                                                        <VStack position="absolute" left="50%" top="28%" transform="translateY(-50%)" gap={0} pointerEvents="none">
                                                            <Text fontSize="xs" fontWeight="800" color="orange.700">DevOps</Text>
                                                            <Text fontSize="2xs" color="orange.600">Important</Text>
                                                        </VStack>
                                                        
                                                        <VStack position="absolute" left="68%" top="18%" transform="translateY(-50%)" gap={0} pointerEvents="none">
                                                            <Text fontSize="xs" fontWeight="800" color="orange.700">Cloud</Text>
                                                            <Text fontSize="2xs" color="orange.600">Medium</Text>
                                                        </VStack>
                                                        
                                                        <VStack position="absolute" left="85%" top="8%" transform="translateY(-50%)" gap={0} pointerEvents="none">
                                                            <Text fontSize="xs" fontWeight="800" color="yellow.700">GraphQL</Text>
                                                            <Text fontSize="2xs" color="yellow.600">Enhance</Text>
                                                        </VStack>
                                                        
                                                        {/* 100% Target Marker */}
                                                        <Box
                                                            position="absolute"
                                                            right="-8px"
                                                            top="0%"
                                                            w="16px"
                                                            h="16px"
                                                            bg="linear-gradient(135deg, rgba(34, 197, 94, 1), rgba(22, 163, 74, 1))"
                                                            borderRadius="full"
                                                            border="3px solid white"
                                                            shadow="xl"
                                                            zIndex={2}
                                                        />
                                                        <VStack
                                                            position="absolute"
                                                            right="-45px"
                                                            top="0%"
                                                            transform="translateY(-50%)"
                                                            gap={0}
                                                            align="start"
                                                        >
                                                            <Text fontSize="xs" fontWeight="800" color="green.700">100%</Text>
                                                            <Text fontSize="2xs" fontWeight="600" color="gray.600">Target</Text>
                                                        </VStack>
                                                            
                                                            {/* Hover Tooltip */}
                                                            <Box
                                                                position="absolute"
                                                                top="-10px"
                                                                left="50%"
                                                                transform="translateX(-50%)"
                                                                bg="gray.900"
                                                                color="white"
                                                                p={3}
                                                                borderRadius="lg"
                                                                shadow="2xl"
                                                                opacity={0}
                                                                _hover={{ opacity: 1 }}
                                                                transition="all 0.3s"
                                                                zIndex={10}
                                                                minW="220px"
                                                            >
                                                                <VStack align="start" gap={1.5}>
                                                                    <Text fontSize="xs" fontWeight="700" color="orange.300">Complete Learning Path:</Text>
                                                                    <VStack align="start" gap={1} pl={2}>
                                                                        <HStack gap={1.5}>
                                                                            <Box w={1.5} h={1.5} bg="red.400" borderRadius="full" />
                                                                            <Text fontSize="2xs">AI/ML (Critical - 69% gap)</Text>
                                                                        </HStack>
                                                                        <HStack gap={1.5}>
                                                                            <Box w={1.5} h={1.5} bg="red.400" borderRadius="full" />
                                                                            <Text fontSize="2xs">Kubernetes (92% gap)</Text>
                                                                        </HStack>
                                                                        <HStack gap={1.5}>
                                                                            <Box w={1.5} h={1.5} bg="red.400" borderRadius="full" />
                                                                            <Text fontSize="2xs">DevOps (90% gap)</Text>
                                                                        </HStack>
                                                                        <HStack gap={1.5}>
                                                                            <Box w={1.5} h={1.5} bg="orange.400" borderRadius="full" />
                                                                            <Text fontSize="2xs">Cloud Technologies (33% gap)</Text>
                                                                        </HStack>
                                                                        <HStack gap={1.5}>
                                                                            <Box w={1.5} h={1.5} bg="orange.400" borderRadius="full" />
                                                                            <Text fontSize="2xs">GraphQL (38% gap)</Text>
                                                                        </HStack>
                                                                        <HStack gap={1.5}>
                                                                            <Box w={1.5} h={1.5} bg="yellow.400" borderRadius="full" />
                                                                            <Text fontSize="2xs">Docker (22% gap)</Text>
                                                                        </HStack>
                                                                    </VStack>
                                                                    <Box w="full" h="1px" bg="whiteAlpha.300" my={1} />
                                                                    <Text fontSize="2xs" color="gray.400">Total Est. Time: 12-18 months</Text>
                                                                </VStack>
                                                                {/* Arrow pointing down */}
                                                                <Box
                                                                    position="absolute"
                                                                    bottom="-8px"
                                                                    left="50%"
                                                                    transform="translateX(-50%)"
                                                                    w={0}
                                                                    h={0}
                                                                    borderLeft="8px solid transparent"
                                                                    borderRight="8px solid transparent"
                                                                    borderTop="8px solid"
                                                                    borderTopColor="gray.900"
                                                                />
                                                            </Box>
                                                    </Box>
                                                </Box>
                                        </Box>
                                        
                                        {/* Key Insights */}
                                        <VStack gap={1.5} mt={2}>
                                            <HStack w="full" p={2} bg="green.50" borderRadius="lg" border="1px solid" borderColor="green.200">
                                                <Box p={1.5} bg="green.100" borderRadius="md">
                                                    <CheckCircle size={14} color="#16a34a" />
                                                </Box>
                                                <VStack align="start" gap={0} flex={1}>
                                                    <Text fontSize="2xs" fontWeight="700" color="green.900">Strong Foundation</Text>
                                                    <Text fontSize="2xs" color="gray.600">React, TypeScript, Python, Node.js</Text>
                                                </VStack>
                                            </HStack>
                                            
                                            <HStack w="full" p={2} bg="orange.50" borderRadius="lg" border="1px solid" borderColor="orange.200">
                                                <Box p={1.5} bg="orange.100" borderRadius="md">
                                                    <AlertCircle size={14} color="#ea580c" />
                                                </Box>
                                                <VStack align="start" gap={0} flex={1}>
                                                    <Text fontSize="2xs" fontWeight="700" color="orange.900">Focus Areas</Text>
                                                    <Text fontSize="2xs" color="gray.600">AI/ML, Kubernetes, DevOps</Text>
                                                </VStack>
                                            </HStack>
                                        </VStack>
                                        </Box>
                                    </Box>

                                    {/* Learning Path Section - Clean Timeline */}
                                    <Box p={3} bg="white" borderRadius="lg" border="1px solid" borderColor="gray.200">
                                        <HStack gap={2} mb={2}>
                                            <ClipboardList size={16} color="#9ca3af" />
                                            <Heading size="sm" color="gray.700" fontWeight="600">Learning Timeline</Heading>
                                        </HStack>
                                        
                                        {/* 3D Timeline */}
                                        <Box p={2} bg="linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)" borderRadius="lg" position="relative">
                                            <HStack gap={2} align="start" position="relative" h="100px">
                                                {/* 3D Timeline Line with Shadow */}
                                                <Box position="absolute" top="35px" left="10%" right="10%" h="4px" bg="linear-gradient(90deg, #a855f7, #3b82f6, #f97316, #10b981)" borderRadius="full" shadow="lg" />
                                                <Box position="absolute" top="38px" left="10%" right="10%" h="2px" bg="blackAlpha.200" filter="blur(2px)" />
                                                
                                                {/* Q1: React */}
                                                <VStack flex={1} align="center" gap={2} position="relative" zIndex={1}>
                                                    <Box 
                                                        w="14" 
                                                        h="14" 
                                                        bg="linear-gradient(135deg, #a855f7 0%, #9333ea 100%)" 
                                                        color="white" 
                                                        borderRadius="xl" 
                                                        display="flex" 
                                                        alignItems="center" 
                                                        justifyContent="center" 
                                                        fontWeight="800" 
                                                        fontSize="lg" 
                                                        border="4px solid" 
                                                        borderColor="white" 
                                                        shadow="xl"
                                                        transform="translateY(-5px)"
                                                        transition="all 0.3s"
                                                        _hover={{ transform: "translateY(-8px) scale(1.1)", shadow: "2xl" }}
                                                    >
                                                        Q1
                                                    </Box>
                                                    <VStack align="center" gap={0.5} p={2.5} bg="white" borderRadius="lg" border="2px solid" borderColor="purple.300" w="full" shadow="md">
                                                        <Text fontWeight="800" color="purple.700" fontSize="xs" textAlign="center">React</Text>
                                                        <Text fontSize="2xs" color="gray.600" textAlign="center" fontWeight="600">Months 1-3</Text>
                                                    </VStack>
                                                </VStack>
                                                
                                                {/* Q2: GraphQL */}
                                                <VStack flex={1} align="center" gap={2} position="relative" zIndex={1}>
                                                    <Box 
                                                        w="14" 
                                                        h="14" 
                                                        bg="linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)" 
                                                        color="white" 
                                                        borderRadius="xl" 
                                                        display="flex" 
                                                        alignItems="center" 
                                                        justifyContent="center" 
                                                        fontWeight="800" 
                                                        fontSize="lg" 
                                                        border="4px solid" 
                                                        borderColor="white" 
                                                        shadow="xl"
                                                        transform="translateY(-5px)"
                                                        transition="all 0.3s"
                                                        _hover={{ transform: "translateY(-8px) scale(1.1)", shadow: "2xl" }}
                                                    >
                                                        Q2
                                                    </Box>
                                                    <VStack align="center" gap={0.5} p={2.5} bg="white" borderRadius="lg" border="2px solid" borderColor="blue.300" w="full" shadow="md">
                                                        <Text fontWeight="800" color="blue.700" fontSize="xs" textAlign="center">GraphQL</Text>
                                                        <Text fontSize="2xs" color="gray.600" textAlign="center" fontWeight="600">Months 4-6</Text>
                                                    </VStack>
                                                </VStack>
                                                
                                                {/* Q3: AI */}
                                                <VStack flex={1} align="center" gap={2} position="relative" zIndex={1}>
                                                    <Box 
                                                        w="14" 
                                                        h="14" 
                                                        bg="linear-gradient(135deg, #f97316 0%, #ea580c 100%)" 
                                                        color="white" 
                                                        borderRadius="xl" 
                                                        display="flex" 
                                                        alignItems="center" 
                                                        justifyContent="center" 
                                                        fontWeight="800" 
                                                        fontSize="lg" 
                                                        border="4px solid" 
                                                        borderColor="white" 
                                                        shadow="xl"
                                                        transform="translateY(-5px)"
                                                        transition="all 0.3s"
                                                        _hover={{ transform: "translateY(-8px) scale(1.1)", shadow: "2xl" }}
                                                    >
                                                        Q3
                                                    </Box>
                                                    <VStack align="center" gap={0.5} p={2.5} bg="white" borderRadius="lg" border="2px solid" borderColor="orange.300" w="full" shadow="md">
                                                        <Text fontWeight="800" color="orange.700" fontSize="xs" textAlign="center">AI 🔥</Text>
                                                        <Text fontSize="2xs" color="gray.600" textAlign="center" fontWeight="600">Months 7-9</Text>
                                                    </VStack>
                                                </VStack>
                                                
                                                {/* Q4: Cloud */}
                                                <VStack flex={1} align="center" gap={2} position="relative" zIndex={1}>
                                                    <Box 
                                                        w="14" 
                                                        h="14" 
                                                        bg="linear-gradient(135deg, #10b981 0%, #059669 100%)" 
                                                        color="white" 
                                                        borderRadius="xl" 
                                                        display="flex" 
                                                        alignItems="center" 
                                                        justifyContent="center" 
                                                        fontWeight="800" 
                                                        fontSize="lg" 
                                                        border="4px solid" 
                                                        borderColor="white" 
                                                        shadow="xl"
                                                        transform="translateY(-5px)"
                                                        transition="all 0.3s"
                                                        _hover={{ transform: "translateY(-8px) scale(1.1)", shadow: "2xl" }}
                                                    >
                                                        Q4
                                                    </Box>
                                                    <VStack align="center" gap={0.5} p={2.5} bg="white" borderRadius="lg" border="2px solid" borderColor="green.300" w="full" shadow="md">
                                                        <Text fontWeight="800" color="green.700" fontSize="xs" textAlign="center">Cloud</Text>
                                                        <Text fontSize="2xs" color="gray.600" textAlign="center" fontWeight="600">Months 10-12</Text>
                                                    </VStack>
                                                </VStack>
                                            </HStack>
                                        </Box>
                                    </Box>

                                </VStack>
                            </SimpleGrid>
                                </Box>
                            )}

                            {/* Wellness Management Tab Content */}
                            {skillModalTab === 'wellness' && (
                                <Box 
                                    h="full" 
                                    style={{ 
                                        animation: 'fadeInSlide 0.4s ease-out',
                                        opacity: 1
                                    }}
                                >
                                    <SimpleGrid columns={{ base: 1, lg: 2 }} gap={3} h="full">
                                        {/* Left Column - Interactive Wellness */}
                                        <VStack gap={2} align="stretch" overflowY="auto" pr={2}>
                                            {/* Quick Actions */}
                                            <SimpleGrid columns={2} gap={2}>
                                                <Box p={2} bg="gray.50" borderRadius="lg" border="1px solid" borderColor="gray.200" cursor="pointer" transition="all 0.2s" _hover={{ bg: "gray.100", shadow: "sm" }}>
                                                    <HStack gap={2}>
                                                        <Box p={1.5} bg="white" borderRadius="md" border="1px solid" borderColor="gray.200">
                                                            <Text fontSize="lg">🧘</Text>
                                                        </Box>
                                                        <VStack align="start" gap={0} flex={1}>
                                                            <Text fontSize="xs" fontWeight="700" color="gray.800">5-Min Meditation</Text>
                                                            <Text fontSize="2xs" color="gray.500">Start now</Text>
                                                        </VStack>
                                                    </HStack>
                                                </Box>
                                                <Box p={2} bg="gray.50" borderRadius="lg" border="1px solid" borderColor="gray.200" cursor="pointer" transition="all 0.2s" _hover={{ bg: "gray.100", shadow: "sm" }}>
                                                    <HStack gap={2}>
                                                        <Box p={1.5} bg="white" borderRadius="md" border="1px solid" borderColor="gray.200">
                                                            <Text fontSize="lg">💪</Text>
                                                        </Box>
                                                        <VStack align="start" gap={0} flex={1}>
                                                            <Text fontSize="xs" fontWeight="700" color="gray.800">Desk Stretches</Text>
                                                            <Text fontSize="2xs" color="gray.500">3 exercises</Text>
                                                        </VStack>
                                                    </HStack>
                                                </Box>
                                                <Box p={2} bg="gray.50" borderRadius="lg" border="1px solid" borderColor="gray.200" cursor="pointer" transition="all 0.2s" _hover={{ bg: "gray.100", shadow: "sm" }}>
                                                    <HStack gap={2}>
                                                        <Box p={1.5} bg="white" borderRadius="md" border="1px solid" borderColor="gray.200">
                                                            <Text fontSize="lg">😴</Text>
                                                        </Box>
                                                        <VStack align="start" gap={0} flex={1}>
                                                            <Text fontSize="xs" fontWeight="700" color="gray.800">Sleep Tracker</Text>
                                                            <Text fontSize="2xs" color="gray.500">7.5h avg</Text>
                                                        </VStack>
                                                    </HStack>
                                                </Box>
                                                <Box p={2} bg="gray.50" borderRadius="lg" border="1px solid" borderColor="gray.200" cursor="pointer" transition="all 0.2s" _hover={{ bg: "gray.100", shadow: "sm" }}>
                                                    <HStack gap={2}>
                                                        <Box p={1.5} bg="white" borderRadius="md" border="1px solid" borderColor="gray.200">
                                                            <Text fontSize="lg">💧</Text>
                                                        </Box>
                                                        <VStack align="start" gap={0} flex={1}>
                                                            <Text fontSize="xs" fontWeight="700" color="gray.800">Water Reminder</Text>
                                                            <Text fontSize="2xs" color="gray.500">6/8 glasses</Text>
                                                        </VStack>
                                                    </HStack>
                                                </Box>
                                            </SimpleGrid>

                                            {/* Today's Wellness Schedule - Clock View */}
                                            <Box 
                                                p={4} 
                                                bg="linear-gradient(135deg, #faf5ff 0%, #f3e8ff 50%, #e9d5ff 100%)" 
                                                borderRadius="xl" 
                                                position="relative" 
                                                overflow="hidden" 
                                                border="1px solid" 
                                                borderColor="purple.200"
                                                boxShadow="0 1px 3px rgba(0,0,0,0.05)"
                                            >
                                                {/* Header with Live Clock */}
                                                <HStack justify="space-between" mb={4}>
                                                    <HStack gap={2}>
                                                        <Box 
                                                            p={2} 
                                                            bg="white" 
                                                            borderRadius="lg"
                                                            border="1px solid"
                                                            borderColor="purple.200"
                                                            style={{ animation: 'pulse 2s infinite' }}
                                                            boxShadow="sm"
                                                        >
                                                            <Clock size={16} color="#9333ea" />
                                                        </Box>
                                                        <Heading size="sm" color="gray.900" fontWeight="700">Today's Schedule</Heading>
                                                    </HStack>
                                                    <Box px={3} py={1} bg="white" borderRadius="lg" border="1px solid" borderColor="purple.200" boxShadow="sm">
                                                        <Text fontSize="xs" fontWeight="700" color="purple.700" fontFamily="monospace">
                                                            {new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
                                                        </Text>
                                                    </Box>
                                                </HStack>

                                                {/* Timeline with Clock Positions */}
                                                <Box position="relative" h="280px">
                                                    {/* Timeline Base */}
                                                    <Box 
                                                        position="absolute" 
                                                        left="50%" 
                                                        top="0" 
                                                        bottom="0" 
                                                        w="2px" 
                                                        bg="gray.200"
                                                        transform="translateX(-50%)"
                                                    />

                                                    {/* Current Time Indicator */}
                                                    <Box
                                                        position="absolute"
                                                        left="50%"
                                                        top="20%"
                                                        w="12px"
                                                        h="12px"
                                                        bg="purple.500"
                                                        borderRadius="full"
                                                        transform="translateX(-50%)"
                                                        boxShadow="0 0 15px rgba(147, 51, 234, 0.4)"
                                                        style={{ animation: 'pulse 2s infinite' }}
                                                        zIndex={2}
                                                    />

                                                    {/* Schedule Items */}
                                                    <VStack gap={3} position="relative" zIndex={1}>
                                                        {/* 9:00 AM */}
                                                        <HStack w="full" justify="space-between" position="relative">
                                                            <Box flex={1} textAlign="right" pr={4}>
                                                                <Text fontSize="xs" fontWeight="600" color="gray.600">9:00 AM</Text>
                                                            </Box>
                                                            <Box w="8px" h="8px" bg="blue.400" borderRadius="full" border="2px solid white" boxShadow="sm" />
                                                            <Box flex={1} pl={4}>
                                                                <Box bg="blue.50" p={2} borderRadius="md" border="1px solid" borderColor="blue.100">
                                                                    <Text fontSize="xs" fontWeight="600" color="gray.800">🧘 Morning Stretch</Text>
                                                                    <Text fontSize="2xs" color="gray.600">5 min desk exercises</Text>
                                                                </Box>
                                                            </Box>
                                                        </HStack>

                                                        {/* 11:00 AM */}
                                                        <HStack w="full" justify="space-between" position="relative">
                                                            <Box flex={1} textAlign="right" pr={4}>
                                                                <Box bg="green.50" p={2} borderRadius="md" border="1px solid" borderColor="green.100">
                                                                    <Text fontSize="xs" fontWeight="600" color="gray.800">💧 Hydration Break</Text>
                                                                    <Text fontSize="2xs" color="gray.600">Drink water</Text>
                                                                </Box>
                                                            </Box>
                                                            <Box w="8px" h="8px" bg="green.400" borderRadius="full" border="2px solid white" boxShadow="sm" />
                                                            <Box flex={1} pl={4}>
                                                                <Text fontSize="xs" fontWeight="600" color="gray.600">11:00 AM</Text>
                                                            </Box>
                                                        </HStack>

                                                        {/* 1:00 PM */}
                                                        <HStack w="full" justify="space-between" position="relative">
                                                            <Box flex={1} textAlign="right" pr={4}>
                                                                <Text fontSize="xs" fontWeight="600" color="gray.600">1:00 PM</Text>
                                                            </Box>
                                                            <Box w="8px" h="8px" bg="orange.400" borderRadius="full" border="2px solid white" boxShadow="sm" />
                                                            <Box flex={1} pl={4}>
                                                                <Box bg="orange.50" p={2} borderRadius="md" border="1px solid" borderColor="orange.100">
                                                                    <Text fontSize="xs" fontWeight="600" color="gray.800">🚶 Lunch & Walk</Text>
                                                                    <Text fontSize="2xs" color="gray.600">15 min outdoor</Text>
                                                                </Box>
                                                            </Box>
                                                        </HStack>

                                                        {/* 3:00 PM */}
                                                        <HStack w="full" justify="space-between" position="relative">
                                                            <Box flex={1} textAlign="right" pr={4}>
                                                                <Box bg="purple.50" p={2} borderRadius="md" border="1px solid" borderColor="purple.100">
                                                                    <Text fontSize="xs" fontWeight="600" color="gray.800">👁️ Eye Rest</Text>
                                                                    <Text fontSize="2xs" color="gray.600">20-20-20 rule</Text>
                                                                </Box>
                                                            </Box>
                                                            <Box w="8px" h="8px" bg="purple.400" borderRadius="full" border="2px solid white" boxShadow="sm" />
                                                            <Box flex={1} pl={4}>
                                                                <Text fontSize="xs" fontWeight="600" color="gray.600">3:00 PM</Text>
                                                            </Box>
                                                        </HStack>

                                                        {/* 5:00 PM */}
                                                        <HStack w="full" justify="space-between" position="relative">
                                                            <Box flex={1} textAlign="right" pr={4}>
                                                                <Text fontSize="xs" fontWeight="600" color="gray.600">5:00 PM</Text>
                                                            </Box>
                                                            <Box w="8px" h="8px" bg="pink.400" borderRadius="full" border="2px solid white" boxShadow="sm" />
                                                            <Box flex={1} pl={4}>
                                                                <Box bg="pink.50" p={2} borderRadius="md" border="1px solid" borderColor="pink.100">
                                                                    <Text fontSize="xs" fontWeight="600" color="gray.800">🧘 Mindful Moment</Text>
                                                                    <Text fontSize="2xs" color="gray.600">3 min breathing</Text>
                                                                </Box>
                                                            </Box>
                                                        </HStack>
                                                    </VStack>
                                                </Box>
                                            </Box>

                                            {/* Wellness Tips Carousel */}
                                            <Box p={3} bg="white" borderRadius="lg" border="1px solid" borderColor="gray.200" position="relative" overflow="hidden">
                                                <Heading size="xs" color="gray.700" fontWeight="600" mb={3}>Wellness Tips</Heading>
                                                <Box 
                                                    style={{ 
                                                        animation: 'scroll 30s linear infinite',
                                                        display: 'flex',
                                                        gap: '8px'
                                                    }}
                                                >
                                                    <Box minW="180px" p={3} bg="blue.50" borderRadius="lg" border="1px solid" borderColor="blue.200" textAlign="center" flexShrink={0}>
                                                        <Text fontSize="3xl" mb={2}>🧘</Text>
                                                        <Text fontSize="xs" fontWeight="700" color="gray.800" mb={1}>Practice Mindfulness</Text>
                                                        <Text fontSize="2xs" color="gray.600">5-10 min daily meditation</Text>
                                                    </Box>
                                                    <Box minW="180px" p={3} bg="green.50" borderRadius="lg" border="1px solid" borderColor="green.200" textAlign="center" flexShrink={0}>
                                                        <Text fontSize="3xl" mb={2}>🧘‍♀️</Text>
                                                        <Text fontSize="xs" fontWeight="700" color="gray.800" mb={1}>Desk Yoga</Text>
                                                        <Text fontSize="2xs" color="gray.600">Stretch at your desk</Text>
                                                    </Box>
                                                    <Box minW="180px" p={3} bg="purple.50" borderRadius="lg" border="1px solid" borderColor="purple.200" textAlign="center" flexShrink={0}>
                                                        <Text fontSize="3xl" mb={2}>👁️</Text>
                                                        <Text fontSize="xs" fontWeight="700" color="gray.800" mb={1}>Eye Rest</Text>
                                                        <Text fontSize="2xs" color="gray.600">20-20-20 rule</Text>
                                                    </Box>
                                                    <Box minW="180px" p={3} bg="orange.50" borderRadius="lg" border="1px solid" borderColor="orange.200" textAlign="center" flexShrink={0}>
                                                        <Text fontSize="3xl" mb={2}>🚶</Text>
                                                        <Text fontSize="xs" fontWeight="700" color="gray.800" mb={1}>Quick Walk</Text>
                                                        <Text fontSize="2xs" color="gray.600">15-min walk boosts mood</Text>
                                                    </Box>
                                                    <Box minW="180px" p={3} bg="pink.50" borderRadius="lg" border="1px solid" borderColor="pink.200" textAlign="center" flexShrink={0}>
                                                        <Text fontSize="3xl" mb={2}>💆</Text>
                                                        <Text fontSize="xs" fontWeight="700" color="gray.800" mb={1}>Neck Stretch</Text>
                                                        <Text fontSize="2xs" color="gray.600">Release tension</Text>
                                                    </Box>
                                                    <Box minW="180px" p={3} bg="cyan.50" borderRadius="lg" border="1px solid" borderColor="cyan.200" textAlign="center" flexShrink={0}>
                                                        <Text fontSize="3xl" mb={2}>😴</Text>
                                                        <Text fontSize="xs" fontWeight="700" color="gray.800" mb={1}>Quality Sleep</Text>
                                                        <Text fontSize="2xs" color="gray.600">7-9 hours nightly</Text>
                                                    </Box>
                                                    <Box minW="180px" p={3} bg="teal.50" borderRadius="lg" border="1px solid" borderColor="teal.200" textAlign="center" flexShrink={0}>
                                                        <Text fontSize="3xl" mb={2}>👥</Text>
                                                        <Text fontSize="xs" fontWeight="700" color="gray.800" mb={1}>Connect Socially</Text>
                                                        <Text fontSize="2xs" color="gray.600">Regular catch-ups</Text>
                                                    </Box>
                                                    {/* Duplicate for seamless loop */}
                                                    <Box minW="180px" p={3} bg="blue.50" borderRadius="lg" border="1px solid" borderColor="blue.200" textAlign="center" flexShrink={0}>
                                                        <Text fontSize="3xl" mb={2}>🧘</Text>
                                                        <Text fontSize="xs" fontWeight="700" color="gray.800" mb={1}>Practice Mindfulness</Text>
                                                        <Text fontSize="2xs" color="gray.600">5-10 min daily meditation</Text>
                                                    </Box>
                                                    <Box minW="180px" p={3} bg="green.50" borderRadius="lg" border="1px solid" borderColor="green.200" textAlign="center" flexShrink={0}>
                                                        <Text fontSize="3xl" mb={2}>🧘‍♀️</Text>
                                                        <Text fontSize="xs" fontWeight="700" color="gray.800" mb={1}>Desk Yoga</Text>
                                                        <Text fontSize="2xs" color="gray.600">Stretch at your desk</Text>
                                                    </Box>
                                                </Box>
                                            </Box>
                                        </VStack>

                                        {/* Right Column - Stress & Resources */}
                                        <VStack gap={2} align="stretch" overflowY="auto" pr={2}>
                                            {/* Quick Stress Relief */}
                                            <Box p={3} bg="white" borderRadius="lg" border="1px solid" borderColor="gray.200">
                                                <HStack gap={2} mb={2}>
                                                    <SparklesIcon size={14} color="#9ca3af" />
                                                    <Heading size="xs" color="gray.700" fontWeight="600">Quick Stress Relief</Heading>
                                                </HStack>
                                                <SimpleGrid columns={2} gap={2}>
                                                    <Box bg="white" borderRadius="lg" overflow="hidden" border="1px solid" borderColor="gray.200" cursor="pointer" transition="all 0.2s" _hover={{ shadow: "md" }}>
                                                        <Box
                                                            h="100px"
                                                            w="100%"
                                                            bgImage="url('https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=400&q=80')"
                                                            bgSize="cover"
                                                            backgroundPosition="center"
                                                            position="relative"
                                                        >
                                                            <Box position="absolute" top={0} left={0} right={0} bottom={0} bg="blackAlpha.300" display="flex" alignItems="center" justifyContent="center">
                                                                <Text fontSize="3xl">🌬️</Text>
                                                            </Box>
                                                        </Box>
                                                        <Box p={2}>
                                                            <Text fontWeight="700" color="gray.800" fontSize="xs" mb={0.5}>Deep Breathing</Text>
                                                            <Text fontSize="2xs" color="gray.500">4-7-8 technique</Text>
                                                        </Box>
                                                    </Box>
                                                    <Box bg="white" borderRadius="lg" overflow="hidden" border="1px solid" borderColor="gray.200" cursor="pointer" transition="all 0.2s" _hover={{ shadow: "md" }}>
                                                        <Box
                                                            h="100px"
                                                            w="100%"
                                                            bgImage="url('https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=400&q=80')"
                                                            bgSize="cover"
                                                            backgroundPosition="center"
                                                            position="relative"
                                                        >
                                                            <Box position="absolute" top={0} left={0} right={0} bottom={0} bg="blackAlpha.300" display="flex" alignItems="center" justifyContent="center">
                                                                <Text fontSize="3xl">🧘</Text>
                                                            </Box>
                                                        </Box>
                                                        <Box p={2}>
                                                            <Text fontWeight="700" color="gray.800" fontSize="xs" mb={0.5}>Muscle Relaxation</Text>
                                                            <Text fontSize="2xs" color="gray.500">Progressive technique</Text>
                                                        </Box>
                                                    </Box>
                                                    <Box bg="white" borderRadius="lg" overflow="hidden" border="1px solid" borderColor="gray.200" cursor="pointer" transition="all 0.2s" _hover={{ shadow: "md" }}>
                                                        <Box
                                                            h="100px"
                                                            w="100%"
                                                            bgImage="url('https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=400&q=80')"
                                                            bgSize="cover"
                                                            backgroundPosition="center"
                                                            position="relative"
                                                        >
                                                            <Box position="absolute" top={0} left={0} right={0} bottom={0} bg="blackAlpha.300" display="flex" alignItems="center" justifyContent="center">
                                                                <Text fontSize="3xl">🌳</Text>
                                                            </Box>
                                                        </Box>
                                                        <Box p={2}>
                                                            <Text fontWeight="700" color="gray.800" fontSize="xs" mb={0.5}>Nature Therapy</Text>
                                                            <Text fontSize="2xs" color="gray.500">20 min outdoors</Text>
                                                        </Box>
                                                    </Box>
                                                    <Box bg="white" borderRadius="lg" overflow="hidden" border="1px solid" borderColor="gray.200" cursor="pointer" transition="all 0.2s" _hover={{ shadow: "md" }}>
                                                        <Box
                                                            h="100px"
                                                            w="100%"
                                                            bgImage="url('https://images.unsplash.com/photo-1511379938547-c1f69419868d?w=400&q=80')"
                                                            bgSize="cover"
                                                            backgroundPosition="center"
                                                            position="relative"
                                                        >
                                                            <Box position="absolute" top={0} left={0} right={0} bottom={0} bg="blackAlpha.300" display="flex" alignItems="center" justifyContent="center">
                                                                <Text fontSize="3xl">🎵</Text>
                                                            </Box>
                                                        </Box>
                                                        <Box p={2}>
                                                            <Text fontWeight="700" color="gray.800" fontSize="xs" mb={0.5}>Music Therapy</Text>
                                                            <Text fontSize="2xs" color="gray.500">Calming sounds</Text>
                                                        </Box>
                                                    </Box>
                                                </SimpleGrid>
                                            </Box>

                                            {/* Professional Support */}
                                            <Box p={3} bg="red.50" borderRadius="lg" border="1px solid" borderColor="red.200">
                                                <HStack gap={2} mb={2}>
                                                    <AlertCircle size={14} color="#dc2626" />
                                                    <Heading size="xs" color="red.900" fontWeight="600">Need Support?</Heading>
                                                </HStack>
                                                <VStack gap={1.5} align="stretch">
                                                    <Text fontSize="2xs" color="gray.700" fontWeight="600">Reach out if experiencing:</Text>
                                                    <VStack gap={1} align="stretch" pl={2}>
                                                        <HStack gap={1.5}>
                                                            <Box w={1} h={1} bg="red.500" borderRadius="full" flexShrink={0} mt={0.5} />
                                                            <Text fontSize="2xs" color="gray.700">Persistent sadness</Text>
                                                        </HStack>
                                                        <HStack gap={1.5}>
                                                            <Box w={1} h={1} bg="red.500" borderRadius="full" flexShrink={0} mt={0.5} />
                                                            <Text fontSize="2xs" color="gray.700">Sleep/appetite changes</Text>
                                                        </HStack>
                                                        <HStack gap={1.5}>
                                                            <Box w={1} h={1} bg="red.500" borderRadius="full" flexShrink={0} mt={0.5} />
                                                            <Text fontSize="2xs" color="gray.700">Anxiety or panic attacks</Text>
                                                        </HStack>
                                                    </VStack>
                                                    <Box mt={1} p={2} bg="white" borderRadius="md">
                                                        <Text fontSize="2xs" fontWeight="600" color="blue.900" mb={0.5}>💙 Company Resources</Text>
                                                        <Text fontSize="2xs" color="gray.600">Contact HR for EAP & counseling</Text>
                                                    </Box>
                                                    
                                                    {/* Spacer to push button down */}
                                                    <Box flex={1} />
                                                    
                                                    {/* Talk to Expert Button - Centered */}
                                                    <Box 
                                                        mt="auto"
                                                        mb={0}
                                                        px={4}
                                                        py={2.5}
                                                        bg="linear-gradient(135deg, #667eea 0%, #764ba2 100%)"
                                                        borderRadius="lg" 
                                                        cursor="pointer" 
                                                        transition="all 0.3s" 
                                                        _hover={{ 
                                                            transform: "translateY(-2px) scale(1.05)", 
                                                            shadow: "xl",
                                                            bg: "linear-gradient(135deg, #5568d3 0%, #6a3f8f 100%)"
                                                        }}
                                                        onClick={() => setIsExpertChatOpen(true)}
                                                        position="relative"
                                                        overflow="hidden"
                                                        boxShadow="0 4px 12px rgba(102, 126, 234, 0.5)"
                                                        textAlign="center"
                                                    >
                                                        <HStack gap={2} justify="center">
                                                            <Text fontSize="2xl" style={{ animation: 'bounceChat 1.5s infinite' }}>💬</Text>
                                                            <Text fontSize="sm" fontWeight="700" color="white">Talk to Expert</Text>
                                                        </HStack>
                                                    </Box>
                                                </VStack>
                                            </Box>

                                        </VStack>
                                    </SimpleGrid>
                                </Box>
                            )}
                        </Box>
                    </Box>
                </Box>
            )}

            {/* Concern Modal */}
            {isConcernModalOpen && (
                <Box
                    position="fixed"
                    top={0}
                    left={0}
                    right={0}
                    bottom={0}
                    bg="rgba(0, 0, 0, 0.6)"
                    backdropFilter="blur(8px)"
                    zIndex={9999}
                    display="flex"
                    alignItems="center"
                    justifyContent="center"
                    onClick={() => setIsConcernModalOpen(false)}
                    style={{ animation: 'fadeIn 0.3s ease-out' }}
                >
                    <Box
                        bg="white"
                        borderRadius="2xl"
                        maxW="500px"
                        w="90%"
                        p={6}
                        onClick={(e) => e.stopPropagation()}
                        style={{ animation: 'slideUp 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)' }}
                        shadow="2xl"
                    >
                        {/* Modal Header */}
                        <HStack justify="space-between" mb={4}>
                            <HStack gap={3}>
                                <Box p={2} bg="orange.100" borderRadius="lg">
                                    <AlertCircle size={24} color="#f97316" />
                                </Box>
                                <VStack align="start" gap={0}>
                                    <Heading size="md" color="gray.800">
                                        Raise a Concern
                                    </Heading>
                                    <Text fontSize="sm" color="gray.600">
                                        Share your concerns with us
                                    </Text>
                                </VStack>
                            </HStack>
                            <IconButton
                                aria-label="Close modal"
                                onClick={() => setIsConcernModalOpen(false)}
                                variant="ghost"
                                color="gray.500"
                                _hover={{ bg: 'gray.100' }}
                                size="sm"
                            >
                                <XIcon size={20} />
                            </IconButton>
                        </HStack>

                        {/* Modal Body */}
                        <VStack gap={4} align="stretch">
                            <Box>
                                <Text fontSize="sm" fontWeight="600" color="gray.700" mb={2}>
                                    Describe your concern
                                </Text>
                                <textarea
                                    value={concernText}
                                    onChange={(e) => setConcernText(e.target.value)}
                                    placeholder="Please describe your concern in detail..."
                                    style={{
                                        width: '100%',
                                        minHeight: '150px',
                                        padding: '12px',
                                        borderRadius: '12px',
                                        border: '1px solid #e2e8f0',
                                        fontSize: '14px',
                                        fontFamily: 'inherit',
                                        resize: 'vertical'
                                    }}
                                />
                            </Box>

                            {/* Action Buttons */}
                            <HStack gap={3} justify="flex-end">
                                <Button
                                    variant="outline"
                                    onClick={() => {
                                        setConcernText('');
                                        setIsConcernModalOpen(false);
                                    }}
                                    borderRadius="lg"
                                >
                                    Cancel
                                </Button>
                                <Button
                                    bg="linear-gradient(135deg, #fb923c 0%, #f97316 100%)"
                                    color="white"
                                    onClick={() => {
                                        // Handle concern submission
                                        console.log('Concern submitted:', concernText);
                                        alert('Your concern has been submitted successfully!');
                                        setConcernText('');
                                        setIsConcernModalOpen(false);
                                    }}
                                    disabled={!concernText.trim()}
                                    _hover={{
                                        bg: "linear-gradient(135deg, #f97316 0%, #ea580c 100%)"
                                    }}
                                    borderRadius="lg"
                                >
                                    Submit Concern
                                </Button>
                            </HStack>
                        </VStack>
                    </Box>
                </Box>
            )}

            {/* Expert Chat Modal */}
            {isExpertChatOpen && (
                <Box
                    position="fixed"
                    top={0}
                    left={0}
                    right={0}
                    bottom={0}
                    bg="rgba(0, 0, 0, 0.6)"
                    backdropFilter="blur(8px)"
                    zIndex={9999}
                    display="flex"
                    alignItems="center"
                    justifyContent="center"
                    onClick={() => {
                        setIsExpertChatOpen(false);
                        setIsAnonymous(false);
                        setIsConnecting(false);
                        setShowWelcome(false);
                    }}
                    style={{ animation: 'fadeIn 0.3s ease-out' }}
                >
                    <Box
                        bg="white"
                        borderRadius="2xl"
                        maxW={isAnonymous ? "700px" : "500px"}
                        w="90%"
                        maxH={isAnonymous ? "700px" : "600px"}
                        onClick={(e) => e.stopPropagation()}
                        style={{ animation: 'slideUp 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)' }}
                        shadow="2xl"
                        overflow="hidden"
                    >
                        {/* Modal Header */}
                        <HStack justify="space-between" p={4} borderBottom="1px solid" borderColor="gray.200" bg="linear-gradient(135deg, #667eea 0%, #764ba2 100%)">
                            <HStack gap={3}>
                                <Box 
                                    p={2} 
                                    bg="whiteAlpha.300" 
                                    borderRadius="lg"
                                    style={{
                                        animation: 'bounceChat 2s infinite'
                                    }}
                                >
                                    <MessageCircle size={24} color="white" />
                                </Box>
                                <VStack align="start" gap={0}>
                                    <Heading size="md" color="white">
                                        Talk to Expert
                                    </Heading>
                                    <Text fontSize="sm" color="whiteAlpha.900">
                                        Confidential wellness support
                                    </Text>
                                </VStack>
                            </HStack>
                            <IconButton
                                aria-label="Close modal"
                                onClick={() => {
                                    setIsExpertChatOpen(false);
                                    setIsAnonymous(false);
                                    setIsConnecting(false);
                                }}
                                variant="ghost"
                                color="white"
                                _hover={{ bg: 'whiteAlpha.300' }}
                                size="sm"
                            >
                                <XIcon size={20} />
                            </IconButton>
                        </HStack>

                        {/* Modal Body */}
                        <Box p={6}>
                            {!isAnonymous && !isConnecting ? (
                                // Initial Screen - Anonymous Option
                                <VStack gap={6} align="stretch">
                                    <VStack gap={2}>
                                        <Text fontSize="lg" fontWeight="700" color="gray.800" textAlign="center">
                                            How would you like to connect?
                                        </Text>
                                        <Text fontSize="sm" color="gray.600" textAlign="center">
                                            Choose your preferred mode of communication
                                        </Text>
                                    </VStack>

                                    <VStack gap={3}>
                                        {/* Go Anonymous Option */}
                                        <Box
                                            p={4}
                                            bg="purple.50"
                                            borderRadius="xl"
                                            border="2px solid"
                                            borderColor="purple.200"
                                            cursor="pointer"
                                            transition="all 0.2s"
                                            _hover={{ borderColor: "purple.400", bg: "purple.100", transform: "translateY(-2px)" }}
                                            onClick={() => {
                                                setIsAnonymous(true);
                                                setIsConnecting(true);
                                                setTimeout(() => {
                                                    setIsConnecting(false);
                                                    setShowWelcome(true);
                                                }, 3000);
                                            }}
                                            w="full"
                                        >
                                            <HStack gap={3}>
                                                <Box p={3} bg="purple.500" borderRadius="lg">
                                                    <Text fontSize="2xl">🎭</Text>
                                                </Box>
                                                <VStack align="start" gap={1} flex={1}>
                                                    <Text fontSize="md" fontWeight="700" color="gray.800">
                                                        Go Anonymous
                                                    </Text>
                                                    <Text fontSize="sm" color="gray.600">
                                                        Your identity will remain completely private
                                                    </Text>
                                                </VStack>
                                                <ArrowRight size={20} color="#6b7280" />
                                            </HStack>
                                        </Box>

                                        {/* Use My Profile Option */}
                                        <Box
                                            p={4}
                                            bg="blue.50"
                                            borderRadius="xl"
                                            border="2px solid"
                                            borderColor="blue.200"
                                            cursor="pointer"
                                            transition="all 0.2s"
                                            _hover={{ borderColor: "blue.400", bg: "blue.100", transform: "translateY(-2px)" }}
                                            onClick={() => {
                                                setIsAnonymous(false);
                                                setIsConnecting(true);
                                            }}
                                            w="full"
                                        >
                                            <HStack gap={3}>
                                                <Box p={3} bg="blue.500" borderRadius="lg">
                                                    <User size={24} color="white" />
                                                </Box>
                                                <VStack align="start" gap={1} flex={1}>
                                                    <Text fontSize="md" fontWeight="700" color="gray.800">
                                                        Use My Profile
                                                    </Text>
                                                    <Text fontSize="sm" color="gray.600">
                                                        Expert can see your profile for personalized help
                                                    </Text>
                                                </VStack>
                                                <ArrowRight size={20} color="#6b7280" />
                                            </HStack>
                                        </Box>
                                    </VStack>

                                    <Box p={3} bg="gray.50" borderRadius="lg">
                                        <Text fontSize="xs" color="gray.600" textAlign="center">
                                            🔒 All conversations are confidential and secure
                                        </Text>
                                    </Box>
                                </VStack>
                            ) : showWelcome ? (
                                // Welcome Screen
                                <VStack gap={6} p={6}>
                                    <Box textAlign="center">
                                        <Text fontSize="4xl" mb={2}>👋</Text>
                                        <Heading size="xl" color="gray.900" mb={2}>
                                            Welcome to Safe Space
                                        </Heading>
                                        <Text fontSize="md" color="gray.600">
                                            {isAnonymous ? 'You are chatting anonymously' : 'Connected with your profile'}
                                        </Text>
                                    </Box>

                                    <Box p={4} bg="purple.50" borderRadius="xl" border="1px solid" borderColor="purple.200">
                                        <VStack gap={3} align="stretch">
                                            <Text fontSize="sm" fontWeight="600" color="gray.800">
                                                Our wellness expert is here to help you with:
                                            </Text>
                                            <VStack gap={2} align="stretch">
                                                <HStack gap={2}>
                                                    <Text>✓</Text>
                                                    <Text fontSize="sm" color="gray.700">Stress and anxiety management</Text>
                                                </HStack>
                                                <HStack gap={2}>
                                                    <Text>✓</Text>
                                                    <Text fontSize="sm" color="gray.700">Work-life balance guidance</Text>
                                                </HStack>
                                                <HStack gap={2}>
                                                    <Text>✓</Text>
                                                    <Text fontSize="sm" color="gray.700">Mental health support</Text>
                                                </HStack>
                                                <HStack gap={2}>
                                                    <Text>✓</Text>
                                                    <Text fontSize="sm" color="gray.700">Confidential counseling</Text>
                                                </HStack>
                                            </VStack>
                                        </VStack>
                                    </Box>

                                    <Box p={4} bg="blue.50" borderRadius="lg">
                                        <Text fontSize="sm" color="blue.900" textAlign="center" fontWeight="600">
                                            💙 Remember: This is a safe, judgment-free space
                                        </Text>
                                    </Box>

                                    <Button
                                        bg="linear-gradient(135deg, #667eea 0%, #764ba2 100%)"
                                        color="white"
                                        size="lg"
                                        w="full"
                                        _hover={{ bg: "linear-gradient(135deg, #5568d3 0%, #6a3f8f 100%)" }}
                                    >
                                        Start Conversation
                                    </Button>
                                </VStack>
                            ) : (
                                // Connecting Screen
                                <VStack gap={6} py={8}>
                                    <Box
                                        style={{
                                            animation: 'pulse 1.5s infinite'
                                        }}
                                    >
                                        <Box
                                            p={6}
                                            bg="linear-gradient(135deg, #667eea 0%, #764ba2 100%)"
                                            borderRadius="full"
                                            position="relative"
                                        >
                                            <MessageCircle size={48} color="white" />
                                            <Box
                                                position="absolute"
                                                top={0}
                                                left={0}
                                                right={0}
                                                bottom={0}
                                                borderRadius="full"
                                                border="4px solid"
                                                borderColor="purple.300"
                                                style={{
                                                    animation: 'ping 1.5s infinite'
                                                }}
                                            />
                                        </Box>
                                    </Box>

                                    <VStack gap={2}>
                                        <Heading size="lg" color="gray.800" textAlign="center">
                                            Connecting to Expert...
                                        </Heading>
                                        <Text fontSize="md" color="gray.600" textAlign="center">
                                            {isAnonymous ? '🎭 Anonymous Mode Active' : '👤 Using Your Profile'}
                                        </Text>
                                        <Text fontSize="sm" color="gray.500" textAlign="center">
                                            Please wait while we connect you with a wellness expert
                                        </Text>
                                    </VStack>

                                    <HStack gap={2}>
                                        <Box w={2} h={2} bg="purple.500" borderRadius="full" style={{ animation: 'bounce 1s infinite 0s' }} />
                                        <Box w={2} h={2} bg="purple.500" borderRadius="full" style={{ animation: 'bounce 1s infinite 0.2s' }} />
                                        <Box w={2} h={2} bg="purple.500" borderRadius="full" style={{ animation: 'bounce 1s infinite 0.4s' }} />
                                    </HStack>

                                    <Button
                                        variant="outline"
                                        onClick={() => {
                                            setIsConnecting(false);
                                            setIsAnonymous(false);
                                        }}
                                        borderRadius="lg"
                                        size="sm"
                                    >
                                        Cancel
                                    </Button>
                                </VStack>
                            )}
                        </Box>
                    </Box>
                </Box>
            )}

            {/* Survey Responses Modal */}
            {isSurveyModalOpen && (
                <Box
                    position="fixed"
                    top={0}
                    left={0}
                    right={0}
                    bottom={0}
                    bg="rgba(0, 0, 0, 0.6)"
                    backdropFilter="blur(8px)"
                    zIndex={9999}
                    display="flex"
                    alignItems="center"
                    justifyContent="center"
                    onClick={() => setIsSurveyModalOpen(false)}
                    style={{ animation: 'fadeIn 0.3s ease-out' }}
                >
                    <Box
                        bg="white"
                        borderRadius="2xl"
                        maxW="1200px"
                        w="95%"
                        maxH="90vh"
                        overflow="hidden"
                        onClick={(e) => e.stopPropagation()}
                        boxShadow="0 25px 50px -12px rgba(0, 0, 0, 0.25)"
                        style={{ animation: 'slideUp 0.3s ease-out' }}
                    >
                        {/* Modal Header */}
                        <Box
                            p={6}
                            borderBottom="1px solid"
                            borderColor="gray.200"
                            bg="linear-gradient(135deg, #667eea 0%, #764ba2 100%)"
                        >
                            <HStack justify="space-between" align="center">
                                <HStack gap={3}>
                                    <Box p={3} bg="whiteAlpha.200" borderRadius="xl">
                                        <FileText size={28} color="white" />
                                    </Box>
                                    <VStack align="start" gap={0}>
                                        <Heading size="lg" color="white" fontWeight="700">Survey Responses</Heading>
                                        <Text fontSize="sm" color="whiteAlpha.900">View your feedback and manager responses</Text>
                                    </VStack>
                                </HStack>
                                <IconButton
                                    aria-label="Close"
                                    onClick={() => setIsSurveyModalOpen(false)}
                                    bg="whiteAlpha.200"
                                    color="white"
                                    _hover={{ bg: "whiteAlpha.300" }}
                                    borderRadius="lg"
                                    size="lg"
                                >
                                    <XIcon size={24} />
                                </IconButton>
                            </HStack>
                        </Box>

                        {/* Modal Body */}
                        <Box p={6} overflowY="auto" maxH="calc(90vh - 120px)">
                            <VStack gap={4} align="stretch">
                                {/* Survey Response Card 1 */}
                                <Box borderRadius="xl" border="2px solid" borderColor="green.200" boxShadow="sm" overflow="hidden">
                                    {/* Header with subtle color */}
                                    <Box p={5} bg="linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%)">
                                        <HStack justify="space-between">
                                            <VStack align="start" gap={1}>
                                                <Heading size="md" color="gray.800">Q4 2024 Wellness Check-in</Heading>
                                                <HStack gap={2}>
                                                    <Badge colorScheme="green" fontSize="xs" px={2} py={1}>Reviewed</Badge>
                                                    <Text fontSize="sm" color="gray.600">Submitted: Oct 15, 2024</Text>
                                                </HStack>
                                            </VStack>
                                            <Box p={3} bg="white" borderRadius="lg" boxShadow="sm">
                                                <CheckCircle size={24} color="#22c55e" />
                                            </Box>
                                        </HStack>
                                    </Box>
                                    
                                    {/* Body */}
                                    <Box p={5} bg="white">

                                    {/* Your Responses */}
                                    <Box mb={4} p={4} bg="gray.50" borderRadius="lg">
                                        <Heading size="sm" color="gray.800" mb={3}>Your Responses</Heading>
                                        <VStack gap={3} align="stretch">
                                            <Box>
                                                <Text fontSize="sm" fontWeight="600" color="gray.700" mb={1}>
                                                    How would you rate your current work-life balance?
                                                </Text>
                                                <Text fontSize="sm" color="gray.600">
                                                    2/5 - Struggling with long hours and tight deadlines
                                                </Text>
                                            </Box>
                                            <Box>
                                                <Text fontSize="sm" fontWeight="600" color="gray.700" mb={1}>
                                                    What challenges are you facing?
                                                </Text>
                                                <Text fontSize="sm" color="gray.600">
                                                    Working late nights frequently due to project deadlines. Finding it difficult to disconnect after work hours.
                                                </Text>
                                            </Box>
                                        </VStack>
                                    </Box>

                                    {/* Manager Response */}
                                    <Box p={4} bg="purple.50" borderRadius="lg" border="1px solid" borderColor="purple.200">
                                        <HStack justify="space-between" mb={3}>
                                            <HStack gap={2}>
                                                <Box p={2} bg="purple.100" borderRadius="lg">
                                                    <User size={16} color="#9333ea" />
                                                </Box>
                                                <VStack align="start" gap={0}>
                                                    <Text fontSize="sm" fontWeight="700" color="gray.800">Manager Response</Text>
                                                    <Text fontSize="xs" color="gray.600">Sarah Johnson • Oct 18, 2024</Text>
                                                </VStack>
                                            </HStack>
                                            <Badge colorScheme="red" fontSize="xs">High Priority</Badge>
                                        </HStack>
                                        <Text fontSize="sm" color="gray.700" mb={3}>
                                            Thank you for sharing your concerns. I understand the pressure you've been under with the recent project deadlines. Your wellbeing is a priority, and we need to address this immediately.
                                        </Text>
                                        <Box p={3} bg="white" borderRadius="md">
                                            <Text fontSize="sm" fontWeight="600" color="gray.800" mb={2}>Action Plan:</Text>
                                            <VStack align="stretch" gap={1}>
                                                <Text fontSize="sm" color="gray.700">• Redistributing tasks within the team to balance workload</Text>
                                                <Text fontSize="sm" color="gray.700">• Implementing no-meeting Fridays for focused work</Text>
                                                <Text fontSize="sm" color="gray.700">• Enrolling you in stress management workshop</Text>
                                                <Text fontSize="sm" color="gray.700">• Setting up bi-weekly 1-on-1 check-ins</Text>
                                            </VStack>
                                        </Box>
                                    </Box>
                                    
                                    {/* Action Buttons */}
                                    <Box p={5} pt={0}>
                                        <HStack gap={3} justify="flex-end">
                                            <Button
                                                size="sm"
                                                variant="outline"
                                                colorScheme="gray"
                                            >
                                                <MessageCircle size={16} />
                                                Add Comment
                                            </Button>
                                            <Button
                                                size="sm"
                                                backgroundColor="cornflowerblue"
                                                colorScheme="green"
                                            >
                                                <CheckCircle size={16} />
                                                Accept Response
                                            </Button>
                                        </HStack>
                                    </Box>
                                    </Box>
                                </Box>

                                {/* Survey Response Card 2 */}
                                <Box borderRadius="xl" border="2px solid" borderColor="blue.200" boxShadow="sm" overflow="hidden">
                                    {/* Header with subtle color */}
                                    <Box p={5} bg="linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%)">
                                        <HStack justify="space-between">
                                            <VStack align="start" gap={1}>
                                                <Heading size="md" color="gray.800">Employee Engagement Survey - October</Heading>
                                                <HStack gap={2}>
                                                    <Badge colorScheme="blue" fontSize="xs" px={2} py={1}>Reviewed</Badge>
                                                    <Text fontSize="sm" color="gray.600">Submitted: Oct 20, 2024</Text>
                                                </HStack>
                                            </VStack>
                                            <Box p={3} bg="white" borderRadius="lg" boxShadow="sm">
                                                <CheckCircle size={24} color="#3b82f6" />
                                            </Box>
                                        </HStack>
                                    </Box>
                                    
                                    {/* Body */}
                                    <Box p={5} bg="white">

                                    {/* Your Responses */}
                                    <Box mb={4} p={4} bg="gray.50" borderRadius="lg">
                                        <Heading size="sm" color="gray.800" mb={3}>Your Responses</Heading>
                                        <VStack gap={3} align="stretch">
                                            <Box>
                                                <Text fontSize="sm" fontWeight="600" color="gray.700" mb={1}>
                                                    How engaged do you feel with your current projects?
                                                </Text>
                                                <Text fontSize="sm" color="gray.600">
                                                    4/5 - Generally engaged but seeking more challenging work
                                                </Text>
                                            </Box>
                                            <Box>
                                                <Text fontSize="sm" fontWeight="600" color="gray.700" mb={1}>
                                                    What would increase your engagement at work?
                                                </Text>
                                                <Text fontSize="sm" color="gray.600">
                                                    Opportunities to work on innovative projects, learning new technologies, and taking on leadership responsibilities.
                                                </Text>
                                            </Box>
                                        </VStack>
                                    </Box>

                                    {/* Manager Response */}
                                    <Box p={4} bg="purple.50" borderRadius="lg" border="1px solid" borderColor="purple.200">
                                        <HStack justify="space-between" mb={3}>
                                            <HStack gap={2}>
                                                <Box p={2} bg="purple.100" borderRadius="lg">
                                                    <User size={16} color="#9333ea" />
                                                </Box>
                                                <VStack align="start" gap={0}>
                                                    <Text fontSize="sm" fontWeight="700" color="gray.800">Manager Response</Text>
                                                    <Text fontSize="xs" color="gray.600">Sarah Johnson • Oct 22, 2024</Text>
                                                </VStack>
                                            </HStack>
                                            <Badge colorScheme="orange" fontSize="xs">Medium Priority</Badge>
                                        </HStack>
                                        <Text fontSize="sm" color="gray.700" mb={3}>
                                            Great to hear you're engaged! Your desire for growth and new challenges is exactly what we need. Let's explore opportunities to leverage your full skill set.
                                        </Text>
                                        <Box p={3} bg="white" borderRadius="md">
                                            <Text fontSize="sm" fontWeight="600" color="gray.800" mb={2}>Action Plan:</Text>
                                            <VStack align="stretch" gap={1}>
                                                <Text fontSize="sm" color="gray.700">• Assigning you as technical lead for upcoming AI integration project</Text>
                                                <Text fontSize="sm" color="gray.700">• Sponsoring enrollment in advanced cloud architecture certification</Text>
                                                <Text fontSize="sm" color="gray.700">• Involving you in architecture review meetings</Text>
                                                <Text fontSize="sm" color="gray.700">• Mentoring junior team members</Text>
                                            </VStack>
                                        </Box>
                                    </Box>
                                    
                                    {/* Action Buttons */}
                                    <Box p={5} pt={0}>
                                        <HStack gap={3} justify="flex-end">
                                            <Button
                                                size="sm"
                                                variant="outline"
                                                colorScheme="gray"
                                            >
                                                <MessageCircle size={16} />
                                                Add Comment
                                            </Button>
                                            <Button
                                                size="sm"
                                                backgroundColor="cornflowerblue"
                                                colorScheme="green"
                                            >
                                                <CheckCircle size={16} />
                                                Accept Response
                                            </Button>
                                        </HStack>
                                    </Box>
                                    </Box>
                                </Box>
                            </VStack>
                        </Box>
                    </Box>
                </Box>
            )}

            {/* Content Offerings Modal */}
            {isContentModalOpen && (
                <Box
                    position="fixed"
                    top={0}
                    left={0}
                    right={0}
                    bottom={0}
                    bg="rgba(0, 0, 0, 0.6)"
                    backdropFilter="blur(8px)"
                    zIndex={9999}
                    display="flex"
                    alignItems="center"
                    justifyContent="center"
                    onClick={() => setIsContentModalOpen(false)}
                    style={{ animation: 'fadeIn 0.3s ease-out' }}
                >
                    <Box
                        bg="white"
                        borderRadius="2xl"
                        maxW="1400px"
                        w="95%"
                        maxH="90vh"
                        overflow="hidden"
                        onClick={(e) => e.stopPropagation()}
                        boxShadow="0 25px 50px -12px rgba(0, 0, 0, 0.25)"
                        style={{ animation: 'slideUp 0.3s ease-out' }}
                    >
                        {/* Modal Header */}
                        <Box
                            p={6}
                            borderBottom="1px solid"
                            borderColor="gray.200"
                            bg="linear-gradient(135deg, #667eea 0%, #764ba2 100%)"
                        >
                            <HStack justify="space-between" align="center">
                                <HStack gap={3}>
                                    <Box p={3} bg="whiteAlpha.200" borderRadius="xl">
                                        <Package size={28} color="white" />
                                    </Box>
                                    <VStack align="start" gap={0}>
                                        <Heading size="lg" color="white" fontWeight="700">Wellness Offerings</Heading>
                                        <Text fontSize="sm" color="whiteAlpha.900">Explore resources, events, and support programs</Text>
                                    </VStack>
                                </HStack>
                                <IconButton
                                    aria-label="Close"
                                    onClick={() => setIsContentModalOpen(false)}
                                    bg="whiteAlpha.200"
                                    color="white"
                                    _hover={{ bg: "whiteAlpha.300" }}
                                    borderRadius="lg"
                                    size="lg"
                                >
                                    <XIcon size={24} />
                                </IconButton>
                            </HStack>
                        </Box>

                        {/* Modal Body */}
                        <Box p={6} overflowY="auto" maxH="calc(90vh - 120px)" bg="gray.50">
                            <VStack gap={6} align="stretch">
                                {/* Content Stats */}
                                <SimpleGrid columns={{ base: 2, md: 3 }} gap={4}>
                                    <Box p={4} bg="white" borderRadius="lg" boxShadow="sm" border="1px solid" borderColor="gray.200">
                                        <VStack gap={1}>
                                            <Text fontSize="4xl" fontWeight="900" color="blue.600">24</Text>
                                            <Text fontSize="sm" color="gray.600" fontWeight="600">Wellness Articles</Text>
                                        </VStack>
                                    </Box>
                                    <Box p={4} bg="white" borderRadius="lg" boxShadow="sm" border="1px solid" borderColor="gray.200">
                                        <VStack gap={1}>
                                            <Text fontSize="4xl" fontWeight="900" color="purple.600">18</Text>
                                            <Text fontSize="sm" color="gray.600" fontWeight="600">Video Resources</Text>
                                        </VStack>
                                    </Box>
                                    <Box p={4} bg="white" borderRadius="lg" boxShadow="sm" border="1px solid" borderColor="gray.200">
                                        <VStack gap={1}>
                                            <Text fontSize="4xl" fontWeight="900" color="green.600">2.5k+</Text>
                                            <Text fontSize="sm" color="gray.600" fontWeight="600">Total Views</Text>
                                        </VStack>
                                    </Box>
                                </SimpleGrid>

                                {/* Featured Articles Section */}
                                <Box p={5} bg="white" borderRadius="xl" boxShadow="md">
                                    <HStack justify="space-between" mb={4}>
                                        <HStack gap={2}>
                                            <Box p={2} bg="blue.100" borderRadius="lg">
                                                <BookOpen size={20} color="#3b82f6" />
                                            </Box>
                                            <Heading size="md" color="gray.800">Featured Articles</Heading>
                                        </HStack>
                                        <Badge colorScheme="blue" fontSize="xs" px={3} py={1}>24 Available</Badge>
                                    </HStack>
                                    
                                    <SimpleGrid columns={{ base: 1, md: 3 }} gap={4}>
                                        {/* Article 1 */}
                                        <Box 
                                            p={4} 
                                            bg="gradient-to-br from-blue-50 to-white" 
                                            borderRadius="lg" 
                                            border="2px solid" 
                                            borderColor="blue.200"
                                            cursor="pointer"
                                            transition="all 0.3s"
                                            _hover={{ transform: "translateY(-4px)", shadow: "lg", borderColor: "blue.400" }}
                                        >
                                            <Badge colorScheme="blue" fontSize="2xs" mb={2}>WELLNESS</Badge>
                                            <Heading size="sm" color="gray.800" mb={2} lineClamp={2}>
                                                Mental Health in the Workplace
                                            </Heading>
                                            <Text fontSize="xs" color="gray.600" mb={3} lineClamp={2}>
                                                Complete guide to maintaining work-life balance and mental wellness.
                                            </Text>
                                            <HStack justify="space-between" fontSize="2xs" color="gray.500">
                                                <Text>📖 5 min read</Text>
                                                <Text>👁️ 1.2k views</Text>
                                            </HStack>
                                        </Box>

                                        {/* Article 2 */}
                                        <Box 
                                            p={4} 
                                            bg="gradient-to-br from-purple-50 to-white" 
                                            borderRadius="lg" 
                                            border="2px solid" 
                                            borderColor="purple.200"
                                            cursor="pointer"
                                            transition="all 0.3s"
                                            _hover={{ transform: "translateY(-4px)", shadow: "lg", borderColor: "purple.400" }}
                                        >
                                            <Badge colorScheme="purple" fontSize="2xs" mb={2}>CAREER</Badge>
                                            <Heading size="sm" color="gray.800" mb={2} lineClamp={2}>
                                                Setting Career Goals for 2025
                                            </Heading>
                                            <Text fontSize="xs" color="gray.600" mb={3} lineClamp={2}>
                                                Learn how to set achievable goals and create a professional roadmap.
                                            </Text>
                                            <HStack justify="space-between" fontSize="2xs" color="gray.500">
                                                <Text>📖 7 min read</Text>
                                                <Text>👁️ 890 views</Text>
                                            </HStack>
                                        </Box>

                                        {/* Article 3 */}
                                        <Box 
                                            p={4} 
                                            bg="gradient-to-br from-green-50 to-white" 
                                            borderRadius="lg" 
                                            border="2px solid" 
                                            borderColor="green.200"
                                            cursor="pointer"
                                            transition="all 0.3s"
                                            _hover={{ transform: "translateY(-4px)", shadow: "lg", borderColor: "green.400" }}
                                        >
                                            <Badge colorScheme="green" fontSize="2xs" mb={2}>HEALTH</Badge>
                                            <Heading size="sm" color="gray.800" mb={2} lineClamp={2}>
                                                Nutrition Tips for Busy Professionals
                                            </Heading>
                                            <Text fontSize="xs" color="gray.600" mb={3} lineClamp={2}>
                                                Practical nutrition advice for maintaining energy throughout the day.
                                            </Text>
                                            <HStack justify="space-between" fontSize="2xs" color="gray.500">
                                                <Text>📖 4 min read</Text>
                                                <Text>👁️ 650 views</Text>
                                            </HStack>
                                        </Box>
                                    </SimpleGrid>
                                </Box>

                                {/* Wellness Videos Section */}
                                <Box p={5} bg="white" borderRadius="xl" boxShadow="md">
                                    <HStack justify="space-between" mb={4}>
                                        <HStack gap={2}>
                                            <Box p={2} bg="purple.100" borderRadius="lg">
                                                <FileText size={20} color="#9333ea" />
                                            </Box>
                                            <Heading size="md" color="gray.800">Wellness Videos</Heading>
                                        </HStack>
                                        <Badge colorScheme="purple" fontSize="xs" px={3} py={1}>18 Available</Badge>
                                    </HStack>
                                    
                                    <SimpleGrid columns={{ base: 1, md: 3 }} gap={4}>
                                        {/* Video 1 - Meditation Guide */}
                                        <Box 
                                            borderRadius="xl" 
                                            overflow="hidden"
                                            border="2px solid" 
                                            borderColor="purple.200"
                                            cursor="pointer"
                                            transition="all 0.3s"
                                            _hover={{ transform: "translateY(-4px)", shadow: "xl", borderColor: "purple.400" }}
                                            bg="white"
                                        >
                                            {/* Video Thumbnail */}
                                            <Box 
                                                h="180px" 
                                                bgImage="url('https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=800&q=80')"
                                                bgSize="cover"
                                                backgroundPosition="center"
                                                position="relative"
                                            >
                                                {/* Play Button Overlay */}
                                                <Box 
                                                    position="absolute"
                                                    top="50%"
                                                    left="50%"
                                                    transform="translate(-50%, -50%)"
                                                    w="60px"
                                                    h="60px"
                                                    bg="whiteAlpha.900"
                                                    borderRadius="full"
                                                    display="flex"
                                                    alignItems="center"
                                                    justifyContent="center"
                                                    boxShadow="lg"
                                                >
                                                    <Text fontSize="2xl">▶️</Text>
                                                </Box>
                                                <Box position="absolute" top={2} left={2}>
                                                    <Badge colorScheme="purple" fontSize="2xs">MEDITATION</Badge>
                                                </Box>
                                                <Box position="absolute" bottom={2} right={2} bg="blackAlpha.700" px={2} py={1} borderRadius="md">
                                                    <Text fontSize="xs" color="white" fontWeight="600">8:45</Text>
                                                </Box>
                                            </Box>
                                            
                                            {/* Video Details */}
                                            <VStack align="stretch" p={4} gap={2}>
                                                <Heading size="sm" color="gray.800" lineClamp={2}>
                                                    Guided Meditation for Stress Relief
                                                </Heading>
                                                <Text fontSize="xs" color="gray.600" lineClamp={2}>
                                                    Learn mindfulness techniques to reduce stress and anxiety in daily life
                                                </Text>
                                                <HStack justify="space-between" fontSize="xs" color="gray.500" pt={1}>
                                                    <Text>👁️ 1.2k views</Text>
                                                    <Text>⭐ 4.8/5</Text>
                                                </HStack>
                                            </VStack>
                                        </Box>

                                        {/* Video 2 - Yoga Tutorial */}
                                        <Box 
                                            borderRadius="xl" 
                                            overflow="hidden"
                                            border="2px solid" 
                                            borderColor="green.200"
                                            cursor="pointer"
                                            transition="all 0.3s"
                                            _hover={{ transform: "translateY(-4px)", shadow: "xl", borderColor: "green.400" }}
                                            bg="white"
                                        >
                                            {/* Video Thumbnail */}
                                            <Box 
                                                h="180px" 
                                                bgImage="url('https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=800&q=80')"
                                                bgSize="cover"
                                                backgroundPosition="center"
                                                position="relative"
                                            >
                                                {/* Play Button Overlay */}
                                                <Box 
                                                    position="absolute"
                                                    top="50%"
                                                    left="50%"
                                                    transform="translate(-50%, -50%)"
                                                    w="60px"
                                                    h="60px"
                                                    bg="whiteAlpha.900"
                                                    borderRadius="full"
                                                    display="flex"
                                                    alignItems="center"
                                                    justifyContent="center"
                                                    boxShadow="lg"
                                                >
                                                    <Text fontSize="2xl">▶️</Text>
                                                </Box>
                                                <Box position="absolute" top={2} left={2}>
                                                    <Badge colorScheme="green" fontSize="2xs">YOGA</Badge>
                                                </Box>
                                                <Box position="absolute" bottom={2} right={2} bg="blackAlpha.700" px={2} py={1} borderRadius="md">
                                                    <Text fontSize="xs" color="white" fontWeight="600">12:30</Text>
                                                </Box>
                                            </Box>
                                            
                                            {/* Video Details */}
                                            <VStack align="stretch" p={4} gap={2}>
                                                <Heading size="sm" color="gray.800" lineClamp={2}>
                                                    Morning Yoga for Beginners
                                                </Heading>
                                                <Text fontSize="xs" color="gray.600" lineClamp={2}>
                                                    Start your day right with gentle stretches and breathing exercises
                                                </Text>
                                                <HStack justify="space-between" fontSize="xs" color="gray.500" pt={1}>
                                                    <Text>👁️ 890 views</Text>
                                                    <Text>⭐ 4.9/5</Text>
                                                </HStack>
                                            </VStack>
                                        </Box>

                                        {/* Video 3 - Nutrition Tips */}
                                        <Box 
                                            borderRadius="xl" 
                                            overflow="hidden"
                                            border="2px solid" 
                                            borderColor="orange.200"
                                            cursor="pointer"
                                            transition="all 0.3s"
                                            _hover={{ transform: "translateY(-4px)", shadow: "xl", borderColor: "orange.400" }}
                                            bg="white"
                                        >
                                            {/* Video Thumbnail */}
                                            <Box 
                                                h="180px" 
                                                bgImage="url('https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=800&q=80')"
                                                bgSize="cover"
                                                backgroundPosition="center"
                                                position="relative"
                                            >
                                                {/* Play Button Overlay */}
                                                <Box 
                                                    position="absolute"
                                                    top="50%"
                                                    left="50%"
                                                    transform="translate(-50%, -50%)"
                                                    w="60px"
                                                    h="60px"
                                                    bg="whiteAlpha.900"
                                                    borderRadius="full"
                                                    display="flex"
                                                    alignItems="center"
                                                    justifyContent="center"
                                                    boxShadow="lg"
                                                >
                                                    <Text fontSize="2xl">▶️</Text>
                                                </Box>
                                                <Box position="absolute" top={2} left={2}>
                                                    <Badge colorScheme="orange" fontSize="2xs">NUTRITION</Badge>
                                                </Box>
                                                <Box position="absolute" bottom={2} right={2} bg="blackAlpha.700" px={2} py={1} borderRadius="md">
                                                    <Text fontSize="xs" color="white" fontWeight="600">6:15</Text>
                                                </Box>
                                            </Box>
                                            
                                            {/* Video Details */}
                                            <VStack align="stretch" p={4} gap={2}>
                                                <Heading size="sm" color="gray.800" lineClamp={2}>
                                                    Healthy Eating for Busy Professionals
                                                </Heading>
                                                <Text fontSize="xs" color="gray.600" lineClamp={2}>
                                                    Quick and nutritious meal ideas to fuel your workday
                                                </Text>
                                                <HStack justify="space-between" fontSize="xs" color="gray.500" pt={1}>
                                                    <Text>👁️ 650 views</Text>
                                                    <Text>⭐ 4.7/5</Text>
                                                </HStack>
                                            </VStack>
                                        </Box>
                                    </SimpleGrid>
                                </Box>

                                {/* EAP Support Banner */}
                                <Box 
                                    p={5} 
                                    bg="linear-gradient(135deg, #667eea 0%, #764ba2 100%)" 
                                    borderRadius="xl" 
                                    boxShadow="lg"
                                    position="relative"
                                    overflow="hidden"
                                >
                                    <Box position="absolute" top="-20px" right="-20px" opacity={0.1}>
                                        <Heart size={120} color="white" />
                                    </Box>
                                    <HStack gap={4} align="center" position="relative">
                                        <Box p={3} bg="whiteAlpha.300" borderRadius="xl">
                                            <Heart size={32} color="white" />
                                        </Box>
                                        <VStack align="start" gap={2} flex={1}>
                                            <Heading size="md" color="white">24/7 Employee Assistance Program</Heading>
                                            <Text fontSize="sm" color="whiteAlpha.900">
                                                Confidential support for personal and work-related concerns • 500+ employees helped this year
                                            </Text>
                                        </VStack>
                                        <Button bg="white" color="purple.600" size="md" _hover={{ bg: "whiteAlpha.900" }}>
                                            Get Support
                                        </Button>
                                    </HStack>
                                </Box>
                            </VStack>
                        </Box>
                    </Box>
                </Box>
            )}

            {/* Daily Check-In Modal */}
            <DailyCheckInModal
                isOpen={showDailyCheckIn}
                onClose={() => setShowDailyCheckIn(false)}
                onComplete={handleCheckInComplete}
            />

            {/* Trend Modal */}
            <TrendModal
                isOpen={showTrendModal}
                onClose={() => setShowTrendModal(false)}
            />
        </Box>
    );
}
