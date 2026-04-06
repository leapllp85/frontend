'use client';

import React, { useState, useEffect } from 'react';
import { Box, VStack, HStack, Text, Badge } from '@chakra-ui/react';
import { Users, AlertTriangle, Brain, Target, BookOpen, Video, MessageCircle } from 'lucide-react';
import { getRiskColor } from '@/utils/riskColors';
import { teamApi, EmployeeProfile, TeamMembersPaginatedResponse, TeamMembersQueryParams } from '@/services';
import { AppLayout } from '@/components/layouts/AppLayout';
import { DataTable, TableColumn } from '@/components/common/DataTable';
import { StatsTile } from '@/components/common/StatsTile';
import { StatsGrid } from '@/components/common/StatsGrid';
import { useScreenSize } from '@/hooks/useScreenSize';
import { getResponsivePadding } from '@/utils/typography';
import { calculateSuggestedRisk } from '@/utils/tableHelpers';
import { mockDataApi } from '@/lib/apis/mockData';

interface TeamMember {
    id: string;
    name: string;
    email: string;
    mentalHealth: 'High' | 'Medium' | 'Low';
    motivationFactor: 'High' | 'Medium' | 'Low';
    careerOpportunities: 'High' | 'Medium' | 'Low';
    personalReason: 'High' | 'Medium' | 'Low';
    managerAssessmentRisk: 'High' | 'Medium' | 'Low';
}

