'use client';

import React, { useState, useEffect } from 'react';
import { Box } from '@chakra-ui/react';
import { DailyCheckInModal } from '@/components/common/DailyCheckInModal';
import { TrendModal } from '@/components/common/TrendModal';

export default function CheckInPopup() {
    // Remove body margins and padding
    useEffect(() => {
        document.body.style.margin = '0';
        document.body.style.padding = '0';
        document.body.style.overflow = 'hidden';
        document.documentElement.style.margin = '0';
        document.documentElement.style.padding = '0';
        document.documentElement.style.overflow = 'hidden';
    }, []);
    const [isOpen, setIsOpen] = useState(true);
    const [showTrend, setShowTrend] = useState(false);

    const handleComplete = (data: { energy: string; workload: string }) => {
        console.log('Check-in completed:', data);
        
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
        
        // Calculate 7-day trend
        const last7Days = last30Days.slice(-7);
        
        // Calculate trends
        const calculateEnergyTrend = (energyData: string[]) => {
            const values = energyData.map(e => e === 'high' ? 3 : e === 'medium' ? 2 : 1);
            const avg = values.reduce((a, b) => a + b, 0) / values.length;
            
            if (avg >= 2.5) return { status: 'improving', emoji: '📈' };
            if (avg >= 1.8) return { status: 'stable', emoji: '➡️' };
            return { status: 'declining', emoji: '📉' };
        };
        
        const calculateWorkloadTrend = (workloadData: string[]) => {
            const yesCount = workloadData.filter(w => w === 'yes').length;
            const percentage = (yesCount / workloadData.length) * 100;
            
            if (percentage >= 70) return { status: 'manageable', emoji: '✅' };
            if (percentage >= 40) return { status: 'moderate', emoji: '⚠️' };
            return { status: 'overwhelming', emoji: '🔴' };
        };
        
        const energyTrend = calculateEnergyTrend(last7Days.map((d: any) => d.energy));
        const workloadTrend = calculateWorkloadTrend(last7Days.map((d: any) => d.workload));
        
        // Show desktop notification
        if ('Notification' in window && Notification.permission === 'granted') {
            const notification = new Notification('📊 Your 7-Day Wellness Trend', {
                body: `Energy: ${energyTrend.emoji} ${energyTrend.status.toUpperCase()}\n` +
                      `Workload: ${workloadTrend.emoji} ${workloadTrend.status.toUpperCase()}\n\n` +
                      `Keep tracking your wellbeing! 💪`,
                requireInteraction: false,
                tag: 'trend-summary',
                silent: true
            });
            
            // Auto-close after 8 seconds
            setTimeout(() => notification.close(), 8000);
        }
        
        // Close check-in modal and show trend modal
        console.log('✅ Check-in complete, showing trend modal...');
        setIsOpen(false);
        
        // Use setTimeout to ensure state updates properly
        setTimeout(() => {
            console.log('📊 Opening trend modal');
            setShowTrend(true);
        }, 100);
    };

    const handleClose = () => {
        console.log('❌ User cancelled check-in');
        setIsOpen(false);
        // Close popup window
        setTimeout(() => {
            window.close();
        }, 300);
    };

    const handleTrendClose = () => {
        console.log('📊 User closed trend modal');
        setShowTrend(false);
        // Don't auto-close popup - let user close it manually
        // User can close the popup window by clicking the browser's close button
    };

    return (
        <Box
            position="fixed"
            top={0}
            left={0}
            right={0}
            bottom={0}
            w="100vw"
            h="100vh"
            m={0}
            p={0}
            bg="linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)"
            display="flex"
            alignItems="center"
            justifyContent="center"
            overflow="hidden"
        >
            <DailyCheckInModal
                isOpen={isOpen}
                onClose={handleClose}
                onComplete={handleComplete}
            />
            
            <TrendModal
                isOpen={showTrend}
                onClose={handleTrendClose}
            />
        </Box>
    );
}
