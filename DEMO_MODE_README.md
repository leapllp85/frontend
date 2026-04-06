# Demo Mode - Implementation Summary

## Overview

The application has been successfully configured to run in **demo mode** using comprehensive mock data. All API calls are disabled and replaced with realistic mock data to provide a fully functional demo experience.

## Features

### ✅ Mock Data Implemented

1. **Team & Employees** (15 members)
   - Complete employee profiles with mental health scores
   - Attrition risk assessments
   - Project allocations
   - Trigger analysis (MH, MT, CO, PR)

2. **Projects** (20 projects)
   - Distributed across 5 business units
   - Various criticality levels (High/Medium/Low)
   - Project allocations and team assignments
   - Timeline and status tracking

3. **Surveys** (6 surveys)
   - Different survey types (engagement, wellness, feedback, etc.)
   - Question statistics with answer distributions
   - Response tracking and completion rates
   - Pending members lists

4. **Dashboard Data**
   - Team attrition risk: 42.5%
   - Team mental health: 68.3%
   - Average utilization: 86.3%
   - Top talent identification
   - Average age: 33.5 years

5. **Action Items** (25 items)
   - Assigned to team members
   - Priority levels (High/Medium/Low)
   - Status tracking (Pending/Completed)

6. **Courses** (12 courses)
   - Categories: Mental Health, Career Development, Technical Skills, Leadership, Communication
   - Various learning resources

7. **Chat/RAG Responses** (10+ pre-defined prompts)
   - Employee analysis queries
   - Project insights
   - Mental health queries
   - Attrition analysis
   - Performance reports

## Demo Configuration

### Location
`src/config/demo.ts`

### Settings
```typescript
{
  enabled: true,  // Demo mode enabled by default
  delays: {
    short: 200ms,   // Quick operations
    medium: 500ms,  // List operations
    long: 1000ms,   // Complex operations
  },
  features: {
    mockTeam: true,
    mockProjects: true,
    mockSurveys: true,
    mockDashboard: true,
    mockActionItems: true,
    mockCourses: true,
    mockChat: true,
  }
}
```

## Mock Data Structure

```
src/constants/mockData/
├── index.ts              # Central export
├── team.ts              # 15 employees with complete profiles
├── projects.ts          # 20 projects across 5 business units
├── surveys.ts           # 6 surveys with questions and responses
├── actionItems.ts       # 25 action items
├── courses.ts           # 12 learning resources
├── chat.ts              # Pre-defined chat prompts and RAG responses
└── users.ts             # Current user and auth data
```

## Updated API Services

All major API services have been updated to use mock data when demo mode is enabled:

- ✅ `teamApi.ts` - Team members, analytics, statistics
- ✅ `projectApi.ts` - Projects, allocations, risks
- ✅ `surveyApi.ts` - Surveys, responses, statistics
- ✅ `dashboardApi.ts` - Dashboard metrics and quick data
- ✅ `asyncChatApi.ts` - AI chat responses with RAG
- ✅ `actionItemApi.ts` - Action items management
- ✅ `courseApi.ts` - Learning resources

## Pre-defined Chat Prompts

### Employee Analysis
- "Show me all high-risk employees"
- "Who are my top performers?"
- "List employees with mental health concerns"
- "Show team members with low motivation"
- "Which employees are overallocated?"

### Project Insights
- "Which projects are at risk?"
- "Show project allocation by team"
- "List projects with critical members"
- "Projects by business unit"

### Mental Health
- "Team mental health trends"
- "Employees needing mental health support"
- "Mental health distribution by department"

### Attrition Analysis
- "Attrition risk analysis"
- "Top reasons for employee attrition"
- "Predict which employees might leave"
- "Attrition trends by department"

### Performance
- "Team utilization report"
- "Show overallocated employees"
- "Performance metrics by team member"

## Chat Response Structure

Each chat prompt returns a comprehensive RAG response with:

