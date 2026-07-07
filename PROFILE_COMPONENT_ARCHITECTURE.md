# Profile Component Architecture

## 📁 Modular Structure

The Profile component has been refactored into a clean, modular architecture for better maintainability and reusability.

---

## 🏗️ Component Hierarchy

```
Profile (Main Container)
├── ProfileMetricsGrid
│   └── MetricCard (×4)
├── AttritionAnalysis
├── ProfileBottomSection
│   ├── CriticalTeamMembers
│   ├── ProjectRisks
│   └── Mapping Button
└── CriticalMembersDialog
```

---

## 📦 Component Breakdown

### **1. Main Profile Component**
**Location:** `/src/components/common/Profile.tsx`

**Responsibilities:**
- Data fetching and state management
- Orchestrating child components
- Error and loading states
- API integration

**Key Features:**
- Fetches data from multiple APIs in parallel
- Manages modal state
- Provides data to all child components

---

### **2. MetricCard Component**
**Location:** `/src/components/profile/MetricCard.tsx`

**Purpose:** Reusable card for displaying single metrics

**Props:**
```typescript
interface MetricCardProps {
  label: string;              // Card title
  value: string | number;     // Metric value
  icon: LucideIcon;          // Icon component
  iconColor: string;         // Icon color
  iconBgColor: string;       // Icon background
  gradientFrom: string;      // Gradient start
  gradientTo: string;        // Gradient end
  valueColor: string;        // Value text color
  shadowColor: string;       // Shadow color
}
```

**Features:**
- Gradient backgrounds
- Hover animations
- Consistent styling
- Fully customizable colors

---

### **3. ProfileMetricsGrid Component**
**Location:** `/src/components/profile/ProfileMetricsGrid.tsx`

**Purpose:** Grid layout for all metric cards

**Props:**
```typescript
interface ProfileMetricsGridProps {
  teamStats: TeamStats | null;
  projectStats: ProjectStats | null;
  projectRisks: ProjectRisksResponse | null;
  metrics: ProjectMetrics | null;
}
```

**Displays:**
- Team Members count
- Total Projects count
- Attrition Risk percentage
- Projects at Risk count

**Responsive:**
- 1 column on mobile
- 2 columns on tablet
- 4 columns on desktop

---

### **4. ProfileBottomSection Component**
**Location:** `/src/components/profile/ProfileBottomSection.tsx`

**Purpose:** Container for Critical Members and Project Risks panels

**Props:**
```typescript
interface ProfileBottomSectionProps {
  userId: string | undefined;
  projectRisks: ProjectRisksResponse | null;
  onMappingClick: () => void;
}
```

**Features:**
- Side-by-side layout
- Centered mapping button
- Hover effects on button
- Responsive spacing

---

### **5. CriticalMembersDialog Component**
**Location:** `/src/components/profile/CriticalMembersDialog.tsx`

**Purpose:** Modal dialog showing project-member mappings

**Props:**
```typescript
interface CriticalMembersDialogProps {
  isOpen: boolean;
  onClose: () => void;
  projects: AtRiskProject[];
}

interface AtRiskProject {
  projectName: string;
  riskLevel: string;
  progress: number;
  dueDate: string;
  criticalMembers: CriticalMember[];
}
```

**Features:**
- Complex table with rowspan
- Color-coded risk levels
- Gradient header
- Responsive design
- Proper TypeScript types

---

## 🎨 Design Patterns Used

### **1. Component Composition**
- Small, focused components
- Clear single responsibilities
- Easy to test and maintain

### **2. Props Drilling Prevention**
- Data passed only where needed
- No unnecessary prop chains
- Clean interfaces

### **3. Configuration-Driven**
- Metric cards configured via array
- Easy to add/remove metrics
- Centralized styling

### **4. Separation of Concerns**
- Data fetching in main component
- Presentation in child components
- Business logic isolated

---

## 🔧 Usage Examples

### **Adding a New Metric Card**

