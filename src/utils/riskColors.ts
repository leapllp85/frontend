/**
 * Utility function to get consistent risk color mapping across the application
 * @param risk - Risk level: 'High', 'Medium', 'Low'
 * @returns Chakra UI color scheme string
 */
export const getRiskColor = (risk: string) => {
    switch (risk) {
        case 'High': return 'red';
        case 'Medium': return 'orange';
        case 'Low': return 'green';
        default: return 'gray';
    }
};

/**
 * Utility function to get risk level from percentage
 * @param percentage - Percentage value
 * @param highThreshold - Threshold for high risk (default: 70)
 * @param mediumThreshold - Threshold for medium risk (default: 40)
 * @returns Risk level string
 */
export const getRiskLevelFromPercentage = (
    percentage: number, 
    highThreshold: number = 70, 
    mediumThreshold: number = 40
): 'High' | 'Medium' | 'Low' => {
    if (percentage >= highThreshold) return 'High';
    if (percentage >= mediumThreshold) return 'Medium';
    return 'Low';
};

/**
 * Utility function to get inverted risk level (for positive metrics like mental health)
 * @param percentage - Percentage value
 * @param goodThreshold - Threshold for good/low risk (default: 80)
 * @param fairThreshold - Threshold for fair/medium risk (default: 60)
 * @returns Risk level string (inverted)
 */
export const getInvertedRiskLevelFromPercentage = (
    percentage: number,
    goodThreshold: number = 80,
    fairThreshold: number = 60
): 'High' | 'Medium' | 'Low' => {
    if (percentage >= goodThreshold) return 'Low';   // Good = Low risk
    if (percentage >= fairThreshold) return 'Medium'; // Fair = Medium risk
    return 'High'; // Poor = High risk
};
