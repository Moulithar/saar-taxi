/**
 * Returns a time-appropriate greeting
 * @param {string} name - The name to include in the greeting
 * @returns {string} A greeting with the appropriate time of day
 */
export function getGreeting(name) {
    const hour = new Date().getHours();
    let timeOfDay = 'day';
  
    if (hour < 12) {
      timeOfDay = 'morning';
    } else if (hour >= 12 && hour < 17) {
      timeOfDay = 'afternoon';
    } else {
      timeOfDay = 'evening';
    }
  
    return `Good ${timeOfDay}, ${name.trim()}!`;
  }