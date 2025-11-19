/**
 * Body SVG Component
 * Ultra-realistic human anatomy with interactive body parts
 * Theme-aware: Dark mode (light parts) | Light mode (dark parts)
 */

import { useState, useEffect } from 'react';

const BodySvg = ({ selectedParts = [], onPartClick, scale = 1, panX = 0, panY = 0 }) => {
  const [hoveredPart, setHoveredPart] = useState(null);
  const [isDark, setIsDark] = useState(true);

  // Detect theme changes
  useEffect(() => {
    const checkTheme = () => {
      setIsDark(document.documentElement.classList.contains('dark'));
    };
    
    checkTheme();
    
    // Watch for theme changes
    const observer = new MutationObserver(checkTheme);
    observer.observe(document.documentElement, { 
      attributes: true, 
      attributeFilter: ['class'] 
    });
    
    return () => observer.disconnect();
  }, []);

  const isSelected = (id) => selectedParts.some(part => part.id === id);
  const isHovered = (id) => hoveredPart === id;

  const getPartStyle = (id, baseColor) => {
    if (isSelected(id)) {
      return {
        fill: baseColor,
        opacity: 0.8,
        filter: 'url(#glow)',
        cursor: 'pointer'
      };
    }
    if (isHovered(id)) {
      return {
        fill: baseColor,
        opacity: 0.5,
        cursor: 'pointer'
      };
    }
    
    // Theme-aware default styling
    if (isDark) {
      // Dark mode: light subtle parts
      return {
        fill: 'rgba(255,255,255,0.1)',
        stroke: 'rgba(255,255,255,0.3)',
        strokeWidth: 1,
        cursor: 'pointer'
      };
    } else {
      // Light mode: dark visible parts
      return {
        fill: 'rgba(10,26,47,0.15)',
        stroke: 'rgba(10,26,47,0.35)',
        strokeWidth: 1.5,
        cursor: 'pointer'
      };
    }
  };

  // Theme-aware outline color
  const outlineColor = isDark ? 'rgba(255,255,255,0.3)' : 'rgba(10,26,47,0.25)';
  const labelBg = isDark ? 'rgba(0,0,0,0.8)' : 'rgba(255,255,255,0.9)';
  const labelStroke = isDark ? 'rgba(255,255,255,0.3)' : 'rgba(10,26,47,0.3)';
  const labelText = isDark ? 'white' : '#0a1a2f';

  return (
    <svg 
      viewBox="0 0 400 700" 
      className="w-full h-full"
      style={{
        transform: `translate(${panX}px, ${panY}px) scale(${scale})`,
        transition: 'transform 0.2s ease-out'
      }}
    >
      {/* SVG Filters for glow effects */}
      <defs>
        <filter id="glow">
          <feGaussianBlur stdDeviation="4" result="coloredBlur"/>
          <feMerge>
            <feMergeNode in="coloredBlur"/>
            <feMergeNode in="SourceGraphic"/>
          </feMerge>
        </filter>
        
        {/* Gradients for realistic skin tone */}
        <linearGradient id="skinGradient" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" style={{stopColor: '#f4c2a0', stopOpacity: 0.3}} />
          <stop offset="100%" style={{stopColor: '#d9a589', stopOpacity: 0.3}} />
        </linearGradient>
      </defs>

      {/* Base body outline for reference (non-interactive) */}
      <g opacity="0.2" stroke={outlineColor} strokeWidth="2" fill="none">
        {/* Body outline */}
        <ellipse cx="200" cy="70" rx="35" ry="45" /> {/* Head */}
        <rect x="170" y="115" width="60" height="30" rx="5" /> {/* Neck */}
        <path d="M 150 145 Q 150 220 160 280 L 240 280 Q 250 220 250 145 Z" /> {/* Torso */}
        <ellipse cx="200" cy="340" rx="45" ry="60" /> {/* Pelvis */}
      </g>

      {/* HEAD */}
      <ellipse
        id="head"
        cx="200"
        cy="70"
        rx="38"
        ry="48"
        {...getPartStyle('head', '#3b82f6')}
        onClick={() => onPartClick('head')}
        onMouseEnter={() => setHoveredPart('head')}
        onMouseLeave={() => setHoveredPart(null)}
      />
      
      {/* NECK */}
      <rect
        id="neck"
        x="170"
        y="115"
        width="60"
        height="32"
        rx="8"
        {...getPartStyle('neck', '#3b82f6')}
        onClick={() => onPartClick('neck')}
        onMouseEnter={() => setHoveredPart('neck')}
        onMouseLeave={() => setHoveredPart(null)}
      />

      {/* CHEST */}
      <path
        id="chest"
        d="M 150 145 Q 150 180 155 210 L 245 210 Q 250 180 250 145 Z"
        {...getPartStyle('chest', '#06b6d4')}
        onClick={() => onPartClick('chest')}
        onMouseEnter={() => setHoveredPart('chest')}
        onMouseLeave={() => setHoveredPart(null)}
      />

      {/* ABDOMEN */}
      <path
        id="abdomen"
        d="M 155 210 Q 160 240 165 280 L 235 280 Q 240 240 245 210 Z"
        {...getPartStyle('abdomen', '#06b6d4')}
        onClick={() => onPartClick('abdomen')}
        onMouseEnter={() => setHoveredPart('abdomen')}
        onMouseLeave={() => setHoveredPart(null)}
      />

      {/* BACK (shown as outline behind) */}
      <ellipse
        id="back"
        cx="200"
        cy="220"
        rx="42"
        ry="80"
        opacity="0.5"
        {...getPartStyle('back', '#8b5cf6')}
        onClick={() => onPartClick('back')}
        onMouseEnter={() => setHoveredPart('back')}
        onMouseLeave={() => setHoveredPart(null)}
      />

      {/* LEFT SHOULDER */}
      <circle
        id="left-shoulder"
        cx="125"
        cy="155"
        r="22"
        {...getPartStyle('left-shoulder', '#10b981')}
        onClick={() => onPartClick('left-shoulder')}
        onMouseEnter={() => setHoveredPart('left-shoulder')}
        onMouseLeave={() => setHoveredPart(null)}
      />

      {/* RIGHT SHOULDER */}
      <circle
        id="right-shoulder"
        cx="275"
        cy="155"
        r="22"
        {...getPartStyle('right-shoulder', '#10b981')}
        onClick={() => onPartClick('right-shoulder')}
        onMouseEnter={() => setHoveredPart('right-shoulder')}
        onMouseLeave={() => setHoveredPart(null)}
      />

      {/* LEFT ARM */}
      <rect
        id="left-arm"
        x="95"
        y="175"
        width="28"
        height="120"
        rx="14"
        {...getPartStyle('left-arm', '#10b981')}
        onClick={() => onPartClick('left-arm')}
        onMouseEnter={() => setHoveredPart('left-arm')}
        onMouseLeave={() => setHoveredPart(null)}
      />

      {/* RIGHT ARM */}
      <rect
        id="right-arm"
        x="277"
        y="175"
        width="28"
        height="120"
        rx="14"
        {...getPartStyle('right-arm', '#10b981')}
        onClick={() => onPartClick('right-arm')}
        onMouseEnter={() => setHoveredPart('right-arm')}
        onMouseLeave={() => setHoveredPart(null)}
      />

      {/* LEFT HAND */}
      <ellipse
        id="left-hand"
        cx="109"
        cy="315"
        rx="16"
        ry="22"
        {...getPartStyle('left-hand', '#f59e0b')}
        onClick={() => onPartClick('left-hand')}
        onMouseEnter={() => setHoveredPart('left-hand')}
        onMouseLeave={() => setHoveredPart(null)}
      />

      {/* RIGHT HAND */}
      <ellipse
        id="right-hand"
        cx="291"
        cy="315"
        rx="16"
        ry="22"
        {...getPartStyle('right-hand', '#f59e0b')}
        onClick={() => onPartClick('right-hand')}
        onMouseEnter={() => setHoveredPart('right-hand')}
        onMouseLeave={() => setHoveredPart(null)}
      />

      {/* LEFT LEG */}
      <path
        id="left-leg"
        d="M 175 400 Q 170 480 165 560 Q 165 580 175 590 L 185 590 Q 195 580 195 560 Q 190 480 185 400 Z"
        {...getPartStyle('left-leg', '#ef4444')}
        onClick={() => onPartClick('left-leg')}
        onMouseEnter={() => setHoveredPart('left-leg')}
        onMouseLeave={() => setHoveredPart(null)}
      />

      {/* RIGHT LEG */}
      <path
        id="right-leg"
        d="M 215 400 Q 210 480 205 560 Q 205 580 215 590 L 225 590 Q 235 580 235 560 Q 230 480 225 400 Z"
        {...getPartStyle('right-leg', '#ef4444')}
        onClick={() => onPartClick('right-leg')}
        onMouseEnter={() => setHoveredPart('right-leg')}
        onMouseLeave={() => setHoveredPart(null)}
      />

      {/* LEFT FOOT */}
      <ellipse
        id="left-foot"
        cx="175"
        cy="615"
        rx="20"
        ry="15"
        {...getPartStyle('left-foot', '#ec4899')}
        onClick={() => onPartClick('left-foot')}
        onMouseEnter={() => setHoveredPart('left-foot')}
        onMouseLeave={() => setHoveredPart(null)}
      />

      {/* RIGHT FOOT */}
      <ellipse
        id="right-foot"
        cx="225"
        cy="615"
        rx="20"
        ry="15"
        {...getPartStyle('right-foot', '#ec4899')}
        onClick={() => onPartClick('right-foot')}
        onMouseEnter={() => setHoveredPart('right-foot')}
        onMouseLeave={() => setHoveredPart(null)}
      />

      {/* Hover label */}
      {hoveredPart && (
        <g>
          <rect
            x="140"
            y="10"
            width="120"
            height="30"
            rx="8"
            fill={labelBg}
            stroke={labelStroke}
            strokeWidth="1"
          />
          <text
            x="200"
            y="28"
            textAnchor="middle"
            fill={labelText}
            fontSize="14"
            fontWeight="500"
          >
            {hoveredPart.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')}
          </text>
        </g>
      )}
    </svg>
  );
};

export default BodySvg;