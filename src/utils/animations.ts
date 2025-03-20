
import { useState, useEffect } from 'react';

export const useTypingEffect = (text: string, speed: number = 40) => {
  const [displayedText, setDisplayedText] = useState('');
  const [isTyping, setIsTyping] = useState(true);
  
  useEffect(() => {
    setDisplayedText('');
    setIsTyping(true);
    
    let i = 0;
    const typingInterval = setInterval(() => {
      if (i < text.length) {
        setDisplayedText(prev => prev + text.charAt(i));
        i++;
      } else {
        clearInterval(typingInterval);
        setIsTyping(false);
      }
    }, speed);
    
    return () => clearInterval(typingInterval);
  }, [text, speed]);
  
  return { displayedText, isTyping };
};

export const fadeInUpAnimation = {
  initial: { opacity: 0, y: 10 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.4, ease: [0.33, 1, 0.68, 1] }
};

export const fadeInAnimation = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  transition: { duration: 0.3, ease: 'easeOut' }
};

export const staggerChildren = (staggerTime: number = 0.1) => ({
  container: {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren,
      }
    }
  },
  item: {
    hidden: { opacity: 0, y: 10 },
    show: { opacity: 1, y: 0 }
  }
});
