'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

// Add keyframes for animations
if (typeof document !== 'undefined') {
    const style = document.createElement('style');
    style.textContent = `
        @keyframes slideUp {
            from {
                opacity: 0;
                transform: translateY(40px) scale(0.95);
            }
            to {
                opacity: 1;
                transform: translateY(0) scale(1);
            }
        }
        @keyframes fadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
        }
        @keyframes fadeInUp {
            from {
                opacity: 0;
                transform: translateY(20px);
            }
            to {
                opacity: 1;
                transform: translateY(0);
            }
        }
        @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
        }
        @keyframes pulse {
            0%, 100% { opacity: 1; }
            50% { opacity: 0.5; }
        }
        @keyframes bounce {
            0%, 100% { transform: translateY(0); }
            50% { transform: translateY(-10px); }
        }
        @keyframes scaleIn {
            from {
                opacity: 0;
                transform: scale(0.8);
            }
            to {
                opacity: 1;
                transform: scale(1);
            }
        }
    `;
    if (!document.head.querySelector('style[data-animations]')) {
        style.setAttribute('data-animations', 'true');
        document.head.appendChild(style);
    }
}
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
    MessageCircle
} from 'lucide-react';
import { Line, Pie } from 'react-chartjs-2';
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
    const router = useRouter();
    const [loading, setLoading] = useState(true);
    const [isCalendarOpen, setIsCalendarOpen] = useState(false);
    const [isHelpModalOpen, setIsHelpModalOpen] = useState(false);
    const [isConcernModalOpen, setIsConcernModalOpen] = useState(false);
    const [concernText, setConcernText] = useState('');
    const [projects, setProjects] = useState<Project[]>([]);
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
    const [newMessage, setNewMessage] = useState('');
    const [testimonies, setTestimonies] = useState<Testimony[]>([]);
    const [skills, setSkills] = useState<Skill[]>([]);
    const [events, setEvents] = useState<CalendarEvent[]>([]);
    const [selectedCategory, setSelectedCategory] = useState<'all' | 'csr' | 'yoga' | 'wellness'>('all');
    
    // User profile data
    const userProfile = {
        name: 'John Doe',
        designation: 'Senior Software Engineer',
        avatar: 'https://i.pravatar.cc/150?img=12' // Sample avatar image
    };


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
                                            bg="purple.50"
                                            _hover={{ bg: "purple.100", borderColor: "purple.300", transform: "translateY(-2px)" }}
                                            display="flex"
                                            flexDirection="column"
                                            gap={2}
                                            p={3}
                                            onClick={() => router.push('/survey-responses')}
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
                                            bg="blue.50"
                                            _hover={{ bg: "blue.100", borderColor: "blue.300", transform: "translateY(-2px)" }}
                                            display="flex"
                                            flexDirection="column"
                                            gap={2}
                                            p={3}
                                            onClick={() => router.push('/content')}
                                            transition="all 0.3s ease"
                                        >
                                            <Box p={1.5} bg="blue.100" borderRadius="md">
                                                <Package size={20} color="#3182CE" />
                                            </Box>
                                            <Text fontWeight="600" color="gray.800" fontSize="sm">
                                                Access Offering
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
                                            bg="green.50"
                                            _hover={{ bg: "green.100", borderColor: "green.300", transform: "translateY(-2px)" }}
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

                                        {/* Get Help */}
                                        <Button
                                            variant="outline"
                                            minH="70px"
                                            h="auto"
                                            borderRadius="lg"
                                            border="2px solid"
                                            borderColor="orange.200"
                                            bg="orange.50"
                                            _hover={{ bg: "orange.100", borderColor: "orange.300", transform: "translateY(-2px)" }}
                                            display="flex"
                                            flexDirection="column"
                                            gap={2}
                                            p={3}
                                            onClick={() => setIsHelpModalOpen(true)}
                                            transition="all 0.3s ease"
                                        >
                                            <Box p={1.5} bg="orange.100" borderRadius="md">
                                                <HelpCircle size={20} color="#DD6B20" />
                                            </Box>
                                            <Text fontWeight="600" color="gray.800" fontSize="sm">
                                                Get Help
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

                    {/* Quadrant 3: Testimonies */}
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
                                <Box p={1} bg="yellow.100" borderRadius="md">
                                    <Award size={16} color="#D97706" />
                                </Box>
                                <VStack align="start" gap={0}>
                                    <Heading size={{ base: "xs", md: "sm" }} color="gray.800" fontWeight="bold">
                                        Testimonies
                                    </Heading>
                                    <Text fontSize="2xs" color="gray.600">
                                        {testimonies.length} reviews
                                    </Text>
                                </VStack>
                            </HStack>
                        </Card.Header>
                        <Card.Body p={{ base: 2, md: 3 }} flex={1} overflow="hidden">
                            <VStack gap={1.5} align="stretch">
                                {testimonies.map((testimony) => (
                                    <Box
                                        key={testimony.id}
                                        p={{ base: 1.5, md: 2 }}
                                        bg="yellow.50"
                                        borderRadius="md"
                                        border="1px solid"
                                        borderColor="yellow.200"
                                    >
                                        <VStack align="stretch" gap={1}>
                                            <HStack justify="space-between">
                                                <VStack align="start" gap={0}>
                                                    <Text fontWeight="bold" color="gray.800" fontSize={{ base: "xs", md: "sm" }}>
                                                        {testimony.author}
                                                    </Text>
                                                    <Text fontSize="2xs" color="gray.600">
                                                        {testimony.role}
                                                    </Text>
                                                </VStack>
                                                <Text fontSize="2xs" color="gray.500">
                                                    {new Date(testimony.date).toLocaleDateString()}
                                                </Text>
                                            </HStack>
                                            <Text fontSize={{ base: "2xs", md: "xs" }} color="gray.700" lineClamp={3}>
                                                "{testimony.message}"
                                            </Text>
                                        </VStack>
                                    </Box>
                                ))}
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
                                    aria-label="Close modal"
                                    onClick={() => setIsHelpModalOpen(false)}
                                    variant="ghost"
                                    color="white"
                                    _hover={{ bg: 'whiteAlpha.200' }}
                                    size="sm"
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
                                        router.push('/survey-responses');
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
                                        router.push('/content');
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
                                                        Access Offerings
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
                                    isDisabled={!concernText.trim()}
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
        </Box>
    );
}
