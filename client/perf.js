import { useEffect } from 'react';

const enabled =
    typeof window !== 'undefined' && new URLSearchParams(window.location.search).has('perf');

const counts = {};

if (enabled) {
    window.renderCounts = () => {
        console.table(counts);
    };
    window.resetRenderCounts = () => {
        Object.keys(counts).forEach((key) => delete counts[key]);
    };
}

export const useRenderCount = enabled
    ? (name) => {
          useEffect(() => {
              counts[name] = (counts[name] || 0) + 1;
          });
      }
    : () => {};
