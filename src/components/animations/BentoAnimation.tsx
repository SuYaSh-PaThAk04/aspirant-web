"use client";

import React from "react";

/**
 * BentoAnimation
 * Animated SVG illustration of stacking book blocks with pulsing stars.
 * Used inside the Courses Adda bento card on the homepage.
 */
export function BentoAnimation() {
  return (
    <div className="relative flex items-center justify-center w-full h-full max-w-[250px] max-h-[250px] aspect-square mx-auto">
      <style
        dangerouslySetInnerHTML={{
          __html: `
        :root {
            --brand-color: #8b5cf6; 
            --flow-color: #818cf8;
            --pipe-bg: #f3f4f6;
            --flow-speed: 4s;
            /* Colors based on your brand palette */
            --book-1: #a5b4fc; /* Bottom - Lightest */
            --book-2: #818cf8;
            --book-3: #8b5cf6;
            --book-4: #7c3aed; /* Top - Darkest/Strongest */
            --loop-duration: 6s;
        }

        /* Continuous Stacking Loop for Books */
        .svg-book {
            transform-origin: bottom;
            animation: book-cycle var(--loop-duration) ease-in-out infinite;
            opacity: 0;
        }

        @keyframes book-cycle {
            0% { 
                transform: translateY(30px) scaleX(0.9); 
                opacity: 0; 
            }
            5%, 75% { 
                transform: translateY(0) scaleX(1); 
                opacity: 1; 
            }
            85%, 100% {
                transform: translateY(-10px);
                opacity: 0;
            }
        }

        /* Continuous Star Loop */
        .svg-star {
            animation: star-cycle var(--loop-duration) ease-in-out infinite;
            transform-origin: center;
            opacity: 0;
        }

        @keyframes star-cycle {
            0%, 15% { transform: scale(0); opacity: 0; }
            25%, 75% { transform: scale(1); opacity: 1; }
            85%, 100% { transform: scale(0); opacity: 0; }
        }

        /* Inner pulse for the star while it's visible */
        .star-pulse-inner {
            animation: star-pulse 2s ease-in-out infinite alternate;
            transform-origin: center;
        }

        @keyframes star-pulse {
            0% { transform: scale(1); }
            100% { transform: scale(1.2); }
        }
      `,
        }}
      />
      <svg
        width="100%"
        height="100%"
        viewBox="0 0 200 200"
        className="w-full h-full object-contain"
      >
        <defs>
          {/* Book 1 (Bottom) Gradient: Rich 3D spine effect */}
          <linearGradient id="book-1-grad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#a5b4fc" />
            <stop offset="25%" stopColor="#ddd6fe" />
            <stop offset="70%" stopColor="#818cf8" />
            <stop offset="100%" stopColor="#8b5cf6" />
          </linearGradient>
          {/* Book 3 Gradient: Vintage spine 3D effect */}
          <linearGradient id="book-3-grad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#818cf8" />
            <stop offset="25%" stopColor="#a5b4fc" />
            <stop offset="70%" stopColor="#8b5cf6" />
            <stop offset="100%" stopColor="#7c3aed" />
          </linearGradient>
          {/* Book 4 (Top) Gradient: Notebook 3D cover effect */}
          <linearGradient id="book-4-grad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#8b5cf6" />
            <stop offset="25%" stopColor="#818cf8" />
            <stop offset="70%" stopColor="#7c3aed" />
            <stop offset="100%" stopColor="#6d28d9" />
          </linearGradient>
          {/* Page Gradient: Off-white paper with side shading */}
          <linearGradient id="pages-grad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#cbd5e1" />
            <stop offset="5%" stopColor="#f8fafc" />
            <stop offset="95%" stopColor="#f8fafc" />
            <stop offset="100%" stopColor="#94a3b8" />
          </linearGradient>
        </defs>

        {/* Soft Background Circle */}
        <circle cx="100" cy="110" r="85" fill="rgba(139, 92, 246, 0.04)" />

        {/* ORGANIZED STARS (With individual delays to loop correctly) */}
        <g className="svg-star" style={{ animationDelay: "1.0s" }}>
          <g className="star-pulse-inner">
            <path
              d="M100 30 l3.5 7 h7.5 l-6 5 l2 7.5 l-7-5 l-7 5 l2-7.5 l-6-5 h7.5 z"
              fill="#8b5cf6"
            />
          </g>
        </g>
        <g className="svg-star" style={{ animationDelay: "1.2s" }}>
          <g className="star-pulse-inner">
            <path
              d="M65 50 l2.5 5 h5.5 l-4.5 4 l1.5 5.5 l-5-4 l-5 4 l1.5-5.5 l-4.5-4 h5.5 z"
              fill="#818cf8"
            />
          </g>
        </g>
        <g className="svg-star" style={{ animationDelay: "1.4s" }}>
          <g className="star-pulse-inner">
            <path
              d="M135 50 l2.5 5 h5.5 l-4.5 4 l1.5 5.5 l-5-4 l-5 4 l1.5-5.5 l-4.5-4 h5.5 z"
              fill="#818cf8"
            />
          </g>
        </g>

        {/* STACKED BLOCKS / BOOKS (With staggered delays in the loop) */}
        {/* Block 1 (Bottom): Hardcover Spine with bookmark ribbon */}
        <g className="svg-book" style={{ animationDelay: "0.1s" }}>
          {/* Bookmark Ribbon (Draped down behind the stack of books but showing at bottom) */}
          <path
            d="M 46 170 L 46 195 L 50 191 L 54 195 L 54 170 Z"
            fill="#ede9fe"
            opacity="0.95"
          />

          {/* Book Spine Cover */}
          <rect
            x="36"
            y="155"
            width="128"
            height="28"
            rx="5"
            fill="url(#book-1-grad)"
            stroke="rgba(139, 92, 246, 0.25)"
            strokeWidth={1}
          />

          {/* Title Plate (Inset Label) */}
        </g>

        {/* Block 2: Pages-Facing Book */}
        <g className="svg-book" style={{ animationDelay: "0.3s" }}>
          {/* Bottom Cover */}
          <rect
            x="46"
            y="149"
            width="108"
            height="3.5"
            rx="1.5"
            fill="var(--book-2)"
          />

          {/* Inner Pages (Paper Block) */}
          <rect
            x="49"
            y="131.5"
            width="102"
            height="18"
            fill="url(#pages-grad)"
          />

          {/* Fine horizontal line textures to simulate book page sheets */}
          <line
            x1="53"
            y1="135"
            x2="147"
            y2="135"
            stroke="rgba(139, 92, 246, 0.12)"
            strokeWidth="1"
          />
          <line
            x1="53"
            y1="140"
            x2="147"
            y2="140"
            stroke="rgba(139, 92, 246, 0.12)"
            strokeWidth="1"
          />
          <line
            x1="53"
            y1="145"
            x2="147"
            y2="145"
            stroke="rgba(139, 92, 246, 0.12)"
            strokeWidth="1"
          />

          {/* Ribbon Bookmark hanging out of pages */}
          <path
            d="M 132 131.5 L 132 158 L 136 154 L 140 158 L 140 131.5 Z"
            fill="var(--book-3)"
            opacity="0.95"
          />

          {/* Top Cover */}
          <rect
            x="46"
            y="128"
            width="108"
            height="3.5"
            rx="1.5"
            fill="var(--book-2)"
          />
        </g>

        {/* Block 3: Vintage Leather-Bound Spine with White Filigree */}
        <g className="svg-book" style={{ animationDelay: "0.5s" }}>
          {/* Spine Base */}
          <rect
            x="40"
            y="102"
            width="120"
            height="24"
            rx="4"
            fill="url(#book-3-grad)"
            stroke="rgba(139, 92, 246, 0.3)"
            strokeWidth={1}
          />

          {/* Elegant white filigree border */}
          <rect
            x="45"
            y="105"
            width="110"
            height="18"
            rx="2"
            fill="none"
            stroke="#ffffff"
            strokeWidth="0.75"
            strokeOpacity="0.5"
          />

          {/* White raised bands */}
          <line
            x1="55"
            y1="102"
            x2="55"
            y2="126"
            stroke="#ffffff"
            strokeWidth="1.5"
            strokeOpacity="0.5"
          />
          <line
            x1="59"
            y1="102"
            x2="59"
            y2="126"
            stroke="#ffffff"
            strokeWidth="1.5"
            strokeOpacity="0.5"
          />
          <line
            x1="141"
            y1="102"
            x2="141"
            y2="126"
            stroke="#ffffff"
            strokeWidth="1.5"
            strokeOpacity="0.5"
          />
          <line
            x1="145"
            y1="102"
            x2="145"
            y2="126"
            stroke="#ffffff"
            strokeWidth="1.5"
            strokeOpacity="0.5"
          />

          {/* Center Medallion Emblem */}
          <g transform="translate(100, 114)">
            <circle cx="0" cy="0" r="3.5" fill="#ffffff" opacity="0.95" />
            <path
              d="M-7,0 L7,0 M0,-7 L0,7"
              stroke="url(#book-3-grad)"
              strokeWidth={0.75}
            />
          </g>
        </g>

        {/* Block 4 (Top): Minimal Notebook with Elastic Strap & Star Logo */}
        <g className="svg-book" style={{ animationDelay: "0.7s" }}>
          {/* Spine Base */}
          <rect
            x="62"
            y="80"
            width="76"
            height="19"
            rx="3.5"
            fill="url(#book-4-grad)"
            stroke="rgba(139, 92, 246, 0.3)"
            strokeWidth={1}
          />

          {/* Elastic Band Strap */}
          <rect
            x="114"
            y="80"
            width="6"
            height="19"
            fill="#ffffff"
            rx="1"
            opacity="0.8"
          />

          {/* Center Star Emblem */}
          <path
            d="M 100 85 L 101.2 88 L 104.2 88 L 101.8 89.7 L 102.8 92.7 L 100 91 L 97.2 92.7 L 98.2 89.7 L 95.8 88 L 98.8 88 Z"
            fill="#ffffff"
            opacity="0.85"
          />
        </g>
      </svg>
    </div>
  );
}
