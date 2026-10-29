import { useState, useEffect } from 'react';
import { flushSync } from 'react-dom';

export function prefersReducedMotion() {
  return (
    typeof window !== 'undefined' &&
    window.matchMedia?.('(prefers-reduced-motion: reduce)').matches
  );
}

/**
 * Same-Document View Transition wrapper with mandatory programmatic focus routing.
 */
export function runViewTransition(updateFn, focusSelector) {
  const routeFocus = () => {
    if (!focusSelector || typeof document === 'undefined') return;
    requestAnimationFrame(() => {
      const target = document.querySelector(focusSelector);
      if (target instanceof HTMLElement) {
        target.focus({ preventScroll: true });
      }
    });
  };

  if (
    typeof document === 'undefined' ||
    !document.startViewTransition ||
    prefersReducedMotion()
  ) {
    updateFn();
    routeFocus();
    return;
  }

  try {
    const transition = document.startViewTransition(() => {
      flushSync(() => {
        updateFn();
      });
    });
    transition.finished.finally(routeFocus);
  } catch {
    updateFn();
    routeFocus();
  }
}

/**
 * Reliable probe for discrete display transitions (catches Firefox bug 1882408).
 */
let supportsDisplayTransition;
export function canTransitionDisplay() {
  if (supportsDisplayTransition !== undefined) return supportsDisplayTransition;
  if (
    typeof window === 'undefined' ||
    !window.CSS?.supports?.('transition-behavior', 'allow-discrete') ||
    !document.body
  ) {
    return false;
  }
  const probe = document.createElement('div');
  probe.style.cssText = 'transition: display 1s allow-discrete !important; display: block;';
  document.body.appendChild(probe);
  getComputedStyle(probe).display;
  probe.style.display = 'none';
  supportsDisplayTransition = getComputedStyle(probe).display === 'block';
  probe.remove();
  return supportsDisplayTransition;
}

export function supportsTopLayerExit() {
  return (
    typeof window !== 'undefined' &&
    Boolean(window.CSS?.supports?.('overlay', 'auto')) &&
    canTransitionDisplay()
  );
}

/**
 * Smoothly closes a top-layer <dialog> across browsers with or without native overlay transitions.
 */
export async function closeTopLayer(dialog) {
  if (!dialog || !dialog.open) return;

  if (!supportsTopLayerExit() && !prefersReducedMotion()) {
    dialog.setAttribute('data-closing', '');
    const animations = dialog.getAnimations({ subtree: true });
    if (animations.length > 0) {
      await Promise.race([
        Promise.allSettled(animations.map((a) => a.finished)),
        new Promise((r) => setTimeout(r, 400))
      ]);
    }
    if (!dialog.hasAttribute('data-closing')) return;
    dialog.removeAttribute('data-closing');
  }

  if (dialog.open) {
    dialog.close();
  }
}

/**
 * Zero-dependency Web Audio API synthesizer for subtle tactical terminal feedback.
 */
let audioCtx = null;

function getAudioContext() {
  if (typeof window === 'undefined') return null;
  if (!audioCtx) {
    const Ctx = window.AudioContext || window.webkitAudioContext;
    if (Ctx) audioCtx = new Ctx();
  }
  if (audioCtx?.state === 'suspended') {
    audioCtx.resume().catch(() => {});
  }
  return audioCtx;
}

export function playHackerSfx(type = 'tick', enabled = false) {
  if (!enabled) return;
  try {
    const ctx = getAudioContext();
    if (!ctx) return;
    const now = ctx.currentTime;

    const tone = (freq, startOffset, duration, gainVal = 0.045, wave = 'triangle') => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = wave;
      osc.frequency.setValueAtTime(freq, now + startOffset);
      gain.gain.setValueAtTime(0.0001, now + startOffset);
      gain.gain.exponentialRampToValueAtTime(gainVal, now + startOffset + 0.01);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + startOffset + duration);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now + startOffset);
      osc.stop(now + startOffset + duration + 0.015);
    };

    if (type === 'tick') {
      tone(980, 0, 0.028, 0.03, 'square');
    } else if (type === 'lock') {
      tone(520, 0, 0.06, 0.045, 'triangle');
      tone(880, 0.065, 0.11, 0.05, 'triangle');
    } else if (type === 'boot') {
      tone(330, 0, 0.08, 0.04, 'triangle');
      tone(495, 0.07, 0.09, 0.045, 'triangle');
      tone(660, 0.15, 0.16, 0.05, 'sine');
    } else if (type === 'success') {
      tone(523.25, 0, 0.08, 0.05, 'triangle');
      tone(659.25, 0.07, 0.08, 0.05, 'triangle');
      tone(783.99, 0.14, 0.18, 0.055, 'sine');
    } else if (type === 'error') {
      tone(210, 0, 0.09, 0.045, 'sawtooth');
      tone(155, 0.09, 0.14, 0.045, 'sawtooth');
    } else if (type === 'scan') {
      tone(440, 0, 0.05, 0.035, 'sine');
      tone(740, 0.045, 0.08, 0.035, 'sine');
    }
  } catch {
    // Ignore audio context restrictions
  }
}

/**
 * Scrambles text through terminal cipher glyphs before locking onto targetText.
 */
const CIPHER_GLYPHS = '01/#<>[]_█▓▒░+=*';

export function useCipherScramble(targetText, triggerKey = 0) {
  const [display, setDisplay] = useState(targetText);

  useEffect(() => {
    if (!targetText || prefersReducedMotion()) {
      setDisplay(targetText);
      return;
    }

    let frame = 0;
    const totalFrames = 9;
    const interval = setInterval(() => {
      frame += 1;
      if (frame >= totalFrames) {
        setDisplay(targetText);
        clearInterval(interval);
        return;
      }
      const revealCount = Math.floor((frame / totalFrames) * targetText.length);
      const next = targetText
        .split('')
        .map((ch, idx) => {
          if (ch === ' ') return ' ';
          if (idx < revealCount) return ch;
          return CIPHER_GLYPHS[(idx + frame * 3) % CIPHER_GLYPHS.length];
        })
        .join('');
      setDisplay(next);
    }, 28);

    return () => clearInterval(interval);
  }, [targetText, triggerKey]);

  return display;
}

/**
 * Smoothly rolls a numeric score up from 0 to targetValue.
 */
export function useCountUp(targetValue, active = true, durationMs = 620) {
  const [value, setValue] = useState(() => (prefersReducedMotion() ? targetValue : 0));

  useEffect(() => {
    if (!active) {
      setValue(0);
      return;
    }
    if (prefersReducedMotion()) {
      setValue(targetValue);
      return;
    }

    let rafId = 0;
    const start = performance.now();
    const step = (now) => {
      const elapsed = Math.min(1, (now - start) / durationMs);
      const eased = 1 - Math.pow(1 - elapsed, 3);
      setValue(Math.round(targetValue * eased));
      if (elapsed < 1) {
        rafId = requestAnimationFrame(step);
      }
    };
    rafId = requestAnimationFrame(step);
    return () => cancelAnimationFrame(rafId);
  }, [targetValue, active, durationMs]);

  return value;
}
