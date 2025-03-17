import { gsap } from 'gsap';

// Entrance animations
export const fadeIn = (element, delay = 0, duration = 0.6) => {
  return gsap.fromTo(
    element,
    { 
      opacity: 0,
      y: 20
    },
    { 
      opacity: 1,
      y: 0,
      duration,
      delay,
      ease: "power2.out"
    }
  );
};

export const scaleIn = (element, delay = 0, duration = 0.5) => {
  return gsap.fromTo(
    element,
    { 
      scale: 0.8,
      opacity: 0
    },
    { 
      scale: 1,
      opacity: 1,
      duration,
      delay,
      ease: "back.out(1.7)"
    }
  );
};

export const slideInLeft = (element, delay = 0, duration = 0.6) => {
  return gsap.fromTo(
    element,
    { 
      x: -50,
      opacity: 0
    },
    { 
      x: 0,
      opacity: 1,
      duration,
      delay,
      ease: "power2.out"
    }
  );
};

export const slideInRight = (element, delay = 0, duration = 0.6) => {
  return gsap.fromTo(
    element,
    { 
      x: 50,
      opacity: 0
    },
    { 
      x: 0,
      opacity: 1,
      duration,
      delay,
      ease: "power2.out"
    }
  );
};

// Interactive animations
export const pulseAnimation = (element, scale = 1.05, duration = 0.3) => {
  return gsap.to(element, {
    scale,
    duration,
    repeat: 1,
    yoyo: true,
    ease: "power1.inOut"
  });
};

export const buttonClickAnimation = (element) => {
  return gsap.to(element, {
    scale: 0.95,
    duration: 0.1,
    onComplete: () => {
      gsap.to(element, {
        scale: 1,
        duration: 0.1
      });
    }
  });
};

// Staggered animations
export const staggeredFadeIn = (elements, staggerAmount = 0.1, delay = 0, duration = 0.4) => {
  return gsap.fromTo(
    elements,
    { 
      y: 20, 
      opacity: 0 
    },
    { 
      y: 0, 
      opacity: 1, 
      stagger: staggerAmount, 
      duration, 
      delay,
      ease: "power1.out"
    }
  );
};

// Page transition animations
export const pageTransitionIn = (container) => {
  const elements = container.querySelectorAll('.animate-item');
  
  gsap.fromTo(
    container,
    { opacity: 0 },
    { opacity: 1, duration: 0.3 }
  );
  
  if (elements.length > 0) {
    gsap.fromTo(
      elements,
      { y: 30, opacity: 0 },
      { y: 0, opacity: 1, stagger: 0.1, duration: 0.5, delay: 0.2 }
    );
  }
};

// Modal animations
export const modalOpenAnimation = (modalContainer, modalContent) => {
  gsap.fromTo(
    modalContainer,
    { opacity: 0 },
    { opacity: 1, duration: 0.3 }
  );
  
  gsap.fromTo(
    modalContent,
    { 
      y: 30, 
      opacity: 0,
      scale: 0.9
    },
    { 
      y: 0, 
      opacity: 1,
      scale: 1,
      duration: 0.4,
      ease: "back.out(1.2)"
    }
  );
};

export const modalCloseAnimation = (modalContainer, modalContent, onComplete) => {
  const tl = gsap.timeline({
    onComplete
  });
  
  tl.to(modalContent, { 
    y: 20, 
    opacity: 0,
    scale: 0.9,
    duration: 0.3
  });
  
  tl.to(modalContainer, { 
    opacity: 0, 
    duration: 0.2 
  }, "-=0.1");
  
  return tl;
}; 