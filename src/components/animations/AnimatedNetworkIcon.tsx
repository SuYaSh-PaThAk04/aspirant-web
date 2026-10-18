"use client";

import React, { useState, useEffect, useRef } from "react";

interface Particle {
  id: number;
  size: number;
  left: number;
  top: number;
  delay: number;
}

interface AnimatedNetworkIconProps {
  className?: string;
}

export function AnimatedNetworkIcon({
  className = "",
}: AnimatedNetworkIconProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(140 / 800);
  const [revealed, setRevealed] = useState(false);
  const [particles, setParticles] = useState<Particle[]>([]);
  const [isHovered, setIsHovered] = useState(false);

  // Initialize particles and staggered reveal triggers on mount
  useEffect(() => {
    const newParticles = Array.from({ length: 15 }).map((_, i) => ({
      id: i,
      size: Math.random() * 5 + 2,
      left: Math.random() * 100,
      top: Math.random() * 100,
      delay: Math.random() * 10,
    }));
    setParticles(newParticles);

    const timer = setTimeout(() => {
      setRevealed(true);
    }, 100);

    return () => clearTimeout(timer);
  }, []);

  // Calculate dynamic scale to fit its own dimensions perfectly using ResizeObserver
  useEffect(() => {
    if (!containerRef.current) return;
    const updateScale = () => {
      const el = containerRef.current;
      if (!el) return;
      const elWidth = el.clientWidth || 140;
      const elHeight = el.clientHeight || 140;

      const scaleX = elWidth / 800;
      const scaleY = elHeight / 600;
      const newScale = Math.min(scaleX, scaleY, 1);
      setScale(newScale);
    };

    updateScale();
    const observer = new ResizeObserver(() => {
      updateScale();
    });

    observer.observe(containerRef.current);

    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={containerRef}
      className={`network-hub-canvas flex items-center justify-center overflow-hidden relative ${className}`}
    >
      <style
        dangerouslySetInnerHTML={{
          __html: `
        .network-hub-canvas {
            --brand-color: #4f46e5; 
            --brand-glow: rgba(130, 54, 253, 0.4);
            --pipe-static: #f1f3f7;
            --flow-speed: 6s;
        }

        .network-container {
            position: relative;
            width: 800px;
            height: 600px;
            background: transparent;
            display: flex;
            justify-content: center;
            align-items: center;
        }

        /* Background Particles */
        .bg-particles {
            position: absolute;
            inset: 0;
            pointer-events: none;
            z-index: 0;
        }

        .particle {
            position: absolute;
            background: #4f46e5;
            border-radius: 50%;
            opacity: 0.1;
            animation: float-particle 15s infinite linear;
        }

        @keyframes float-particle {
            0% { transform: translateY(0) translateX(0); opacity: 0; }
            50% { opacity: 0.2; }
            100% { transform: translateY(-100px) translateX(20px); opacity: 0; }
        }

        .pipeline-svg {
            position: absolute;
            inset: 0;
            width: 100%;
            height: 100%;
            pointer-events: none;
            z-index: 1;
        }

        .pipe-static {
            fill: none;
            stroke: var(--pipe-static);
            stroke-width: 3;
            stroke-linecap: round;
            stroke-linejoin: round;
        }

        .flow-path {
            fill: none;
            stroke: var(--brand-color);
            stroke-linecap: round;
            stroke-linejoin: round;
            stroke-dasharray: 100, 1000; 
            stroke-dashoffset: 1100;
            transition: stroke-width 0.4s ease, filter 0.4s ease, opacity 0.4s ease;
        }

        @keyframes flow-variable {
            0% { stroke-dashoffset: 1100; }
            100% { stroke-dashoffset: 0; }
        }

        .node {
            position: absolute;
            z-index: 10;
            opacity: 0;
            transform: scale(0.5);
            transition: all 0.6s cubic-bezier(0.34, 1.56, 0.64, 1);
        }

        .node.revealed {
            opacity: 1;
            transform: scale(1);
        }

        .avatar-wrapper {
            width: 80px;
            height: 80px;
            border-radius: 50%;
            border: 3px solid white;
            background: white;
            padding: 2px;
            box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
            overflow: hidden;
            cursor: pointer;
            transition: all 0.4s ease;
            position: relative;
        }

        .avatar-wrapper img {
            width: 100%;
            height: 100%;
            object-fit: cover;
            border-radius: 50%;
        }

        .node.revealed:hover .avatar-wrapper {
            transform: scale(1.15) translateY(-5px);
            border-color: var(--brand-color);
            box-shadow: 0 10px 25px rgba(130, 54, 253, 0.3);
        }

        /* Pulse Ring for Active Nodes */
        .node.active-pulse::after {
            content: '';
            position: absolute;
            top: 50%; left: 50%;
            width: 100%; height: 100%;
            transform: translate(-50%, -50%);
            border: 2px solid var(--brand-color);
            border-radius: 50%;
            animation: pulse-ring 3s infinite;
            pointer-events: none;
        }

        @keyframes pulse-ring {
            0% { width: 80px; height: 80px; opacity: 0.6; }
            100% { width: 140px; height: 140px; opacity: 0; }
        }

        .central-hub {
            position: absolute;
            left: 50%;
            top: 50%;
            transform: translate(-50%, -50%) scale(0.8);
            background: white;
            border: 2.5px solid var(--brand-color);
            border-radius: 20px;
            padding: 18px 36px;
            z-index: 20;
            box-shadow: 0 15px 40px rgba(130, 54, 253, 0.15);
            text-align: center;
            opacity: 0;
            transition: all 0.6s cubic-bezier(0.34, 1.56, 0.64, 1);
        }

        .central-hub.revealed {
            opacity: 1;
            transform: translate(-50%, -50%) scale(1);
        }

        .central-hub h1 {
            color: var(--brand-color);
            font-size: 1.75rem;
            font-weight: 700;
            margin: 0;
            white-space: nowrap;
            letter-spacing: -0.01em;
        }

        /* Node Position Logic */
        #node-1 { top: 10%; left: 15%; }
        #node-2 { top: 43.5%; left: 5%; }
        #node-3 { bottom: 10%; left: 15%; }
        #node-4 { top: 10%; right: 15%; }
        #node-5 { top: 43.5%; right: 5%; }
        #node-6 { bottom: 10%; right: 15%; }
      `,
        }}
      />

      <div
        className="network-container shrink-0"
        style={{
          transform: `scale(${scale})`,
          transformOrigin: "center center",
          position: "absolute",
        }}
      >
        {/* Background Particles */}
        <div className="bg-particles">
          {particles.map((p) => (
            <div
              key={p.id}
              className="particle"
              style={{
                width: `${p.size}px`,
                height: `${p.size}px`,
                left: `${p.left}%`,
                top: `${p.top}%`,
                animationDelay: `${p.delay}s`,
              }}
            />
          ))}
        </div>

        {/* Pipeline SVG */}
        <svg
          className="pipeline-svg"
          viewBox="0 0 800 600"
          preserveAspectRatio="xMidYMid meet"
        >
          {/* Static Paths (Grey) */}
          <g className="pipe-static">
            <path d="M 400 300 L 90 300" />
            <path d="M 400 300 Q 400 100 170 100" />
            <path d="M 400 300 Q 400 500 170 500" />
            <path d="M 400 300 L 710 300" />
            <path d="M 400 300 Q 400 100 630 100" />
            <path d="M 400 300 Q 400 500 630 500" />
          </g>

          {/* Flowing Paths (Purple) */}
          <g
            id="main-flow"
            className="flow-path"
            style={{
              animation: `flow-variable ${isHovered ? "1.5s" : "6s"} cubic-bezier(0.45, 0.05, 0.55, 0.95) infinite`,
              strokeWidth: isHovered ? "5" : "3.5",
              filter: isHovered
                ? "drop-shadow(0 0 10px var(--brand-color))"
                : "drop-shadow(0 0 5px var(--brand-glow))",
              opacity: isHovered ? 1 : 0.8,
            }}
          >
            <path d="M 400 300 L 90 300" />
            <path d="M 400 300 Q 400 100 170 100" />
            <path d="M 400 300 Q 400 500 170 500" />
            <path d="M 400 300 L 710 300" />
            <path d="M 400 300 Q 400 100 630 100" />
            <path d="M 400 300 Q 400 500 630 500" />
          </g>
        </svg>

        {/* Central Hub */}
        <div
          id="hub"
          className={`central-hub ${revealed ? "revealed" : ""}`}
          style={{ padding: "8px" }}
        >
          <img
            src="https://storage.googleapis.com/aspirant-adda-461113-community-server-assets/profile/logo.jpg"
            alt="Aspirant Adda Logo"
            className="w-[155px] h-[155px] rounded-xl object-contain"
          />
        </div>

        {/* Outer Nodes with staggered reveal delay and hover hooks */}
        <div
          id="node-1"
          className={`node active-pulse ${revealed ? "revealed" : ""}`}
          style={{ transitionDelay: "600ms" }}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          <div className="avatar-wrapper">
            <img
              src="/indian%20images%20person/atul-kumar-8OikdXQa1vE-unsplash%201.png"
              alt="User"
            />
          </div>
        </div>

        <div
          id="node-2"
          className={`node active-pulse ${revealed ? "revealed" : ""}`}
          style={{ transitionDelay: "750ms" }}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          <div className="avatar-wrapper">
            <img
              src="/indian%20images%20person/pexels-d67-hunter-2154822929-36535613%201.png"
              alt="User"
            />
          </div>
        </div>

        <div
          id="node-3"
          className={`node active-pulse ${revealed ? "revealed" : ""}`}
          style={{ transitionDelay: "900ms" }}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          <div className="avatar-wrapper">
            <img
              src="/indian%20images%20person/pexels-ketut-subiyanto-4307869%201.png"
              alt="User"
            />
          </div>
        </div>

        <div
          id="node-4"
          className={`node active-pulse ${revealed ? "revealed" : ""}`}
          style={{ transitionDelay: "1050ms" }}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          <div className="avatar-wrapper">
            <img
              src="/indian%20images%20person/pexels-mouli-ghosh-615183603-17394327%201.png"
              alt="User"
            />
          </div>
        </div>

        <div
          id="node-5"
          className={`node active-pulse ${revealed ? "revealed" : ""}`}
          style={{ transitionDelay: "1200ms" }}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          <div className="avatar-wrapper">
            <img
              src="/indian%20images%20person/pexels-wanderinglenses-19958868%201.png"
              alt="User"
            />
          </div>
        </div>

        <div
          id="node-6"
          className={`node active-pulse ${revealed ? "revealed" : ""}`}
          style={{ transitionDelay: "1350ms" }}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          <div className="avatar-wrapper">
            <img
              src="/indian%20images%20person/usman-yousaf-yIOViGQmjJ4-unsplash%201.png"
              alt="User"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
