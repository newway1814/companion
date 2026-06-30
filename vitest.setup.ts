import "@testing-library/jest-dom/vitest";

import { expect, vi } from "vitest";
import * as axeMatchers from "vitest-axe/matchers";

expect.extend(axeMatchers);

// jsdom lacks IntersectionObserver, which framer-motion's `whileInView` uses.
// Stub it so motion-wrapped components render in tests.
if (!("IntersectionObserver" in globalThis)) {
  class MockIntersectionObserver {
    observe = vi.fn();
    unobserve = vi.fn();
    disconnect = vi.fn();
    takeRecords = vi.fn(() => []);
    root = null;
    rootMargin = "";
    thresholds = [];
  }
  vi.stubGlobal("IntersectionObserver", MockIntersectionObserver);
}
