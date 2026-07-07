# Mock Chat Questions - Complete List

This document contains all available mock chat questions organized by category.

## Employee Analysis Questions

1. **Show me all high-risk employees**
   - Category: employee
   - ID: emp_001

## Project Analysis Questions

2. **Show me projects at risk**
   - Category: project
   - ID: proj_001

## Mental Health Questions

3. **Show me employees with mental health concerns**
   - Category: mental_health
   - ID: mh_001

## Attrition Risk Questions

4. **Which employees are most likely to leave?**
   - Category: attrition
   - ID: attr_001

5. **Top reasons for employee attrition**
   - Category: attrition
   - ID: attr_002

## Performance Analysis Questions

6. **Show me overallocated employees**
   - Category: performance
   - ID: perf_001

### Low Performance Analysis

7. **Employees with low performance ratings in the last 2 cycles**
   - Category: performance
   - ID: perf_low_001

8. **List employees whose performance has declined year-over-year**
   - Category: performance
   - ID: perf_low_002

9. **Who are the bottom 10% performers in my team?**
   - Category: performance
   - ID: perf_low_003

### Performance Benchmarking

10. **List employees with performance below team average**
    - Category: performance
    - ID: cost_perf_001

11. **Show employees with no measurable contributions**
    - Category: performance
    - ID: cost_perf_002

### High Performance Recognition

12. **Show top 20% performers for bonus allocation**
    - Category: performance
    - ID: cost_high_001

13. **Who exceeded their targets significantly?**
    - Category: performance
    - ID: cost_high_002

14. **Show employees with consistent high performance**
    - Category: performance
    - ID: cost_high_003

### Bonus & Compensation

15. **Identify employees eligible for spot bonuses**
    - Category: performance
    - ID: bonus_001

16. **List employees who should not receive bonus**
    - Category: performance
    - ID: bonus_002

17. **Who are the most valuable contributors this cycle?**
    - Category: performance
    - ID: value_001

### Cost Optimization

18. **List employees with low performance and high salary cost**
    - Category: performance
    - ID: cost_001

### Utilization & Resource Planning

19. **Identify roles with low utilization**
    - Category: performance
    - ID: util_001

20. **List employees with no critical project involvement**
    - Category: performance
    - ID: util_002

21. **Identify employees with skills mismatch vs current needs**
    - Category: performance
    - ID: util_003

22. **Show employees with long bench time / idle time**
    - Category: performance
    - ID: util_004

23. **Identify employees with lowest business impact**
    - Category: performance
    - ID: util_005

### Workforce Optimization

24. **Suggest potential layoff candidates**
    - Category: performance
    - ID: layoff_001

---

## Total Questions: 24

### Breakdown by Category:
- **Employee**: 1 question
- **Project**: 1 question
- **Mental Health**: 1 question
- **Attrition**: 2 questions
- **Performance**: 19 questions
  - Low Performance: 3 questions
  - Performance Benchmarking: 2 questions
  - High Performance Recognition: 3 questions
  - Bonus & Compensation: 3 questions
  - Cost Optimization: 1 question
  - Utilization & Resource Planning: 5 questions
  - Workforce Optimization: 1 question
  - General Performance: 1 question (overallocated employees)

---

## File Locations:

- **Main Chat File**: `src/constants/mockData/chat.ts`
- **Performance Questions**: `src/constants/mockData/chatPerformance.ts`
- **Cost Optimization Questions**: `src/constants/mockData/chatCostOptimization.ts`

## Usage:

All questions are available in the chat interface and use keyword-based fuzzy matching. You can ask questions in natural language, and the system will match them to the closest available mock response.

### Example Queries:
- "show high risk employees"
- "who is likely to leave"
- "low performers"
- "bonus eligible employees"
- "underutilized team members"
- "layoff candidates"
