# Constants Centralization Guide

## 📋 Overview

All application constants have been centralized into a single, well-organized constants file for better maintainability and consistency.

---

## 📁 File Location

**Main Constants File:** `/src/constants/index.ts`

---

## 🎯 What's Included

### **1. Mock Data Constants**
- `MOCK_AT_RISK_PROJECTS` - Sample project risk data for Profile component
- `DASHBOARD_METRICS` - Dashboard performance metrics
- `TECHNICAL_RECOMMENDATIONS` - Skills and training recommendations
- `LEADERSHIP_ARTICLES` - Leadership development content

### **2. Status & Priority Constants**
- `ACTION_ITEM_STATUSES` - Action item workflow states
- `ACTION_ITEM_PRIORITIES` - Priority levels
- `PROJECT_STATUSES` - Project lifecycle states
- `SURVEY_STATUSES` - Survey states
- `RISK_LEVELS` - Risk assessment levels
- `ATTRITION_RISK_LEVELS` - Employee attrition risk levels

### **3. Color Schemes**
- `STATUS_COLORS` - Status-to-color mappings
- `PRIORITY_COLORS` - Priority-to-color mappings
- `RISK_COLORS` - Risk level colors
- `ATTRITION_COLORS` - Attrition risk colors
- `METRIC_CARD_GRADIENTS` - Gradient configurations for metric cards

### **4. Configuration Constants**
- `PAGINATION_DEFAULTS` - Pagination settings
- `TABLE_LIMITS` - Table row limits
- `DATE_FORMATS` - Date/time format strings
- `VALIDATION_RULES` - Form validation rules
- `BREAKPOINTS` - Responsive breakpoints
- `Z_INDEX` - Z-index layering system
- `ANIMATION_DURATIONS` - Animation timing

### **5. API Endpoints Reference**
- `API_ENDPOINTS` - Complete API endpoint mapping

### **6. Type Definitions**
- `SURVEY_TYPES` - Survey type constants
- `QUESTION_TYPES` - Question type constants
- `NOTIFICATION_TYPES` - Notification type constants

---

## 🔧 Usage Examples

### **Importing Constants**

```typescript
// Import specific constants
import { 
  MOCK_AT_RISK_PROJECTS, 
  DASHBOARD_METRICS,
  STATUS_COLORS,
  RISK_LEVELS
} from '@/constants';

// Or import everything
import * as CONSTANTS from '@/constants';
```

### **Using Mock Data**

```typescript
// In Profile component
import { MOCK_AT_RISK_PROJECTS } from '@/constants';

<CriticalMembersDialog
  projects={MOCK_AT_RISK_PROJECTS}
/>
```

### **Using Dashboard Metrics**

```typescript
// In My Space page
import { DASHBOARD_METRICS, TECHNICAL_RECOMMENDATIONS } from '@/constants';

export default function MySpace() {
  const metrics = DASHBOARD_METRICS;
  const recommendations = TECHNICAL_RECOMMENDATIONS;
  
  return (
    // ... render metrics
  );
}
```

### **Using Status Colors**

```typescript
import { STATUS_COLORS, PRIORITY_COLORS } from '@/constants';

<Badge colorScheme={STATUS_COLORS[status]}>
  {status}
</Badge>

<Badge colorScheme={PRIORITY_COLORS[priority]}>
  {priority}
</Badge>
```

### **Using Validation Rules**

```typescript
import { VALIDATION_RULES } from '@/constants';

const passwordSchema = z.string()
  .min(VALIDATION_RULES.MIN_PASSWORD_LENGTH)
  .max(VALIDATION_RULES.MAX_PASSWORD_LENGTH);
```

### **Using Date Formats**

```typescript
import { DATE_FORMATS } from '@/constants';
import { format } from 'date-fns';

const formattedDate = format(new Date(), DATE_FORMATS.DISPLAY);
```

---

## 📊 Updated Components

### **Profile Component** (`/src/components/common/Profile.tsx`)
- ✅ Now imports `MOCK_AT_RISK_PROJECTS`
- ✅ Removed inline mock data (40+ lines)
- ✅ Cleaner, more maintainable code

### **My Space Page** (`/src/app/my-space/page.tsx`)
- ✅ Now imports `DASHBOARD_METRICS`
- ✅ Now imports `TECHNICAL_RECOMMENDATIONS`
- ✅ Now imports `LEADERSHIP_ARTICLES`
- ✅ Removed 100+ lines of inline data

---

## 🎨 Gradient Configurations

The `METRIC_CARD_GRADIENTS` object provides pre-configured gradient schemes:

