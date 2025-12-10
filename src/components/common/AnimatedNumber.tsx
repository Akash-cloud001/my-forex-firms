"use client";

import React, { useEffect, useState, useRef } from "react";
import { motion } from "motion/react";
import { useInView } from "react-intersection-observer";

interface AnimatedNumberProps {
  value: string; // e.g., "100+", "1M+", "1000+"
  className?: string;
  duration?: number;
}

/**
 * Parses a formatted number string and extracts the numeric value and suffix
 * Examples:
 * - "100+" -> { number: 100, suffix: "+" }
 * - "1M+" -> { number: 1, suffix: "M+" }
 * - "1000+" -> { number: 1000, suffix: "+" }
 */
function parseNumber(value: string): { number: number; suffix: string } {
  // Remove any whitespace
  const cleaned = value.trim();
  
  // Match number and suffix pattern
  // Handles: "100+", "1M+", "1000+", "1K+", etc.
  const match = cleaned.match(/^([\d.]+)([^\d]*)$/);
  
  if (!match) {
    // Fallback: try to extract just the number
    const numMatch = cleaned.match(/[\d.]+/);
    if (numMatch) {
      return {
        number: parseFloat(numMatch[0]),
        suffix: cleaned.replace(numMatch[0], ""),
      };
    }
    return { number: 0, suffix: cleaned };
  }
  
  const numberPart = parseFloat(match[1]);
  const suffix = match[2] || "";
  
  return { number: numberPart, suffix };
}

/**
 * Formats a number with its suffix
 */
function formatNumber(number: number, suffix: string): string {
  // Round to avoid decimal places for whole numbers
  const rounded = Math.round(number);
  return `${rounded}${suffix}`;
}

/**
 * Easing function for smooth animation (ease-out cubic)
 */
function easeOutCubic(t: number): number {
  return 1 - Math.pow(1 - t, 3);
}

const AnimatedNumber: React.FC<AnimatedNumberProps> = ({
  value,
  className = "",
  duration = 2,
}) => {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.2,
  });

  const { number: targetNumber, suffix } = parseNumber(value);
  const [displayValue, setDisplayValue] = useState(0);
  const animationFrameRef = useRef<number | null>(null);
  const startTimeRef = useRef<number | null>(null);
  const hasAnimatedRef = useRef(false);

  // Animate number from 0 to target
  useEffect(() => {
    if (!inView || hasAnimatedRef.current) return;

    hasAnimatedRef.current = true;
    startTimeRef.current = Date.now();

    const animate = () => {
      const now = Date.now();
      const elapsed = now - (startTimeRef.current || now);
      const progress = Math.min(elapsed / (duration * 1000), 1);
      
      const easedProgress = easeOutCubic(progress);
      const currentValue = easedProgress * targetNumber;
      
      setDisplayValue(currentValue);

      if (progress < 1) {
        animationFrameRef.current = requestAnimationFrame(animate);
      } else {
        // Ensure we end exactly at target
        setDisplayValue(targetNumber);
      }
    };

    animationFrameRef.current = requestAnimationFrame(animate);

    return () => {
      if (animationFrameRef.current !== null) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [inView, targetNumber, duration]);

  return (
    <motion.p
      ref={ref}
      className={className}
      initial={{ opacity: 0, y: 30 }}
      animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
      transition={{
        duration: 0.5,
        ease: "easeOut",
      }}
    >
      {formatNumber(displayValue, suffix)}
    </motion.p>
  );
};

export default AnimatedNumber;

