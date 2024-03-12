import { useEffect, useRef, useState } from "react";

// custom hooks to track if element or component is visible on screen
export const useOnScreen = (ref: any) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      setIsVisible(entry.isIntersecting);
    });

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => {
      observer.disconnect();
    };
  }, [ref]);

  return isVisible;
};