```typescript
import { METRIC_CARD_GRADIENTS } from '@/constants';

const tealGradient = METRIC_CARD_GRADIENTS.teal;
// {
//   from: '#ccfbf1',
//   to: '#f0fdfa',
//   iconColor: '#14b8a6',
//   iconBg: 'teal.100',
//   valueColor: 'gray.800',
//   shadow: 'rgba(20, 184, 166, 0.15)'
// }
```

Available gradients: `teal`, `indigo`, `amber`, `rose`, `blue`, `green`

---

## 🔒 Type Safety

All constants are exported with TypeScript types:

```typescript
import type { 
  ActionItemStatus,
  ActionItemPriority,
  ProjectStatus,
  SurveyStatus,
  RiskLevel,
  AttritionRiskLevel
} from '@/constants';

const status: ActionItemStatus = 'in_progress'; // Type-safe!
const risk: RiskLevel = 'High Risk'; // Type-safe!
```

---

## ✅ Benefits

### **1. Single Source of Truth**
- All constants in one place
- No duplication across files
- Easy to update globally

### **2. Better Maintainability**
- Clear organization by category
- Easy to find and modify
- Documented with comments

### **3. Type Safety**
- Full TypeScript support
- Exported types for all constants
- Compile-time validation

### **4. Consistency**
- Same values used everywhere
- No typos or variations
- Standardized naming

### **5. Reduced Code**
- Removed 150+ lines from components
- Cleaner component files
- Focus on logic, not data

---

## 📝 Adding New Constants

### **Step 1: Add to Constants File**

```typescript
// In /src/constants/index.ts

export const MY_NEW_CONSTANT = {
  VALUE_1: 'value1',
  VALUE_2: 'value2'
} as const;

export type MyNewType = typeof MY_NEW_CONSTANT[keyof typeof MY_NEW_CONSTANT];
```

### **Step 2: Import in Component**

```typescript
import { MY_NEW_CONSTANT } from '@/constants';

// Use it
const value = MY_NEW_CONSTANT.VALUE_1;
```

---

## 🔄 Migration Checklist

When moving constants from components to the centralized file:

- [ ] Identify all hardcoded constants in component
- [ ] Add constants to appropriate section in `/src/constants/index.ts`
- [ ] Use `as const` for immutability
- [ ] Export TypeScript types if needed
- [ ] Update component to import from constants
- [ ] Remove inline constant definitions
- [ ] Test that component still works
- [ ] Update documentation

---

## 🎯 Best Practices

### **DO:**
- ✅ Use `as const` for immutable constants
- ✅ Group related constants together
- ✅ Export TypeScript types
- ✅ Use UPPER_SNAKE_CASE for constant names
- ✅ Add comments for complex constants
- ✅ Keep constants organized by category

### **DON'T:**
- ❌ Mix constants with business logic
- ❌ Use mutable objects (use `as const`)
- ❌ Duplicate constants across files
- ❌ Use magic strings/numbers in components
- ❌ Forget to export types

---

## 📚 Related Files

- **Constants:** `/src/constants/index.ts`
- **Profile Component:** `/src/components/common/Profile.tsx`
- **My Space Page:** `/src/app/my-space/page.tsx`
- **Metric Card:** `/src/components/profile/MetricCard.tsx`
- **Profile Metrics Grid:** `/src/components/profile/ProfileMetricsGrid.tsx`

---

## 🚀 Future Enhancements

### **Potential Improvements:**

1. **Environment-Specific Constants**
   - Separate dev/staging/prod constants
   - Use environment variables

2. **Localization**
   - Extract strings for i18n
   - Multi-language support

3. **Feature Flags**
   - Add feature toggle constants
   - A/B testing configurations

4. **Theme Constants**
   - Centralize theme values
   - Dark mode support

5. **API Configuration**
   - Move API URLs to constants
   - Timeout configurations

---

## 📊 Impact Summary

### **Code Reduction:**
- **Profile Component:** -40 lines
- **My Space Page:** -100 lines
- **Total Reduction:** ~140 lines of duplicated code

### **Files Modified:**
- ✅ Created `/src/constants/index.ts` (500+ lines)
- ✅ Updated `/src/components/common/Profile.tsx`
- ✅ Updated `/src/app/my-space/page.tsx`

### **Benefits Achieved:**
- ✅ Single source of truth for all constants
- ✅ Better type safety with exported types
- ✅ Easier maintenance and updates
- ✅ Consistent values across application
- ✅ Cleaner component code

---

**Last Updated:** January 10, 2026
**Version:** 1.0.0
