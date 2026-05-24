import React, { useState, useEffect, useCallback } from 'react';

export default function TextScramble({ text, triggerOn = 'hover', className = '' }) {
  const [displayText, setDisplayText] = useState(text);
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$%&*+-/\\<>[]{}';

  const scramble = useCallback(() => {
    let iteration = 0;
    const interval = setInterval(() => {
      setDisplayText(
        text
          .split("")
          .map((char, index) => {
            if (char === " ") return " ";
            if (index < iteration) {
              return text[index];
            }
            return chars[Math.floor(Math.random() * chars.length)];
          })
          .join("")
      );

      if (iteration >= text.length) {
        clearInterval(interval);
      }
      iteration += 1 / 3;
    }, 25);
    return interval;
  }, [text]);

  useEffect(() => {
    if (triggerOn === 'mount') {
      const interval = scramble();
      return () => clearInterval(interval);
    }
  }, [scramble, triggerOn]);

  return (
    <span 
      onMouseEnter={triggerOn === 'hover' ? scramble : undefined} 
      className={`cursor-default select-none ${className}`}
    >
      {displayText}
    </span>
  );
}
