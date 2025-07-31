import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";

interface Complaint {
  text: string;
  timestamp: string;
  date: string;
}

interface Task {
  text: string;
  completed: boolean;
}

interface DeveloperData {
  complaints: Complaint[];
  hugCounter: Record<string, number>;
  dailyTasks: Record<string, Task[]>;
  darkMode: boolean;
}

export default function DeveloperConsole() {
  const [data, setData] = useState<DeveloperData>({
    complaints: [],
    hugCounter: {},
    dailyTasks: {},
    darkMode: false
  });
  const [isVisible, setIsVisible] = useState(false);

  const loadData = () => {
    const complaints = JSON.parse(localStorage.getItem('loveApp_complaints') || '[]');
    const hugCounter = JSON.parse(localStorage.getItem('loveApp_hugCounter') || '{}');
    const dailyTasks = JSON.parse(localStorage.getItem('loveApp_dailyTasks') || '{}');
    const darkMode = JSON.parse(localStorage.getItem('loveApp_darkMode') || 'false');

    setData({ complaints, hugCounter, dailyTasks, darkMode });
  };

  useEffect(() => {
    loadData();
    const interval = setInterval(loadData, 5000); // Auto refresh every 5 seconds
    return () => clearInterval(interval);
  }, []);

  const getTotalStats = () => {
    const totalComplaints = data.complaints.length;
    const totalHugs = Object.values(data.hugCounter).reduce((sum, count) => sum + count, 0);
    
    let totalTasksCompleted = 0;
    let totalTasks = 0;
    Object.values(data.dailyTasks).forEach(tasks => {
      totalTasks += tasks.length;
      totalTasksCompleted += tasks.filter(task => task.completed).length;
    });

    return { totalComplaints, totalHugs, totalTasksCompleted, totalTasks };
  };

  const clearData = (key: string) => {
    if (confirm(`Clear ${key}? This cannot be undone.`)) {
      localStorage.removeItem(key);
      loadData();
    }
  };

  if (!isVisible) {
    return (
      <div className="fixed bottom-4 right-4 z-50">
        <Button 
          onClick={() => setIsVisible(true)}
          className="bg-purple-600 hover:bg-purple-700 text-white text-xs px-3 py-2"
        >
          👨‍💻 Dev Console
        </Button>
      </div>
    );
  }

  const stats = getTotalStats();

  return (
    <div className="fixed bottom-4 right-4 w-96 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg shadow-lg z-50 max-h-96 overflow-hidden">
      <div className="bg-purple-600 text-white p-2 flex justify-between items-center">
        <span className="text-sm font-bold">👨‍💻 Developer Console</span>
        <Button 
          onClick={() => setIsVisible(false)}
          className="bg-transparent hover:bg-purple-700 text-white text-xs px-2 py-1"
        >
          ✕
        </Button>
      </div>
      
      <div className="p-3 overflow-y-auto max-h-80">
        {/* Stats Summary */}
        <div className="mb-4 p-2 bg-purple-50 dark:bg-purple-900 rounded">
          <h3 className="text-sm font-bold mb-2">📊 Quick Stats</h3>
          <div className="text-xs space-y-1">
            <div>💬 Complaints: {stats.totalComplaints}</div>
            <div>🤗 Total Hugs: {stats.totalHugs}</div>
            <div>✅ Tasks: {stats.totalTasksCompleted}/{stats.totalTasks}</div>
            <div>🌙 Dark Mode: {data.darkMode ? 'ON' : 'OFF'}</div>
          </div>
        </div>

        {/* Recent Complaints */}
        <div className="mb-4">
          <div className="flex justify-between items-center mb-2">
            <h3 className="text-sm font-bold">💬 Recent Complaints</h3>
            <Button 
              onClick={() => clearData('loveApp_complaints')}
              className="bg-red-500 hover:bg-red-600 text-white text-xs px-2 py-1"
            >
              Clear
            </Button>
          </div>
          <div className="max-h-32 overflow-y-auto">
            {data.complaints.slice(-3).map((complaint, index) => (
              <div key={index} className="text-xs p-2 mb-1 bg-gray-100 dark:bg-gray-700 rounded">
                <div className="font-medium">{complaint.date}</div>
                <div className="text-gray-600 dark:text-gray-300 truncate">{complaint.text}</div>
              </div>
            ))}
            {data.complaints.length === 0 && (
              <div className="text-xs text-gray-500 italic">No complaints yet</div>
            )}
          </div>
        </div>

        {/* Today's Data */}
        <div className="mb-4">
          <h3 className="text-sm font-bold mb-2">📅 Today's Activity</h3>
          {(() => {
            const today = new Date().toDateString();
            const todayHugs = data.hugCounter[today] || 0;
            const todayTasks = data.dailyTasks[today] || [];
            const completedToday = todayTasks.filter(task => task.completed).length;
            
            return (
              <div className="text-xs space-y-1">
                <div>🤗 Hugs today: {todayHugs}</div>
                <div>✅ Tasks completed: {completedToday}/{todayTasks.length}</div>
                {todayTasks.length > 0 && (
                  <div className="mt-2">
                    <div className="font-medium mb-1">Today's Tasks:</div>
                    {todayTasks.map((task, index) => (
                      <div key={index} className="text-xs flex items-center">
                        <span className="mr-1">{task.completed ? '✅' : '⏳'}</span>
                        <span className={task.completed ? 'line-through opacity-60' : ''}>
                          {task.text}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            );
          })()}
        </div>

        {/* Actions */}
        <div className="border-t pt-2">
          <Button 
            onClick={loadData}
            className="bg-green-500 hover:bg-green-600 text-white text-xs px-2 py-1 mr-2"
          >
            🔄 Refresh
          </Button>
          <Button 
            onClick={() => {
              const dataStr = JSON.stringify({
                complaints: data.complaints,
                hugCounter: data.hugCounter,
                dailyTasks: data.dailyTasks
              }, null, 2);
              console.log('Love App Data:', dataStr);
              alert('Data logged to browser console');
            }}
            className="bg-blue-500 hover:bg-blue-600 text-white text-xs px-2 py-1"
          >
            📋 Export
          </Button>
        </div>
      </div>
    </div>
  );
}