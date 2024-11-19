'use client';

import { useEffect, useState } from 'react';

declare global {
  interface Window {
    particlesJS: any;
  }
}

export default function ParticlesBackground() {
  const [isScriptLoaded, setIsScriptLoaded] = useState(false);

  useEffect(() => {
    const checkScriptLoaded = () => {
      if (typeof window.particlesJS !== 'undefined') {
        setIsScriptLoaded(true);
      } else {
        setTimeout(checkScriptLoaded, 100);
      }
    };
    checkScriptLoaded();
  }, []);

  useEffect(() => {
    if (isScriptLoaded) {
      window.particlesJS('particles-js', {
        particles: {
          number: {
            value: 80,
            density: {
              enable: true,
              value_area: 800
            }
          },
          color: {
            value: '#ffffff'
          },
          shape: {
            type: 'circle'
          },
          opacity: {
            value: 0.3,
            random: true,
            anim: {
              enable: false,
              speed: 1,
              opacity_min: 0.1,
              sync: false
            }
          },
          size: {
            value: 3,
            random: true,
            anim: {
              enable: false,
              speed: 40,
              size_min: 0.1,
              sync: false
            }
          },
          line_linked: {
            enable: true,
            distance: 150,
            color: '#3B82F6',
            opacity: 0.2,
            width: 1
          },
          move: {
            enable: true,
            speed: 2,
            direction: 'none',
            random: false,
            straight: false,
            out_mode: 'out',
            bounce: false,
            attract: {
              enable: false,
              rotateX: 600,
              rotateY: 1200
            }
          }
        },
        interactivity: {
          detect_on: 'canvas',
          events: {
            onhover: {
              enable: true,
              mode: 'grab'
            },
            onclick: {
              enable: true,
              mode: 'push'
            },
            resize: true
          },
          modes: {
            grab: {
              distance: 140,
              line_linked: {
                opacity: 0.5
              }
            },
            push: {
              particles_nb: 4
            }
          }
        },
        retina_detect: true
      });
    }
  }, [isScriptLoaded]);

  return (
    <>
      <div id="particles-js" className="absolute inset-0 -z-10"></div>
      {/* Animated Background Elements */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full border-2 border-blue-500 radar-ring"></div>
        <div className="absolute bottom-1/4 right-1/4 w-64 h-64 rounded-full border-2 border-green-500 radar-ring" style={{ animationDelay: '-1.5s' }}></div>
        <div className="absolute top-1/3 right-1/3 w-48 h-48 rounded-full border-2 border-purple-500 radar-ring" style={{ animationDelay: '-0.75s' }}></div>
      </div>
    </>
  );
}
