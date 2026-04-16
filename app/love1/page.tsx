"use client";

import { useEffect, useRef } from "react";
import mojs from "@mojs/core";

export default function LovePage() {
  const containerRef = useRef<HTMLDivElement>(null);
  const soundRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const qs = (s: string) => containerRef.current!.querySelector(s) as HTMLElement;

    const easingHeart = mojs.easing.path(
      "M0,100C2.9,86.7,33.6-7.3,46-7.3s15.2,22.7,26,22.7S89,0,100,0"
    );

    const el = {
      container: qs(".mo-container"),

      i: qs(".lttr--I"),
      l: qs(".lttr--L"),
      o: qs(".lttr--O"),
      v: qs(".lttr--V"),
      e: qs(".lttr--E"),
      y: qs(".lttr--Y"),
      o2: qs(".lttr--O2"),
      u: qs(".lttr--U"),

      lineLeft: qs(".line--left"),
      lineRight: qs(".line--rght"),

      colTxt: "#763c8c",
      colHeart: "#fa4843",
    };

    class Heart extends mojs.CustomShape {
      getShape() {
        return `<path d="M50,88.9C25.5,78.2,0.5,54.4,3.8,31.1S41.3,1.8,50,29.9c8.7-28.2,42.8-22.2,46.2,1.2S74.5,78.2,50,88.9z"/>`;
      }
      getLength() {
        return 200;
      }
    }

    mojs.addShape("heart", Heart);

    const crtBoom = (delay = 0, x = 0, rd = 46) => {
      const parent = el.container;

      const crcl = new mojs.Shape({
        shape: "circle",
        fill: "none",
        stroke: el.colTxt,
        strokeWidth: { 5: 0 },
        radius: { [rd]: [rd + 20] },
        easing: "quint.out",
        duration: 300,
        parent,
        delay,
        x,
      });

      const brst = new mojs.Burst({
        radius: { [rd + 15]: 110 },
        angle: "rand(60, 180)",
        count: 3,
        timeline: { delay },
        parent,
        x,
        children: {
          radius: [5, 3, 7],
          fill: el.colTxt,
          scale: { 1: 0 },
          duration: 300,
        },
      });

      return [crcl, brst];
    };

    const timeline = new mojs.Timeline();

    timeline.add([
      new mojs.Html({
        el: el.lineLeft,
        x: { 0: 150 },
        duration: 1000,
      }),
      new mojs.Html({
        el: el.lineRight,
        x: { 0: -150 },
        duration: 1000,
      }),

      new mojs.Shape({
        parent: el.container,
        shape: "heart",
        fill: el.colHeart,
        scale: { 0: 1 },
        duration: 800,
        easing: easingHeart,
      }),

      ...crtBoom(500, 0),
      ...crtBoom(1000, 50),
    ]);

    timeline.play();
    const interval = setInterval(() => timeline.replay(), 4000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="love-wrapper">
      <div ref={containerRef} className="container">
        <svg
          className="svg-container"
          viewBox="0 0 500 200"
        >
          <line className="line line--left" x1="10" y1="17" x2="10" y2="183" />
          <line className="line line--rght" x1="490" y1="17" x2="490" y2="183" />

          <g>
            <path className="lttr lttr--I" d="M42.2,73.9h11.4v52.1H42.2Z" />
            <path className="lttr lttr--L" d="M85.1,73.9h11.4v42.1h22.8v10H85.1Z" />
            <path className="lttr lttr--O" d="M123.9,100c0-15.2,11.7-26.9,27.2-26.9s27.2,11.7,27.2,26.9s-11.7,26.9-27.2,26.9S123.9,115.2,123.9,100z" />
            <path className="lttr lttr--V" d="M180.7,73.9H193l8.4,22.9 8.6-22.8h11.7l-19.9,52.1h-11.5Z" />
            <path className="lttr lttr--E" d="M239.1,73.9h32.2v10h-20.7v10.2h17.9v9.5h-17.9v12.4H272v10h-33Z" />
            <path className="lttr lttr--Y" d="M315.8,102.5l-20.1-28.6H309l6.3,9.4 6.3-9.6 6.3-9.4h12.9l-19.9,28.5v23.6h-11.4Z" />
            <path className="lttr lttr--O2" d="M348.8,100c0-15.2,11.7-26.9,27.2-26.9c15.5,0,27.2,11.7,27.2,26.9s-11.7,26.9-27.2,26.9C360.5,126.9,348.8,115.2,348.8,100z" />
            <path className="lttr lttr--U" d="M412.4,101.1V73.9h11.4v26.7c0,10.9,2.4,15.9,11.5,15.9c8.4,0,11.4-4.6,11.4-15.8V73.9h11v26.9c0,7.8-1.1,13.5-4,17.7c-3.7,5.3-10.4,8.4-18.7,8.4c-8.4,0-15.1-3.1-18.8-8.5C413.4,114.2,412.4,108.5,412.4,101.1z" />
          </g>
        </svg>

        <div className="mo-container" />
      </div>

      {/* STYLE */}
      <style jsx>{`
        .love-wrapper {
          min-height: 100vh;
          display: flex;
          justify-content: center;
          align-items: center;
          background: #ffc568;
        }

        .container {
          width: 500px;
          height: 200px;
          position: relative;
        }

        .svg-container {
          position: absolute;
          z-index: 2;
        }

        .mo-container {
          width: 100%;
          height: 100%;
        }

        .line {
          stroke: white;
          stroke-width: 8;
          stroke-linecap: round;
        }

        .lttr {
          fill: #763c8c;
        }
      `}</style>
    </div>
  );
}