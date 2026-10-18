"use client";

import React, { useState, useEffect, useRef } from "react";
import { CenterBox } from "./CenterBox";

interface Particle {
  id: number;
  size: number;
  left: number;
  top: number;
  delay: number;
}

/**
 * PipelineAnimation
 * Interactive animated network pipeline with avatar nodes, flowing connection
 * paths, and floating particles. Used in the "Pan India Network" bento card.
 */

export function PipelineAnimation() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(1);
  const [revealed, setRevealed] = useState(false);
  const [particles, setParticles] = useState<Particle[]>([]);
  const [isHovered, setIsHovered] = useState(false);

  // Initialize particles on mount to avoid hydration mismatch
  useEffect(() => {
    const newParticles = Array.from({ length: 10 }).map((_, i) => ({
      id: i,
      size: Math.random() * 4 + 2,
      left: Math.random() * 100,
      top: Math.random() * 100,
      delay: Math.random() * 10,
    }));
    setParticles(newParticles);

    // Staggered reveal trigger
    const timer = setTimeout(() => {
      setRevealed(true);
    }, 100);

    return () => clearTimeout(timer);
  }, []);

  // Responsive scaling logic using ResizeObserver
  useEffect(() => {
    if (!containerRef.current) return;
    const updateScale = () => {
      const el = containerRef.current;
      if (!el) return;
      const parentWidth = el.clientWidth;
      const parentHeight = el.clientHeight;

      // Calculate scale to fit parent dimensions perfectly
      const scaleX = parentWidth / 500;
      const scaleY = parentHeight / 850;

      // Ensure the animation scales down dynamically to fit both width and height,
      // avoiding any cropping/clipping on any device sizes (mobile/tablet/desktop).
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
      className="flex items-center justify-center w-full h-full relative"
    >
      <style
        dangerouslySetInnerHTML={{
          __html: `
        .pipeline-container {
            --brand-color: #4f46e5; 
            --brand-glow: #818cf8;
            --flow-speed: 6s;
            position: relative;
            width: 500px;
            height: 850px;
            background: transparent;
        }

        /* Background Particles */
        .bg-particles {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            pointer-events: none;
            z-index: 0;
        }

        .particle {
            position: absolute;
            background: var(--brand-glow);
            border-radius: 50%;
            opacity: 0.1;
            animation: float-particle 15s infinite linear;
        }

        @keyframes float-particle {
            0% { transform: translateY(0); opacity: 0; }
            50% { opacity: 0.2; }
            100% { transform: translateY(-300px); opacity: 0; }
        }

        /* SVG Pipeline Overlay */
        .pipeline-svg {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            pointer-events: none;
            z-index: 1;
        }

        .pipe-static {
            fill: none;
            stroke: #f1f3f7;
            stroke-width: 3;
            stroke-linecap: round;
            stroke-linejoin: round;
        }

        /* Fast-Slow-Fast Flow Animation */
        .flow-path {
            fill: none;
            stroke: var(--brand-color);
            stroke-linecap: round;
            stroke-linejoin: round;
            stroke-dasharray: 140, 1000; 
            stroke-dashoffset: 1140;
            transition: stroke-width 0.4s ease, filter 0.4s ease;
        }

        @keyframes flow-variable {
            0% { stroke-dashoffset: 1140; }
            25% { stroke-dashoffset: 850; }  
            75% { stroke-dashoffset: 300; }  
            100% { stroke-dashoffset: 0; }    
        }

        /* Nodes Styling */
        .node {
            position: absolute;
            z-index: 10;
            opacity: 0;
            transform: scale(0.8);
            transition: opacity 0.6s ease, transform 0.6s cubic-bezier(0.23, 1, 0.32, 1);
        }

        .node.revealed {
            opacity: 1;
            transform: scale(1);
        }

        .avatar-node {
            width: 75px;
            height: 75px;
            border-radius: 50%;
            border: 2px solid #f3f4f6;
            background: white;
            padding: 2px;
            box-shadow: 0 4px 15px rgba(0, 0, 0, 0.05);
            overflow: hidden;
            cursor: pointer;
            transition: all 0.4s ease;
        }

        .avatar-node img {
            width: 100%;
            height: 100%;
            object-fit: cover;
            border-radius: 50%;
            transition: all 0.4s ease;
        }

        .node.revealed:hover { transform: scale(1.1) translateY(-5px); }
        .node.revealed:hover .avatar-node {
            border-color: var(--brand-color);
            box-shadow: 0 10px 25px rgba(130, 54, 253, 0.3);
        }

        /* Pulsing Rings on specific nodes */
        .node.active-pulse::before {
            content: '';
            position: absolute;
            top: 50%; left: 50%;
            width: 100%; height: 100%;
            transform: translate(-50%, -50%);
            border: 1px solid var(--brand-glow);
            border-radius: 50%;
            animation: halo 3s infinite;
            pointer-events: none;
        }

        @keyframes halo {
            0% { width: 75px; height: 75px; opacity: 0.6; }
            100% { width: 130px; height: 130px; opacity: 0; }
        }

        /* Placement */
        #n1 { top: 122px; left: 40px; }
        #n2 { top: 202px; right: 50px; }
        #n3 { top: 240px; left: 202px; }
        #n4 { top: 660px; left: 240px; }
        #n5 { bottom: 120px; left: 30px; }
        #n6 { bottom: 20px; right: 50px; }
      `,
        }}
      />

      <div
        className="pipeline-container shrink-0"
        style={{
          transform: `translate(-50%, -50%) scale(${scale})`,
          transformOrigin: "center center",
          position: "absolute",
          left: "50%",
          top: "42%",
        }}
      >
        {/* Particles */}
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
        <svg className="pipeline-svg" viewBox="0 0 500 850">
          <g className="pipe-static">
            <path d="M 77.5 160 V 450 H 150" />
            <path d="M 400 240 V 280 H 240 V 320" />
            <path d="M 240 400 V 450" />
            <path d="M 350 450 H 420 V 240" />
            <path d="M 250 480 V 550 H 280 V 620" />
            <path d="M 280 550 V 800 H 400" />
            <path d="M 280 700 H 70 V 650" />
          </g>

          <g
            className="flow-path"
            style={{
              animation: isHovered
                ? "flow-variable 1s linear infinite"
                : "flow-variable 6s cubic-bezier(0.45, 0.05, 0.55, 0.95) infinite",
              strokeWidth: isHovered ? "5" : "3.5",
              filter: isHovered
                ? "drop-shadow(0 0 15px var(--brand-glow))"
                : "drop-shadow(0 0 8px rgba(130, 54, 253, 0.4))",
            }}
          >
            <path d="M 77.5 160 V 450 H 150" />
            <path d="M 400 240 V 280 H 240 V 320" />
            <path d="M 240 400 V 450" />
            <path d="M 350 450 H 420 V 240" />
            <path d="M 250 480 V 550 H 280 V 620" />
            <path d="M 280 550 V 800 H 400" />
            <path d="M 280 700 H 70 V 650" />
          </g>
        </svg>

        {/* Nodes */}
        <div
          id="n1"
          className={`node active-pulse ${revealed ? "revealed" : ""}`}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          <div className="avatar-node">
            <img
              src="/indian%20images%20person/atul-kumar-8OikdXQa1vE-unsplash%201.png"
              alt="User Avatar"
            />
          </div>
        </div>

        <div
          id="n2"
          className={`node active-pulse ${revealed ? "revealed" : ""}`}
          style={{ transitionDelay: "0.1s" }}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          <div className="avatar-node">
            <img
              src="/indian%20images%20person/pexels-d67-hunter-2154822929-36535613%201.png"
              alt="User Avatar"
            />
          </div>
        </div>

        <div
          id="n3"
          className={`node active-pulse ${revealed ? "revealed" : ""}`}
          style={{ transitionDelay: "0.2s" }}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          <div className="avatar-node">
            <img
              src="/indian%20images%20person/pexels-ketut-subiyanto-4307869%201.png"
              alt="User Avatar"
            />
          </div>
        </div>

        {/* Central Box Brand Element */}
        <CenterBox revealed={revealed} />

        <div
          id="n4"
          className={`node active-pulse ${revealed ? "revealed" : ""}`}
          style={{ transitionDelay: "0.4s" }}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          <div className="avatar-node">
            <img
              src="/indian%20images%20person/pexels-mouli-ghosh-615183603-17394327%201.png"
              alt="User Avatar"
            />
          </div>
        </div>

        <div
          id="n5"
          className={`node active-pulse ${revealed ? "revealed" : ""}`}
          style={{ transitionDelay: "0.5s" }}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          <div className="avatar-node">
            <img
              src="/indian%20images%20person/pexels-wanderinglenses-19958868%201.png"
              alt="User Avatar"
            />
          </div>
        </div>

        <div
          id="n6"
          className={`node active-pulse ${revealed ? "revealed" : ""}`}
          style={{ transitionDelay: "0.6s" }}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          <div className="avatar-node">
            <img
              src="/indian%20images%20person/usman-yousaf-yIOViGQmjJ4-unsplash%201.png"
              alt="User Avatar"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
