'use client';

import React, { useState, useEffect } from 'react';

// Add keyframes for modal animation
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
    `;
    if (!document.head.querySelector('style[data-modal-animations]')) {
        style.setAttribute('data-modal-animations', 'true');
        document.head.appendChild(style);
    }
}
import { 
    Box, 
    Heading, 
    Text, 
    VStack, 
    HStack, 
    SimpleGrid, 
    Button, 
    IconButton,
    Stack,
    ButtonProps,
    IconButtonProps,
    StackProps,
    Badge,
    Flex
} from '@chakra-ui/react';
// Import type for Chakra UI Button rightIcon
import { 
    BookOpen as BookOpenIcon, 
    Heart as HeartIcon, 
    Calendar as CalendarIcon, 
    MessageCircle as MessageCircleIcon, 
    HelpCircle as HelpCircleIcon,
    ChevronLeft,
    ChevronRight,
    Clock as ClockIcon,
    Users as UsersIcon,
    TrendingUp as TrendingUpIcon,
    FileText as FileTextIcon,
    Video as VideoIcon,
    Award as AwardIcon,
    Bookmark as BookmarkIcon,
    BookmarkCheck as BookmarkCheckIcon,
    MapPin as MapPinIcon,
    X as XIcon
} from 'lucide-react';

interface CarouselItem {
    id: string;
    type: 'article' | 'event' | 'eap';
    title: string;
    description: string;
    date?: string;
    image: string;
    stats: string;
    bgPosition?: string;
}

interface ResourceCard {
    id: string;
    title: string;
    description: string;
    icon: React.ReactNode;
    color: string;
    items: number;
    action: string;
}

interface StatCardProps {
    icon: React.ReactNode;
    value: string;
    label: string;
    color: string;
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
    image: string;
}

const StatCard: React.FC<StatCardProps> = ({ icon, value, label, color }) => (
    <Box 
        p={3} 
        h="full" 
        bg="white" 
        border="1px solid" 
        borderColor="gray.100" 
        borderRadius="md" 
        shadow="sm"
        _hover={{ shadow: 'md', transform: 'translateY(-2px)' }} 
        transition="all 0.3s"
    >
        <HStack gap={2}>
            <Box 
                p={1.5} 
                bg={`${color}.50`}
                borderRadius="lg" 
                color={`${color}.600`}
                boxShadow="sm"
            >
                {icon}
            </Box>
            <VStack align="start" gap={0}>
                <Text fontSize="md" fontWeight="bold" color="gray.800">
                    {value}
                </Text>
                <Text fontSize="2xs" color="gray.500" fontWeight="medium">
                    {label}
                </Text>
            </VStack>
        </HStack>
    </Box>
);

export default function ContentPage() {
    const [currentSlide, setCurrentSlide] = useState(0);
    const [carouselItems, setCarouselItems] = useState<CarouselItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [isCalendarOpen, setIsCalendarOpen] = useState(false);
    const [events, setEvents] = useState<CalendarEvent[]>([]);
    const [selectedCategory, setSelectedCategory] = useState<'all' | 'csr' | 'yoga' | 'wellness'>('all');

    useEffect(() => {
        // Mock data - Replace with actual API calls
        const fetchData = async () => {
            setLoading(true);
            
            // Simulate API call
            setTimeout(() => {
                setCarouselItems([
                    {
                        id: '1',
                        type: 'article',
                        title: 'New Mental Health Resources Available',
                        description: 'Explore our comprehensive guide to maintaining work-life balance and mental wellness in the workplace.',
                        date: '2 days ago',
                        stats: '1.2k views',
                        image: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=1600&q=80',
                        bgPosition: 'center 30%'
                    },
                    {
                        id: '2',
                        type: 'event',
                        title: 'Upcoming Workshop: Stress Management',
                        description: 'Join us for an interactive session on effective stress management techniques. Limited seats available!',
                        date: 'Nov 15, 2025',
                        stats: '45 registered',
                        image: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=1600&q=80',
                        bgPosition: 'center center'
                    },
                    {
                        id: '3',
                        type: 'eap',
                        title: 'Employee Assistance Program Update',
                        description: 'Our EAP has helped 500+ employees this year. Access 24/7 confidential support for personal and work-related concerns.',
                        stats: '500+ employees assisted',
                        image: 'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=1600&q=80',
                        bgPosition: 'center 40%'
                    },
                    {
                        id: '4',
                        type: 'article',
                        title: 'Career Development: Setting Goals for 2025',
                        description: 'Learn how to set achievable career goals and create a roadmap for professional growth.',
                        date: '1 week ago',
                        stats: '890 views',
                        image: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=1600&q=80',
                        bgPosition: 'center 60%'
                    }
                ]);

                // Initialize events data
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
                        image: 'https://images.unsplash.com/photo-1618477461853-cf6ed80faba5?w=800&q=80'
                    },
                    {
                        id: 'e2',
                        title: 'Morning Yoga Session',
                        description: 'Start your day with energizing yoga poses and breathing exercises.',
                        date: 'Nov 5, 2025',
                        time: '7:00 AM - 8:00 AM',
                        location: 'Office Wellness Center',
                        category: 'yoga',
                        spots: 30,
                        spotsAvailable: 12,
                        isBookmarked: false,
                        isRegistered: false,
                        image: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=800&q=80'
                    },
                    {
                        id: 'e3',
                        title: 'Mental Wellness Workshop',
                        description: 'Learn practical techniques for managing stress and maintaining mental health.',
                        date: 'Nov 8, 2025',
                        time: '2:00 PM - 4:00 PM',
                        location: 'Conference Room A',
                        category: 'wellness',
                        spots: 40,
                        spotsAvailable: 18,
                        isBookmarked: false,
                        isRegistered: false,
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
                        description: 'Expert nutritionist shares tips for healthy eating and lifestyle choices.',
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
                        description: 'Guided meditation session to enhance focus and inner peace.',
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

    const handleCardClick = (cardId: string) => {
        if (cardId === '3') { // Workshops & Events card
            setIsCalendarOpen(true);
        }
    };

    const filteredEvents = selectedCategory === 'all' 
        ? events 
        : events.filter(event => event.category === selectedCategory);

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

    const resourceCards: ResourceCard[] = [
        {
            id: '1',
            title: 'Knowledge Articles',
            description: 'Browse our library of articles covering wellness, career development, and workplace tips.',
            icon: <BookOpenIcon />,
            color: 'purple',
            items: 150,
            action: 'Browse Articles'
        },
        {
            id: '2',
            title: 'Employee Assistance Program',
            description: 'Access confidential support for personal, family, and work-related concerns 24/7.',
            icon: <HeartIcon />,
            color: 'red',
            items: 0,
            action: 'Get Support'
        },
        {
            id: '3',
            title: 'Workshops & Events',
            description: 'Join upcoming workshops, webinars, and events focused on professional and personal growth.',
            icon: <CalendarIcon />,
            color: 'blue',
            items: 12,
            action: 'View Events'
        },
        {
            id: '4',
            title: 'Partnered Counselling',
            description: 'Connect with professional counsellors for mental health support and guidance.',
            icon: <MessageCircleIcon />,
            color: 'green',
            items: 0,
            action: 'Book Session'
        },
        {
            id: '5',
            title: 'AR/HR Help',
            description: 'Get assistance with HR policies, benefits, payroll, and administrative queries.',
            icon: <HelpCircleIcon />,
            color: 'orange',
            items: 0,
            action: 'Contact HR'
        },
        {
            id: '6',
            title: 'Wellness',
            description: 'Explore our comprehensive guide to maintaining work-life balance and mental wellness in the workplace.',
            icon: <BookOpenIcon />,
            color: 'grey',
            items: 0,
            action: 'Explore Wellness'
        }
    ];

    const nextSlide = () => {
        setCurrentSlide((prev) => (prev + 1) % carouselItems.length);
    };

    const prevSlide = () => {
        setCurrentSlide((prev) => (prev - 1 + carouselItems.length) % carouselItems.length);
    };

    const getCarouselIcon = (type: string) => {
        switch (type) {
            case 'article':
                return <FileTextIcon size={24} />;
            case 'event':
                return <CalendarIcon size={24} />;
            case 'eap':
                return <HeartIcon size={24} />;
            default:
                return <FileTextIcon size={24} />;
        }
    };

    const getCarouselColor = (type: string) => {
        switch (type) {
            case 'article':
                return { bg: 'purple.500', light: 'purple.50', border: 'purple.200' };
            case 'event':
                return { bg: 'blue.500', light: 'blue.50', border: 'blue.200' };
            case 'eap':
                return { bg: 'red.500', light: 'red.50', border: 'red.200' };
            default:
                return { bg: 'gray.500', light: 'gray.50', border: 'gray.200' };
        }
    };

    if (loading) {
        return (
            <Box h="100vh" bg="gray.50" display="flex" alignItems="center" justifyContent="center">
                <Text>Loading...</Text>
            </Box>
        );
    }

    const currentItem = carouselItems[currentSlide];
    const colors = getCarouselColor(currentItem?.type || 'article');

    return (
        <Box h="100vh" bg="gray.50" overflow="hidden" display="flex" flexDirection="column">
            {/* Header */}
            <Box 
                bg="white" 
                borderBottom="1px solid" 
                borderColor="gray.200" 
                px={{ base: 4, md: 6 }} 
                py={2} 
                flexShrink={0} 
                boxShadow="sm"
            >
                <VStack align="start">
                    <Heading size={{ base: "lg", md: "xl" }} color="gray.800" fontWeight="600">
                        Wellness & Support
                    </Heading>
                    <Text color="gray.600" fontSize={{ base: "sm", md: "md" }}>
                        Access knowledge articles, support programs, and professional development resources
                    </Text>
                </VStack>
            </Box>

            {/* Main Content */}
            <Box flex={1} overflow="hidden" display="flex" flexDirection="column">
                <Box p={{ base: 3, md: 4 }} maxW="1400px" mx="auto" w="full" h="full" overflow="auto">
                {/* Carousel Section */}
                <Box
                    bg="white"
                    borderRadius="lg"
                    boxShadow="sm"
                    mb={4}
                    overflow="hidden"
                >
                    <Box position="relative" h={{ base: "220px", md: "240px" }}>
                        {/* Background Image with Overlay */}
                        <Box
                            position="absolute"
                            top={0}
                            left={0}
                            right={0}
                            bottom={0}
                            backgroundImage={`url(${currentItem?.image})`}
                            backgroundSize="cover"
                            backgroundPosition={currentItem?.bgPosition || 'center center'}
                            _before={{
                                content: '""',
                                position: 'absolute',
                                top: 0,
                                left: 0,
                                right: 0,
                                bottom: 0,
                                background: 'linear-gradient(to right, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0.4) 100%)',
                                zIndex: 1
                            }}
                        />
                        
                        {/* Carousel Content */}
                        <Box
                            position="relative"
                            zIndex={2}
                            h="full"
                            p={{ base: 6, md: 8 }}
                            display="flex"
                            flexDirection="column"
                            justifyContent="center"
                        >
                            <VStack align="start" maxW="700px">
                                {/* Type Badge */}
                                <HStack>
                                    <Box
                                        px={3}
                                        py={1}
                                        bg={colors.bg}
                                        color="white"
                                        borderRadius="full"
                                        fontSize="xs"
                                        fontWeight="bold"
                                        textTransform="uppercase"
                                        display="inline-flex"
                                        alignItems="center"
                                        gap={1}
                                    >
                                        {currentItem?.type === 'article' ? '📰 New Article' : 
                                         currentItem?.type === 'event' ? '📅 Upcoming Event' : '❤️ EAP Update'}
                                        </Box>
                                </HStack>

                                {/* Title and Description */}
                                <VStack align="start" gap={2}>
                                    <Heading size={{ base: "lg", md: "xl" }} color="white" textShadow="0 2px 4px rgba(0,0,0,0.3)" lineHeight="1.3">
                                        {currentItem?.title}
                                    </Heading>
                                    <Text color="rgba(255,255,255,0.9)" fontSize={{ base: "sm", md: "md" }} lineClamp={2} textShadow="0 1px 2px rgba(0,0,0,0.3)">
                                        {currentItem?.description}
                                    </Text>
                                </VStack>

                                {/* Meta Info */}
                                <HStack flexWrap="wrap" gap={2}>
                                    {currentItem?.date && (
                                        <HStack gap={2} bg="rgba(255,255,255,0.2)" px={2} py={1} borderRadius="md" backdropFilter="blur(10px)">
                                            <ClockIcon size={14} color="white" />
                                            <Text fontSize="xs" color="white" fontWeight="medium">
                                                {currentItem.date}
                                            </Text>
                                        </HStack>
                                    )}
                                    {currentItem?.stats && (
                                        <HStack gap={2} bg="rgba(255,255,255,0.2)" px={2} py={1} borderRadius="md" backdropFilter="blur(10px)">
                                            <TrendingUpIcon size={14} color="white" />
                                            <Text fontSize="xs" color="white" fontWeight="medium">
                                                {currentItem.stats}
                                            </Text>
                                        </HStack>
                                    )}
                                </HStack>

                                {/* CTA Button */}
                                <Button
                                    colorScheme={currentItem?.type === 'article' ? 'purple' : 
                                                 currentItem?.type === 'event' ? 'blue' : 'red'}
                                    size="md"
                                    mt={2}
                                    shadow="lg"
                                    _hover={{
                                        transform: 'translateY(-2px)',
                                        boxShadow: '0 4px 12px rgba(0,0,0,0.15)'
                                    }}
                                    transition="all 0.2s"
                                >
                                    {currentItem?.type === 'article' ? 'Read Article' : 
                                     currentItem?.type === 'event' ? 'Register Now' : 'Learn More'}
                                </Button>
                            </VStack>
                            </Box>

                        {/* Navigation Arrows */}
                        <Button
                            position="absolute"
                            left={4}
                            top="50%"
                            transform="translateY(-50%)"
                            onClick={prevSlide}
                            variant="solid"
                            bg="white"
                            color="gray.800"
                            borderRadius="full"
                            w={12}
                            h={12}
                            p={0}
                            shadow="lg"
                            _hover={{ bg: 'gray.100' }}
                        >
                            <ChevronLeft size={24} />
                        </Button>
                        <Button
                            position="absolute"
                            right={4}
                            top="50%"
                            transform="translateY(-50%)"
                            onClick={nextSlide}
                            variant="solid"
                            bg="white"
                            color="gray.800"
                            borderRadius="full"
                            w={12}
                            h={12}
                            p={0}
                            shadow="lg"
                            _hover={{ bg: 'gray.100' }}
                        >
                            <ChevronRight size={24} />
                        </Button>

                        {/* Dots Indicator */}
                        <HStack
                            position="absolute"
                            bottom={4}
                            left="50%"
                            transform="translateX(-50%)"
                            gap={2}
                        >
                            {carouselItems.map((_, index) => (
                                <Box
                                    key={index}
                                    w={currentSlide === index ? 8 : 2}
                                    h={2}
                                    bg={currentSlide === index ? colors.bg : 'gray.300'}
                                    borderRadius="full"
                                    cursor="pointer"
                                    onClick={() => setCurrentSlide(index)}
                                    transition="all 0.3s"
                                />
                            ))}
                        </HStack>
                        </Box>
                    </Box>

                {/* Quick Stats Section */}
                <SimpleGrid columns={{ base: 2, md: 4 }} gap={3} mb={4}>
                    <StatCard 
                        icon={<UsersIcon size={20} />}
                        value="500+"
                        label="Employees Supported"
                        color="purple"
                    />
                    <StatCard 
                        icon={<BookOpenIcon size={20} />}
                        value="150"
                        label="Knowledge Articles"
                        color="blue"
                    />
                    <StatCard 
                        icon={<CalendarIcon size={20} />}
                        value="12"
                        label="Upcoming Events"
                        color="green"
                    />
                    <StatCard 
                        icon={<AwardIcon size={20} />}
                        value="95%"
                        label="Satisfaction Rate"
                        color="orange"
                    />
                </SimpleGrid>

                {/* Resource Cards Grid */}
                    <VStack align="start" mb={3} mt={2}>
                        <Heading size={{ base: "md", md: "lg" }} color="gray.800" fontWeight="600">
                            Explore Resources
                        </Heading>
                        <Text color="gray.600" fontSize={{ base: "sm", md: "md" }}>
                            Access support services and resources tailored to your needs
                        </Text>
                    </VStack>

                <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} gap={3} mb={4}>
                    {resourceCards.map((card) => (
                        <Box
                            key={card.id}
                            border="1px solid"
                            borderColor="gray.200"
                            borderRadius="lg"
                            overflow="hidden"
                            bg="white"
                            transition="all 0.3s"
                            _hover={{
                                transform: 'translateY(-4px)',
                                boxShadow: 'lg'
                            }}
                            cursor={card.id === '3' ? 'pointer' : 'default'}
                            onClick={() => card.id === '3' && handleCardClick(card.id)}
                        >
                            <Box p={4}>
                                <HStack gap={4} align="start">
                                    <Box
                                        p={2}
                                        bg={`${card.color}.50`}
                                        color={`${card.color}.600`}
                                        borderRadius="lg"
                                        display="flex"
                                        alignItems="center"
                                        justifyContent="center"
                                    >
                                        {card.icon}
                                    </Box>
                                    <VStack align="start" gap={2} flex={1}>
                                        <Heading size="md" color="gray.800">
                                            {card.title}
                                        </Heading>
                                        <Text color="gray.600" fontSize="sm">
                                            {card.description}
                                        </Text>
                                        <HStack w="full" justify="space-between" pt={2} gap={2}>
                                            <Text fontSize="xs" color="gray.500">
                                                {card.items > 0 ? `${card.items} resources available` : 'Available 24/7'}
                                            </Text>
                                            <Button 
                                                size="sm" 
                                                colorScheme={card.color}
                                                variant="ghost"
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    if (card.id === '3') handleCardClick(card.id);
                                                }}
                                            >
                                                {card.action}
                                            </Button>
                                        </HStack>
                                    </VStack>
                                </HStack>
                            </Box>
                        </Box>
                    ))}
                </SimpleGrid>

                </Box>
            </Box>

            {/* Event Calendar Modal Overlay */}
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
                        w={{ base: "95%", md: "90%", lg: "80%" }}
                        maxW="1200px"
                        maxH="90vh"
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
                                    <CalendarIcon size={24} />
                                </Box>
                                <VStack align="start" gap={0}>
                                    <Heading size="lg">Event Calendar</Heading>
                                    <Text fontSize="sm" opacity={0.9}>
                                        Discover and register for upcoming events
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

                        {/* Events List */}
                        <Box p={5} maxH="calc(90vh - 220px)" overflow="auto" bg="gray.50">
                            <SimpleGrid columns={{ base: 1, md: 2 }} gap={4}>
                                {filteredEvents.map((event) => {
                                    const categoryColor = getCategoryColor(event.category);
                                    return (
                                    <Box
                                        key={event.id}
                                        border="1px solid"
                                        borderColor="gray.200"
                                        borderRadius="lg"
                                        overflow="hidden"
                                        bg={`${categoryColor}.50`}
                                        transition="all 0.3s"
                                        _hover={{ shadow: 'md', bg: 'white' }}
                                    >
                                        {/* Event Image */}
                                        <Box
                                            h="180px"
                                            w="full"
                                            overflow="hidden"
                                            position="relative"
                                        >
                                            <img
                                                src={event.image}
                                                alt={event.title}
                                                style={{
                                                    width: '100%',
                                                    height: '100%',
                                                    objectFit: 'cover',
                                                    transition: 'transform 0.3s'
                                                }}
                                                onMouseOver={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
                                                onMouseOut={(e) => e.currentTarget.style.transform = 'scale(1)'}
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

                                        <Box p={4}>
                                            <Flex justify="space-between" align="start" mb={2}>
                                                <Badge
                                                    bg={`${categoryColor}.100`}
                                                    color={`${categoryColor}.700`}
                                                    fontSize="xs"
                                                    px={2}
                                                    py={1}
                                                    borderRadius="md"
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
                                                >
                                                    {event.isBookmarked ? (
                                                        <BookmarkCheckIcon size={20} fill="currentColor" />
                                                    ) : (
                                                        <BookmarkIcon size={20} />
                                                    )}
                                                </IconButton>
                                            </Flex>

                                            <Heading size="md" mb={2} color="gray.800">
                                                {event.title}
                                            </Heading>

                                            <Text fontSize="sm" color="gray.600" mb={3} lineClamp={2}>
                                                {event.description}
                                            </Text>

                                            <VStack align="start" gap={2} mb={3}>
                                                <HStack gap={2}>
                                                    <CalendarIcon size={16} color="gray" />
                                                    <Text fontSize="sm" color="gray.600">
                                                        {event.date}
                                                    </Text>
                                                </HStack>
                                                <HStack gap={2}>
                                                    <ClockIcon size={16} color="gray" />
                                                    <Text fontSize="sm" color="gray.600">
                                                        {event.time}
                                                    </Text>
                                                </HStack>
                                                <HStack gap={2}>
                                                    <MapPinIcon size={16} color="gray" />
                                                    <Text fontSize="sm" color="gray.600">
                                                        {event.location}
                                                    </Text>
                                                </HStack>
                                            </VStack>

                                            <Flex justify="space-between" align="center">
                                                <Text fontSize="xs" color="gray.500">
                                                    {event.spotsAvailable} of {event.spots} spots available
                                                </Text>
                                                <Button
                                                    size="sm"
                                                    bg={event.isRegistered ? 'gray.50' : `${getCategoryColor(event.category)}.100`}
                                                    color={event.isRegistered ? `${getCategoryColor(event.category)}.600` : `${getCategoryColor(event.category)}.700`}
                                                    border="1px solid"
                                                    borderColor={`${getCategoryColor(event.category)}.300`}
                                                    onClick={() => handleRegister(event.id)}
                                                    disabled={!event.isRegistered && event.spotsAvailable === 0}
                                                    _hover={{
                                                        bg: event.isRegistered ? `${getCategoryColor(event.category)}.50` : `${getCategoryColor(event.category)}.200`,
                                                        borderColor: `${getCategoryColor(event.category)}.400`
                                                    }}
                                                    _active={{
                                                        transform: 'scale(0.98)'
                                                    }}
                                                    transition="all 0.2s"
                                                    fontWeight="normal"
                                                >
                                                    {event.isRegistered ? '✓ Registered' : 'Register Now'}
                                                </Button>
                                            </Flex>
                                        </Box>
                                    </Box>
                                    );
                                })}
                            </SimpleGrid>

                            {filteredEvents.length === 0 && (
                                <Box textAlign="center" py={8}>
                                    <Text color="gray.500">No events found in this category</Text>
                                </Box>
                            )}
                        </Box>
                    </Box>
                </Box>
            )}
        </Box>
    );
}

// Removed duplicate component definitions to fix the 'Unexpected token Box' error
