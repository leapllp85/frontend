# Wellness Dashboard Desktop Shortcut Setup

## Overview
This guide explains how to create a desktop shortcut that opens the Team Wellness Dashboard in a standalone window (without browser UI) with integrated chat functionality.

## Features
- **Standalone Window**: Opens in Microsoft Edge app mode without address bar, tabs, or bookmarks
- **Optimized Size**: Window opens at 1400x900 pixels
- **Chat Integration**: Click the chat icon to open AI chat assistant within the same window
- **Seamless Experience**: No gaps or padding, full-window display

## Setup Instructions

### Step 1: Create Desktop Shortcut
1. Open Command Prompt or PowerShell
2. Navigate to the frontend directory:
   ```
   cd d:\mywork\ews\frontend
   ```
3. Run the shortcut creation script:
   ```
   create-shortcut.bat
   ```
4. Press any key when prompted to close the script

### Step 2: Verify Shortcut
- Check your desktop for "Team Wellness Dashboard" shortcut
- The shortcut should have the Microsoft Edge icon

### Step 3: Launch Dashboard
1. Double-click the "Team Wellness Dashboard" shortcut on your desktop
2. The wellness dashboard will open in a standalone window
3. Click the chat icon (💬) in the top-right corner to open the AI chat assistant
4. Click the chat icon again to return to the dashboard view

## How It Works

### Desktop Shortcut
The `create-shortcut.bat` script creates a Windows shortcut (.lnk file) that:
- Targets: `msedge.exe` (Microsoft Edge)
- Arguments: `--app=http://localhost:3000/wellness-dashboard --window-size=1400,900`
- Opens the dashboard in app mode without browser chrome

### Standalone Mode
The wellness dashboard page (`/wellness-dashboard`) is configured with:
- `standalone={true}` prop passed to `ManagerWellnessDashboard` component
- Removes backdrop overlay and modal styling
- Fills entire window without gaps or padding
- Optimized for app-like experience

### Chat Integration
- Chat icon in top-right corner toggles chat interface
- Chat loads in an iframe from `/chat?embed=true`
- Embedded mode removes header and adjusts styling for seamless integration
- Absolute positioning ensures chat fills entire window

## Troubleshooting

### Shortcut doesn't work
- Ensure Microsoft Edge is installed
- Verify the development server is running on `http://localhost:3000`
- Check that the path in the shortcut is correct

### Chat not loading
- Verify the chat page exists at `/chat`
- Check browser console for errors
- Ensure embedded mode is properly detected

### Gaps or padding visible
- Verify `standalone={true}` is set in wellness-dashboard page
- Check that `showChat` state is properly toggling
- Ensure iframe has `embed=true` query parameter

## Technical Details

### Files Modified
1. `create-shortcut.bat` - Creates desktop shortcut with Edge app mode
2. `src/app/wellness-dashboard/page.tsx` - Standalone dashboard page
3. `src/components/common/ManagerWellnessDashboard.tsx` - Dashboard component with chat integration
4. `src/app/chat/page.tsx` - Chat page with embedded mode support
5. `src/app/chat/layout.tsx` - Custom layout for chat to remove constraints

### Key Props and States
- `standalone` prop: Controls whether dashboard renders in standalone or modal mode
- `showChat` state: Toggles between dashboard and chat views
- `isEmbedded` state: Detects when chat is loaded in iframe for styling adjustments
