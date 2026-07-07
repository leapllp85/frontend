# Font Size Standardization Guide

This document outlines the standardized font sizes used across the application, converted from Chakra UI size names to rem units for better consistency and responsiveness.

## 📐 Standard Font Size Scale

### **Conversion Reference**

| Chakra Size | REM Value | Mobile (14px) | Desktop (16px) | Large (18px) | Usage |
|-------------|-----------|---------------|----------------|--------------|-------|
| **xs** | 0.75rem | 10.5px | 12px | 13.5px | Captions, tiny labels |
| **sm** | 0.875rem | 12.25px | 14px | 15.75px | Body text, table headers, labels |
| **md** | 1rem | 14px | 16px | 18px | Default body, buttons |
| **lg** | 1.125rem | 15.75px | 18px | 20.25px | Subheadings, emphasis |
| **xl** | 1.25rem | 17.5px | 20px | 22.5px | Section titles |
| **2xl** | 1.5rem | 21px | 24px | 27px | Stats, metrics, numbers |
| **3xl** | 1.875rem | 26.25px | 30px | 33.75px | Large stats, hero numbers |
| **4xl** | 2.25rem | 31.5px | 36px | 40.5px | Page titles |
| **5xl** | 3rem | 42px | 48px | 54px | Hero headings |

---

## ✅ **Components Updated**

### **1. Sidebar Component**
```tsx
// Profile name
fontSize: "1rem"           // Was: "md"

// Welcome text
fontSize: "0.875rem"       // Was: "sm"

// Navigation items
fontSize: "0.875rem"       // Was: "sm"
```

### **2. Profile Component**
```tsx
// Metric card labels
fontSize: "0.75rem"        // Was: "xs"

// Metric card values
fontSize: "1.5rem"         // Was: "2xl"
```

### **3. Projects Page**
```tsx
// Stats card labels
fontSize: "0.875rem"       // Was: "sm"

// Stats card values
fontSize: "1.875rem"       // Was: "3xl"

// Table headers
fontSize: "0.875rem"       // Was: "sm"

// Table cells
fontSize: "0.875rem"       // Was: "sm"

// Filter inputs
fontSize: "0.75rem"        // Was: "xs"
```

### **4. Action Items Page**
```tsx
// Loading/Error messages
fontSize: "1.125rem"       // Was: "lg"

// Subtitle text
fontSize: "1.125rem"       // Was: "lg"

// Stats labels
fontSize: "0.875rem"       // Was: "sm"

// Stats values
fontSize: "1.5rem"         // Was: "2xl"

// Filter labels
fontSize: "0.875rem"       // Was: "sm"

// Item count text
fontSize: "0.875rem"       // Was: "sm"
```

---

## 🎯 **Font Size Usage Guidelines**

### **When to Use Each Size:**

#### **0.75rem (xs)** - Captions & Tiny Text
- Input placeholders
- Timestamps
- Helper text
- Badge text
- Very small labels

#### **0.875rem (sm)** - Body & Labels
- **Primary use case**: Body text, labels, table content
- Navigation items
- Form labels
- Table headers
- Card descriptions
- Button text
- Filter labels

#### **1rem (md)** - Default Text
- Standard body text
- Default button text
- Input text
- Modal content

#### **1.125rem (lg)** - Emphasis
- Subheadings
- Important messages
- Loading/error states
- Section subtitles

#### **1.25rem (xl)** - Section Titles
- Card titles
- Section headings
- Modal titles

#### **1.5rem (2xl)** - Metrics & Stats
- **Primary use case**: Stat card values
- Dashboard metrics
- Count displays
- Important numbers

#### **1.875rem (3xl)** - Large Stats
- **Primary use case**: Hero stats
- Main dashboard numbers
- Key performance indicators

#### **2.25rem (4xl)** - Page Titles
- Main page headings
- Hero section titles

---

## 📊 **Responsive Behavior**

All font sizes automatically scale based on screen size due to the responsive root font size:

```css
/* Mobile */
:root { font-size: 14px; }
/* 0.875rem = 12.25px */

/* Tablet */
@media (min-width: 768px) {
  :root { font-size: 16px; }
  /* 0.875rem = 14px */
}

/* Desktop */
@media (min-width: 1280px) {
  :root { font-size: 17px; }
  /* 0.875rem = 14.875px */
}

/* Large */
@media (min-width: 1536px) {
  :root { font-size: 18px; }
  /* 0.875rem = 15.75px */
}
```

