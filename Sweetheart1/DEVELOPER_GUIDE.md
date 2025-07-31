# Developer Guide - Love Message App

## 📊 Database & Data Storage

### What does the database do?
Currently, this app uses **localStorage** (browser storage) instead of a traditional database. This means:
- All data is stored locally in the user's browser
- Data persists between browser sessions
- Data is specific to each device/browser
- No server-side database is needed

### Future Database Options
If you want to upgrade to a real database later:
- **PostgreSQL** (already configured with Drizzle ORM)
- **Neon Database** (serverless PostgreSQL)
- **SQLite** for simpler local storage

## 🔧 How to Access User Data as a Developer

### Method 1: Built-in Developer Console
The app now includes a developer console in the bottom-right corner:
1. Look for the "👨‍💻 Dev Console" button
2. Click it to see real-time data
3. View complaints, hug counts, tasks, and more
4. Auto-refreshes every 5 seconds

### Method 2: Browser Developer Tools
1. Open the app in your browser
2. Press `F12` or right-click → "Inspect"
3. Go to the "Console" tab
4. Type these commands:

```javascript
// Get all complaints
JSON.parse(localStorage.getItem('loveApp_complaints') || '[]')

// Get hug counts by date
JSON.parse(localStorage.getItem('loveApp_hugCounter') || '{}')

// Get daily tasks by date
JSON.parse(localStorage.getItem('loveApp_dailyTasks') || '{}')

// Get usage analytics (NEW)
JSON.parse(localStorage.getItem('loveApp_usageAnalytics') || '{}')

// Get National Girlfriend Day data (NEW)
JSON.parse(localStorage.getItem('loveApp_nationalGirlfriendDay') || '{}')

// Get reminders
JSON.parse(localStorage.getItem('loveApp_reminders') || '[]')

// Get dark mode setting
JSON.parse(localStorage.getItem('loveApp_darkMode') || 'false')

// Quick overview of all activity
Object.keys(localStorage).filter(key => key.startsWith('loveApp_')).forEach(key => {
  console.log(key, JSON.parse(localStorage.getItem(key)));
});

// Clear all data (be careful!)
localStorage.clear()
```

### Method 3: External HTML File
Open the `developer-data-access.html` file in your browser for a dedicated dashboard.

## 📱 Data Structure

### Complaints
```javascript
[
  {
    "text": "The app is too cute!",
    "timestamp": "2025-01-27T10:30:00.000Z",
    "date": "1/27/2025"
  }
]
```

### Hug Counter
```javascript
{
  "Mon Jan 27 2025": 15,
  "Tue Jan 28 2025": 8
}
```

### Daily Tasks
```javascript
{
  "Mon Jan 27 2025": [
    {
      "text": "Drink 8 glasses of water 💧",
      "completed": true
    },
    {
      "text": "Send me a cute selfie 📸",
      "completed": false
    }
  ]
}
```

## 🎨 Theme & Styling

### Background Colors
- **Light Mode**: Gentle pink (`hsl(338, 100%, 95%)`)
- **Dark Mode**: Dark romantic pink (`hsl(340, 30%, 15%)`)

### Key Features
- Segoe UI font throughout the app
- Smooth animations between sections
- Responsive design for mobile and desktop
- Next love message countdown timer
- Special day detection (August 1st)

## 🚀 Daily Content Generation

### Love Messages
- Uses day of year to generate consistent daily messages
- 15 unique messages that rotate throughout the year
- Same message appears for the same date every year

### Reminders
- Similar rotation system for daily reminders
- 15 unique reminders focused on self-care and positivity

### Tasks
- Random selection of 5 tasks from 8 possible tasks each day
- Tasks reset daily and save completion status
- Progress tracking with percentage completion

## 🔄 LocalStorage Keys
- `loveApp_complaints`: All submitted complaints
- `loveApp_hugCounter`: Daily hug counts
- `loveApp_dailyTasks`: Tasks by date
- `loveApp_darkMode`: Theme preference

## 💡 Tips for Monitoring
1. The developer console shows real-time stats
2. Export data to see detailed JSON structure
3. Use browser bookmarks for quick localStorage access
4. Monitor daily engagement through task completion rates
5. Track emotional feedback through complaint frequency

This system gives you complete visibility into how the app is being used while maintaining privacy and simplicity.