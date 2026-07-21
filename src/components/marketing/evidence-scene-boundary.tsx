"use client";

import dynamic from "next/dynamic";
import * as React from "react";

const EvidenceScene = dynamic(
  () => import("./evidence-scene").then((module) => module.EvidenceScene),
  { ssr: false, loading: () => null },
);

type SceneErrorBoundaryState = { failed: boolean };

class SceneErrorBoundary extends React.Component<
  { children: React.ReactNode },
  SceneErrorBoundaryState
> {
  state: SceneErrorBoundaryState = { failed: false };

  static getDerivedStateFromError(): SceneErrorBoundaryState {
    return { failed: true };
  }

  render() {
    return this.state.failed ? null : this.props.children;
  }
}

function supportsEvidenceScene() {
  if (!window.matchMedia("(min-width: 768px)").matches) return false;
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return false;

  try {
    const canvas = document.createElement("canvas");
    return Boolean(canvas.getContext("webgl2"));
  } catch {
    return false;
  }
}

export function EvidenceSceneBoundary() {
  const [enabled, setEnabled] = React.useState(false);

  React.useEffect(() => {
    let active = true;
    queueMicrotask(() => {
      if (active) setEnabled(supportsEvidenceScene());
    });
    return () => {
      active = false;
    };
  }, []);

  if (!enabled) return null;

  return (
    <SceneErrorBoundary>
      <EvidenceScene />
    </SceneErrorBoundary>
  );
}