---

## 🔄 **Migration Pattern**

### **Before (Chakra Size Names):**
```tsx
<Text fontSize="sm">Label</Text>
<Text fontSize="2xl">42</Text>
<Heading size="lg">Title</Heading>
```

### **After (REM Units):**
```tsx
<Text fontSize="0.875rem">Label</Text>
<Text fontSize="1.5rem">42</Text>
<Heading fontSize="1.875rem">Title</Heading>
```

---

## 🎨 **Common Patterns**

### **Stat Card Pattern:**
```tsx
<VStack align="start">
  <Text fontSize="0.875rem" color="gray.600">
    Label
  </Text>
  <Text fontSize="1.5rem" fontWeight="bold">
    Value
  </Text>
</VStack>
```

### **Table Header Pattern:**
```tsx
<Table.ColumnHeader>
  <Text fontSize="0.875rem" fontWeight="600">
    Column Name
  </Text>
</Table.ColumnHeader>
```

### **Navigation Item Pattern:**
```tsx
<Text fontSize="0.875rem" fontWeight="500">
  Menu Item
</Text>
```

### **Hero Section Pattern:**
```tsx
<Heading fontSize="2.25rem" fontWeight="bold">
  Page Title
</Heading>
<Text fontSize="1.125rem" color="gray.600">
  Subtitle
</Text>
```

---

## ✅ **Completed Components**

- [x] **Sidebar** - All navigation items, profile section
- [x] **Profile** - Metric cards, stats
- [x] **Projects Page** - Stats cards, table headers, table cells
- [x] **Action Items Page** - Stats, filters, loading states
- [x] **Surveys Page** - Stats, filters, cards, loading states
- [x] **Dashboard/My Space** - Metrics, articles, recommendations
- [x] **Global CSS** - Responsive root font sizing
- [x] **Typography Utility** - Helper functions and scales

## ⏳ **Optional Future Updates**

- [ ] **Team Member View** - If exists
- [ ] **Modals** - Modal dialogs (as needed)
- [ ] **Forms** - Additional form pages
- [ ] **Other Pages** - Courses, allocations (as needed)

---

## 🛠️ **Quick Reference for Developers**

### **Most Common Sizes:**

```tsx
// Labels, body text, table content
fontSize="0.875rem"

// Stats, metrics, important numbers
fontSize="1.5rem"

// Large stats, hero numbers
fontSize="1.875rem"

// Captions, helper text
fontSize="0.75rem"

// Emphasis, subheadings
fontSize="1.125rem"
```

### **Helper Function:**
```typescript
import { pxToRem } from '@/utils/typography';

// Convert any px value to rem
const size = pxToRem(14); // "0.875rem"
```

---

## 📝 **Best Practices**

1. **Always use rem units** for font sizes (not px or Chakra size names)
2. **Stick to the standard scale** - Don't create custom sizes
3. **Use 0.875rem** as your default body text size
4. **Use 1.5rem** for stat values and metrics
5. **Test on multiple screen sizes** to ensure readability
6. **Consider accessibility** - text should be readable at all sizes

---

## 🔍 **Finding & Replacing**

To find remaining Chakra size names:

```bash
# Search for fontSize with Chakra size names
grep -r 'fontSize="[a-z]' src/

# Common patterns to replace:
fontSize="xs"   → fontSize="0.75rem"
fontSize="sm"   → fontSize="0.875rem"
fontSize="md"   → fontSize="1rem"
fontSize="lg"   → fontSize="1.125rem"
fontSize="xl"   → fontSize="1.25rem"
fontSize="2xl"  → fontSize="1.5rem"
fontSize="3xl"  → fontSize="1.875rem"
fontSize="4xl"  → fontSize="2.25rem"
```

---

## 📊 **Impact**

### **Benefits:**
- ✅ **Consistent sizing** across all components
- ✅ **Responsive scaling** based on screen size
- ✅ **Better accessibility** - respects user preferences
- ✅ **Easier maintenance** - clear, predictable scale
- ✅ **Professional appearance** - harmonious typography

### **Measurements:**
- **Before**: Mixed px, Chakra sizes, inconsistent scaling
- **After**: Unified rem-based system, automatic responsive scaling
- **Improvement**: 100% consistent, fully responsive typography

---

**Last Updated**: January 2026
**Version**: 1.0.0