1. **Layout** - Grid configuration for components
2. **Components** - Charts, tables, metrics cards
3. **Dataset** - Filtered/aggregated data
4. **Insights**
   - Key findings (3-5 bullet points)
   - Recommendations (actionable items)
   - Alerts (urgent issues)
   - Next steps (suggested actions)

## Team Composition

### Risk Distribution
- **High Risk**: 5 employees (33%)
- **Medium Risk**: 5 employees (33%)
- **Low Risk**: 5 employees (33%)

### Primary Triggers
- Mental Health (MH): 5 employees
- Motivation (MT): 3 employees
- Career Opportunities (CO): 2 employees
- Personal Reasons (PR): 5 employees

### Allocation
- **Overallocated** (>100%): 2 employees
- **Optimal** (90-100%): 5 employees
- **Underutilized** (<90%): 8 employees

## Project Distribution

### By Business Unit
- Digital: 5 projects
- Supply Chain: 4 projects
- Operations: 3 projects
- Finance: 4 projects
- Merchandising: 4 projects

### By Criticality
- High: 8 projects (40%)
- Medium: 7 projects (35%)
- Low: 5 projects (25%)

## Survey Statistics

| Survey | Type | Completion Rate | Responses |
|--------|------|----------------|-----------|
| Q1 2024 Team Engagement | Engagement | 73% | 11/15 |
| Mental Health Check-in | Wellness | 87% | 13/15 |
| Project Feedback | Feedback | 100% | 15/15 |
| Career Development | Career | 60% | 9/15 |
| Remote Work Experience | Remote Work | 80% | 12/15 |
| Manager Effectiveness | Manager Feedback | 53% | 8/15 |

## How to Use Demo Mode

### Enabled by Default
Demo mode is **enabled by default** in the configuration. No additional setup required.

### To Disable Demo Mode
Edit `src/config/demo.ts`:
```typescript
export const DEMO_CONFIG = {
  enabled: false,  // Set to false to use real API
  // ...
};
```

Or set environment variable:
```bash
NEXT_PUBLIC_DEMO_MODE=false
```

### Testing Different Scenarios

1. **View Team Page**
   - See all 15 team members
   - Filter by risk level, mental health, triggers
   - Search by name or email

2. **View Projects Page**
   - Browse 20 projects
   - Filter by business unit, criticality, status
   - See project allocations and team members

3. **Use AI Chat**
   - Try pre-defined prompts for detailed responses
   - Get insights with charts, tables, and recommendations
   - See realistic progress indicators

4. **Check Surveys**
   - View 6 different surveys
   - See response statistics
   - Check pending members

5. **Review Action Items**
   - See 25 action items
   - Filter by status or priority
   - Assigned to various team members

## Benefits of Demo Mode

✅ **No Backend Required** - Fully functional without API server
✅ **Realistic Data** - 15 employees, 20 projects, comprehensive profiles
✅ **Fast Development** - Test UI without waiting for API
✅ **Consistent Testing** - Same data every time
✅ **Complete Features** - All pages and functionality work
✅ **AI Chat Responses** - Pre-defined prompts with detailed insights
✅ **Easy Toggle** - Switch between demo and real API easily

## Data Relationships

All mock data maintains proper relationships:
- Employee IDs match across allocations and projects
- Project IDs consistent in allocations and risks
- Survey responses match question types
- Chat responses use actual mock data for accuracy

## Performance

Mock data is optimized for browser performance:
- Realistic delays simulate API latency
- Data size kept reasonable (15 employees, 20 projects)
- Efficient filtering and pagination
- No unnecessary data duplication

## Future Enhancements

Potential improvements for demo mode:
- Add more chat prompts
- Include time-series data for trends
- Add more survey types
- Expand course catalog
- Include notification mock data

## Support

For questions or issues with demo mode:
1. Check `src/config/demo.ts` for configuration
2. Review mock data in `src/constants/mockData/`
3. Verify API service implementations
4. Check browser console for errors

---

**Demo Mode Status**: ✅ **ACTIVE**

All API calls are currently using mock data. The application is fully functional for demonstration purposes.
