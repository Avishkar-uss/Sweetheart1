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
      tasks: 0,
      hugs: 0,
      reminders: 0,
      specialday: 0
    },
    interactionCounts: {
      hugsSent: 0,
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
    if (['home', 'tasks', 'hugs', 'reminders', 'specialday'].includes(section)) {
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

  const navigateToSection = useCallback((section: string) => {
    // Skip complaint section - it's been removed
    if (section === 'complaints') return;
    
    setCurrentSection(section);
    window.history.pushState({}, '', `/${section}`);
    setSidebarOpen(false);
  }, [navigate]);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
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
          <div className="w-full flex items-center justify-center">
            <div className="bg-white rounded-3xl shadow-2xl border border-gray-200 p-8 max-w-2xl w-full animate-floating-heart text-center">
              <h2 className="text-3xl font-bold text-gray-900 mb-6">
                💖 Daily Love Message 💖
              </h2>
              <p className="text-xl sm:text-2xl text-gray-800 leading-relaxed mb-6">
                {generateDailyLoveMessage()}
              </p>
              
              <div className="flex justify-center space-x-2 mb-6">
                {['💖', '💕', '💝', '❤️', '💗', '💘', '💞'].map((heart, index) => (
                  <span
                    key={index}
                    className="text-3xl cursor-pointer hover:scale-150 transition-transform"
                  >
                    {heart}
                  </span>
                ))}
              </div>
              
              <div className="bg-gradient-to-r from-pink-50 to-purple-50 rounded-xl p-4 border border-pink-200">
                <div className="text-lg text-gray-900">
                  Every moment with you is a treasure! 💎✨
                </div>
              </div>
            </div>
          </div>
        );

      case 'tasks':
        return (
          <div className="w-full flex items-center justify-center">
            <div className="bg-white rounded-3xl shadow-2xl border border-gray-200 p-8 max-w-2xl w-full animate-floating-heart text-center">
              <h2 className="text-3xl font-bold text-gray-900 mb-6">
                ✅ Love Tasks ✅
              </h2>
              <p className="text-lg text-gray-800 mb-6">
                Sweet little things to make our day better 💕
              </p>

                <div className="space-y-4 mb-6">
                  {todayTasks.map((task: Task, index: number) => (
                    <div key={index} className="flex items-center space-x-3 p-4 bg-gradient-to-r from-pink-50 to-purple-50 dark:from-pink-50 dark:to-purple-50 rounded-xl hover:shadow-lg transition-all duration-300 transform hover:scale-105">
                      <input
                        type="checkbox"
                        checked={task.completed}
                        onChange={() => toggleTask(index)}
                        className="w-6 h-6 text-pink-500 rounded-lg focus:ring-pink-500 transform hover:scale-110 transition-transform"
                      />
                      <label className={`flex-1 text-lg text-gray-900 dark:text-gray-900 font-medium ${task.completed ? 'line-through opacity-60' : ''}`}>
                        {task.text}
                      </label>
                      {task.completed && <span className="text-2xl">🎉</span>}
                    </div>
                  ))}
                </div>

                <div className="bg-gradient-to-r from-pink-100 to-purple-100 dark:from-pink-100 dark:to-purple-100 rounded-xl shadow-lg p-6 text-center border-2 border-pink-300 dark:border-pink-300 animate-pulse">
                  <div className="text-lg font-bold text-gray-900 dark:text-gray-900 mb-3">Today's Progress 📊</div>
                  <div className="w-full bg-white rounded-full h-4 shadow-inner">
                    <div
                      className="bg-gradient-to-r from-pink-400 to-purple-500 h-4 rounded-full transition-all duration-1000 animate-pulse"
                      style={{ width: `${progressPercentage}%` }}
                    ></div>
                  </div>
                  <div className="text-xl font-bold text-gray-900 dark:text-gray-900 mt-3">
                    {progressPercentage}% Complete ({completedTasks}/{todayTasks.length}) 🌟
                  </div>
                </div>
              </div>
            </div>
        );

      case 'hugs':
        return (
          <div className="max-w-2xl mx-auto content-transition animate-fade-in">
            <div className="bg-white dark:bg-white backdrop-blur-2xl rounded-3xl shadow-2xl border border-gray-200 dark:border-gray-300 p-8 mb-8 animate-bounce-huge">
              <div className="bg-white dark:bg-white border border-gray-200 dark:border-gray-300 rounded-2xl shadow-xl p-8 animate-heart-float text-center relative">
                <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-900 mb-6 animate-pulse-love">
                  🤗 Virtual Hugs 🤗
                </h2>
                <p className="text-lg text-gray-800 dark:text-gray-800 mb-8 animate-floating-heart">
                  Sending love when we miss each other 💕
                </p>

                {/* Enhanced Hug Animation Overlay */}
                {hugAnimation.show && (
                  <div className="fixed inset-0 flex items-center justify-center z-50 pointer-events-none">
                    {/* Main hug emoji with enhanced animation */}
                    <div className="text-9xl animate-bounce-huge transform-gpu" key={hugAnimation.id} style={{ animationDuration: '0.8s' }}>
                      {hugAnimation.emoji}
                    </div>
                    
                    {/* Secondary hug effect */}
                    <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                      <div className="text-7xl opacity-30 animate-hug-explosion transform-gpu" style={{ animationDuration: '1.2s' }}>{hugAnimation.emoji}</div>
                    </div>
                    
                    {/* Floating hearts with staggered animation */}
                    {hugAnimation.hearts && (
                      <>
                        {['💖', '💕', '💝', '❤️', '💗', '💘', '💞'].map((heart, index) => (
                          <div
                            key={`heart-${index}`}
                            className="absolute animate-heart-float text-5xl transform-gpu"
                            style={{
                              left: `${35 + index * 4}%`,
                              top: `${55 + Math.sin(index) * 10}%`,
                              animationDelay: `${index * 0.2}s`,
                              animationDuration: '3s'
                            }}
                          >
                            {heart}
                          </div>
                        ))}
                        {['💖', '💕', '💝', '✨', '🌟'].map((heart, index) => (
                          <div
                            key={`heart2-${index}`}
                            className="absolute animate-heart-float text-4xl transform-gpu"
                            style={{
                              right: `${30 + index * 6}%`,
                              top: `${60 + Math.cos(index) * 8}%`,
                              animationDelay: `${0.8 + index * 0.3}s`,
                              animationDuration: '2.5s'
                            }}
                          >
                            {heart}
                          </div>
                        ))}
                      </>
                    )}
                    
                    {/* Sparkle effects with optimized animation */}
                    {['✨', '⭐', '🌟', '💫', '✨'].map((sparkle, index) => (
                      <div
                        key={`sparkle-${index}`}
                        className="absolute text-3xl animate-ping transform-gpu"
                        style={{
                          left: `${15 + index * 18}%`,
                          top: `${25 + index * 12}%`,
                          animationDelay: `${index * 0.4}s`,
                          animationDuration: '2s'
                        }}
                      >
                        {sparkle}
                      </div>
                    ))}
                  </div>
                )}

                <div className="bg-gradient-to-r from-pink-100 to-purple-100 dark:from-pink-100 dark:to-purple-100 rounded-xl shadow-lg p-6 mb-8 border-2 border-pink-300 dark:border-pink-300 animate-pulse">
                  <div className="text-lg font-bold text-gray-900 dark:text-gray-900 mb-2">Today's Hugs Given 📊</div>
                  <div className="text-4xl font-bold text-gray-900 dark:text-gray-900">{todayHugs} 🤗</div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-6">
                  {[
                    { emoji: '🤗', label: 'Warm Hug', color: 'from-orange-100 to-yellow-100' },
                    { emoji: '💝', label: 'Love Hug', color: 'from-pink-100 to-red-100' },
                    { emoji: '🌸', label: 'Gentle Hug', color: 'from-pink-100 to-purple-100' },
                    { emoji: '✨', label: 'Magic Hug', color: 'from-blue-100 to-purple-100' },
                    { emoji: '🦋', label: 'Butterfly Hug', color: 'from-green-100 to-blue-100' },
                    { emoji: '🌙', label: 'Goodnight Hug', color: 'from-indigo-100 to-purple-100' }
                  ].map((hug, index) => (
                    <button
                      key={index}
                      onClick={() => sendHug(hug.emoji)}
                      className={`bg-gradient-to-r ${hug.color} p-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-110 active:scale-95 border-2 border-gray-200 hover:border-pink-300 animate-floating-heart`}
                      style={{ 
                        animationDelay: `${index * 0.1}s`,
                        animationDuration: '4s'
                      }}
                    >
                      <div className="text-5xl mb-3 transform transition-all duration-300 hover:scale-125 hover:rotate-12">{hug.emoji}</div>
                      <div className="text-sm font-medium text-gray-900">{hug.label}</div>
                    </button>
                  ))}
                </div>

                <div className="bg-gradient-to-r from-pink-50 to-purple-50 dark:from-pink-50 dark:to-purple-50 rounded-xl p-6 border-2 border-pink-200 dark:border-pink-200 animate-floating-heart">
                  <div className="flex justify-center space-x-2 mb-4">
                    {['💖', '🤗', '💕', '✨', '💝', '🤗', '💖'].map((emoji, index) => (
                      <span
                        key={index}
                        className="text-3xl animate-bounce cursor-pointer hover:scale-150 transition-all duration-300"
                        style={{ 
                          animationDelay: `${index * 0.1}s`,
                          animationDuration: '2s'
                        }}
                      >
                        {emoji}
                      </span>
                    ))}
                  </div>
                  <p className="text-lg font-bold text-gray-900 dark:text-gray-900">
                    💝 Every hug sent is a hug received! 💝
                  </p>
                </div>
              </div>
            </div>
          </div>
        );

      case 'reminders':
        return (
          <div className="max-w-2xl mx-auto content-transition animate-fade-in">
            <div className="bg-white dark:bg-white backdrop-blur-2xl rounded-3xl shadow-2xl border border-gray-200 dark:border-gray-300 p-8 mb-8 animate-bounce-huge">
              <div className="bg-white dark:bg-white border border-gray-200 dark:border-gray-300 rounded-2xl shadow-xl p-8 animate-heart-float text-center">
                <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-900 mb-6 animate-pulse-love">
                  📋 Daily Reminders 📋
                </h2>
                <p className="text-lg text-gray-800 dark:text-gray-800 mb-8 animate-floating-heart">
                  Sweet thoughts for today 🌸
                </p>

                <div className="bg-gradient-to-r from-pink-50 to-purple-50 dark:from-pink-50 dark:to-purple-50 rounded-xl p-6 mb-8 border-2 border-pink-200 dark:border-pink-200 animate-floating-heart">
                  <div className="text-xl text-gray-900 dark:text-gray-900 leading-relaxed font-medium">
                    {generateDailyReminder()}
                  </div>
                </div>

                <div className="flex justify-center space-x-3 mb-6">
                  {['💖', '💕', '💝', '❤️', '💗', '💘', '💞', '🌹', '✨'].map((emoji, index) => (
                    <span
                      key={index}
                      className="text-4xl cursor-pointer hover:scale-150 transition-all duration-300 animate-bounce"
                      style={{ 
                        animationDelay: `${index * 0.15}s`,
                        animationDuration: '2s'
                      }}
                      onClick={() => {
                        // Add a little sparkle effect on click
                        const element = document.elementFromPoint(0, 0);
                        if (element) {
                          element.style.transform = 'scale(1.5) rotate(360deg)';
                          setTimeout(() => {
                            element.style.transform = '';
                          }, 500);
                        }
                      }}
                    >
                      {emoji}
                    </span>
                  ))}
                </div>

                <div className="bg-gradient-to-r from-pink-100 to-purple-100 dark:from-pink-100 dark:to-purple-100 rounded-xl shadow-lg px-6 py-4 inline-block border-2 border-pink-300 dark:border-pink-300 animate-pulse">
                  <p className="text-lg font-bold text-gray-900 dark:text-gray-900">
                    💝 You are loved and cherished every day! 💝
                  </p>
                </div>
              </div>
            </div>
          </div>
        );

      case 'specialday':
        // Track page access for developer monitoring
        useEffect(() => {
          setSpecialDayData(prev => ({
            ...prev,
            pageViews: prev.pageViews + 1,
            lastAccessed: new Date().toISOString(),
            lastCelebrated: today,
            totalCelebrations: isAugust1st() ? prev.totalCelebrations + 1 : prev.totalCelebrations
          }));
        }, []);

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
      className="font-['Segoe_UI'] min-h-screen h-screen overflow-hidden transition-all duration-300 relative" 
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
      {/* 🍔 Hamburger Menu - Top Left */}
      <button 
        className="fixed top-4 left-4 z-50 cursor-pointer text-4xl hover:scale-110 transition-transform duration-200 bg-white/20 backdrop-blur-sm rounded-lg p-2 border border-white/30" 
        onClick={toggleSidebar}
        type="button"
      >
        <span className="text-gray-700 dark:text-gray-300">☰</span>
      </button>

      {/* 📅 Date Display - Top Right */}
      <div className="fixed top-4 right-4 z-40 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white/20 backdrop-blur-sm rounded-lg px-3 py-2 border border-white/30">
        {getCurrentDate()}
      </div>

      {/* 📋 Sidebar - Only visible when toggled */}
      <div className={`fixed top-0 left-0 h-full w-64 bg-white dark:bg-gray-800 shadow-lg transform ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} transition-transform duration-300 ease-in-out z-40`}>
        <div className="p-6">
          <h2 className="text-2xl font-bold text-pink-600 dark:text-pink-400 mb-6">💕 Navigation</h2>
          
          <nav className="space-y-3">
            <button
              onClick={() => navigateToSection('home')}
              className={`w-full text-left px-4 py-3 rounded-lg transition-all duration-200 ${
                currentSection === 'home' 
                  ? 'bg-pink-100 dark:bg-pink-900 text-pink-800 dark:text-pink-200' 
                  : 'text-gray-700 dark:text-gray-300 hover:bg-pink-50 dark:hover:bg-pink-900/30'
              }`}
            >
              🏠 Home
            </button>
            
            <button
              onClick={() => navigateToSection('tasks')}
              className={`w-full text-left px-4 py-3 rounded-lg transition-all duration-200 ${
                currentSection === 'tasks' 
                  ? 'bg-pink-100 dark:bg-pink-900 text-pink-800 dark:text-pink-200' 
                  : 'text-gray-700 dark:text-gray-300 hover:bg-pink-50 dark:hover:bg-pink-900/30'
              }`}
            >
              ✅ Tasks
            </button>
            
            <button
              onClick={() => navigateToSection('reminders')}
              className={`w-full text-left px-4 py-3 rounded-lg transition-all duration-200 ${
                currentSection === 'reminders' 
                  ? 'bg-pink-100 dark:bg-pink-900 text-pink-800 dark:text-pink-200' 
                  : 'text-gray-700 dark:text-gray-300 hover:bg-pink-50 dark:hover:bg-pink-900/30'
              }`}
            >
              🔔 Reminders
            </button>
            
            <button
              onClick={() => navigateToSection('hugs')}
              className={`w-full text-left px-4 py-3 rounded-lg transition-all duration-200 ${
                currentSection === 'hugs' 
                  ? 'bg-pink-100 dark:bg-pink-900 text-pink-800 dark:text-pink-200' 
                  : 'text-gray-700 dark:text-gray-300 hover:bg-pink-50 dark:hover:bg-pink-900/30'
              }`}
            >
              🤗 Hugs
            </button>
            
            <hr className="border-gray-300 dark:border-gray-600 my-4" />
            
            <button
              onClick={toggleDarkMode}
              className="flex items-center gap-3 px-4 py-2 rounded-lg hover:bg-pink-100 dark:hover:bg-pink-700 text-gray-700 dark:text-gray-300 w-full transition-all"
            >
              <span className="text-xl">{isDarkMode ? '☀️' : '🌙'}</span>
              <span>{isDarkMode ? 'Light Mode' : 'Dark Mode'}</span>
            </button>
          </nav>
        </div>
      </div>

// ... (rest of the code remains the same)
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-30" 
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* 🧠 Main Content Wrapper */}
      <main className="absolute inset-0 flex items-center justify-center p-4 overflow-y-auto">
        <div className="w-full max-w-4xl">
          {renderContent()}
        </div>
      </main>
    </div>
  );
} 

  
