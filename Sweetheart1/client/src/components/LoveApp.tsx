import { useState, useEffect, useCallback } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useLocalStorage } from "../hooks/useLocalStorage";
import { generateDailyLoveMessage, generateDailyReminder } from "../lib/loveMessages";
import { formatTimeUntilMidnight, isAugust1st, getTodayString, isTestAugust1st } from "../lib/dateUtils";


type Section = 'home' | 'complaint' | 'tasks' | 'hugs' | 'reminders' | 'specialday';

interface Task {
  text: string;
  completed: boolean;
}

interface Complaint {
  text: string;
  timestamp: string;
  date: string;
}

const dailyTasks = [
  { text: "Drink 8 glasses of water 💧", completed: false },
  { text: "Eat something delicious 🍽️", completed: false },
  { text: "Take 3 deep breaths 🫁", completed: false },
  { text: "Send me a cute selfie 📸", completed: false },
  { text: "Tell me about your day 💬", completed: false },
  { text: "Do something that makes you smile 😊", completed: false },
  { text: "Give yourself a compliment 💕", completed: false },
  { text: "Listen to your favorite song 🎵", completed: false },
  { text: "Stretch for 5 minutes 🧘‍♀️", completed: false },
  { text: "Write down one thing you're grateful for ✨", completed: false },
  { text: "Take a 10-minute walk 🚶‍♀️", completed: false },
  { text: "Send a sweet message to someone you love 💌", completed: false },
  { text: "Organize one small thing 🧺", completed: false },
  { text: "Put your phone away for 30 mins 📵", completed: false },
  { text: "Look at the sky for 1 minute ☁️", completed: false },
  { text: "Smile at yourself in the mirror 🪞", completed: false },
  { text: "Draw a doodle 🎨", completed: false },
  { text: "Eat a fruit 🍎", completed: false },
  { text: "Hug your pillow tight 🤗", completed: false },
  { text: "Play your favorite game 🎮", completed: false },
  { text: "Look at old happy photos 🖼️", completed: false },
  { text: "Say 'I love myself' out loud 💗", completed: false },
  { text: "Play with your hair or style it 💇‍♀️", completed: false },
  { text: "Make your bed nicely 🛏️", completed: false },
  { text: "Do 10 jumping jacks 🤸‍♀️", completed: false },
  { text: "Wash your face with love 🧼", completed: false },
  { text: "Light a candle or smell something nice 🕯️", completed: false },
  { text: "Read 1 page of a book 📖", completed: false },
  { text: "Write me a cute thought 📝", completed: false },
  { text: "Set one small goal for tomorrow 🎯", completed: false }
];

