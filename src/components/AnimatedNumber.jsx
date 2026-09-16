import { useEffect, useRef } from 'react';
import { animate, useReducedMotion } from 'framer-motion';

export default function AnimatedNumber({ value, format, active }) {
  const textRef = useRef(null);
  const previous = useRef(0);
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    if (!active || reduceMotion) {
      if (textRef.current) textRef.current.textContent = format(value);
      previous.current = active ? value : 0;
      return;
    }
    const controls = animate(previous.current, value, {
      duration: 0.65,
      ease: [0.22, 1, 0.36, 1],
      onUpdate(latest) {
        previous.current = latest;
        if (textRef.current) textRef.current.textContent = format(latest);
      },
    });
    return () => controls.stop();
  }, [value, format, active, reduceMotion]);

  return (
    <>
      <span ref={textRef} aria-hidden="true">{format(value)}</span>
      <span className="srOnly">{format(value)}</span>
    </>
  );
}
