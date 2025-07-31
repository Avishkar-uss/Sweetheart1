import { getDayOfYear } from './dateUtils';

const loveMessages = [
  "You are the sunshine that brightens my every morning and the moonlight that soothes my every night. 🌅🌙",
  "Every heartbeat whispers your name, every breath I take is filled with love for you. 💓",
  "In a world full of temporary things, you are my forever. 💫",
  "Your smile is my favorite notification, your laugh is my favorite sound. 😊🔔",
  "You make my heart feel like it's dancing even when my feet are still. 💃❤️",
  "Being with you feels like coming home to a place I never knew I was searching for. 🏡💕",
  "You're not just my girlfriend, you're my best friend, my safe place, my everything. 🤗",
  "Every day with you is a new adventure, every moment a new reason to fall deeper in love. 🗺️💖",
  "Your love has turned my life into the most beautiful story ever written. 📖✨",
  "When I count my blessings, I count you twice - once for being you, and once for being mine. 🙏💝",
  "You are my favorite chapter in this beautiful book called life. 📚💕",
  "Your eyes hold galaxies, your touch creates magic, your love transforms everything. ✨🌌",
  "With you, I've learned that home isn't a place, it's a feeling, and you are mine. 🏠💖",
  "You are my today, my tomorrow, my always, and my forever. 💫⏰",
  "Your love is the melody that makes my heart sing the most beautiful song. 🎵💗"
];

const reminders = [
  "Remember to smile today - your smile is someone's sunshine! ☀️😊",
  "You are beautiful exactly as you are. Never forget your worth! 👑✨",
  "Take a moment to breathe deeply and appreciate this beautiful day. 🌸🫁",
  "Your kindness makes the world a brighter place. Keep spreading love! 💫❤️",
  "Don't forget to drink water and take care of your amazing self! 💧🌿",
  "You are stronger than you know and braver than you feel. 💪🦋",
  "Every challenge today is just making you more amazing. You've got this! 🌟💪",
  "Remember to be gentle with yourself - you're doing better than you think. 🤗💕",
  "Your dreams are valid and your goals are achievable. Keep going! 🎯✨",
  "You bring so much joy to those around you. Thank you for being you! 🌈💖",
  "Today is a perfect day to celebrate how wonderful you are. 🎉💝",
  "Your heart is full of love, and the world is lucky to have you in it. 💕🌍",
  "Remember that you are loved, cherished, and appreciated beyond measure. 🥰💖",
  "Take time to do something that makes your soul happy today. 🌸😌",
  "You are a gift to this world, and I'm grateful for you every single day. 🎁💕"
];

export function generateDailyLoveMessage(): string {
  const dayOfYear = getDayOfYear();
  const messageIndex = dayOfYear % loveMessages.length;
  return loveMessages[messageIndex];
}

export function generateDailyReminder(): string {
  const dayOfYear = getDayOfYear();
  const reminderIndex = dayOfYear % reminders.length;
  return reminders[reminderIndex];
}
