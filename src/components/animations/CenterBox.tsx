"use client";

import React from "react";

interface CenterBoxProps {
  revealed: boolean;
}

export function CenterBox({ revealed }: CenterBoxProps) {
  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: `
        .center-box {
            position: absolute;
            left: 50%;
            top: 450px;
            transform: translate(-50%, -50%) scale(0.8);
            background: white; 
            border: 2px solid var(--brand-color, #4f46e5); 
            border-radius: 16px; 
            padding: 16px 32px;
            min-width: fit-content;
            z-index: 20;
            box-shadow: 0 12px 30px rgba(130, 54, 253, 0.1); 
            display: flex;
            align-items: center;
            justify-content: center;
            transition: all 0.4s ease, opacity 0.6s ease, transform 0.6s cubic-bezier(0.23, 1, 0.32, 1);
            cursor: default;
            white-space: nowrap;
            opacity: 0;
        }

        .center-box.revealed {
            opacity: 1;
            transform: translate(-50%, -50%) scale(1);
        }

        .center-box span {
            color: var(--brand-color, #4f46e5); 
            font-size: 2rem;
            font-weight: 600;
            line-height: 1.1;
            margin: 0;
            font-family: var(--font-body);
            letter-spacing: -0.02em;
        }

        /* Subtle idle hover effect for the box */
        .center-box.revealed:hover {
            transform: translate(-50%, -55%) scale(1.05);
            box-shadow: 0 18px 45px rgba(130, 54, 253, 0.2);
            background: rgba(130, 54, 253, 0.02); 
        }
      `}} />
      <div
        id="center-box"
        className={`center-box reveal active-pulse ${revealed ? "revealed" : ""}`}
        style={{ transitionDelay: "0.3s" }}
      >
        <span>Aspirant Adda</span>
      </div>
    </>
  );
}
