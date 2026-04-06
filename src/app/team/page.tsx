'use client';

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import {
    Box,
    VStack,
    HStack,
    Text,
    Heading,
    Card,
    Badge,
    SimpleGrid,
    Button,
    Flex,
    Spinner,
    Input
} from '@chakra-ui/react';
import { Pagination } from '@/components/common/Pagination';
import { 
    Users, 
    TrendingUp, 
    AlertTriangle,
    Target,
    Brain,
    UserCheck,
    Heart,
    Briefcase,
    BookOpen,
    Video,
    MessageCircle,
    BarChart3,
    Calendar
} from 'lucide-react';
import { getRiskColor } from '@/utils/riskColors';
import { dashboardApi, teamApi, DashboardQuickData, EmployeeProfile } from '@/services';
import { AppLayout } from '@/components/layouts/AppLayout';
import { TeamMember } from '@/types';
import { EmployeeDetailModal } from '@/components/team/EmployeeDetailModal';

export default function Teams() {
    const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
    const [dashboardData, setDashboardData] = useState<DashboardQuickData | null>(null);
    const [quickDataLoading, setQuickDataLoading] = useState(true);
    const [teamDataLoading, setTeamDataLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [saving, setSaving] = useState(false);
    const [saveSuccess, setSaveSuccess] = useState<string | null>(null);
    const [changedMembers, setChangedMembers] = useState<Set<string>>(new Set());
    
    // Pagination and search state
    const [searchQuery, setSearchQuery] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize, setPageSize] = useState(20);
    const [totalCount, setTotalCount] = useState(0);
    const [filteredCount, setFilteredCount] = useState(0);
    
    // Filter state
    const [riskFilter, setRiskFilter] = useState('');
    const [mentalHealthFilter, setMentalHealthFilter] = useState('');
    const [triggerFilter, setTriggerFilter] = useState('');
    
    // Modal and hover state
    const [selectedMember, setSelectedMember] = useState<TeamMember | null>(null);
    const [isSummaryModalOpen, setIsSummaryModalOpen] = useState(false);
    const [isEmployeeDetailModalOpen, setIsEmployeeDetailModalOpen] = useState(false);
    const [hoveredMember, setHoveredMember] = useState<TeamMember | null>(null);
    const [activeTab, setActiveTab] = useState<'work' | 'mental'>('work');
    
    // Dashboard visibility state - show only on first load
    const [showDashboard, setShowDashboard] = useState(() => {
        if (typeof window !== 'undefined') {
            const hasSeenDashboard = localStorage.getItem('teamDashboardSeen');
            if (!hasSeenDashboard) {
                localStorage.setItem('teamDashboardSeen', 'true');
                return true;
            }
            return false;
        }
        return true;
    });

    // Fetch quick data first for immediate dashboard display
    useEffect(() => {
        const fetchQuickData = async () => {
            try {
                setQuickDataLoading(true);
                const quickData = await dashboardApi.getDashboardQuickData();
                setDashboardData(quickData);
                setError(null);
            } catch (err) {
                console.error('Failed to fetch quick data:', err);
                setError('Failed to load dashboard data. Please try again.');
                setDashboardData(null);
            } finally {
                setQuickDataLoading(false);
            }
        };

        fetchQuickData();
    }, []);

    // Fetch team data separately after quick data loads
    useEffect(() => {
        if (!quickDataLoading && dashboardData) {
            const fetchTeamData = async () => {
                try {
                    setTeamDataLoading(true);
                    const teamData = await teamApi.getTeamMembers({
                        page: currentPage,
                        page_size: pageSize,
                        search: searchQuery || undefined
                    });
                    
                    // Transform team data to match UI expectations
                    // @ts-ignore
                    const teamArray = Array.isArray(teamData.results.team_members) ? teamData.results.team_members : [];
                    
                    const transformedTeamMembers: TeamMember[] = teamArray.map((member: any) => ({
                        id: member.id.toString(),
                        name: (member.first_name && member.last_name) ? `${member.first_name} ${member.last_name}` : (member.username || 'Unknown User'),
                        email: member.email || `${member.username || 'unknown'}@company.com`,
                        age: member.age || 0,
                        mentalHealth: member.mental_health || 'Medium',
                        motivationFactor: member.motivation_factor || 'Medium',
                        careerOpportunities: member.career_opportunities || 'Medium',
                        personalReason: member.personal_reason || 'Medium',
                        managerAssessmentRisk: member.manager_assessment_risk || 'Medium',
                        utilization: Math.floor(Math.random() * 30) + 70, // TODO: Get from allocations API
                        projectCriticality: member.manager_assessment_risk || 'Medium',
                        attritionRisk: member.manager_assessment_risk || 'Medium',
                        primaryTrigger: member.primary_trigger || 'MH',
                        triggers: {
                            mentalHealth: member.mental_health === 'Low',
                            motivation: member.motivation_factor === 'Low',
                            career: member.career_opportunities === 'Low',
                            personal: member.personal_reason === 'Low'
                        }
                    }));
                    
                    setTeamMembers(transformedTeamMembers);
                    setTotalCount(teamData.count);
                    setFilteredCount(teamData.results.filtered_count);
                    setError(null);
                } catch (err) {
                    console.error('Failed to fetch team data:', err);
                    // Don't set error for team data failure, just log it
                    setTeamMembers([]);
                } finally {
                    setTeamDataLoading(false);
                }
            };

            fetchTeamData();
        }
    }, [quickDataLoading, dashboardData, currentPage, pageSize, searchQuery]);

    const calculateSuggestedRisk = (member: TeamMember): 'High' | 'Medium' | 'Low' => {
        const riskValues = {
            'High': 3,
            'Medium': 2,
            'Low': 1
        };
        
        const total = riskValues[member.mentalHealth] + 
                     riskValues[member.motivationFactor] + 
                     riskValues[member.careerOpportunities] + 
                     riskValues[member.personalReason];
        
        const average = total / 4;
        
        if (average >= 2.5) return 'High';
        if (average >= 1.5) return 'Medium';
        return 'Low';
    };

    const handleRiskChange = useCallback((memberId: string, newRisk: 'High' | 'Medium' | 'Low') => {
        setTeamMembers(prev => prev.map(member => 
            member.id === memberId ? { ...member, attritionRisk: newRisk } : member
        ));
        setChangedMembers(prev => new Set(prev).add(memberId));
        setSaveSuccess(null);
    }, []);

    const handleSaveChanges = useCallback(async () => {
        if (changedMembers.size === 0) return;

        setSaving(true);
        setSaveSuccess(null);
        setError(null);

        try {
            const updatePromises = Array.from(changedMembers).map(async (memberId) => {
                const member = teamMembers.find(m => m.id === memberId);
                if (!member) return;

                return await teamApi.updateTeamMember(parseInt(memberId), {
                    manager_assessment_risk: member.attritionRisk || 'Medium'
                });
            });

            await Promise.all(updatePromises);
            
            setChangedMembers(new Set());
            setSaveSuccess('Team member assessments updated successfully!');
            
            setTimeout(() => setSaveSuccess(null), 3000);
        } catch (err) {
            console.error('Failed to save team member changes:', err);
            setError('Failed to save changes. Please try again.');
        } finally {
            setSaving(false);
        }
    }, [changedMembers, teamMembers]);

    // Memoized analytics data
    const { attritionData, mentalHealthIssues, filteredMembers } = useMemo(() => {
        const attrition = teamMembers.reduce((acc, member) => {
            const risk = member.attritionRisk || 'Medium';
            acc[risk] = (acc[risk] || 0) + 1;
            return acc;
        }, {} as Record<string, number>);

        const mentalHealth = teamMembers.filter(member => member.mentalHealth === 'High').length;

        const filtered = teamMembers.filter(member => {
            if (riskFilter && member.attritionRisk !== riskFilter) return false;
            if (mentalHealthFilter && member.mentalHealth !== mentalHealthFilter) return false;
            if (triggerFilter) {
                if (triggerFilter === 'MH' && member.mentalHealth === 'High') return true;
                if (triggerFilter === 'MF' && member.motivationFactor === 'High') return true;
                if (triggerFilter === 'CO' && member.careerOpportunities === 'High') return true;
                if (triggerFilter === 'PR' && member.personalReason === 'High') return true;
                if (triggerFilter) return false;
            }
            return true;
        });

        return { attritionData: attrition, mentalHealthIssues: mentalHealth, filteredMembers: filtered };
    }, [teamMembers, riskFilter, mentalHealthFilter, triggerFilter]);

    return (
        <>
        <AppLayout>
            {/* Content */}
            <Box px={{ base: 4, md: 6, lg: 8 }} py={{ base: 2, md: 2 }}>
                <VStack gap={4} align="stretch" w="full">

                    {/* Loading State */}
                    {quickDataLoading && (
                        <Box textAlign="center" py={12}>
                            <Spinner size="xl" color="purple.500" mb={4} />
                            <Text fontSize="lg" color="gray.600">Loading team data...</Text>
                        </Box>
                    )}

                    {/* Error State */}
                    {error && (
                        <Box textAlign="center" py={12}>
                            <Text fontSize="lg" color="red.500" mb={4}>{error}</Text>
                            <Button onClick={() => window.location.reload()} colorScheme="purple">
                                Retry
                            </Button>
                        </Box>
                    )}

                    {showDashboard && (
                    <Box
                    //  bg="blue.50"
                      borderRadius="2xl" p={3}>
                        <SimpleGrid columns={8} gap={2}>
                            {/* Total Members Card */}
                            <Box 
                                bg="white" 
                                borderRadius="lg" 
                                    p={3} 
                                    shadow="sm" 
                                    border="1px solid" 
                                    borderColor="gray.200"
                                    transition="all 0.2s"
                                    _hover={{ shadow: "md", transform: "translateY(-2px)" }}
                                >
                                    <VStack align="center" gap={1}>
                                        <Box p={1.5} bg="blue.50" borderRadius="lg">
                                            <Users size={18} color="#3B82F6" />
                                        </Box>
                                        <Text fontSize="xl" fontWeight="bold" color="gray.800">
                                            {totalCount}
                                        </Text>
                                        <Text fontSize="2xs" color="gray.600" fontWeight="medium" textAlign="center">
                                            Total Members
                                        </Text>
                                    </VStack>
                                </Box>
                                
                                {/* High Risk Card */}
                                <Box 
                                    bg="white" 
                                    borderRadius="lg" 
                                    p={3} 
                                    shadow="sm" 
                                    border="1px solid" 
                                    borderColor="gray.200"
                                    transition="all 0.2s"
                                    _hover={{ shadow: "md", transform: "translateY(-2px)" }}
                                >
                                    <VStack align="center" gap={1}>
                                        <Box p={1.5} bg="red.50" borderRadius="lg">
                                            <AlertTriangle size={18} color="#EF4444" />
                                        </Box>
                                        <Text fontSize="xl" fontWeight="bold" color="gray.800">
                                            {teamMembers.filter(m => m.attritionRisk === 'High').length}
                                        </Text>
                                        <Text fontSize="2xs" color="gray.600" fontWeight="medium" textAlign="center">
                                            High Risk
                                        </Text>
                                    </VStack>
                                </Box>
                                
                                {/* Medium Risk Card */}
                                <Box 
                                    bg="white" 
                                    borderRadius="lg" 
                                    p={3} 
                                    shadow="sm" 
                                    border="1px solid" 
                                    borderColor="gray.200"
                                    transition="all 0.2s"
                                    _hover={{ shadow: "md", transform: "translateY(-2px)" }}
                                >
                                    <VStack align="center" gap={1}>
                                        <Box p={1.5} bg="orange.50" borderRadius="lg">
                                            <TrendingUp size={18} color="#F97316" />
                                        </Box>
                                        <Text fontSize="xl" fontWeight="bold" color="gray.800">
                                            {teamMembers.filter(m => m.attritionRisk === 'Medium').length}
                                        </Text>
                                        <Text fontSize="2xs" color="gray.600" fontWeight="medium" textAlign="center">
                                            Medium Risk
                                        </Text>
                                    </VStack>
                                </Box>
                                
                                {/* Low Risk Card */}
                                <Box 
                                    bg="white" 
                                    borderRadius="lg" 
                                    p={3} 
                                    shadow="sm" 
                                    border="1px solid" 
                                    borderColor="gray.200"
                                    transition="all 0.2s"
                                    _hover={{ shadow: "md", transform: "translateY(-2px)" }}
                                >
                                    <VStack align="center" gap={1}>
                                        <Box p={1.5} bg="green.50" borderRadius="lg">
                                            <Target size={18} color="#059669" />
                                        </Box>
                                        <Text fontSize="xl" fontWeight="bold" color="gray.800">
                                            {teamMembers.filter(m => m.attritionRisk === 'Low').length}
                                        </Text>
                                        <Text fontSize="2xs" color="gray.600" fontWeight="medium" textAlign="center">
                                            Low Risk
                                        </Text>
                                    </VStack>
                                </Box>
                                
                                {/* Mental Health Risks Card */}
                                <Box 
                                    bg="white" 
                                    borderRadius="lg" 
                                    p={3} 
                                    shadow="sm" 
                                    border="1px solid" 
                                    borderColor="gray.200"
                                    transition="all 0.2s"
                                    _hover={{ shadow: "md", transform: "translateY(-2px)" }}
                                >
                                    <VStack align="center" gap={1}>
                                        <Box p={1.5} bg="pink.50" borderRadius="lg">
                                            <Heart size={18} color="#EC4899" />
                                        </Box>
                                        <Text fontSize="xl" fontWeight="bold" color="gray.800">
                                            {teamMembers.filter(m => m.mentalHealth === 'High').length}
                                        </Text>
                                        <Text fontSize="2xs" color="gray.600" fontWeight="medium" textAlign="center">
                                            Mental Health
                                        </Text>
                                    </VStack>
                                </Box>
                                
                                {/* Gender Ratio Card */}
                                <Box 
                                    bg="white" 
                                    borderRadius="lg" 
                                    p={3} 
                                    shadow="sm" 
                                    border="1px solid" 
                                    borderColor="gray.200"
                                    transition="all 0.2s"
                                    _hover={{ shadow: "md", transform: "translateY(-2px)" }}
                                >
                                    <VStack align="center" gap={1}>
                                        <Box p={1.5} bg="purple.50" borderRadius="lg">
                                            <UserCheck size={18} color="#7c3aed" />
                                        </Box>
                                        <Text fontSize="xl" fontWeight="bold" color="gray.800">
                                            {teamMembers.length > 0 ? 
                                                `${Math.round((teamMembers.filter(m => (m as any).gender === 'Female').length / teamMembers.length) * 100)}%`
                                                : 'N/A'
                                            }
                                        </Text>
                                        <Text fontSize="2xs" color="gray.600" fontWeight="medium" textAlign="center">
                                            Female Ratio
                                        </Text>
                                    </VStack>
                                </Box>
                                
                                {/* Average Utilization Card */}
                                <Box 
                                    bg="white" 
                                    borderRadius="lg" 
                                    p={3} 
                                    shadow="sm" 
                                    border="1px solid" 
                                    borderColor="gray.200"
                                    transition="all 0.2s"
                                    _hover={{ shadow: "md", transform: "translateY(-2px)" }}
                                >
                                    <VStack align="center" gap={1}>
                                        <Box p={1.5} bg="blue.50" borderRadius="lg">
                                            <BarChart3 size={18} color="#2563eb" />
                                        </Box>
                                        <Text fontSize="xl" fontWeight="bold" color="gray.800">
                                            {teamMembers.length > 0 ? 
                                                `${Math.round(teamMembers.reduce((sum, m) => sum + (m.utilization || 0), 0) / teamMembers.length)}%`
                                                : '0%'
                                            }
                                        </Text>
                                        <Text fontSize="2xs" color="gray.600" fontWeight="medium" textAlign="center">
                                            Avg Utilization
                                        </Text>
                                    </VStack>
                                </Box>
                                
                                {/* Average Age Card */}
                                <Box 
                                    bg="white" 
                                    borderRadius="lg" 
                                    p={3} 
                                    shadow="sm" 
                                    border="1px solid" 
                                    borderColor="gray.200"
                                    transition="all 0.2s"
                                    _hover={{ shadow: "md", transform: "translateY(-2px)" }}
                                >
                                    <VStack align="center" gap={1}>
                                        <Box p={1.5} bg="teal.50" borderRadius="lg">
                                            <Calendar size={18} color="#14b8a6" />
                                        </Box>
                                        <Text fontSize="xl" fontWeight="bold" color="gray.800">
                                            {teamMembers.length > 0 ? 
                                                Math.round(teamMembers.reduce((sum, m) => sum + (m.age || 0), 0) / teamMembers.length)
                                                : 0
                                            }
                                        </Text>
                                        <Text fontSize="2xs" color="gray.600" fontWeight="medium" textAlign="center">
                                            Average Age
                                        </Text>
                                    </VStack>
                                </Box>
                            </SimpleGrid>
                        </Box>
                    )}

                        {/* Team Members Management Section */}
                        {!quickDataLoading && !error && (
                            <HStack align="stretch" gap={4} h="calc(100vh - 300px)">
                            <Card.Root bg="white" shadow="sm" borderRadius="3xl" w="70%" h="120%" display="flex" flexDirection="column">
                                <Card.Header p={3}>
                                    <HStack justify="space-between">
                                        <VStack align="start" gap={1}>
                                            {teamDataLoading && (
                                                <HStack gap={2}>
                                                    <Spinner size="sm" color="blue.500" />
                                                    <Text fontSize="sm" color="gray.500">Loading team data...</Text>
                                                </HStack>
                                            )}
                                        </VStack>
                                    </HStack>
                                    
                                    {/* Search and Filters */}
                                    <VStack gap={3} mt={1} align="stretch">
                                        <Input
                                            placeholder="Search by name, email, or username..."
                                            value={searchQuery}
                                            onChange={(e) => {
                                                setSearchQuery(e.target.value);
                                                setCurrentPage(1);
                                            }}
                                            size="md"
                                            color="black"
                                            _placeholder={{ color: 'gray.500' }}
                                        />
                                        <HStack gap={3} flexWrap="wrap">
                                            <Text fontSize="sm" fontWeight="600" color="gray.700">Filters:</Text>
                                            <select
                                                value={riskFilter}
                                                onChange={(e) => {
                                                    setRiskFilter(e.target.value);
                                                    setCurrentPage(1);
                                                }}
                                                style={{
                                                    padding: '6px 12px',
                                                    border: '1px solid #d1d5db',
                                                    borderRadius: '6px',
                                                    fontSize: '14px',
                                                    backgroundColor: 'white',
                                                    color: '#4a5568',
                                                    outline: 'none',
                                                    cursor: 'pointer',
                                                    minWidth: '140px'
                                                }}
                                            >
                                                <option value="">All Risk Levels</option>
                                                <option value="High">High Risk</option>
                                                <option value="Medium">Medium Risk</option>
                                                <option value="Low">Low Risk</option>
                                            </select>
                                            <select
                                                value={mentalHealthFilter}
                                                onChange={(e) => {
                                                    setMentalHealthFilter(e.target.value);
                                                    setCurrentPage(1);
                                                }}
                                                style={{
                                                    padding: '6px 12px',
                                                    border: '1px solid #d1d5db',
                                                    borderRadius: '6px',
                                                    fontSize: '14px',
                                                    backgroundColor: 'white',
                                                    color: '#4a5568',
                                                    outline: 'none',
                                                    cursor: 'pointer',
                                                    minWidth: '140px'
                                                }}
                                            >
                                                <option value="">All Mental Health</option>
                                                <option value="High">High</option>
                                                <option value="Medium">Medium</option>
                                                <option value="Low">Low</option>
                                            </select>
                                            <select
                                                value={triggerFilter}
                                                onChange={(e) => {
                                                    setTriggerFilter(e.target.value);
                                                    setCurrentPage(1);
                                                }}
                                                style={{
                                                    padding: '6px 12px',
                                                    border: '1px solid #d1d5db',
                                                    borderRadius: '6px',
                                                    fontSize: '14px',
                                                    backgroundColor: 'white',
                                                    color: '#4a5568',
                                                    outline: 'none',
                                                    cursor: 'pointer',
                                                    minWidth: '140px'
                                                }}
                                            >
                                                <option value="">All Triggers</option>
                                                <option value="MH">Mental Health</option>
                                                <option value="MF">Motivation</option>
                                                <option value="CO">Career</option>
                                                <option value="PR">Personal</option>
                                            </select>
                                        </HStack>
                                    </VStack>
                                    
                                    {/* Search Results Info */}
                                    {searchQuery && (
                                        <Box p={3} bg="blue.50" borderRadius="md" border="1px solid" borderColor="blue.100" mt={3}>
                                            <Text fontSize="sm" color="blue.700">
                                                <strong>{filteredCount}</strong> members found matching <strong>"{searchQuery}"</strong>
                                                {filteredCount !== totalCount && (
                                                    <span> (filtered from {totalCount} total members)</span>
                                                )}
                                            </Text>
                                        </Box>
                                    )}

                                    {/* Success/Error Messages */}
                                    {saveSuccess && (
                                        <Box mt={4} p={3} bg="green.50" border="1px solid" borderColor="green.200" borderRadius="md">
                                            <Text color="green.700" fontSize="sm" fontWeight="medium">
                                                ✅ {saveSuccess}
                                            </Text>
                                        </Box>
                                    )}
                                    
                                    {error && (
                                        <Box mt={4} p={3} bg="red.50" border="1px solid" borderColor="red.200" borderRadius="md">
                                            <Text color="red.700" fontSize="sm" fontWeight="medium">
                                                ❌ {error}
                                            </Text>
                                        </Box>
                                    )}
                                </Card.Header>
                                <Card.Body p={3} py={0} flex="1" minH="0">
                                    <Box 
                                        overflowX="auto" 
                                        h="120%" 
                                        overflowY="auto"
                                        borderRadius="xl"
                                        bg="white"
                                        css={{
                                            '&::-webkit-scrollbar': {
                                                width: '8px',
                                                height: '8px'
                                            },
                                            '&::-webkit-scrollbar-track': {
                                                background: '#f1f5f9',
                                                borderRadius: '4px'
                                            },
                                            '&::-webkit-scrollbar-thumb': {
                                                background: '#cbd5e1',
                                                borderRadius: '4px'
                                            },
                                            '&::-webkit-scrollbar-thumb:hover': {
                                                background: '#94a3b8'
                                            }
                                        }}
                                    >
                                        <table style={{ 
                                            width: '100%', 
                                            minWidth: '900px',
                                            borderCollapse: 'separate',
                                            borderSpacing: '0',
                                            background: 'white'
                                        }}>
                                            <thead style={{ position: 'sticky', top: 0, zIndex: 10 }}>
                                            <tr style={{ 
                                                background: 'linear-gradient(to bottom, #f8fafc 0%, #f1f5f9 100%)',
                                                borderBottom: '2px solid #e2e8f0',
                                                boxShadow: '0 1px 3px rgba(0, 0, 0, 0.05)'
                                            }}>
                                                <th style={{ 
                                                    padding: '12px 16px', 
                                                    textAlign: 'left', 
                                                    fontWeight: '700', 
                                                    color: '#1e293b', 
                                                    fontSize: '12px',
                                                    letterSpacing: '0.025em',
                                                    textTransform: 'uppercase',
                                                    borderRight: '1px solid #e2e8f0',
                                                    minWidth: '140px',
                                                    background: 'transparent'
                                                }}>
                                                    Team Member
                                                </th>
                                                <th style={{ 
                                                    padding: '12px 16px', 
                                                    textAlign: 'center', 
                                                    fontWeight: '700', 
                                                    color: '#1e293b', 
                                                    fontSize: '12px',
                                                    letterSpacing: '0.025em',
                                                    textTransform: 'uppercase',
                                                    borderRight: '1px solid #e2e8f0',
                                                    minWidth: '240px',
                                                    background: 'transparent'
                                                }}>
                                                    Member Score
                                                </th>
                                                <th style={{ 
                                                    padding: '12px 16px', 
                                                    textAlign: 'center', 
                                                    fontWeight: '700', 
                                                    color: '#1e293b', 
                                                    fontSize: '12px',
                                                    letterSpacing: '0.025em',
                                                    textTransform: 'uppercase',
                                                    borderRight: '1px solid #e2e8f0',
                                                    minWidth: '120px',
                                                    background: 'transparent'
                                                }}>
                                                    AI Risk
                                                </th>
                                                <th style={{ 
                                                    padding: '12px 16px',
                                                    textAlign: 'center',
                                                    fontWeight: '700',
                                                    fontSize: '12px',
                                                    color: '#1e293b',
                                                    letterSpacing: '0.025em',
                                                    textTransform: 'uppercase',
                                                    borderRight: '1px solid #e2e8f0',
                                                    minWidth: '140px',
                                                    background: 'transparent'
                                                }}>
                                                    Assessment
                                                </th>
                                                <th style={{ 
                                                    padding: '12px 16px',
                                                    textAlign: 'center',
                                                    fontWeight: '700',
                                                    fontSize: '12px',
                                                    color: '#1e293b',
                                                    letterSpacing: '0.025em',
                                                    textTransform: 'uppercase',
                                                    minWidth: '140px',
                                                    background: 'transparent'
                                                }}>
                                                    Primary Trigger
                                                </th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {filteredMembers.map((member, index) => (
                                                <tr 
                                                    key={member.id}
                                                    onMouseEnter={() => setHoveredMember(member)}
                                                    style={{ 
                                                        borderBottom: '1px solid #e5e7eb',
                                                        backgroundColor: index % 2 === 0 ? '#ffffff' : '#fafbfc',
                                                        transition: 'all 0.2s ease'
                                                    }}
                                                    className={`table-row ${index % 2 === 1 ? 'table-row-alt' : ''}`}
                                                >
                                                    <td style={{ 
                                                        padding: '16px 20px',
                                                        borderRight: '1px solid #e5e7eb'
                                                    }}>
                                                        <VStack align="stretch" gap={2}>
                                                            <HStack gap={2} align="center">
                                                                <Box
                                                                    w="28px"
                                                                    h="28px"
                                                                    borderRadius="full"
                                                                    bg="#6b7280"
                                                                    display="flex"
                                                                    alignItems="center"
                                                                    justifyContent="center"
                                                                    color="white"
                                                                    fontSize="xs"
                                                                    fontWeight="medium"
                                                                >
                                                                    {member.name.charAt(0).toUpperCase()}
                                                                </Box>
                                                                <VStack align="start" gap={0} flex={1}>
                                                                    <Text fontWeight="semibold" color="gray.800" fontSize="xs">
                                                                        {member.name}
                                                                    </Text>
                                                                    <Text color="gray.500" fontSize="2xs" truncate>
                                                                        {member.email}
                                                                    </Text>
                                                                </VStack>
                                                            </HStack>
                                                        </VStack>
                                                    </td>

                                                    <td style={{ 
                                                        padding: '12px 16px', 
                                                        textAlign: 'center',
                                                        borderRight: '1px solid #f3f4f6'
                                                    }}>
                                                        {/* Risk Factors Grid - 2x2 Layout */}
                                                        <VStack gap={2} w="full">
                                                            {/* Top Row: Mental and Motivation */}
                                                            <HStack gap={3} justify="center" w="full">
                                                                <VStack gap={1} align="center" minW="80px">
                                                                    <Text fontSize="2xs" color="gray.600" fontWeight="600">
                                                                        Mental
                                                                    </Text>
                                                                    <Badge
                                                                        colorScheme={member.mentalHealth === 'High' ? 'red' : member.mentalHealth === 'Medium' ? 'orange' : 'green'}
                                                                        fontSize="2xs"
                                                                        px={2}
                                                                        py={0.5}
                                                                    >
                                                                        {member.mentalHealth}
                                                                    </Badge>
                                                                </VStack>
                                                                <VStack gap={1} align="center" minW="80px">
                                                                    <Text fontSize="2xs" color="gray.600" fontWeight="600">
                                                                        Motivation
                                                                    </Text>
                                                                    <Badge
                                                                        colorScheme={member.motivationFactor === 'High' ? 'red' : member.motivationFactor === 'Medium' ? 'orange' : 'green'}
                                                                        fontSize="2xs"
                                                                        px={2}
                                                                        py={0.5}
                                                                    >
                                                                        {member.motivationFactor}
                                                                    </Badge>
                                                                </VStack>
                                                            </HStack>
                                                            {/* Bottom Row: Career and Personal */}
                                                            <HStack gap={3} justify="center" w="full">
                                                                <VStack gap={1} align="center" minW="80px">
                                                                    <Text fontSize="2xs" color="gray.600" fontWeight="600">
                                                                        Career
                                                                    </Text>
                                                                    <Badge
                                                                        colorScheme={member.careerOpportunities === 'High' ? 'red' : member.careerOpportunities === 'Medium' ? 'orange' : 'green'}
                                                                        fontSize="2xs"
                                                                        px={2}
                                                                        py={0.5}
                                                                    >
                                                                        {member.careerOpportunities}
                                                                    </Badge>
                                                                </VStack>
                                                                <VStack gap={1} align="center" minW="80px">
                                                                    <Text fontSize="2xs" color="gray.600" fontWeight="600">
                                                                        Personal
                                                                    </Text>
                                                                    <Badge
                                                                        colorScheme={member.personalReason === 'High' ? 'red' : member.personalReason === 'Medium' ? 'orange' : 'green'}
                                                                        fontSize="2xs"
                                                                        px={2}
                                                                        py={0.5}
                                                                    >
                                                                        {member.personalReason}
                                                                    </Badge>
                                                                </VStack>
                                                            </HStack>
                                                        </VStack>
                                                    </td>
                                                    <td style={{ 
                                                        padding: '12px 16px', 
                                                        textAlign: 'center',
                                                        borderRight: '1px solid #f3f4f6'
                                                    }}>
                                                        <Text 
                                                            fontSize="xs"
                                                            fontWeight="600"
                                                            color={calculateSuggestedRisk(member) === 'High' ? '#dc2626' : calculateSuggestedRisk(member) === 'Medium' ? '#d97706' : '#059669'}
                                                            bg={calculateSuggestedRisk(member) === 'High' ? '#fef2f2' : calculateSuggestedRisk(member) === 'Medium' ? '#fef3c7' : '#f0fdf4'}
                                                            px={3}
                                                            py={1.5}
                                                            borderRadius="md"
                                                            border="1px solid"
                                                            borderColor={calculateSuggestedRisk(member) === 'High' ? '#fecaca' : calculateSuggestedRisk(member) === 'Medium' ? '#fed7aa' : '#bbf7d0'}
                                                            display="inline-block"
                                                        >
                                                            {calculateSuggestedRisk(member)}
                                                        </Text>
                                                    </td>
                                                    <td style={{ 
                                                        padding: '12px 16px', 
                                                        textAlign: 'center',
                                                        borderRight: '1px solid #f3f4f6'
                                                    }}>
                                                        <select
                                                            value={member.attritionRisk || 'Medium'}
                                                            onChange={(e) => handleRiskChange(member.id, e.target.value as any)}
                                                            style={{
                                                                color: '#374151',
                                                                padding: '4px 8px',
                                                                border: '1px solid #d1d5db',
                                                                borderRadius: '4px',
                                                                fontSize: '11px',
                                                                backgroundColor: 'white',
                                                                fontWeight: '500',
                                                                outline: 'none',
                                                                cursor: 'pointer',
                                                                width: '100%'
                                                            }}
                                                            className="risk-select"
                                                        >
                                                            <option value="High">High Risk</option>
                                                            <option value="Medium">Medium Risk</option>
                                                            <option value="Low">Low Risk</option>
                                                        </select>
                                                    </td>
                                                    <td style={{ 
                                                        padding: '8px 8px', 
                                                        textAlign: 'center'
                                                    }}>
                                                        <select
                                                            defaultValue=""
                                                            style={{
                                                                color: '#374151',
                                                                padding: '4px 8px',
                                                                border: '1px solid #d1d5db',
                                                                borderRadius: '4px',
                                                                fontSize: '11px',
                                                                backgroundColor: 'white',
                                                                fontWeight: '500',
                                                                outline: 'none',
                                                                cursor: 'pointer',
                                                                width: '100%'
                                                            }}
                                                            className="trigger-select"
                                                        >
                                                            <option value="">Select Trigger</option>
                                                            <option value="Career growth">Career growth</option>
                                                            <option value="Salary concerns">Salary concerns</option>
                                                            <option value="Higher education">Higher education</option>
                                                            <option value="Relocating">Relocating</option>
                                                            <option value="Work-life balance">Work-life balance</option>
                                                            <option value="Team conflicts">Team conflicts</option>
                                                        </select>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </Box>
                                
                                {/* CSS Styles for hover effects */}
                                <style jsx>{`
                                    .table-row-alt {
                                        background-color: #fafbff !important;
                                    }
                                    
                                    .table-row {
                                        transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
                                    }
                                    
                                    .table-row:hover {
                                        background: linear-gradient(135deg, #f0f4ff 0%, #e8f0ff 100%) !important;
                                        transform: translateY(-3px) scale(1.02);
                                        box-shadow: 0 10px 30px rgba(128, 90, 213, 0.25), 0 6px 15px rgba(128, 90, 213, 0.15);
                                        border-bottom: 3px solid #805ad5 !important;
                                        z-index: 5;
                                        position: relative;
                                    }
                                    
                                    .risk-select, .trigger-select {
                                        transition: all 0.2s ease;
                                    }
                                    
                                    .risk-select:hover, .trigger-select:hover {
                                        border-color: #6b46c1 !important;
                                        box-shadow: 0 4px 12px rgba(128, 90, 213, 0.2);
                                        transform: scale(1.02);
                                        background: linear-gradient(135deg, #faf9ff 0%, #f3f1ff 100%) !important;
                                    }
                                `}</style>
                            </Card.Body>
                            
                            {/* Enhanced Pagination Footer */}
                            <Card.Footer p={4} borderTop="1px solid" borderColor="gray.200">
                                <HStack justify="space-between" w="full" align="center" flexWrap="wrap" gap={4}>
                                    <Pagination
                                        currentPage={currentPage}
                                        totalPages={Math.ceil((searchQuery ? filteredCount : totalCount) / pageSize)}
                                        totalItems={searchQuery ? filteredCount : totalCount}
                                        itemsPerPage={pageSize}
                                        onPageChange={setCurrentPage}
                                        loading={teamDataLoading}
                                        showFirstLast={true}
                                        showPageNumbers={true}
                                        hideItemCount={true}
                                    />
                                    <Button
                                        colorPalette="blue"
                                        size="sm"
                                        onClick={handleSaveChanges}
                                        disabled={changedMembers.size === 0 || saving}
                                        loading={saving}
                                        loadingText="Saving..."
                                    >
                                        Save Changes ({changedMembers.size})
                                    </Button>
                                </HStack>
                            </Card.Footer>
                        </Card.Root>
                        
                        {/* Profile Panel - 30% */}
                        <Box w="30%" h="120%">
                            {hoveredMember ? (
                                <Card.Root 
                                    bg="white" 
                                    shadow="2xl" 
                                    borderRadius="3xl" 
                                    border="1px solid" 
                                    borderColor="gray.200" 
                                    h="100%" 
                                    display="flex" 
                                    flexDirection="column" 
                                    overflow="hidden"
                                    transform="translateY(-8px)"
                                    transition="all 0.3s ease"
                                    style={{
                                        boxShadow: '0 20px 50px rgba(0, 0, 0, 0.18), 0 10px 20px rgba(0, 0, 0, 0.12), 0 4px 8px rgba(0, 0, 0, 0.08), inset 0 -3px 6px rgba(0, 0, 0, 0.06)'
                                    }}
                                >
                                    {/* Centered Profile Picture */}
                                    <Box 
                                        p={4} 
                                        borderBottom="1px solid" 
                                        borderColor="blue.100"
                                        position="relative"
                                        bg="linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%)"
                                        _before={{
                                            content: '""',
                                            position: 'absolute',
                                            top: 0,
                                            left: 0,
                                            right: 0,
                                            bottom: 0,
                                            backgroundImage: `
                                                radial-gradient(circle at 20% 50%, rgba(255, 255, 255, 0.6) 0%, transparent 50%),
                                                radial-gradient(circle at 80% 80%, rgba(96, 165, 250, 0.08) 0%, transparent 50%),
                                                radial-gradient(circle at 40% 20%, rgba(255, 255, 255, 0.4) 0%, transparent 50%),
                                                repeating-linear-gradient(45deg, transparent, transparent 10px, rgba(96, 165, 250, 0.02) 10px, rgba(96, 165, 250, 0.02) 20px)
                                            `,
                                            opacity: 1,
                                            pointerEvents: 'none'
                                        }}
                                    >
                                        <VStack gap={2} align="center" position="relative" zIndex={1}>
                                            <Box
                                                w="80px"
                                                h="80px"
                                                borderRadius="full"
                                                overflow="hidden"
                                                border="3px solid"
                                                borderColor="blue.200"
                                                bg="white"
                                                position="relative"
                                                boxShadow="0 4px 12px rgba(96, 165, 250, 0.2)"
                                            >
                                                <img 
                                                    src={`https://ui-avatars.com/api/?name=${encodeURIComponent(hoveredMember.name)}&size=200&background=667eea&color=fff&bold=true`}
                                                    alt={hoveredMember.name}
                                                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                                />
                                            </Box>
                                            <VStack gap={0} align="center">
                                                <Text fontWeight="bold" fontSize="md" color="gray.800">
                                                    {hoveredMember.name}
                                                </Text>
                                                <Text fontSize="xs" color="gray.600">
                                                    {hoveredMember.email}
                                                </Text>
                                            </VStack>
                                            <Badge 
                                                colorPalette={getRiskColor(hoveredMember.attritionRisk || 'Medium')} 
                                                size="sm" 
                                                fontWeight="semibold"
                                                variant="solid"
                                                px={3}
                                                py={1}
                                                borderRadius="full"
                                                fontSize="xs"
                                            >
                                                {hoveredMember.attritionRisk || 'Medium'} Risk
                                            </Badge>
                                        </VStack>
                                    </Box>
                                    
                                    <Card.Body p={0} overflowY="auto" flex="1">
                                        {/* Tab Navigation */}
                                        <HStack gap={0} borderBottom="2px solid" borderColor="gray.200" bg="gray.50">
                                            <Box
                                                flex="1"
                                                textAlign="center"
                                                py={3}
                                                cursor="pointer"
                                                borderBottom={activeTab === 'work' ? '3px solid' : 'none'}
                                                borderColor={activeTab === 'work' ? 'blue.500' : 'transparent'}
                                                bg={activeTab === 'work' ? 'white' : 'transparent'}
                                                onClick={() => setActiveTab('work')}
                                                transition="all 0.2s"
                                                _hover={{ bg: activeTab === 'work' ? 'white' : 'gray.100' }}
                                            >
                                                <HStack justify="center" gap={2}>
                                                    <Briefcase size={16} color={activeTab === 'work' ? '#2563eb' : '#6b7280'} />
                                                    <Text 
                                                        fontSize="xs" 
                                                        fontWeight={activeTab === 'work' ? 'bold' : 'medium'}
                                                        color={activeTab === 'work' ? 'blue.600' : 'gray.600'}
                                                    >
                                                        Work & Performance
                                                    </Text>
                                                </HStack>
                                            </Box>
                                            <Box
                                                flex="1"
                                                textAlign="center"
                                                py={3}
                                                cursor="pointer"
                                                borderBottom={activeTab === 'mental' ? '3px solid' : 'none'}
                                                borderColor={activeTab === 'mental' ? 'pink.500' : 'transparent'}
                                                bg={activeTab === 'mental' ? 'white' : 'transparent'}
                                                onClick={() => setActiveTab('mental')}
                                                transition="all 0.2s"
                                                _hover={{ bg: activeTab === 'mental' ? 'white' : 'gray.100' }}
                                            >
                                                <HStack justify="center" gap={2}>
                                                    <Heart size={16} color={activeTab === 'mental' ? '#ec4899' : '#6b7280'} />
                                                    <Text 
                                                        fontSize="xs" 
                                                        fontWeight={activeTab === 'mental' ? 'bold' : 'medium'}
                                                        color={activeTab === 'mental' ? 'pink.600' : 'gray.600'}
                                                    >
                                                        Mental Health
                                                    </Text>
                                                </HStack>
                                            </Box>
                                        </HStack>

                                        {/* Tab Content */}
                                        <Box p={3}>
                                            {activeTab === 'work' ? (
                                                <VStack align="stretch" gap={3}>
                                                    {/* AI Work Insight - First */}
                                                    <Box p={3} bg="gradient-to-r from-blue-50 to-cyan-50" borderRadius="lg" border="1px solid" borderColor="blue.200">
                                                        <HStack gap={2} mb={2}>
                                                            <Box p={1.5} bg="blue.100" borderRadius="md">
                                                                <Brain size={16} color="#2563eb" />
                                                            </Box>
                                                            <Text fontSize="xs" fontWeight="700" color="gray.800">AI Work Insight</Text>
                                                        </HStack>
                                                        <Text fontSize="xs" color="gray.700" lineHeight="1.6">
                                                            Currently managing 3 projects with balanced workload. Showing strong performance on E-Commerce platform. Consider delegating API tasks to optimize productivity.
                                                        </Text>
                                                    </Box>

                                                    {/* Key Metrics */}
                                                    <SimpleGrid columns={2} gap={2}>
                                                        <Box p={2.5} bg="blue.50" borderRadius="lg" textAlign="center">
                                                            <Text fontSize="xl" fontWeight="bold" color="blue.600">78%</Text>
                                                            <Text fontSize="xs" color="gray.600" mt={0.5}>Engagement</Text>
                                                        </Box>
                                                        <Box p={2.5} bg="purple.50" borderRadius="lg" textAlign="center">
                                                            <Text fontSize="xl" fontWeight="bold" color="purple.600">{hoveredMember.utilization}%</Text>
                                                            <Text fontSize="xs" color="gray.600" mt={0.5}>Utilization</Text>
                                                        </Box>
                                                    </SimpleGrid>

                                                    {/* Active Projects and Skills & Learning - Side by Side */}
                                                    <SimpleGrid columns={2} gap={2}>
                                                        {/* Active Projects */}
                                                        <Box p={3} bg="purple.50" borderRadius="lg" border="1px solid" borderColor="purple.200">
                                                            <Text fontSize="xs" fontWeight="700" color="gray.800" mb={2}>Active Projects</Text>
                                                            <VStack align="stretch" gap={2}>
                                                    <Box>
                                                        <HStack justify="space-between" mb={1}>
                                                            <Text fontSize="xs" color="gray.700" fontWeight="600">E-Commerce Platform</Text>
                                                            <Text fontSize="xs" fontWeight="bold" color="purple.600">45%</Text>
                                                        </HStack>
                                                        <Box h="5px" bg="purple.100" borderRadius="full" overflow="hidden">
                                                            <Box w="45%" h="full" bg="purple.500" />
                                                        </Box>
                                                    </Box>
                                                    <Box>
                                                        <HStack justify="space-between" mb={1}>
                                                            <Text fontSize="xs" color="gray.700" fontWeight="600">Mobile App Redesign</Text>
                                                            <Text fontSize="xs" fontWeight="bold" color="purple.600">30%</Text>
                                                        </HStack>
                                                        <Box h="5px" bg="purple.100" borderRadius="full" overflow="hidden">
                                                            <Box w="30%" h="full" bg="purple.500" />
                                                        </Box>
                                                    </Box>
                                                    <Box>
                                                        <HStack justify="space-between" mb={1}>
                                                            <Text fontSize="xs" color="gray.700" fontWeight="600">API Integration</Text>
                                                            <Text fontSize="xs" fontWeight="bold" color="purple.600">25%</Text>
                                                        </HStack>
                                                        <Box h="5px" bg="purple.100" borderRadius="full" overflow="hidden">
                                                            <Box w="25%" h="full" bg="purple.500" />
                                                        </Box>
                                                    </Box>
                                                </VStack>
                                                        </Box>

                                                        {/* Skills & Learning */}
                                                        <Box p={3} bg="green.50" borderRadius="lg" border="1px solid" borderColor="green.200">
                                                            <Text fontSize="xs" fontWeight="700" color="gray.800" mb={2}>Skills & Learning</Text>
                                                        <HStack justify="space-between" mb={2}>
                                                            <Text fontSize="xs" color="gray.600">Skill Level</Text>
                                                            <Text fontSize="xs" fontWeight="bold" color="green.600">65%</Text>
                                                        </HStack>
                                                        <Box h="6px" bg="green.100" borderRadius="full" overflow="hidden" mb={2.5}>
                                                            <Box w="65%" h="full" bg="green.500" />
                                                        </Box>
                                                        <HStack gap={2} mb={2.5} flexWrap="wrap">
                                                            <Badge colorPalette="blue" fontSize="xs" px={2.5} py={1}>React</Badge>
                                                            <Badge colorPalette="purple" fontSize="xs" px={2.5} py={1}>TypeScript</Badge>
                                                            <Badge colorPalette="green" fontSize="xs" px={2.5} py={1}>Node.js</Badge>
                                                        </HStack>
                                                        <SimpleGrid columns={3} gap={2}>
                                                            <VStack gap={0.5} align="center">
                                                                <Text fontSize="lg" fontWeight="bold" color="orange.600">12</Text>
                                                                <Text fontSize="xs" color="gray.600">Courses</Text>
                                                            </VStack>
                                                            <VStack gap={0.5} align="center">
                                                                <Text fontSize="lg" fontWeight="bold" color="green.600">85%</Text>
                                                                <Text fontSize="xs" color="gray.600">Score</Text>
                                                            </VStack>
                                                            <VStack gap={0.5} align="center">
                                                                <Text fontSize="lg" fontWeight="bold" color="blue.600">24h</Text>
                                                                <Text fontSize="xs" color="gray.600">Time</Text>
                                                            </VStack>
                                                        </SimpleGrid>
                                                        </Box>
                                                    </SimpleGrid>
                                                </VStack>
                                            ) : (
                                                <VStack align="stretch" gap={3}>
                                                    {/* AI Mental Health Insight */}
                                                    <Box p={3} bg="gradient-to-r from-pink-50 to-rose-50" borderRadius="lg" border="1px solid" borderColor="pink.200">
                                                        <HStack gap={2} mb={2}>
                                                            <Box p={1.5} bg="pink.100" borderRadius="md">
                                                                <Brain size={16} color="#ec4899" />
                                                            </Box>
                                                            <Text fontSize="xs" fontWeight="700" color="gray.800">AI Mental Health Insight</Text>
                                                        </HStack>
                                                        <Text fontSize="xs" color="gray.700" lineHeight="1.6" mb={2.5}>
                                                            {hoveredMember.mentalHealth === 'High' 
                                                                ? 'High stress indicators detected. Recommend immediate 1-on-1 check-in and workload review. Consider wellness program enrollment.'
                                                                : hoveredMember.mentalHealth === 'Medium'
                                                                ? 'Moderate stress levels observed. Schedule regular check-ins and monitor workload. Encourage work-life balance practices.'
                                                                : 'Positive mental health indicators. Maintain current support and recognition practices. Good work-life balance observed.'}
                                                        </Text>
                                                        <SimpleGrid columns={2} gap={2}>
                                                            <Box>
                                                                <Text fontSize="xs" color="gray.600" mb={1}>Mental Health</Text>
                                                                <Badge 
                                                                    colorPalette={hoveredMember.mentalHealth === 'High' ? 'red' : hoveredMember.mentalHealth === 'Medium' ? 'orange' : 'green'}
                                                                    fontSize="xs"
                                                                    px={2.5}
                                                                    py={1}
                                                                >
                                                                    {hoveredMember.mentalHealth}
                                                                </Badge>
                                                            </Box>
                                                            <Box>
                                                                <Text fontSize="xs" color="gray.600" mb={1}>Motivation</Text>
                                                                <Badge 
                                                                    colorPalette={hoveredMember.motivationFactor === 'High' ? 'red' : hoveredMember.motivationFactor === 'Medium' ? 'orange' : 'green'}
                                                                    fontSize="xs"
                                                                    px={2.5}
                                                                    py={1}
                                                                >
                                                                    {hoveredMember.motivationFactor}
                                                                </Badge>
                                                            </Box>
                                                        </SimpleGrid>
                                                    </Box>

                                                    {/* Engagement Metrics */}
                                                    <Box p={3} bg="blue.50" borderRadius="lg" border="1px solid" borderColor="blue.200">
                                                        <Text fontSize="xs" fontWeight="700" color="gray.800" mb={2.5}>Engagement Metrics</Text>
                                                        <VStack align="stretch" gap={2}>
                                                            <Box>
                                                                <HStack justify="space-between" mb={1}>
                                                                    <HStack gap={1.5}>
                                                                        <BookOpen size={14} color="#2563eb" />
                                                                        <Text fontSize="xs" color="gray.700">Knowledge Articles</Text>
                                                                    </HStack>
                                                                    <Text fontSize="xs" fontWeight="bold" color="blue.600">24</Text>
                                                                </HStack>
                                                                <Box h="5px" bg="blue.100" borderRadius="full" overflow="hidden">
                                                                    <Box w="80%" h="full" bg="blue.500" />
                                                                </Box>
                                                            </Box>
                                                            <Box>
                                                                <HStack justify="space-between" mb={1}>
                                                                    <HStack gap={1.5}>
                                                                        <Video size={14} color="#7c3aed" />
                                                                        <Text fontSize="xs" color="gray.700">Videos Watched</Text>
                                                                    </HStack>
                                                                    <Text fontSize="xs" fontWeight="bold" color="purple.600">18</Text>
                                                                </HStack>
                                                                <Box h="5px" bg="purple.100" borderRadius="full" overflow="hidden">
                                                                    <Box w="60%" h="full" bg="purple.500" />
                                                                </Box>
                                                            </Box>
                                                            <Box>
                                                                <HStack justify="space-between" mb={1}>
                                                                    <HStack gap={1.5}>
                                                                        <MessageCircle size={14} color="#059669" />
                                                                        <Text fontSize="xs" color="gray.700">Chat Sessions</Text>
                                                                    </HStack>
                                                                    <Text fontSize="xs" fontWeight="bold" color="green.600">32</Text>
                                                                </HStack>
                                                                <Box h="5px" bg="green.100" borderRadius="full" overflow="hidden">
                                                                    <Box w="90%" h="full" bg="green.500" />
                                                                </Box>
                                                            </Box>
                                                        </VStack>
                                                    </Box>

                                                    {/* Risk Factors */}
                                                    <Box p={3} bg="orange.50" borderRadius="lg" border="1px solid" borderColor="orange.200">
                                                        <Text fontSize="xs" fontWeight="700" color="gray.800" mb={2.5}>Risk Factors</Text>
                                                        <SimpleGrid columns={2} gap={2}>
                                                            <Box>
                                                                <Text fontSize="xs" color="gray.600" mb={1}>Career Opportunities</Text>
                                                                <Badge 
                                                                    colorPalette={hoveredMember.careerOpportunities === 'High' ? 'red' : hoveredMember.careerOpportunities === 'Medium' ? 'orange' : 'green'}
                                                                    fontSize="xs"
                                                                    px={2.5}
                                                                    py={1}
                                                                >
                                                                    {hoveredMember.careerOpportunities}
                                                                </Badge>
                                                            </Box>
                                                            <Box>
                                                                <Text fontSize="xs" color="gray.600" mb={1}>Personal Reasons</Text>
                                                                <Badge 
                                                                    colorPalette={hoveredMember.personalReason === 'High' ? 'red' : hoveredMember.personalReason === 'Medium' ? 'orange' : 'green'}
                                                                    fontSize="xs"
                                                                    px={2.5}
                                                                    py={1}
                                                                >
                                                                    {hoveredMember.personalReason}
                                                                </Badge>
                                                            </Box>
                                                        </SimpleGrid>
                                                    </Box>
                                                </VStack>
                                            )}
                                        </Box>
                                    </Card.Body>
                                </Card.Root>
                            ) : (
                                <Card.Root bg="gray.50" shadow="sm" borderRadius="3xl" border="1px dashed" borderColor="gray.300" h="100%" display="flex" alignItems="center" justifyContent="center">
                                    <Card.Body p={8}>
                                        <VStack gap={3} align="center">
                                            <Box p={4} bg="gray.200" borderRadius="full">
                                                <Users size={32} color="#9ca3af" />
                                            </Box>
                                            <Text fontSize="sm" color="gray.500" textAlign="center">
                                                Hover over a team member row to see their profile
                                            </Text>
                                        </VStack>
                                    </Card.Body>
                                </Card.Root>
                            )}
                        </Box>
                        </HStack>
                        )}
                    </VStack>
                </Box>

                {/* Member Summary Modal */}
                {isSummaryModalOpen && selectedMember && (
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
                    onClick={() => setIsSummaryModalOpen(false)}
                    style={{ animation: 'fadeIn 0.3s ease-out' }}
                >
                    <Box
                        bg="white"
                        borderRadius="2xl"
                        maxW="900px"
                        w="90%"
                        maxH="85vh"
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
                            <HStack justify="space-between" align="start">
                                <HStack gap={4}>
                                    <Box
                                        w="60px"
                                        h="60px"
                                        borderRadius="full"
                                        bg="white"
                                        display="flex"
                                        alignItems="center"
                                        justifyContent="center"
                                        fontSize="2xl"
                                        fontWeight="bold"
                                        color="purple.600"
                                    >
                                        {selectedMember.name.charAt(0).toUpperCase()}
                                    </Box>
                                    <VStack align="start" gap={1}>
                                        <Heading size="lg" color="white" fontWeight="600">
                                            {selectedMember.name}
                                        </Heading>
                                        <Text color="whiteAlpha.900" fontSize="sm">
                                            {selectedMember.email}
                                        </Text>
                                    </VStack>
                                </HStack>
                                <Button
                                    onClick={() => setIsSummaryModalOpen(false)}
                                    variant="ghost"
                                    color="white"
                                    _hover={{ bg: "whiteAlpha.200" }}
                                    size="sm"
                                >
                                    ✕
                                </Button>
                            </HStack>
                        </Box>

                        {/* Modal Body */}
                        <Box p={6} overflowY="auto" maxH="calc(85vh - 140px)">
                            <VStack gap={6} align="stretch">
                                {/* Skill Positioning */}
                                <Box p={4} bg="blue.50" borderRadius="lg" border="1px solid" borderColor="blue.200">
                                    <HStack gap={3} mb={4}>
                                        <Box p={2} bg="blue.100" borderRadius="md">
                                            <Target size={20} color="#2563eb" />
                                        </Box>
                                        <Heading size="md" color="gray.800" fontWeight="600">
                                            Skill Positioning
                                        </Heading>
                                    </HStack>
                                    <SimpleGrid columns={2} gap={4}>
                                        <Box>
                                            <Text fontSize="xs" color="gray.600" mb={1}>Current Level</Text>
                                            <HStack>
                                                <Box flex={1} h="8px" bg="gray.200" borderRadius="full" overflow="hidden">
                                                    <Box w="65%" h="full" bg="blue.500" />
                                                </Box>
                                                <Text fontSize="sm" fontWeight="600" color="blue.600">65%</Text>
                                            </HStack>
                                        </Box>
                                        <Box>
                                            <Text fontSize="xs" color="gray.600" mb={1}>Target Level</Text>
                                            <HStack>
                                                <Box flex={1} h="8px" bg="gray.200" borderRadius="full" overflow="hidden">
                                                    <Box w="100%" h="full" bg="green.500" />
                                                </Box>
                                                <Text fontSize="sm" fontWeight="600" color="green.600">100%</Text>
                                            </HStack>
                                        </Box>
                                    </SimpleGrid>
                                    <Box mt={4}>
                                        <Text fontSize="xs" color="gray.600" mb={2}>Top Skills</Text>
                                        <HStack gap={2} flexWrap="wrap">
                                            <Badge colorScheme="blue" fontSize="xs">React</Badge>
                                            <Badge colorScheme="purple" fontSize="xs">TypeScript</Badge>
                                            <Badge colorScheme="green" fontSize="xs">Node.js</Badge>
                                            <Badge colorScheme="orange" fontSize="xs">Python</Badge>
                                        </HStack>
                                    </Box>
                                </Box>

                                {/* Learning Curve */}
                                <Box p={4} bg="purple.50" borderRadius="lg" border="1px solid" borderColor="purple.200">
                                    <HStack gap={3} mb={4}>
                                        <Box p={2} bg="purple.100" borderRadius="md">
                                            <TrendingUp size={20} color="#9333ea" />
                                        </Box>
                                        <Heading size="md" color="gray.800" fontWeight="600">
                                            Learning Curve
                                        </Heading>
                                    </HStack>
                                    <SimpleGrid columns={3} gap={4}>
                                        <Box textAlign="center" p={3} bg="white" borderRadius="md">
                                            <Text fontSize="2xl" fontWeight="bold" color="purple.600">12</Text>
                                            <Text fontSize="xs" color="gray.600">Courses Completed</Text>
                                        </Box>
                                        <Box textAlign="center" p={3} bg="white" borderRadius="md">
                                            <Text fontSize="2xl" fontWeight="bold" color="green.600">85%</Text>
                                            <Text fontSize="xs" color="gray.600">Avg. Score</Text>
                                        </Box>
                                        <Box textAlign="center" p={3} bg="white" borderRadius="md">
                                            <Text fontSize="2xl" fontWeight="bold" color="blue.600">24h</Text>
                                            <Text fontSize="xs" color="gray.600">Learning Time</Text>
                                        </Box>
                                    </SimpleGrid>
                                    <Box mt={4}>
                                        <Text fontSize="xs" color="gray.600" mb={2}>Recent Progress</Text>
                                        <VStack gap={2} align="stretch">
                                            <HStack justify="space-between" p={2} bg="white" borderRadius="md">
                                                <Text fontSize="xs" color="gray.700">Advanced React Patterns</Text>
                                                <Badge colorScheme="green" fontSize="2xs">Completed</Badge>
                                            </HStack>
                                            <HStack justify="space-between" p={2} bg="white" borderRadius="md">
                                                <Text fontSize="xs" color="gray.700">System Design Fundamentals</Text>
                                                <Badge colorScheme="blue" fontSize="2xs">In Progress</Badge>
                                            </HStack>
                                        </VStack>
                                    </Box>
                                </Box>

                                {/* Mental Health */}
                                <Box p={4} bg="pink.50" borderRadius="lg" border="1px solid" borderColor="pink.200">
                                    <HStack gap={3} mb={4}>
                                        <Box p={2} bg="pink.100" borderRadius="md">
                                            <Heart size={20} color="#ec4899" />
                                        </Box>
                                        <Heading size="md" color="gray.800" fontWeight="600">
                                            Mental Health & Well-being
                                        </Heading>
                                    </HStack>
                                    <SimpleGrid columns={2} gap={4}>
                                        <Box>
                                            <Text fontSize="xs" color="gray.600" mb={2}>Mental Health Risk</Text>
                                            <Badge
                                                colorScheme={selectedMember.mentalHealth === 'High' ? 'red' : selectedMember.mentalHealth === 'Medium' ? 'orange' : 'green'}
                                                fontSize="sm"
                                                px={3}
                                                py={1}
                                            >
                                                {selectedMember.mentalHealth}
                                            </Badge>
                                        </Box>
                                        <Box>
                                            <Text fontSize="xs" color="gray.600" mb={2}>Motivation Level</Text>
                                            <Badge
                                                colorScheme={selectedMember.motivationFactor === 'High' ? 'red' : selectedMember.motivationFactor === 'Medium' ? 'orange' : 'green'}
                                                fontSize="sm"
                                                px={3}
                                                py={1}
                                            >
                                                {selectedMember.motivationFactor}
                                            </Badge>
                                        </Box>
                                    </SimpleGrid>
                                    <Box mt={4}>
                                        <Text fontSize="xs" color="gray.600" mb={2}>Key Indicators</Text>
                                        <VStack gap={2} align="stretch">
                                            <HStack justify="space-between" p={2} bg="white" borderRadius="md">
                                                <Text fontSize="xs" color="gray.700">Work-Life Balance</Text>
                                                <Text fontSize="xs" fontWeight="600" color="green.600">Good</Text>
                                            </HStack>
                                            <HStack justify="space-between" p={2} bg="white" borderRadius="md">
                                                <Text fontSize="xs" color="gray.700">Stress Level</Text>
                                                <Text fontSize="xs" fontWeight="600" color="orange.600">Moderate</Text>
                                            </HStack>
                                            <HStack justify="space-between" p={2} bg="white" borderRadius="md">
                                                <Text fontSize="xs" color="gray.700">Career Satisfaction</Text>
                                                <Badge colorScheme={selectedMember.careerOpportunities === 'High' ? 'red' : selectedMember.careerOpportunities === 'Medium' ? 'orange' : 'green'} fontSize="2xs">
                                                    {selectedMember.careerOpportunities}
                                                </Badge>
                                            </HStack>
                                        </VStack>
                                    </Box>
                                </Box>

                                {/* Wellness Engagement */}
                                <Box p={4} bg="orange.50" borderRadius="lg" border="1px solid" borderColor="orange.200">
                                    <HStack gap={3} mb={4}>
                                        <Box p={2} bg="orange.100" borderRadius="md">
                                            <BookOpen size={20} color="#dd6b20" />
                                        </Box>
                                        <Heading size="md" color="gray.800" fontWeight="600">
                                            Wellness Engagement
                                        </Heading>
                                    </HStack>
                                    
                                    {/* Engagement Stats */}
                                    <SimpleGrid columns={3} gap={4} mb={4}>
                                        <Box textAlign="center" p={3} bg="white" borderRadius="md">
                                            <HStack justify="center" gap={2} mb={1}>
                                                <BookOpen size={16} color="#dd6b20" />
                                                <Text fontSize="2xl" fontWeight="bold" color="orange.600">
                                                    {Math.floor(Math.random() * 15) + 8}
                                                </Text>
                                            </HStack>
                                            <Text fontSize="xs" color="gray.600">Articles Read</Text>
                                        </Box>
                                        <Box textAlign="center" p={3} bg="white" borderRadius="md">
                                            <HStack justify="center" gap={2} mb={1}>
                                                <Video size={16} color="#9333ea" />
                                                <Text fontSize="2xl" fontWeight="bold" color="purple.600">
                                                    {Math.floor(Math.random() * 10) + 4}
                                                </Text>
                                            </HStack>
                                            <Text fontSize="xs" color="gray.600">Videos Watched</Text>
                                        </Box>
                                        <Box textAlign="center" p={3} bg="white" borderRadius="md">
                                            <HStack justify="center" gap={2} mb={1}>
                                                <MessageCircle size={16} color="#3b82f6" />
                                                <Text fontSize="2xl" fontWeight="bold" color="blue.600">
                                                    {Math.floor(Math.random() * 5) + 2}
                                                </Text>
                                            </HStack>
                                            <Text fontSize="xs" color="gray.600">Chat Sessions</Text>
                                        </Box>
                                    </SimpleGrid>

                                    {/* Content Trends */}
                                    <Box>
                                        <Text fontSize="xs" color="gray.600" mb={2} fontWeight="600">Content Engagement Trends</Text>
                                        <VStack gap={2} align="stretch">
                                            <Box p={3} bg="white" borderRadius="md">
                                                <HStack justify="space-between" mb={2}>
                                                    <Text fontSize="xs" color="gray.700" fontWeight="600">🧘 Stress Management</Text>
                                                    <Badge colorScheme="orange" fontSize="2xs">High Interest</Badge>
                                                </HStack>
                                                <Text fontSize="2xs" color="gray.600" mb={2}>8 times in last 2 weeks</Text>
                                                <Box w="full" h="4px" bg="gray.200" borderRadius="full" overflow="hidden">
                                                    <Box w="75%" h="full" bg="orange.400" />
                                                </Box>
                                            </Box>
                                            <Box p={3} bg="white" borderRadius="md">
                                                <HStack justify="space-between" mb={2}>
                                                    <Text fontSize="xs" color="gray.700" fontWeight="600">💤 Work-Life Balance</Text>
                                                    <Badge colorScheme="purple" fontSize="2xs">Moderate</Badge>
                                                </HStack>
                                                <Text fontSize="2xs" color="gray.600" mb={2}>5 videos last month</Text>
                                                <Box w="full" h="4px" bg="gray.200" borderRadius="full" overflow="hidden">
                                                    <Box w="55%" h="full" bg="purple.400" />
                                                </Box>
                                            </Box>
                                            <Box p={3} bg="white" borderRadius="md">
                                                <HStack justify="space-between" mb={2}>
                                                    <Text fontSize="xs" color="gray.700" fontWeight="600">💬 Chat Support</Text>
                                                    <Badge colorScheme="blue" fontSize="2xs">Recent</Badge>
                                                </HStack>
                                                <Text fontSize="2xs" color="gray.600" mb={2}>3 sessions this week</Text>
                                                <Box w="full" h="4px" bg="gray.200" borderRadius="full" overflow="hidden">
                                                    <Box w="40%" h="full" bg="blue.400" />
                                                </Box>
                                            </Box>
                                        </VStack>
                                    </Box>

                                    {/* AI Insights */}
                                    <Box mt={4} p={3} bg="white" borderRadius="md" border="1px solid" borderColor="orange.300">
                                        <HStack gap={2} mb={2}>
                                            <Brain size={14} color="#9333ea" />
                                            <Text fontSize="xs" fontWeight="600" color="gray.800">AI Insight</Text>
                                        </HStack>
                                        <Text fontSize="xs" color="gray.700" lineHeight="1.6">
                                            {selectedMember.name.split(' ')[0]} shows consistent engagement with <strong>stress-related content</strong>, 
                                            particularly during <strong>Monday mornings and late evenings</strong>. Recommend scheduling a 1-on-1 check-in.
                                        </Text>
                                    </Box>

                                    {/* Recommended Actions */}
                                    <Box mt={4}>
                                        <Text fontSize="xs" color="gray.600" mb={2} fontWeight="600">Recommended Actions</Text>
                                        <VStack gap={2} align="stretch">
                                            <HStack gap={2} p={2} bg="white" borderRadius="md">
                                                <CheckCircle size={12} color="#22c55e" />
                                                <Text fontSize="xs" color="gray.700">Schedule 1-on-1 for workload discussion</Text>
                                            </HStack>
                                            <HStack gap={2} p={2} bg="white" borderRadius="md">
                                                <CheckCircle size={12} color="#22c55e" />
                                                <Text fontSize="xs" color="gray.700">Recommend stress management workshop</Text>
                                            </HStack>
                                            <HStack gap={2} p={2} bg="white" borderRadius="md">
                                                <CheckCircle size={12} color="#22c55e" />
                                                <Text fontSize="xs" color="gray.700">Connect with EAP counselor</Text>
                                            </HStack>
                                        </VStack>
                                    </Box>
                                </Box>

                                {/* Overall Assessment */}
                                <Box p={4} bg="gray.50" borderRadius="lg" border="1px solid" borderColor="gray.200">
                                    <HStack gap={3} mb={3}>
                                        <Box p={2} bg="gray.200" borderRadius="md">
                                            <BarChart3 size={20} color="#4b5563" />
                                        </Box>
                                        <Heading size="md" color="gray.800" fontWeight="600">
                                            Overall Assessment
                                        </Heading>
                                    </HStack>
                                    <HStack justify="space-between" align="center">
                                        <Text fontSize="sm" color="gray.700">Attrition Risk</Text>
                                        <Badge
                                            colorScheme={selectedMember.attritionRisk === 'High' ? 'red' : selectedMember.attritionRisk === 'Medium' ? 'orange' : 'green'}
                                            fontSize="md"
                                            px={4}
                                            py={2}
                                        >
                                            {selectedMember.attritionRisk}
                                        </Badge>
                                    </HStack>
                                </Box>
                            </VStack>
                        </Box>
                    </Box>
                </Box>
                )}
            </AppLayout>

            {/* Employee Detail Modal - Rendered outside AppLayout */}
            <EmployeeDetailModal
                isOpen={isEmployeeDetailModalOpen}
                onClose={() => {
                    setIsEmployeeDetailModalOpen(false);
                    setSelectedMember(null);
                }}
                employee={selectedMember}
            />
        </>
    );
}
