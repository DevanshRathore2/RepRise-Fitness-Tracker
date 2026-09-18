"use client";

import React, { useState, useRef } from "react";
import { motion, useAnimate, type AnimationOptions } from "motion/react";

export interface RandomLetterSwapProps {
  label: string;
  reverse?: boolean;
  transition?: AnimationOptions;
  staggerDuration?: number;
  className?: string;
  onClick?: () => void;
}

function debounce<T extends (...args: any[]) => void>(
  func: T,
  wait: number,
  options: { leading?: boolean; trailing?: boolean } = { leading: true, trailing: true }
) {
  let timeout: NodeJS.Timeout | null = null;
  let lastArgs: any[] | null = null;

  return function (this: any, ...args: Parameters<T>) {
    const callNow = options.leading && !timeout;
    lastArgs = args;

    if (timeout) clearTimeout(timeout);

    timeout = setTimeout(() => {
      timeout = null;
      if (options.trailing !== false && !callNow && lastArgs) {
        func.apply(this, lastArgs as Parameters<T>);
      }
    }, wait);

    if (callNow) {
      func.apply(this, args);
    }
  };
}

export function RandomLetterSwap({
  label,
  reverse = true,
  transition = {
    type: "spring",
    duration: 0.6,
  },
  staggerDuration = 0.025,
  className = "",
  onClick,
  ...props
}: RandomLetterSwapProps) {
  const [scope, animate] = useAnimate();
  const [blocked, setBlocked] = useState(false);
  const blockedRef = useRef(blocked);
  blockedRef.current = blocked;

  const mergeTransition = (trans: AnimationOptions, i: number) => ({
    ...trans,
    delay: i * staggerDuration,
  });

  const letters = label.split("");

  const hoverStart = debounce(
    () => {
      if (blockedRef.current) return;
      setBlocked(true);

      const shuffledIndices = Array.from(
        { length: letters.length },
        (_, i) => i
      ).sort(() => Math.random() - 0.5);

      for (let i = 0; i < letters.length; i++) {
        const randomIndex = shuffledIndices[i];

        animate(
          `.letter-${randomIndex}`,
          {
            y: reverse ? "100%" : "-100%",
          },
          mergeTransition(transition, i)
        ).then(() => {
          animate(
            `.letter-${randomIndex}`,
            {
              y: 0,
            },
            {
              duration: 0,
            }
          );
        });

        animate(
          `.letter-secondary-${randomIndex}`,
          {
            top: "0%",
          },
          mergeTransition(transition, i)
        )
          .then(() => {
            animate(
              `.letter-secondary-${randomIndex}`,
              {
                top: reverse ? "-100%" : "100%",
              },
              {
                duration: 0,
              }
            );
          })
          .then(() => {
            if (i === letters.length - 1) {
              setBlocked(false);
            }
          });
      }
    },
    100,
    { leading: true, trailing: true }
  );

  return (
    <motion.span
      className={`inline-flex justify-center items-center relative overflow-hidden select-none ${className}`}
      onHoverStart={hoverStart}
      onClick={onClick}
      ref={scope}
      {...props}
    >
      <span className="sr-only">{label}</span>

      {letters.map((letter: string, i: number) => {
        return (
          <span
            className="whitespace-pre relative inline-flex"
            key={i}
            aria-hidden={true}
          >
            <motion.span
              className={`relative pb-1 letter-${i}`}
              style={{ top: 0 }}
            >
              {letter}
            </motion.span>
            <motion.span
              className={`absolute letter-secondary-${i}`}
              style={{ top: reverse ? "-100%" : "100%" }}
            >
              {letter}
            </motion.span>
          </span>
        );
      })}
    </motion.span>
  );
}

export default RandomLetterSwap;