export default function LoveApp() {
  const [location, navigate] = useLocation();
  const [currentSection, setCurrentSection] = useState<Section>('home');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useLocalStorage('loveApp_darkMode', false);
  const [complaintText, setComplaintText] = useState('');
  const [complaints, setComplaints] = useLocalStorage<Complaint[]>('loveApp_complaints', []);
  const [hugCounter, setHugCounter] = useLocalStorage<Record<string, number>>('loveApp_hugCounter', {});
  const [dailyTasksData, setDailyTasksData] = useLocalStorage<Record<string, Task[]>>('loveApp_dailyTasks', {});
  const [nextMessageTimer, setNextMessageTimer] = useState('');
  const [hugAnimation, setHugAnimation] = useState<{ show: boolean; emoji: string; id: number; hearts: boolean }>({ show: false, emoji: '', id: 0, hearts: false });
  
  // Store special day data for developer access and monitoring
  const [specialDayData, setSpecialDayData] = useLocalStorage('loveApp_nationalGirlfriendDay', {
    lastCelebrated: '',
    totalCelebrations: 0,
    specialMessages: [
      "You are the sunshine in my darkest days, the reason behind my brightest smiles, and the love that makes my heart skip a beat.",
      "Today and every day, I celebrate YOU - my beautiful, amazing, perfect girlfriend!",
      "You've turned my world into a fairy tale, and I'm grateful for every moment we share together.",
      "Your laugh is my favorite sound in the whole world",
      "Your smile lights up my entire universe",
      "Your love makes me a better person every day",
      "You make every day feel like an adventure"
    ],
    specialPromises: [
      "Extra hugs and cuddles all day",
      "Your favorite treat just because", 
      "Surprise gifts throughout the day",
      "A romantic evening under the stars"
    ],
    createdAt: new Date().toISOString(),
    isActive: isAugust1st(),
    pageViews: 0,
    lastAccessed: ''
  });
  
  const [reminders, setReminders] = useLocalStorage<string[]>('loveApp_reminders', []);
  
  // Comprehensive usage analytics for developer monitoring
  const [usageAnalytics, setUsageAnalytics] = useLocalStorage('loveApp_usageAnalytics', {
    totalSessions: 0,
    lastSessionDate: '',
    sectionVisits: {
      home: 0,
      complaint: 0,
      tasks: 0,
      hugs: 0,
      reminders: 0,
      specialday: 0
    },
    interactionCounts: {
      hugsSent: 0,
      complaintsSubmitted: 0,
      tasksCompleted: 0,
      remindersViewed: 0,
      darkModeToggles: 0
    },
    dailyStats: {},
    createdAt: new Date().toISOString()
  });

  const today = getTodayString();
  const todayHugs = hugCounter[today] || 0;
  const todayTasks = dailyTasksData[today] || [];

  // Initialize daily tasks if not present
  useEffect(() => {
    if (!dailyTasksData[today]) {
      const shuffled = [...dailyTasks].sort(() => 0.5 - Math.random());
      const selectedTasks = shuffled.slice(0, 5);
      setDailyTasksData((prev: Record<string, Task[]>) => ({ ...prev, [today]: selectedTasks }));
    }
  }, [today, dailyTasksData, setDailyTasksData]);

  // Handle navigation from URL
  useEffect(() => {
    const section = location.slice(1) as Section;
    if (['home', 'complaint', 'tasks', 'hugs', 'reminders', 'specialday'].includes(section)) {
      setCurrentSection(section);
    } else {
      setCurrentSection('home');
    }
  }, [location]);

  // Timer for next message
  useEffect(() => {
    const updateTimer = () => {
      setNextMessageTimer(formatTimeUntilMidnight());
    };
    
    updateTimer();
    const interval = setInterval(updateTimer, 1000);
    return () => clearInterval(interval);
  }, []);

  // Dark mode effect
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

   useEffect(() => {
          setSpecialDayData(prev => ({
            ...prev,
            pageViews: prev.pageViews + 1,
            lastAccessed: new Date().toISOString(),
            lastCelebrated: today,
            totalCelebrations: isAugust1st() ? prev.totalCelebrations + 1 : prev.totalCelebrations
          }));
        }, []);

  const navigateToSection = useCallback((section: Section) => {
    setCurrentSection(section);
    navigate(`/${section}`);
    setSidebarOpen(false);
    
    // Track section visits for analytics
    setUsageAnalytics(prev => ({
      ...prev,
      sectionVisits: {
        ...prev.sectionVisits,
        [section]: prev.sectionVisits[section] + 1
      }
    }));
  }, [navigate, setUsageAnalytics]);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
  };

  const submitComplaint = () => {
    if (complaintText.trim()) {
      const newComplaint: Complaint = {
        text: complaintText.trim(),
        timestamp: new Date().toISOString(),
        date: new Date().toLocaleDateString()
      };
      setComplaints((prev: Complaint[]) => [...prev, newComplaint]);
      setComplaintText('');
      
      // Track complaint submissions
      setUsageAnalytics(prev => ({
        ...prev,
        interactionCounts: {
          ...prev.interactionCounts,
          complaintsSubmitted: prev.interactionCounts.complaintsSubmitted + 1
        }
      }));
    }
  };

  const toggleTask = (index: number) => {
    const wasCompleted = todayTasks[index]?.completed;
    setDailyTasksData((prev: Record<string, Task[]>) => ({
      ...prev,
      [today]: prev[today].map((task: Task, i: number) => 
        i === index ? { ...task, completed: !task.completed } : task
      )
    }));
    
    // Track task completions (only when completing, not uncompleting)
    if (!wasCompleted) {
      setUsageAnalytics(prev => ({
        ...prev,
        interactionCounts: {
          ...prev.interactionCounts,
          tasksCompleted: prev.interactionCounts.tasksCompleted + 1
        }
      }));
    }
  };

  const sendHug = (hugEmoji: string) => {
    setHugCounter((prev: Record<string, number>) => ({
      ...prev,
      [today]: (prev[today] || 0) + 1
    }));

    // Track hug interactions for analytics
    setUsageAnalytics(prev => ({
      ...prev,
      interactionCounts: {
        ...prev.interactionCounts,
        hugsSent: prev.interactionCounts.hugsSent + 1
      }
    }));

    const animationId = Date.now();
    setHugAnimation({ show: true, emoji: hugEmoji, id: animationId, hearts: true });
    setTimeout(() => {
      setHugAnimation({ show: false, emoji: '', id: 0, hearts: false });
    }, 3000);
  };

  const completedTasks = todayTasks.filter((task: Task) => task.completed).length;
  const progressPercentage = todayTasks.length > 0 ? Math.round((completedTasks / todayTasks.length) * 100) : 0;

  const getCurrentDate = () => {
    const now = new Date();
    return now.toLocaleDateString('en-US', { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

const renderContent = () => {
  switch (currentSection) {
    case 'home':
      return (
        <div className="max-w-2xl mx-auto text-center content-transition animate-fade-in pt-36">
          <div className="mb-8">
            <h1 className="text-4xl font-bold romantic-accent mb-4 animate-pulse-love">Daily Love Message 💖</h1>
            <p className="text-xl romantic-text mb-8">For my Sweetheart 💝</p>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8 mb-6 transform hover:scale-105 transition-transform duration-300">
            <div className="text-lg text-gray-800 dark:text-gray-200 leading-relaxed mb-4">
              {generateDailyLoveMessage()}
            </div>
            <div className="text-sm romantic-text">
              💌 A new message awaits you tomorrow
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 inline-block">
            <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">Next love message in:</div>
            <div className="text-lg font-bold romantic-accent">
              {nextMessageTimer}
            </div>
          </div>
        </div>
      );

    case 'complaint':
      return (
        <div className="max-w-2xl mx-auto content-transition animate-fade-in pt-20">
          <div className="text-center mb-6">
            <h2 className="text-3xl font-bold romantic-accent mb-2">Complaint Box 💬</h2>
            <p className="romantic-text text-sm">Your sweet concerns make this love even sweeter 💌</p>
          </div>

          <div className="bg-pink-50 dark:bg-pink-900 rounded-xl shadow-lg p-6">
            <Textarea 
              value={complaintText}
              onChange={(e) => setComplaintText(e.target.value)}
              rows={4}
              className="w-full p-3 border border-pink-300 dark:border-pink-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 resize-none mb-4"
              placeholder="Write your sweet complaint... 💭"
            />

            <Button 
              onClick={submitComplaint}
              className="bg-pink-600 hover:bg-pink-700 text-white px-4 py-2 rounded-lg transition-colors duration-200 transform hover:scale-105 w-full"
            >
              Submit 💝
            </Button>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 text-center mt-4">
            <div className="text-2xl mb-2">🤗</div>
            <div className="romantic-text text-sm">You're loved, heard, and cherished!</div>
          </div>
        </div>
      );
case 'tasks':
  return (
    <div className="pt-20 max-w-2xl mx-auto">
      <h2 className="text-3xl font-bold romantic-accent mb-6 text-center">Love Tasks ✅</h2>
      <ul className="space-y-3">
        {todayTasks.map((task, index) => (
          <li
            key={index}
            className={`p-3 rounded-lg border flex items-center gap-3 ${
              task.completed ? 'bg-green-50 border-green-300 line-through text-gray-500' : 'bg-pink-50 border-pink-300'
            }`}
          >
            <button
              onClick={() => toggleTaskCompletion(index)}
              className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                task.completed ? 'bg-green-400 border-green-500 text-white' : 'border-gray-400'
              }`}
            >
              {task.completed ? '✓' : ''}
            </button>
            <span className="text-sm">{task.text}</span>
          </li>
        ))}
      </ul>
    </div>
  );

    case 'hugs':
      return (
        <div className="pt-20 text-center">
          <h2 className="text-3xl font-bold romantic-accent mb-6">🤗 Virtual Hugs</h2>
          <p className="text-gray-700 dark:text-gray-300 mb-4">Send and receive sweet hugs anytime 💗</p>
          <Button
            onClick={handleHug}
            className="bg-pink-500 text-white px-4 py-2 rounded hover:bg-pink-600"
          >
            Send a Hug 🤗
          </Button>
        </div>
      );
    case 'reminders':
      return (
        <div className="max-w-2xl mx-auto content-transition animate-fade-in pt-20">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold romantic-accent mb-4">Daily Reminders 📋</h2>
            <p className="romantic-text">Sweet thoughts for today</p>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8 text-center">
            <div className="text-lg font-medium text-gray-800 dark:text-gray-200 leading-relaxed mb-6">
              {generateDailyReminder()}
            </div>

            <div className="flex justify-center space-x-4">
              <span className="text-2xl animate-float">🌸</span>
              <span className="text-2xl animate-float" style={{ animationDelay: '0.5s' }}>💕</span>
              <span className="text-2xl animate-float" style={{ animationDelay: '1s' }}>✨</span>
            </div>
          </div>
        </div>
      );


      case 'specialday':
        return (
          <div className="max-w-4xl mx-auto content-transition animate-fade-in pt-20">
            <div className="text-center mb-8">
              <h2 className="text-5xl font-bold romantic-accent mb-4 animate-bounce-heart">
                🎉 National Girlfriend Day! 💖
              </h2>
              <p className="text-xl romantic-text">August 1st - A special day to celebrate our amazing love</p>
            </div>

            <div className="bg-gradient-to-br from-pink-100 via-rose-100 to-purple-100 dark:from-pink-900 dark:via-rose-900 dark:to-purple-900 rounded-xl shadow-2xl p-10 text-center relative overflow-hidden">
              {/* Floating decorative elements */}
              <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
                {[...Array(15)].map((_, index) => (
                  <div
                    key={index}
                    className="absolute text-2xl opacity-20 animate-float"
                    style={{
                      left: `${Math.random() * 100}%`,
                      top: `${Math.random() * 100}%`,
                      animationDelay: `${Math.random() * 3}s`,
                      animationDuration: `${3 + Math.random() * 2}s`
                    }}
                  >
                    {['💖', '💕', '🌸', '✨', '🌹', '💝', '🦋'][Math.floor(Math.random() * 7)]}
                  </div>
                ))}
              </div>

              <div className="relative z-10">
                <div className="mb-8">
                  <div className="flex justify-center space-x-6 mb-8">
                    {['🌹', '🌺', '🌸', '🌷', '🌻', '💐', '🌼'].map((flower, index) => (
                      <span 
                        key={index}
                        className="text-5xl flower-animation transform hover:scale-125 transition-transform cursor-pointer" 
                        style={{ animationDelay: `${index * 0.3}s` }}
                      >
                        {flower}
                      </span>
                    ))}
                  </div>
                  
                  <div className="text-2xl text-gray-800 dark:text-gray-200 leading-relaxed mb-8 bg-white/50 dark:bg-gray-800/50 rounded-lg p-6">
                    You are the sunshine in my darkest days, the reason behind my brightest smiles, and the love that makes my heart skip a beat. 
                    <br/><br/>
                    Today and every day, I celebrate YOU - my beautiful, amazing, perfect girlfriend! 💕
                    <br/><br/>
                    You've turned my world into a fairy tale, and I'm grateful for every moment we share together.
                  </div>
                  
                  <div className="grid md:grid-cols-2 gap-6 mb-8">
                    <div className="bg-white dark:bg-gray-700 rounded-lg p-6 shadow-lg">
                      <div className="text-xl romantic-accent font-semibold mb-4">💖 You mean everything to me because:</div>
                      <div className="text-gray-700 dark:text-gray-300 space-y-3 text-left">
                        <div className="flex items-center">
                          <span className="text-2xl mr-3">✨</span>
                          <span>Your laugh is my favorite sound in the whole world</span>
                        </div>
                        <div className="flex items-center">
                          <span className="text-2xl mr-3">💫</span>
                          <span>Your smile lights up my entire universe</span>
                        </div>
                        <div className="flex items-center">
                          <span className="text-2xl mr-3">🌟</span>
                          <span>Your love makes me a better person every day</span>
                        </div>
                        <div className="flex items-center">
                          <span className="text-2xl mr-3">💖</span>
                          <span>You make every day feel like an adventure</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="bg-white dark:bg-gray-700 rounded-lg p-6 shadow-lg">
                      <div className="text-xl romantic-accent font-semibold mb-4">🎁 Special Promises for Today:</div>
                      <div className="text-gray-700 dark:text-gray-300 space-y-3 text-left">
                        <div className="flex items-center">
                          <span className="text-2xl mr-3">🤗</span>
                          <span>Extra hugs and cuddles all day</span>
                        </div>
                        <div className="flex items-center">
                          <span className="text-2xl mr-3">🍰</span>
                          <span>Your favorite treat just because</span>
                        </div>
                        <div className="flex items-center">
                          <span className="text-2xl mr-3">💝</span>
                          <span>Surprise gifts throughout the day</span>
                        </div>
                        <div className="flex items-center">
                          <span className="text-2xl mr-3">🌙</span>
                          <span>A romantic evening under the stars</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="text-3xl romantic-accent font-bold mb-4 animate-pulse-love">
                  Happy National Girlfriend Day, my beautiful queen! 👑💕
                </div>
                
                <div className="text-lg text-gray-600 dark:text-gray-300">
                  Today we celebrate not just National Girlfriend Day, but the incredible woman who makes my life complete! 🎉✨
                </div>
                
                {/* Special hearts animation for this page */}
                <div className="mt-8 flex justify-center space-x-4">
                  {['💖', '💕', '💝', '❤️', '💗', '💘', '💞'].map((heart, index) => (
                    <span
                      key={index}
                      className="text-3xl animate-bounce-heart cursor-pointer hover:scale-150 transition-transform"
                      style={{ animationDelay: `${index * 0.2}s` }}
                    >
                      {heart}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        );

      default:
        return <div>Section not found</div>;
    }
  };

  return (
    <div 
      className="font-['Segoe_UI'] min-h-screen transition-all duration-300" 
      style={{ 
        backgroundColor: isDarkMode ? 'hsl(340, 80%, 8%)' : 'hsl(338, 90%, 85%)',
        background: isDarkMode 
          ? 'linear-gradient(135deg, hsl(340, 90%, 6%) 0%, hsl(320, 85%, 10%) 50%, hsl(340, 75%, 8%) 100%)' 
          : 'linear-gradient(135deg, hsl(338, 95%, 82%) 0%, hsl(320, 90%, 88%) 50%, hsl(335, 85%, 85%) 100%)',
        backgroundImage: isDarkMode
          ? 'linear-gradient(135deg, hsl(340, 90%, 6%) 0%, hsl(320, 85%, 10%) 50%, hsl(340, 75%, 8%) 100%), radial-gradient(circle at 20% 80%, hsla(340, 100%, 20%, 0.3) 0%, transparent 50%), radial-gradient(circle at 80% 20%, hsla(320, 100%, 15%, 0.4) 0%, transparent 50%)'
          : 'linear-gradient(135deg, hsl(338, 95%, 82%) 0%, hsl(320, 90%, 88%) 50%, hsl(335, 85%, 85%) 100%), radial-gradient(circle at 20% 80%, hsla(340, 100%, 95%, 0.5) 0%, transparent 50%), radial-gradient(circle at 80% 20%, hsla(320, 100%, 92%, 0.6) 0%, transparent 50%)'
      }}
    >
      {/* Hamburger Menu Icon */}
      <div 
        className="fixed top-4 left-4 z-50 cursor-pointer text-2xl hover:scale-110 transition-transform duration-200" 
        onClick={toggleSidebar}
      >
        <span className="romantic-accent">☰</span>
      </div>

      {/* Date Display */}
      <div className="fixed top-4 right-4 z-40 text-sm text-gray-600 dark:text-gray-400">
        {getCurrentDate()}
      </div>

      {/* Sidebar */}
      <div className={`fixed top-0 left-0 h-full w-64 bg-white dark:bg-gray-800 shadow-lg transform ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} sidebar-transition z-40`}>
        <div className="p-6 mt-16">
          <nav className="space-y-4">
            <button onClick={() => navigateToSection('home')} className="flex items-center space-x-3 text-gray-700 dark:text-gray-300 hover:text-pink-500 transition-colors duration-200 w-full text-left">
              <span>🏠</span>
              <span>Home</span>
            </button>
            <button onClick={() => navigateToSection('complaint')} className="flex items-center space-x-3 text-gray-700 dark:text-gray-300 hover:text-pink-500 transition-colors duration-200 w-full text-left">
              <span>📝</span>
              <span>Complaint Box</span>
            </button>
            <button onClick={() => navigateToSection('tasks')} className="flex items-center space-x-3 text-gray-700 dark:text-gray-300 hover:text-pink-500 transition-colors duration-200 w-full text-left">
              <span>✅</span>
              <span>Tasks</span>
            </button>
            <button onClick={() => navigateToSection('hugs')} className="flex items-center space-x-3 text-gray-700 dark:text-gray-300 hover:text-pink-500 transition-colors duration-200 w-full text-left">
              <span>🤗</span>
              <span>Hugs</span>
            </button>
            <button onClick={() => navigateToSection('reminders')} className="flex items-center space-x-3 text-gray-700 dark:text-gray-300 hover:text-pink-500 transition-colors duration-200 w-full text-left">
              <span>📋</span>
              <span>Reminders</span>
            </button>

            {isAugust1st() && (
              <button onClick={() => navigateToSection('specialday')} className="flex items-center space-x-3 text-gray-700 dark:text-gray-300 hover:text-pink-500 transition-colors duration-200 w-full text-left">
                <span>💖</span>
                <span>Special Day</span>
              </button>
            )}
            <hr className="border-gray-300 dark:border-gray-600" />
            <button onClick={toggleDarkMode} className="flex items-center space-x-3 text-gray-700 dark:text-gray-300 hover:text-pink-500 transition-colors duration-200 w-full text-left">
              <span>{isDarkMode ? '☀️' : '🌙'}</span>
              <span>{isDarkMode ? 'Light Mode' : 'Dark Mode'}</span>
            </button>
          </nav>
        </div>
      </div>

      {/* Sidebar Overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-30" 
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Main Content */}
      <div className="transition-all duration-300">
        {renderContent()}
      </div>


    </div>
  );
}