export default function MyTeam() {
    const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const [totalCount, setTotalCount] = useState(0);
    const [filteredCount, setFilteredCount] = useState(0);
    const [wellnessStats, setWellnessStats] = useState({ articlesRead: 0, videosWatched: 0, messagesExchanged: 0, activePercentage: 0 });

    const screenSize = useScreenSize();
    const padding = getResponsivePadding(screenSize);

    const fetchTeamData = async (params?: TeamMembersQueryParams) => {
        try {
            setLoading(true);
            const response: TeamMembersPaginatedResponse = await teamApi.getTeamMembers(params);
            
            const profilesArray = response.results.team_members || [];
            const transformedMembers: TeamMember[] = profilesArray.map((profile: EmployeeProfile) => ({
                id: profile.id.toString(),
                name: `${profile.first_name} ${profile.last_name}`,
                email: profile.email || `${profile.first_name?.toLowerCase()}.${profile.last_name?.toLowerCase()}@company.com`,
                mentalHealth: profile.mental_health as 'High' | 'Medium' | 'Low',
                motivationFactor: profile.motivation_factor as 'High' | 'Medium' | 'Low',
                careerOpportunities: profile.career_opportunities as 'High' | 'Medium' | 'Low',
                personalReason: profile.personal_reason as 'High' | 'Medium' | 'Low',
                managerAssessmentRisk: profile.manager_assessment_risk as 'High' | 'Medium' | 'Low',
            }));
            
            setTeamMembers(transformedMembers);
            setTotalCount(response.count);
            setFilteredCount(response.results.filtered_count);
            setError(null);

            // Fetch wellness stats from mock API
            const stats = await mockDataApi.getWellnessEngagementStats('team');
            setWellnessStats(stats);
        } catch (err) {
            console.error('Error fetching team data:', err);
            setError('Failed to load team data. Please try again.');
            setTeamMembers([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchTeamData({ page: currentPage, page_size: pageSize, search: searchQuery || undefined });
    }, [currentPage, pageSize, searchQuery]);

    const handleRiskChange = (memberId: string, newRisk: 'High' | 'Medium' | 'Low') => {
        setTeamMembers(prev => prev.map(member => 
            member.id === memberId 
                ? { ...member, managerAssessmentRisk: newRisk }
                : member
        ));
    };

    const attritionData = {
        High: teamMembers.filter(m => calculateSuggestedRisk(m as any) === 'High').length,
        Medium: teamMembers.filter(m => calculateSuggestedRisk(m as any) === 'Medium').length,
        Low: teamMembers.filter(m => calculateSuggestedRisk(m as any) === 'Low').length
    };

    const mentalHealthIssues = teamMembers.filter(m => m.mentalHealth === 'Low').length;

    const columns: TableColumn<TeamMember>[] = [
        {
            key: 'name',
            header: 'Member',
            width: '20%',
            align: 'left',
            priority: 'high',
            render: (value, row) => (
                <VStack align="start" gap={1}>
                    <Text fontWeight="semibold" color="gray.800" fontSize="sm">
                        {value}
                    </Text>
                    <Text color="gray.600" fontSize="xs">
                        {row.email}
                    </Text>
                </VStack>
            )
        },
        {
            key: 'mentalHealth',
            header: 'Mental Health',
            width: '12%',
            align: 'center',
            priority: 'high',
            render: (value) => (
                <Badge colorPalette={getRiskColor(value)} size="sm" borderRadius="full">
                    {value}
                </Badge>
            )
        },
        {
            key: 'motivationFactor',
            header: 'Motivation',
            width: '12%',
            align: 'center',
            priority: 'high',
            render: (value) => (
                <Badge colorPalette={getRiskColor(value)} size="sm" borderRadius="full">
                    {value}
                </Badge>
            )
        },
        {
            key: 'careerOpportunities',
            header: 'Career',
            width: '12%',
            align: 'center',
            priority: 'medium',
            render: (value) => (
                <Badge colorPalette={getRiskColor(value)} size="sm" borderRadius="full">
                    {value}
                </Badge>
            )
        },
        {
            key: 'personalReason',
            header: 'Personal',
            width: '12%',
            align: 'center',
            priority: 'medium',
            render: (value) => (
                <Badge colorPalette={getRiskColor(value)} size="sm" borderRadius="full">
                    {value}
                </Badge>
            )
        },
        {
            key: 'suggestedRisk',
            header: 'Suggested Risk',
            width: '12%',
            align: 'center',
            priority: 'medium',
            render: (_, row) => {
                const risk = calculateSuggestedRisk(row as any);
                return (
                    <Badge colorPalette={getRiskColor(risk)} size="sm" borderRadius="full">
                        {risk}
                    </Badge>
                );
            }
        },
        {
            key: 'wellnessEngagement',
            header: 'Wellness Engagement',
            width: '15%',
            align: 'center',
            priority: 'low',
            render: () => (
                <VStack gap={1}>
                    <HStack gap={2} justify="center">
                        <HStack gap={1}>
                            <BookOpen size={14} color="#dd6b20" />
                            <Text fontSize="xs" fontWeight="600" color="gray.700">{wellnessStats.articlesRead}</Text>
                        </HStack>
                        <HStack gap={1}>
                            <Video size={14} color="#9333ea" />
                            <Text fontSize="xs" fontWeight="600" color="gray.700">{wellnessStats.videosWatched}</Text>
                        </HStack>
                        <HStack gap={1}>
                            <MessageCircle size={14} color="#3b82f6" />
                            <Text fontSize="xs" fontWeight="600" color="gray.700">{wellnessStats.messagesExchanged}</Text>
                        </HStack>
                    </HStack>
                    <Badge colorPalette="orange" size="xs" borderRadius="full">
                        {wellnessStats.activePercentage}% Active
                    </Badge>
                </VStack>
            )
        },
        {
            key: 'managerAssessmentRisk',
            header: 'Manager Assessment',
            width: '15%',
            align: 'center',
            priority: 'high',
            render: (value, row) => (
                <select
                    value={value}
                    onChange={(e) => handleRiskChange(row.id, e.target.value as any)}
                    style={{
                        color: '#4a5568',
                        padding: '6px 12px',
                        border: '1px solid #d1d5db',
                        borderRadius: '9999px',
                        fontSize: '12px',
                        backgroundColor: 'white',
                        fontWeight: '500',
                        outline: 'none',
                        cursor: 'pointer'
                    }}
                >
                    <option value="High">High Risk</option>
                    <option value="Medium">Medium Risk</option>
                    <option value="Low">Low Risk</option>
                </select>
            )
        }
    ];

    return (
        <AppLayout>
            <Box w="full" h="100vh" bg="gray.50" overflow="auto">
                <Box px={padding.px} py={padding.py} maxW="1920px" mx="auto">
                    <VStack gap={6} align="stretch" w="full">
                        {/* Stats Grid */}
                        <StatsGrid columns={{ base: 1, sm: 2, md: 3, lg: 5 }}>
                            <StatsTile
                                icon={Users}
                                iconColor="#3182ce"
                                iconBgColor="blue.100"
                                label="Total Team Members"
                                value={teamMembers.length}
                                valueColor="blue.600"
                                loading={loading}
                            />
                            <StatsTile
                                icon={AlertTriangle}
                                iconColor="#e53e3e"
                                iconBgColor="red.100"
                                label="High Risk Members"
                                value={attritionData.High}
                                valueColor="red.600"
                                loading={loading}
                            />
                            <StatsTile
                                icon={Target}
                                iconColor="#38a169"
                                iconBgColor="green.100"
                                label="Low Risk Members"
                                value={attritionData.Low}
                                valueColor="green.600"
                                loading={loading}
                            />
                            <StatsTile
                                icon={Brain}
                                iconColor="#805ad5"
                                iconBgColor="purple.100"
                                label="Mental Health Issues"
                                value={mentalHealthIssues}
                                valueColor="purple.600"
                                loading={loading}
                            />
                            <StatsTile
                                icon={BookOpen}
                                iconColor="#dd6b20"
                                iconBgColor="orange.100"
                                label="Wellness Engagement"
                                value={`${wellnessStats.activePercentage}%`}
                                valueColor="orange.600"
                                loading={loading}
                                subtitle={
                                    <HStack gap={2} fontSize="xs" color="gray.600" justify="center">
                                        <HStack gap={1}>
                                            <BookOpen size={12} />
                                            <Text>{wellnessStats.articlesRead} articles</Text>
                                        </HStack>
                                        <Text>•</Text>
                                        <HStack gap={1}>
                                            <Video size={12} />
                                            <Text>{wellnessStats.videosWatched} videos</Text>
                                        </HStack>
                                    </HStack>
                                }
                            />
                        </StatsGrid>

                        {/* Data Table */}
                        <DataTable
                            data={teamMembers}
                            columns={columns}
                            title="Team Members"
                            description="Individual team member risk assessments"
                            currentPage={currentPage}
                            totalPages={Math.ceil(filteredCount / pageSize)}
                            totalItems={totalCount}
                            itemsPerPage={pageSize}
                            onPageChange={setCurrentPage}
                            onItemsPerPageChange={setPageSize}
                            searchQuery={searchQuery}
                            onSearchChange={setSearchQuery}
                            searchPlaceholder="Search by name, email, or username..."
                            filteredCount={filteredCount}
                            loading={loading}
                            emptyMessage="No team members found"
                            rowHeight="60px"
                        />
                    </VStack>
                </Box>
            </Box>
        </AppLayout>
    );
}