Edit `/src/components/profile/ProfileMetricsGrid.tsx`:

```typescript
const metricsConfig = [
  // ... existing metrics
  {
    label: 'New Metric',
    value: data?.new_metric || 0,
    icon: YourIcon,
    iconColor: '#your-color',
    iconBgColor: 'your.100',
    gradientFrom: '#gradient-start',
    gradientTo: '#gradient-end',
    valueColor: 'your.600',
    shadowColor: 'rgba(r, g, b, 0.15)',
  },
];
```

### **Customizing Metric Card Appearance**

```typescript
<MetricCard
  label="Custom Label"
  value={42}
  icon={Star}
  iconColor="#FFD700"
  iconBgColor="yellow.100"
  gradientFrom="#FFF9C4"
  gradientTo="#FFF59D"
  valueColor="yellow.800"
  shadowColor="rgba(255, 215, 0, 0.15)"
/>
```

### **Using ProfileBottomSection**

```typescript
<ProfileBottomSection
  userId={currentUser?.id}
  projectRisks={risksData}
  onMappingClick={() => setDialogOpen(true)}
/>
```

---

## 📊 Data Flow

```
API Services
    ↓
Profile Component (State Management)
    ↓
    ├→ ProfileMetricsGrid → MetricCard (×4)
    ├→ AttritionAnalysis
    ├→ ProfileBottomSection
    │   ├→ CriticalTeamMembers
    │   └→ ProjectRisks
    └→ CriticalMembersDialog
```

---

## ✅ Benefits of Modular Architecture

### **1. Maintainability**
- Easy to locate and fix bugs
- Clear component boundaries
- Self-documenting code

### **2. Reusability**
- MetricCard can be used anywhere
- Components are self-contained
- No tight coupling

### **3. Testability**
- Each component can be tested independently
- Clear input/output contracts
- Easy to mock dependencies

### **4. Scalability**
- Easy to add new features
- Simple to modify existing ones
- No ripple effects

### **5. Developer Experience**
- Clear file structure
- Intuitive naming
- TypeScript support
- Easy onboarding

---

## 🚀 Future Enhancements

### **Potential Improvements:**

1. **Extract API Logic**
   - Create custom hooks (useProfileData)
   - Separate data fetching from UI

2. **Add Loading States**
   - Skeleton screens for each section
   - Progressive loading

3. **Error Boundaries**
   - Graceful error handling per section
   - Fallback UI components

4. **Performance Optimization**
   - Memoization of expensive calculations
   - Lazy loading of heavy components

5. **Accessibility**
   - ARIA labels
   - Keyboard navigation
   - Screen reader support

---

## 📝 File Structure

```
src/
├── components/
│   ├── common/
│   │   └── Profile.tsx                    # Main container
│   └── profile/
│       ├── MetricCard.tsx                 # Reusable metric card
│       ├── ProfileMetricsGrid.tsx         # Metrics grid layout
│       ├── ProfileBottomSection.tsx       # Bottom panel container
│       ├── CriticalMembersDialog.tsx      # Modal dialog
│       ├── AttritionAnalysis.tsx          # Existing component
│       ├── ProjectRisks.tsx               # Existing component
│       └── criticality/
│           └── CriticalTeamMembers.tsx    # Existing component
```

---

## 🎯 Key Takeaways

1. **Modular = Maintainable**: Each component has a single, clear purpose
2. **Reusable = Efficient**: MetricCard can be used across the app
3. **Typed = Safe**: Full TypeScript support prevents errors
4. **Configured = Flexible**: Easy to customize without code changes
5. **Composed = Powerful**: Complex UI from simple building blocks

---

## 📚 Related Documentation

- [Typography System](./TYPOGRAPHY_SYSTEM.md)
- [Font Size Standardization](./FONT_SIZE_STANDARDIZATION.md)
- [Performance Optimizations](./PERFORMANCE_OPTIMIZATIONS.md)

---

**Last Updated:** January 10, 2026
**Version:** 2.0.0
