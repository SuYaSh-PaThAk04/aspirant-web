"use client";

import React, { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";

/**
 * QuizAnimation
 * GSAP-powered animated quiz battle logo with swap transitions,
 * victory sparkles, parallax mouse tracking, and responsive scaling.
 * Used in the "1 vs 1 Live Quiz Battles" bento card.
 */
export function QuizAnimation({ className = "" }: { className?: string }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const masterWrapperRef = useRef<HTMLDivElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  const logoQuizRef = useRef<SVGGElement>(null);
  const logoWinRef = useRef<SVGGElement>(null);

  const [scale, setScale] = useState(160 / 600); // Default scale for 160px bounds (600px viewBox)

  // Dynamic scaling using ResizeObserver
  useEffect(() => {
    if (!containerRef.current) return;
    const updateScale = () => {
      const el = containerRef.current;
      if (!el) return;
      const elWidth = el.clientWidth || 160;
      const elHeight = el.clientHeight || 160;

      const scaleX = elWidth / 600;
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

  // GSAP Animations and Parallax Effect
  useEffect(() => {
    const victorySparks =
      containerRef.current?.querySelectorAll(".victory-spark");

    // 1. Dynamic Centering: Setting transformOrigin to "50% 50%" uses the actual bounding boxes
    if (logoQuizRef.current && logoWinRef.current) {
      gsap.set([logoQuizRef.current, logoWinRef.current], {
        transformOrigin: "50% 50%",
      });
      // Set initial dynamic state (animate Quiz in from 0.7 scale on mount, Win starts at scale 0 with rotation)
      gsap.set(logoQuizRef.current, { opacity: 0, scale: 0.7 });
      gsap.set(logoWinRef.current, { opacity: 0, scale: 0, rotation: -20 });
    }
    if (victorySparks && victorySparks.length > 0) {
      gsap.set(Array.from(victorySparks), {
        opacity: 0,
        scale: 0,
        transformOrigin: "50% 50%",
      });
    }

    // 2. Main Professional Swap Timeline
    const swapTl = gsap.timeline({ repeat: -1 });

    swapTl
      // State 1: Animate 1VS1 QUIZ Logo in
      .to(logoQuizRef.current, {
        opacity: 1,
        scale: 1,
        duration: 0.8,
        ease: "back.out(1.5)",
      })
      // Idle breathe/pulse effect
      .to(logoQuizRef.current, {
        scale: 1.05,
        duration: 1.5,
        repeat: 1,
        yoyo: true,
        ease: "sine.inOut",
      })
      // Smooth transition out
      .to(logoQuizRef.current, {
        opacity: 0,
        scale: 0.7,
        duration: 0.4,
        ease: "power2.in",
      })

      // State 2: WIN Logo Visible (Elastic snap-in from scale 0 with rotation release)
      .set(logoWinRef.current, { pointerEvents: "auto" })
      .to(logoWinRef.current, {
        opacity: 1,
        scale: 0.75, // perfectly scaled down as requested
        rotation: 0, // spins to upright
        duration: 0.8,
        ease: "elastic.out(1, 0.6)",
      })

      // WIN Sparkles pop-in earlier to match the elastic pop
      .to(
        Array.from(victorySparks || []),
        {
          opacity: 1,
          scale: 1,
          duration: 0.5,
          stagger: 0.1,
          ease: "back.out(2)",
        },
        "-=0.5",
      )
      // Sparkles fade out
      .to(
        Array.from(victorySparks || []),
        {
          opacity: 0,
          scale: 0.5,
          duration: 0.4,
          stagger: 0.1,
          ease: "power2.in",
        },
        "+=0.3",
      )

      // WIN Logo idle pulse sync (adjusted scale range for smaller size)
      .to(
        logoWinRef.current,
        {
          scale: 0.82,
          duration: 1.5,
          repeat: 1,
          yoyo: true,
          ease: "sine.inOut",
        },
        "-=1.5",
      )

      // Transition Back to Quiz (Slight pop out)
      .to(logoWinRef.current, {
        opacity: 0,
        scale: 0.9,
        duration: 0.4,
        ease: "power2.in",
      })
      .set(logoWinRef.current, { pointerEvents: "none" })
      .delay(0.2);

    // 3. Subtle persistent vertical floating (applied to svgRef to avoid y conflicts with parallax)
    const floatTween = gsap.to(svgRef.current, {
      y: "-=15",
      duration: 3,
      repeat: -1,
      yoyo: true,
      ease: "sine.inOut",
    });

    // 4. Smooth Parallax mouse move effect (applied to master-wrapper div)
    const handleMouseMove = (e: MouseEvent) => {
      const { clientX, clientY } = e;
      const xPos = (clientX / window.innerWidth - 0.5) * 40;
      const yPos = (clientY / window.innerHeight - 0.5) * 40;

      gsap.to(masterWrapperRef.current, {
        x: xPos,
        y: yPos,
        rotationY: xPos / 2,
        rotationX: -yPos / 2,
        duration: 1,
        ease: "power3.out",
      });
    };

    window.addEventListener("mousemove", handleMouseMove);

    // CLEANUP ON UNMOUNT: Kill active timelines, tweens, and remove global event listeners to prevent memory leaks
    return () => {
      swapTl.kill();
      floatTween.kill();
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className={`quiz-animation-canvas flex items-center justify-center overflow-visible relative ${className}`}
    >
      <style
        dangerouslySetInnerHTML={{
          __html: `
        .quiz-container {
            position: relative;
            width: 600px;
            height: 600px;
            display: flex;
            justify-content: center;
            align-items: center;
            background: transparent;
            perspective: 1200px;
        }

        .quiz-svg-element {
            width: 100%;
            height: 100%;
            overflow: visible;
        }

        .float-wrapper-element {
            transform-origin: center center;
            transform-style: preserve-3d;
            will-change: transform;
            width: 100%;
            height: 100%;
            display: flex;
            justify-content: center;
            align-items: center;
        }
        
        .text-path, .win-path {
            filter: drop-shadow(0 0 12px rgba(150, 109, 250, 0.7));
            will-change: transform, opacity;
        }

        .victory-spark {
            fill: #966DFA;
            opacity: 0;
            filter: drop-shadow(0 0 6px rgba(150, 109, 250, 0.9));
        }
      `,
        }}
      />

      <div
        className="quiz-container shrink-0"
        style={{
          transform: `translate(-50%, -50%) scale(${scale})`,
          transformOrigin: "center center",
          position: "absolute",
          top: "50%",
          left: "50%",
        }}
      >
        <div
          ref={masterWrapperRef}
          className="float-wrapper-element"
          id="master-wrapper"
        >
          <svg
            ref={svgRef}
            viewBox="-20 -20 600 600"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="quiz-svg-element"
            id="quiz-svg"
          >
            {/* Phone and Hand (Strictly untouched and static) */}
            <path
              d="M106.4 412.534L107.333 436.334C108.733 455.467 124.6 471.334 144.666 470.867L316.4 460.134C336 459.201 352.333 442.867 352.333 422.334L336 42.4672C335.066 21.9338 318.266 7.46716 298.2 7.93382L124.6 17.2672C107.333 18.2005 89.1328 34.5338 90.0662 56.0005L99.3995 248.734"
              stroke="#966DFA"
              strokeWidth="7"
              strokeMiterlimit="10"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M120.866 402.267L121.799 434.933C122.732 447.533 133.466 457.8 146.532 456.867L314.066 447.533C328.532 447.067 338.799 435.867 338.332 421.4L319.666 43.8667C319.199 30.3334 307.999 20.0667 294.466 20.5334L272.532 21.4667C269.732 21.4667 267.399 23.8 267.399 26.6C267.399 33.6 263.199 40.1334 255.266 40.6L167.532 46.2C161.466 46.2 155.399 41.0667 154.932 35.4667C154.932 31.7334 153.066 28.4667 149.332 28.9334L126.932 30.3334C114.332 30.8 103.132 42 103.599 56L115.732 322.933"
              stroke="#966DFA"
              strokeWidth="7"
              strokeMiterlimit="10"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M224 465.734C245.467 486.267 279.067 513.8 310.8 526.4C329.467 533.867 338.8 533.4 349.533 537.134C364.467 542.267 375.667 550.2 386.867 560"
              stroke="#966DFA"
              strokeWidth="7"
              strokeMiterlimit="10"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M338.801 138.134L334.601 160.067C334.601 176.867 336.934 191.334 341.134 200.667C347.201 214.2 359.334 240.8 360.268 278.134L359.334 290.734"
              stroke="#966DFA"
              strokeWidth="7"
              strokeMiterlimit="10"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M363.067 220.734C359.333 221.667 353.267 220.734 350 217.467"
              stroke="#966DFA"
              strokeWidth="7"
              strokeMiterlimit="10"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M345.333 262.266L358.4 273"
              stroke="#966DFA"
              strokeWidth="7"
              strokeMiterlimit="10"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M95.2 167.534C82.6 163.334 66.2666 162.867 56.9333 172.667C49.4666 181.067 49.4666 191.334 57.8666 202.067C67.2 213.267 82.6 219.334 97.0666 226.8"
              stroke="#966DFA"
              strokeWidth="7"
              strokeMiterlimit="10"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M97.0676 234.734C78.4009 234.734 56.9342 253.4 61.6009 273.934C63.9342 283.267 73.2676 293.534 77.4676 299.134C69.0676 307.067 61.1342 318.734 63.9342 331.8C66.2676 343.467 78.4009 351.867 90.0676 359.8C70.4676 369.134 68.1342 393.4 82.6009 406.467C91.9342 414.867 99.4009 418.134 106.401 419.534"
              stroke="#966DFA"
              strokeWidth="7"
              strokeMiterlimit="10"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M97.0673 247.333C102.201 253.4 113.401 262.733 113.401 278.133C113.401 294.933 100.334 308 85.8673 303.8C80.7339 302.867 77.4673 299.133 77.4673 299.133"
              stroke="#966DFA"
              strokeWidth="7"
              strokeMiterlimit="10"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M98.0005 303.801C105.467 313.134 120.867 322.467 119.934 339.267C119 356.067 102.2 366.334 89.1338 358.867"
              stroke="#966DFA"
              strokeWidth="7"
              strokeMiterlimit="10"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M100.333 412.067C118.999 413.934 129.266 390.134 119.933 375.667C114.799 367.267 101.266 359.801 90.0659 362.134"
              stroke="#966DFA"
              strokeWidth="7"
              strokeMiterlimit="10"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M83.5341 292.133C84.4674 278.133 94.2674 268.8 96.6007 266C97.0674 264.6 86.8007 256.2 77.4674 263.667C66.2674 273 77.4674 287.467 83.5341 292.133Z"
              stroke="#966DFA"
              strokeWidth="4.01847"
              strokeMiterlimit="10"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M93.8002 348.6C95.2002 334.133 104.534 329 107.334 326.667C109.667 324.8 91.0002 313.133 82.6003 323.867C76.5336 334.133 86.8002 345.333 93.8002 348.6Z"
              stroke="#966DFA"
              strokeWidth="4.1412"
              strokeMiterlimit="10"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M99.4005 399.467C98.0005 387.8 103.134 380.8 107.8 376.6C105.467 373.333 91.9338 370.533 87.2671 380.8C84.4671 390.133 93.8005 397.6 99.4005 399.467Z"
              stroke="#966DFA"
              strokeWidth="4.06607"
              strokeMiterlimit="10"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M338.333 140C342.067 119.466 359.334 110.133 368.2 113.866C376.6 116.2 380.8 141.4 381.734 149.333C382.667 154.466 382.667 157.733 384.534 161C391.067 175.466 403.2 186.666 409.267 207.666C420.467 249.2 437.267 263.666 442.4 286.533C445.667 299.133 445.667 314.533 447.533 325.733C455.933 373.333 455.933 386.866 462.933 403.666C470.4 421.4 484.867 434 508.2 450.8"
              stroke="#966DFA"
              strokeWidth="7"
              strokeMiterlimit="10"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M382.666 160.067C378.466 161 370.999 160.067 368.199 154.467C363.066 139.067 358.399 124.6 370.999 118.067"
              stroke="#966DFA"
              strokeWidth="4.01847"
              strokeMiterlimit="10"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M197.399 31.2668L224.466 29.4001"
              stroke="#966DFA"
              strokeWidth="3.80473"
              strokeMiterlimit="10"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M236.133 25.2004C233.8 25.2004 232.4 27.5338 232.867 29.8671C233.8 33.6004 240.333 33.1338 240.333 29.4004C240.333 27.0671 238.467 24.7338 236.133 25.2004Z"
              fill="#966DFA"
            />
            <path
              d="M117.601 350L118.534 372.4"
              stroke="#966DFA"
              strokeWidth="4.06747"
              strokeMiterlimit="10"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M108.732 358.866L117.599 364.466"
              stroke="#966DFA"
              strokeWidth="4.24947"
              strokeMiterlimit="10"
              strokeLinecap="round"
              strokeLinejoin="round"
            />

            {/* LOGO SWAP CONTAINER */}
            <g id="logo-swap-group" transform="rotate(-3 215 242)">
              {/* 1VS1 QUIZ Logo */}
              <g ref={logoQuizRef} id="logo-quiz" transform="translate(-11, 0)">
                <path
                  className="text-path"
                  d="M156.8 177.8L167.534 176.866C168.934 176.866 168.934 177.8 168.934 178.733L171.734 237.066C171.734 238.466 170.8 238.466 169.867 238.466L160.534 239.4C159.6 239.4 159.134 238.466 159.134 238L158.2 193.2L154.467 199.733C154 200.666 153.067 200.666 152.134 199.733L144.667 198.333C143.734 198.333 142.8 197.4 143.734 196.466L152.134 179.666C153.067 177.8 154.467 177.8 156.8 177.8Z"
                  fill="#966DFA"
                  stroke="#966DFA"
                  strokeWidth="1.16667"
                  strokeMiterlimit="10"
                />
                <path
                  className="text-path"
                  d="M213.266 175.467C215.6 175.467 216.533 175.467 215.6 177.8C213.266 193.2 207.2 230.534 204.866 237.067C201.6 237.534 196.466 238 194.133 237.067C189.466 230.534 182 198.334 179.2 179.667C179.2 176.867 180.133 176.867 182 176.867L189.466 176.4C190.4 176.4 191.8 176.4 191.8 178.734C193.666 194.134 196.466 215.134 198.8 219.334L203.933 177.8C203.933 175.467 205.8 175.467 207.2 175.467H213.266Z"
                  fill="#966DFA"
                  stroke="#966DFA"
                  strokeWidth="1.16667"
                  strokeMiterlimit="10"
                />
                <path
                  className="text-path"
                  d="M222.601 218.867C222.601 217.934 222.601 217.934 224.001 217.934L234.268 217.467C237.068 223.533 242.201 224.467 245.468 222.133C249.668 219.333 248.734 210 238.468 209.067C217.468 207.2 219.801 180.6 235.201 174.534C243.601 172.2 259.001 172.667 258.068 189.934C258.068 191.334 257.134 192.267 255.734 192.267L248.734 192.733C247.801 192.733 247.801 192.734 247.334 191.334C245.468 184.8 236.134 183.867 235.201 189.934C233.334 195.534 238.468 197.4 242.668 197.867C263.201 200.667 264.134 226.334 249.668 232.867C239.401 236.6 224.001 233.8 222.601 218.867Z"
                  fill="#966DFA"
                  stroke="#966DFA"
                  strokeWidth="1.16667"
                  strokeMiterlimit="10"
                />
                <path
                  className="text-path"
                  d="M276.733 170.333L286.999 169.866C288.866 169.866 289.333 169.866 289.333 171.733L292.133 230.533C292.133 231.466 291.199 231.466 290.266 231.466L281.866 231.933C279.999 231.933 279.999 231.466 279.999 230.533L279.066 183.866L275.799 191.333C271.599 191.333 265.533 189.933 265.066 189L272.533 172.666C273.466 170.333 274.866 170.333 276.733 170.333Z"
                  fill="#966DFA"
                  stroke="#966DFA"
                  strokeWidth="1.16667"
                  strokeMiterlimit="10"
                />
                <path
                  className="text-path"
                  d="M185.733 312.2H181.999V311.267L180.133 308.934C177.799 311.267 174.999 311.267 170.799 311.267C156.333 311.267 152.133 301.934 151.199 286.534C150.266 264.6 147.933 252.467 168.466 252.467C185.266 252.467 187.599 263.667 188.066 279.067C188.533 291.667 188.533 297.734 186.199 302.867L188.533 307.067L182.466 312.2H185.733ZM178.266 296.8C179.199 293.534 178.266 284.667 177.799 274.867C177.333 267.867 174.999 263.667 169.866 263.667C164.733 263.667 160.533 266.934 161.466 274.867C161.466 281.4 161.466 287.467 162.399 294C163.333 302.867 168.466 304.267 172.666 302.867L168.933 297.734L174.066 292.6L178.266 296.8Z"
                  fill="#966DFA"
                  stroke="#966DFA"
                  strokeWidth="1.16667"
                  strokeMiterlimit="10"
                />
                <path
                  className="text-path"
                  d="M230.999 252.466C231.933 264.6 231.933 278.133 231.933 294C231.933 306.133 224.933 309.4 215.133 309.4C203.933 309.866 196.933 305.2 196.933 294.933C196.933 280 196.466 266 195.533 254.333C195.533 253.4 195.533 252.466 196.933 252.466L204.866 252C206.266 252 206.266 252 206.266 253.4C206.266 264.6 207.199 283.266 208.133 290.733C209.066 296.8 212.333 299.133 216.533 297.733C220.733 296.8 221.666 293.533 220.733 284.666L219.333 253.4C219.333 252.466 219.799 252 220.733 252L229.133 251.533C230.999 251.533 230.999 252 230.999 252.466Z"
                  fill="#966DFA"
                  stroke="#966DFA"
                  strokeWidth="1.16667"
                  strokeMiterlimit="10"
                />
                <path
                  className="text-path"
                  d="M239.399 250.133C239.399 249.2 239.399 248.733 241.266 248.733L251.532 248.266C252.466 248.266 252.466 249.2 252.466 250.133L254.799 306.133C254.799 307.066 254.799 307.066 252.932 307.066L242.666 308C242.199 308 241.266 308 241.266 306.133C242.199 302.866 239.399 261.8 239.399 250.133Z"
                  fill="#966DFA"
                  stroke="#966DFA"
                  strokeWidth="1.16667"
                  strokeMiterlimit="10"
                />
                <path
                  className="text-path"
                  d="M260.399 249.667C260.399 248.733 260.399 248.267 262.266 248.267L292.132 246.4C293.066 246.4 293.066 246.4 293.066 247.333L293.999 258.533C293.999 259.467 275.799 289.8 274.866 293.533L294.466 291.667C295.399 291.667 296.332 291.667 296.332 292.6L296.799 303.333C296.799 304.267 296.799 304.267 295.399 304.267L265.066 305.667C264.132 305.667 263.199 305.667 263.199 305.2L262.732 292.6C262.732 289.8 279.066 264.6 282.799 258.533L269.266 259L262.266 259.933C260.399 259.933 260.399 259.933 260.399 258.533V249.667Z"
                  fill="#966DFA"
                  stroke="#966DFA"
                  strokeWidth="1.16667"
                  strokeMiterlimit="10"
                />
              </g>

              {/* WIN Logo (Smaller size 0.75 and dynamically centered based on bounds) */}
              <g
                ref={logoWinRef}
                id="logo-win"
                style={{ opacity: 0, pointerEvents: "none" }}
                transform="translate(130, 211) scale(0.75)"
              >
                {/* Bold W */}
                <path
                  className="win-path"
                  d="M0 0 L25 80 L50 20 L75 80 L100 0 L85 0 L65 55 L50 10 L35 55 L15 0 Z"
                  fill="#966DFA"
                  stroke="#966DFA"
                  strokeWidth="1.16667"
                />
                {/* Bold I */}
                <path
                  className="win-path"
                  d="M115 0 L135 0 L135 80 L115 80 Z"
                  fill="#966DFA"
                  stroke="#966DFA"
                  strokeWidth="1.16667"
                />
                {/* Bold N */}
                <path
                  className="win-path"
                  d="M150 80 L150 0 L170 0 L195 55 L195 0 L210 0 L210 80 L195 80 L165 25 L165 80 Z"
                  fill="#966DFA"
                  stroke="#966DFA"
                  strokeWidth="1.16667"
                />

                {/* Victory Sparkles */}
                <path
                  className="victory-spark"
                  d="M50 -30 L53 -18 L65 -18 L55 -10 L58 2 L50 -7 L42 2 L45 -10 L35 -18 L47 -18 Z"
                />
                <path
                  className="victory-spark"
                  d="M170 -20 L172 -12 L178 -12 L173 -8 L174 0 L170 -5 L166 0 L167 -8 L162 -12 L168 -12 Z"
                />
              </g>
            </g>
          </svg>
        </div>
      </div>
    </div>
  );
}
