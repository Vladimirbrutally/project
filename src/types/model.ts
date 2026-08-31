import type { BufferGeometry } from "three";

export interface ModelDimensions {
  x: number;
  y: number;
  z: number;
}

export interface ModelAnalysis {
  fileName: string;
  fileSize: number;
  geometry: BufferGeometry;
  dimensions: ModelDimensions;
  volumeCm3: number;
  triangleCount: number;
  tooLarge: boolean;
}
