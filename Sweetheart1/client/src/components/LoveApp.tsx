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
  useEffect(() => {
  if (window.innerWidth >= 768) {
    setSidebarOpen(true);
  }
}, 
 // Initialize daily tasks if not present
  useEffect(() => {
    if (!dailyTasksData[today]) {
      const shuffled = [...dailyTasks].sort(() => 0.5 - Math.random());
      const selectedTasks = shuffled.slice(0, 5);
      setDailyTasksData((prev: Record<string, Task[]>) => ({ ...prev, [today]: selectedTasks }));
    }
  }, [today, setDailyTasksData]);

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
    <div className="relative min-h-screen pt-28 px-4 sm:px-6 overflow-hidden bg-gradient-to-br from-rose-100 via-pink-200 to-rose-300 content-transition animate-fade-in">

      {/* ✨ Floating hearts background */}
      <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
        {Array.from({ length: 20 }).map((_, i) => (
          <div
            key={i}
            className="absolute text-pink-400 opacity-20 animate-floating-heart"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              fontSize: `${Math.random() * 20 + 16}px`,
              animationDuration: `${Math.random() * 10 + 5}s`,
              animationDelay: `${Math.random() * 5}s`,
            }}
          >
            ❤️
          </div>
        ))}
      </div>

      {/* 💖 Main Card */}
      <div className="relative z-10 max-w-3xl mx-auto text-center bg-white/70 dark:bg-gray-800/50 backdrop-blur-2xl rounded-[2rem] shadow-[0_8px_32px_0_rgba(31,38,135,0.1)] p-10 border border-white/30 dark:border-gray-700">

        {/* Header */}
        <div className="mb-10">
          <h1 className="text-5xl sm:text-6xl font-bold romantic-accent text-gray-900 dark:text-white animate-pulse-love drop-shadow-sm tracking-tight">
            Daily Love Message <span className="animate-bounce">💖</span>
          </h1>
          <p className="text-2xl sm:text-3xl romantic-text text-pink-700 dark:text-pink-300 mt-3 italic font-light">
            For my Sweetheart <span className="animate-pulse">💝</span>
          </p>
        </div>

        {/* Message Card */}
        <div className="bg-white/90 dark:bg-gray-900/70 border border-pink-200 dark:border-pink-700 rounded-2xl shadow-xl p-8 mb-8 transform hover:scale-[1.01] transition-transform duration-300">
          <p className="text-xl sm:text-2xl text-gray-800 dark:text-gray-100 leading-relaxed mb-4 font-medium">
            {generateDailyLoveMessage()}
          </p>
          <p className="text-sm romantic-text text-gray-600 dark:text-gray-300 italic">
            💌 A new message awaits you tomorrow
          </p>
        </div>

        {/* Timer Box */}
        <div className="bg-white/90 dark:bg-gray-800/60 rounded-xl shadow-lg px-6 py-4 inline-block border border-pink-100 dark:border-pink-900">
          <div className="text-sm text-gray-500 dark:text-gray-300 mb-1 font-medium">
            Next love message in:
          </div>
          <div className="text-2xl sm:text-3xl font-semibold romantic-accent tracking-wide text-gray-900 dark:text-white">
            {nextMessageTimer}
          </div>
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
    <div className="pt-24 min-h-screen bg-gradient-to-br from-pink-100 via-rose-200 to-pink-300 px-4">
      <div className="max-w-2xl mx-auto backdrop-blur-md bg-white/60 dark:bg-gray-800/60 rounded-3xl shadow-xl p-8 border border-white/30">
        <h2 className="text-4xl font-bold romantic-accent mb-6 text-center animate-pulse-love">Love Tasks 💗</h2>
        <p className="text-center text-gray-700 dark:text-gray-300 mb-8 italic">A few sweet things to brighten your day 🌷</p>
        <ul className="space-y-4">
          {todayTasks.map((task, index) => (
            <li
              key={index}
              className={`p-4 rounded-xl flex items-center justify-between transition-all duration-300 shadow-sm ${
                task.completed ? 'bg-green-100/80 backdrop-blur-sm' : 'bg-white/70 hover:bg-pink-50'
              }`}
            >
              <label className="flex items-center space-x-4 w-full cursor-pointer">
                <input
                  type="checkbox"
                  checked={task.completed}
                  onChange={() => toggleTask(index)}
                  className="h-5 w-5 accent-pink-500 transition-all duration-200"
                />
                <span
                  className={`flex-1 text-lg font-medium ${
                    task.completed ? 'line-through text-gray-500' : 'text-gray-800'
                  }`}
                >
                  {task.text}
                </span>
                {task.completed && <span className="text-green-600 text-xl">✅</span>}
              </label>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );


   case 'hugs':
  return (
    <div className="max-w-3xl mx-auto content-transition animate-fade-in pt-20 px-4 sm:px-0">
      <div className="text-center mb-10">
        <h2 className="text-4xl font-bold romantic-accent mb-2 animate-pulse-love text-pink-700 dark:text-pink-300 drop-shadow-md">
          Virtual Hugs 🤗
        </h2>
        <p className="romantic-text text-gray-600 dark:text-gray-300 text-lg italic">
          Sending love when we miss each other 💞
        </p>
      </div>

      <div className="rounded-3xl bg-pink-600 dark:bg-pink-800 text-white shadow-2xl p-8 text-center relative transition-all duration-300">
        {/* Animated Overlay */}
        {hugAnimation.show && (
          <div className="fixed inset-0 flex items-center justify-center z-50 pointer-events-none">
            <div className="text-8xl animate-bounce-huge" key={hugAnimation.id}>
              {hugAnimation.emoji}
            </div>

            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
              <div className="text-6xl opacity-40 animate-hug-explosion">{hugAnimation.emoji}</div>
            </div>

            {/* Floating hearts */}
            {hugAnimation.hearts && (
              <>
                {['💖', '💕', '💝', '❤️', '💗'].map((heart, index) => (
                  <div
                    key={`${heart}-${index}`}
                    className="absolute animate-heart-float text-4xl"
                    style={{
                      left: `${40 + index * 5}%`,
                      top: '60%',
                      animationDelay: `${index * 0.3}s`
                    }}
                  >
                    {heart}
                  </div>
                ))}
              </>
            )}
          </div>
        )}

        <div className="mb-6">
          <div className="text-sm text-pink-100 dark:text-pink-200 mb-2">Today's Hugs Given:</div>
          <div className="text-3xl font-bold">{todayHugs}</div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {[
            { emoji: '🤗', label: 'Warm Hug' },
            { emoji: '💝', label: 'Love Hug' },
            { emoji: '🌸', label: 'Gentle Hug' },
            { emoji: '✨', label: 'Magic Hug' },
            { emoji: '🦋', label: 'Butterfly Hug' },
            { emoji: '🌙', label: 'Goodnight Hug' }
          ].map((hug, index) => (
            <Button
              key={index}
              onClick={() => sendHug(hug.emoji)}
              className="bg-white text-pink-600 hover:bg-pink-100 dark:bg-gray-700 dark:text-pink-300 p-6 rounded-xl shadow-md hover:shadow-xl transition-all duration-200 transform hover:scale-105 active:scale-95 border border-white/30"
            >
              <div className="text-4xl mb-2 transform transition-transform duration-200 hover:scale-125">{hug.emoji}</div>
              <div className="text-sm">{hug.label}</div>
            </Button>
          ))}
        </div>
      </div>
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
                          <span>A beautiful future of us</span>
                        </div>
                        <div className="flex items-center">
                          <span className="text-2xl mr-3">💝</span>
                          <span>A sweet forhead kiss</span>
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
    className="relative min-h-screen font-['Segoe_UI'] overflow-x-hidden transition-all duration-300"
    style={{
      backgroundImage: isDarkMode
        ? 'linear-gradient(135deg, hsl(340, 90%, 6%) 0%, hsl(320, 85%, 10%) 50%, hsl(340, 75%, 8%) 100%), radial-gradient(circle at 20% 80%, hsla(340, 100%, 20%, 0.3) 0%, transparent 50%), radial-gradient(circle at 80% 20%, hsla(320, 100%, 15%, 0.4) 0%, transparent 50%)'
        : 'linear-gradient(135deg, hsl(338, 95%, 82%) 0%, hsl(320, 90%, 88%) 50%, hsl(335, 85%, 85%) 100%), radial-gradient(circle at 20% 80%, hsla(340, 100%, 95%, 0.5) 0%, transparent 50%), radial-gradient(circle at 80% 20%, hsla(320, 100%, 92%, 0.6) 0%, transparent 50%)'
    }}
  >
    {/* 🍔 Hamburger Menu */}
    <div
      className="fixed top-4 left-4 z-50 cursor-pointer text-2xl hover:scale-110 transition-transform duration-200"
      onClick={toggleSidebar}
    >
      <span className="romantic-accent">☰</span>
    </div>

    {/* 📅 Date Display */}
    <div className="fixed top-4 right-4 z-40 text-sm text-gray-600 dark:text-gray-400">
      {getCurrentDate()}
    </div>

    {/* 📋 Sidebar */}
    <div className={`fixed top-0 left-0 h-full w-64 overflow-y-auto bg-white dark:bg-gray-800 shadow-lg transform ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} transition-transform duration-300 z-40`}>
      <div className="p-6 mt-16">
        <nav className="space-y-4">
          {[
            { label: 'Home', emoji: '🏠', key: 'home' },
            { label: 'Complaint Box', emoji: '📝', key: 'complaint' },
            { label: 'Tasks', emoji: '✅', key: 'tasks' },
            { label: 'Hugs', emoji: '🤗', key: 'hugs' },
            { label: 'Reminders', emoji: '📋', key: 'reminders' },
          ].map(item => (
            <button
              key={item.key}
              onClick={() => navigateToSection(item.key)}
              className="flex items-center space-x-3 text-gray-700 dark:text-gray-300 hover:text-pink-500 w-full"
            >
              <span>{item.emoji}</span><span>{item.label}</span>
            </button>
          ))}

          {isAugust1st() && (
            <button onClick={() => navigateToSection('specialday')} className="flex items-center space-x-3 text-gray-700 dark:text-gray-300 hover:text-pink-500 w-full">
              <span>💖</span><span>Special Day</span>
            </button>
          )}

          <hr className="border-gray-300 dark:border-gray-600" />
          <button onClick={toggleDarkMode} className="flex items-center space-x-3 text-gray-700 dark:text-gray-300 hover:text-pink-500 w-full">
            <span>{isDarkMode ? '☀️' : '🌙'}</span>
            <span>{isDarkMode ? 'Light Mode' : 'Dark Mode'}</span>
          </button>
        </nav>
      </div>
    </div>

    {/* 🧊 Sidebar Overlay */}
    {sidebarOpen && (
      <div
        className="fixed inset-0 bg-black bg-opacity-50 z-30"
        onClick={() => setSidebarOpen(false)}
      />
    )}

    {/* 🧠 Main Content Wrapper */}
    <main className="pt-24 pb-10 px-4 sm:px-6 transition-all duration-300">
      {renderContent()}
    </main>
  </div>
);
}
