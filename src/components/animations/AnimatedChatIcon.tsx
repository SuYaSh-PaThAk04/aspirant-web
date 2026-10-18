"use client";

import React, { useState, useEffect, useRef } from "react";

interface Ripple {
  id: number;
}

interface AnimatedChatIconProps {
  className?: string;
}

export function AnimatedChatIcon({ className = "" }: AnimatedChatIconProps) {
  // 1. TACTILE STATE: Manage mouse/touch feedback scale
  const [isPressed, setIsPressed] = useState(false);
  
  // 2. RIPPLE STATE: Array to hold active clicks ripples
  const [ripples, setRipples] = useState<Ripple[]>([]);
  const rippleIdCounter = useRef(0);
  const timeoutsRef = useRef<number[]>([]);

  // Ripple click handler to generate dynamic background waves
  const handleInteraction = () => {
    const newId = rippleIdCounter.current++;
    setRipples((prev) => [...prev, { id: newId }]);

    // MEMORY LEAK PREVENTION: Auto-remove the ripple after its animation finishes (4000ms)
    const timeoutId = window.setTimeout(() => {
      setRipples((prev) => prev.filter((r) => r.id !== newId));
      timeoutsRef.current = timeoutsRef.current.filter((t) => t !== timeoutId);
    }, 4000);

    timeoutsRef.current.push(timeoutId);
  };

  // CLEANUP ON UNMOUNT: Clear all active timeouts to prevent memory leaks if component is unmounted prematurely
  useEffect(() => {
    return () => {
      timeoutsRef.current.forEach((t) => clearTimeout(t));
    };
  }, []);

  // Event handlers for tactile scaling
  const handleStart = () => {
    setIsPressed(true);
  };

  const handleEnd = () => {
    setIsPressed(false);
  };

  return (
    <div
      className={`animated-chat-canvas flex items-center justify-center cursor-pointer select-none ${className}`}
      style={{
        transform: isPressed ? "scale(0.9)" : "scale(1)",
        transition: isPressed
          ? "transform 0.1s ease"
          : "transform 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)",
      }}
      // Web mouse triggers
      onMouseDown={handleStart}
      onMouseUp={() => {
        handleEnd();
        handleInteraction();
      }}
      onMouseLeave={handleEnd}
      // Mobile touch triggers (prevent scrolling delays & improve responsiveness)
      onTouchStart={(e) => {
        // Prevent scrolling triggers when tapping the icon
        e.stopPropagation();
        handleStart();
      }}
      onTouchEnd={(e) => {
        e.stopPropagation();
        handleEnd();
        handleInteraction();
      }}
    >
      <style dangerouslySetInnerHTML={{ __html: `
        .animated-chat-canvas {
            --brand-color: #8E8AFF;
            --brand-hover: #7a76e5;
            --light-color: #e0dfff;
            --bg-color: #ffffff;
            --trace-speed: 3s;
            position: relative;
        }

        .animated-chat-canvas #chat-svg {
            width: 100%;
            height: 100%;
            overflow: visible;
        }

        /* 1. UNIQUE INFINITE TRACE ANIMATION */
        .animated-chat-canvas .loop-path {
            stroke: #ffffff;
            stroke-width: 3;
            fill: var(--brand-color);
            stroke-dasharray: 150 350;
            stroke-dashoffset: 500;
            animation: traceLoop var(--trace-speed) linear infinite;
            transition: fill 0.5s ease, stroke-width 0.4s ease;
        }

        @keyframes traceLoop {
            from { stroke-dashoffset: 500; }
            to { stroke-dashoffset: 0; }
        }

        /* 2. BREATHING EFFECT */
        .animated-chat-canvas .breathing-group {
            transform-origin: center;
            animation: breath 4s ease-in-out infinite;
            width: 100%;
            height: 100%;
            display: flex;
            align-items: center;
            justify-content: center;
        }

        @keyframes breath {
            0%, 100% { transform: scale(1); filter: drop-shadow(0 5px 10px rgba(142, 138, 255, 0.2)); }
            50% { transform: scale(1.03); filter: drop-shadow(0 15px 25px rgba(142, 138, 255, 0.4)); }
        }

        /* 3. CONTINUOUS DOT WAVE */
        .animated-chat-canvas .dot {
            transform-origin: center;
            fill: var(--brand-color);
            opacity: 0.4;
            animation: dotWave 1.8s infinite ease-in-out;
        }

        @keyframes dotWave {
            0%, 100% { transform: translateY(0) scale(1); opacity: 0.4; }
            50% { transform: translateY(-10px) scale(1.2); opacity: 1; }
        }

        .animated-chat-canvas .dot-1 { animation-delay: 0s; }
        .animated-chat-canvas .dot-2 { animation-delay: 0.2s; }
        .animated-chat-canvas .dot-3 { animation-delay: 0.4s; }

        /* 4. BACKGROUND RADIAL RIPPLE */
        .animated-chat-canvas .ripple {
            position: absolute;
            border: 2px solid var(--brand-color);
            border-radius: 50%;
            opacity: 0;
            pointer-events: none;
            width: 100px;
            height: 100px;
            animation: rippleEffect 4s ease-out forwards;
        }

        @keyframes rippleEffect {
            0% { width: 40px; height: 40px; opacity: 0.6; }
            100% { width: 300px; height: 300px; opacity: 0; }
        }

        /* Hover States for Professional Polish */
        .animated-chat-canvas:hover .loop-path {
            fill: var(--brand-hover);
            stroke: #ffffff;
            stroke-width: 4;
            animation-duration: 1.5s;
        }

        .animated-chat-canvas:hover .breathing-group {
            animation-duration: 2s;
        }

        /* Hint Text Badge */
        .animated-chat-canvas .status-badge {
            position: absolute;
            bottom: -25px;
            background: #f0efff;
            color: var(--brand-color);
            padding: 4px 10px;
            border-radius: 20px;
            font-size: 8px;
            font-weight: 700;
            text-transform: uppercase;
            letter-spacing: 1.5px;
            display: flex;
            align-items: center;
            gap: 4px;
            opacity: 0;
            transition: opacity 0.5s ease;
            pointer-events: none;
            z-index: 30;
            white-space: nowrap;
        }

        .animated-chat-canvas:hover .status-badge {
            opacity: 1;
        }

        .animated-chat-canvas .status-dot {
            width: 5px;
            height: 5px;
            background: var(--brand-color);
            border-radius: 50%;
            animation: blink 1s infinite;
        }

        @keyframes blink {
            0%, 100% { opacity: 1; }
            50% { opacity: 0.3; }
        }
      `}} />

      {/* Ripple background elements */}
      {ripples.map((ripple) => (
        <div key={ripple.id} className="ripple" />
      ))}

      {/* Breathing main group */}
      <div className="breathing-group">
        <svg
          id="chat-svg"
          viewBox="0 0 509 509"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          preserveAspectRatio="xMidYMid meet"
        >
          {/* Outer/Back Bubble Path */}
          <path
            className="loop-path"
            d="M420.943 90.0934H365.971C352.228 66.1704 326.778 43.7744 291.657 43.7744H87.0388C41.7379 43.7744 5.08984 81.9494 5.08984 126.741V274.86C5.08984 312.017 29.5218 346.629 68.7148 357.318C72.2778 357.827 72.7868 360.372 72.7868 364.444V409.236C73.2958 418.907 82.4578 425.015 90.0928 418.907L146.592 376.151C161.862 397.02 184.767 409.745 214.289 409.745H340.521C343.066 409.745 345.102 410.254 347.138 411.272L420.434 462.681C429.596 469.298 439.267 464.717 438.758 454.028V414.835C438.758 410.254 439.776 408.218 442.321 407.709C476.933 399.565 503.91 367.498 503.91 325.251V177.641C503.91 133.358 466.753 91.6204 420.943 90.0934ZM83.4758 410.254V364.444C83.4758 355.282 79.4038 349.174 71.2598 347.647C39.7018 340.521 15.7788 312.526 15.7788 274.86V127.759C15.7788 90.6024 47.8458 53.9544 86.0208 53.9544H291.657C314.562 53.9544 337.976 66.1704 353.246 89.5844H216.325C175.096 90.0934 128.777 125.723 128.777 177.132L129.286 322.197C129.286 336.449 133.358 350.192 140.484 366.989L83.4758 410.254ZM494.239 325.251C494.239 354.773 473.879 388.367 439.776 398.547C433.668 399.565 427.56 404.146 427.56 413.308L428.069 455.046L356.809 405.164C352.228 402.11 346.12 400.074 338.994 400.074H214.289C173.06 400.074 139.466 367.498 139.466 323.215V176.114C139.466 140.484 172.042 100.782 216.325 100.273H419.925C458.1 100.273 494.239 131.831 494.239 176.114V325.251Z"
          />
          {/* Inner/Window Bubble Path */}
          <path
            className="loop-path"
            style={{ animationDelay: "-1.5s" }}
            d="M404.146 129.285H229.05C199.019 129.285 165.425 155.244 164.916 195.964L165.425 293.183C167.461 321.178 187.312 355.79 231.086 355.79H406.182C434.686 355.79 466.753 334.412 470.825 295.219V195.964C470.316 159.825 440.285 129.285 404.146 129.285ZM460.136 292.165C460.136 318.124 438.758 345.101 405.164 345.61H236.176C199.528 347.137 176.623 320.669 176.114 292.165V196.473C176.114 170.514 199.019 140.992 230.068 139.465H406.182C432.65 139.465 460.136 160.843 460.645 195.964L460.136 292.165Z"
          />
          {/* Dot 1 */}
          <path
            className="dot dot-1"
            d="M241.265 216.834C228.031 216.834 215.306 227.523 215.306 242.793C215.306 255.009 225.486 268.752 241.265 268.752C256.535 269.77 267.733 257.045 267.224 242.284C266.715 228.541 256.535 216.834 241.265 216.834ZM241.265 258.572C233.121 258.572 225.486 251.446 225.486 242.284C225.486 234.649 232.103 226.505 241.265 226.505C250.427 226.505 257.044 234.649 257.044 242.284C257.044 251.955 249.409 258.572 241.265 258.572Z"
          />
          {/* Dot 2 */}
          <path
            className="dot dot-2"
            d="M314.052 216.834C300.818 216.834 286.566 226.505 286.566 242.793C286.566 255.009 296.746 268.752 313.543 268.752C328.813 268.752 340.52 256.536 340.011 241.775C339.502 229.05 328.813 216.834 314.052 216.834ZM313.543 258.572C305.399 258.572 297.255 251.955 297.255 242.793C297.255 234.14 305.399 226.505 313.543 226.505C321.687 226.505 329.831 233.631 329.831 242.284C329.831 251.955 321.687 258.572 313.543 258.572Z"
          />
          {/* Dot 3 */}
          <path
            className="dot dot-3"
            d="M385.822 216.835C373.606 217.344 358.845 227.015 358.845 242.794C358.845 257.046 369.534 268.753 385.822 268.753C401.092 269.262 413.308 256.028 411.781 240.758C410.254 227.015 399.056 216.326 385.822 216.835ZM385.822 258.573C377.678 258.573 369.534 251.447 369.534 242.285C369.534 234.65 376.66 226.506 385.822 226.506C394.984 226.506 401.601 234.141 401.601 242.285C401.601 251.956 393.966 258.573 385.822 258.573Z"
          />
        </svg>
      </div>

      {/* Hover Info Badge */}
      <div className="status-badge">
        <span className="status-dot" />
        Live Feed
      </div>
    </div>
  );
}
