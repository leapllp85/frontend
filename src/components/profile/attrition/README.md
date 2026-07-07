# Attrition Analysis - Modular Component Architecture

This directory contains a modular, reusable component structure for the Attrition Analysis dashboard. The components are organized for easy modification, testing, and reuse across the application.

## 📁 Directory Structure

```
attrition/
├── README.md                           # This file
├── index.ts                            # Barrel export for all components
│
├── TabNavigation.tsx                   # Pill-style tab switcher
├── SectionHeader.tsx                   # Reusable section header with icon
│
├── MetricBar.tsx                       # Progress bar with label and percentage
├── StatCard.tsx                        # Stat display card (value + label)
├── AlertCard.tsx                       # Alert card with icon, stats, badges, items
├── ActionItemCard.tsx                  # Action/recommendation card with items
│
├── Tab1Content.tsx                     # "Your Attention" tab content
├── Tab2Content.tsx                     # "Recommendations" tab content
│
└── [Legacy Components]                 # Backward compatibility components
    ├── DistributionPieChart.tsx
    ├── AnalysisDonutChart.tsx
    ├── SurveySentimentBar.tsx
    └── ...
```

## 🧩 Component Overview

### Navigation & Layout

#### `TabNavigation`
Clean pill-style tab switcher with hover states.
```tsx
<TabNavigation 
  tabs={['Tab 1', 'Tab 2', 'Tab 3']} 
  activeTab={0} 
  onTabChange={(index) => setActiveTab(index)} 
/>
```

#### `SectionHeader`
Consistent section header with icon and subtitle.
```tsx
<SectionHeader
  title="Action Items"
  subtitle="Immediate actions required"
  icon={Target}
  iconColor="#ef4444"
  iconBg="red.50"
/>
```

### Reusable UI Components

#### `MetricBar`
Horizontal progress bar with label and percentage.
```tsx
<MetricBar
  label="Workload Stress"
  value={68}
  color="#ef4444"
  labelWidth="120px"
  showIcon={true}
/>
```

#### `StatCard`
Centered stat display with large value and small label.
```tsx
<StatCard
  value="5/12"
  label="High Critical + Risk"
  color="#ef4444"
/>
```

#### `AlertCard`
Flexible alert card supporting stats, badges, tags, and action items.
```tsx
<AlertCard
  title="Mental Health"
  icon={HeartPulse}
  iconColor="#ec4899"
  iconBg="pink.50"
  stats={[
    { label: 'High-risk', value: '2', color: '#ef4444' },
    { label: 'Avg duration', value: '4 days', color: '#f97316' }
  ]}
  badge={{ text: 'Action Required', colorScheme: 'red' }}
  sectionTitle="Recommended"
  items={['Schedule 1:1 check-ins', 'Redistribute workload']}
/>
```

#### `ActionItemCard`
Card for displaying action items or recommendations.
```tsx
<ActionItemCard
  title="Survey Sentiment"
  icon={MessageSquare}
  color="#3b82f6"
  bg="blue.50"
  borderColor="blue.100"
  items={[
    'Conduct immediate 1-on-1 meetings',
    'Review and redistribute workload'
  ]}
/>
```

### Tab Content Components

#### `Tab1Content`
Complete "Your Attention" tab with 3-column layout:
- Left: Alert cards (Skill Gap, Mental Health)
- Center: Quick stats (4 stat cards)
- Right: Engagement metrics (Survey Sentiment, Content Consumption)

```tsx
{activeTab === 1 && <Tab1Content />}
```

#### `Tab2Content`
Complete "Recommendations" tab with 2-column layout:
- Left: Action Items (immediate actions)
- Right: Strategic Recommendations (long-term improvements)

```tsx
{activeTab === 2 && <Tab2Content />}
```

## 🎨 Design System

### Colors
- **Red**: `#ef4444` (High priority, critical)
- **Orange**: `#f97316` (Medium priority, warning)
- **Blue**: `#3b82f6` (Information, skill-related)
- **Pink**: `#ec4899` (Mental health, wellness)
- **Purple**: `#8b5cf6` (Career, development)
- **Teal**: `#14b8a6` (Personal, balance)
- **Green**: `#10b981` (Positive, consumption)
- **Indigo**: `#6366f1` (Management, strategy)
- **Amber**: `#f59e0b` (Recommendations, insights)

### Typography
- **Section Titles**: `0.875rem` / `700` weight
- **Card Titles**: `0.8125rem` / `600` weight
- **Body Text**: `0.75rem` / `500` weight
- **Labels**: `0.6875rem` / `500-600` weight
- **Stat Values**: `1.375rem` / `800` weight

### Spacing
- **Card Padding**: `p={4}` or `p={5}`
- **Gap Between Cards**: `gap={3}` or `gap={4}`
- **Inner Spacing**: `mb={2.5}`, `mb={3}`, `mb={4}`

### Borders & Shadows
- **Border**: `1px solid` / `gray.100`
- **Border Radius**: `xl` (cards), `lg` (inner elements)
- **Shadow**: `0 1px 4px rgba(0,0,0,0.04)` (default)
- **Hover Shadow**: `0 2px 8px rgba(0,0,0,0.06)`

## 🔧 Usage in Main Component

```tsx
import { TabNavigation, Tab1Content, Tab2Content } from './attrition';

export const AttritionAnalysis = () => {
  const [activeTab, setActiveTab] = useState(0);
  const tabs = ['Attrition Analysis', 'Your Attention', 'Recommendations'];

  return (
    <Card.Root>
      <Card.Header>
        <TabNavigation 
          tabs={tabs} 
          activeTab={activeTab} 
          onTabChange={setActiveTab} 
        />
      </Card.Header>
      
      <Card.Body>
        {activeTab === 0 && <Tab0Content />}
        {activeTab === 1 && <Tab1Content />}
        {activeTab === 2 && <Tab2Content />}
      </Card.Body>
    </Card.Root>
  );
};
```

## 🚀 Benefits of This Structure

1. **Easy Modification**: Each component is self-contained and can be modified independently
2. **Reusability**: Components like `MetricBar`, `StatCard`, and `AlertCard` can be used anywhere
3. **Testability**: Small, focused components are easier to unit test
4. **Maintainability**: Clear separation of concerns makes debugging easier
5. **Consistency**: Shared components ensure UI consistency across tabs
6. **Scalability**: Easy to add new tabs or modify existing ones

## 📝 Adding New Content

### To add a new tab:
1. Create `Tab3Content.tsx` in this directory
2. Use existing reusable components (`AlertCard`, `MetricBar`, etc.)
3. Export from `index.ts`
4. Import and use in main `AttritionAnalysis.tsx`

### To modify existing tab:
1. Open the respective `Tab*Content.tsx` file
2. Modify the data arrays (stats, items, etc.)
3. Adjust layout if needed
4. Changes are isolated to that tab only

### To create a new reusable component:
1. Create new component file (e.g., `NewCard.tsx`)
2. Follow existing patterns (props interface, styling)
3. Export from `index.ts`
4. Use in tab content files

## 🎯 Best Practices

- **Keep components small**: Each component should do one thing well
- **Use TypeScript interfaces**: Define clear prop types for all components
- **Follow naming conventions**: Use descriptive names (e.g., `AlertCard`, not `Card1`)
- **Maintain consistency**: Use the same spacing, colors, and typography patterns
- **Document changes**: Update this README when adding new components
- **Test thoroughly**: Verify changes don't break other tabs or components

## 📦 Dependencies

- `@chakra-ui/react` - UI components
- `lucide-react` - Icons
- `react` - Core framework

---

**Last Updated**: March 2026  
**Maintainer**: Development Team
