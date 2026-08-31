import { Box3, type BufferGeometry } from "three";
import { STLLoader } from "three/examples/jsm/loaders/STLLoader.js";
import { calculateMeshVolume } from "./calculateVolume";
import type { ModelAnalysis } from "../types/model";
import type { Printer } from "../types/printer";

export const maxStlFileSize = 100 * 1024 * 1024;

export function validateStlFile(file: File): string | null {
  const extension = file.name.split(".").pop()?.toLowerCase();

  if (extension !== "stl") {
    return "รองรับเฉพาะไฟล์ STL เท่านั้น";
  }

  if (file.size > maxStlFileSize) {
    return "ไฟล์มีขนาดเกิน 100 MB";
  }

  return null;
}

export async function parseStlFile(file: File, buildVolume: Printer): Promise<ModelAnalysis> {
  const validationError = validateStlFile(file);

  if (validationError) {
    throw new Error(validationError);
  }

  const buffer = await file.arrayBuffer();
  const loader = new STLLoader();
  const geometry = loader.parse(buffer);
  return analyzeGeometry(file.name, file.size, geometry, buildVolume);
}

export function analyzeGeometry(
  fileName: string,
  fileSize: number,
  geometry: BufferGeometry,
  buildVolume: Printer,
): ModelAnalysis {
  geometry.computeVertexNormals();
  geometry.computeBoundingBox();
  geometry.computeBoundingSphere();

  const boundingBox = geometry.boundingBox;

  if (!boundingBox) {
    throw new Error("Unable to read this STL file. Please verify that the file is valid.");
  }

  const size = new Box3(boundingBox.min.clone(), boundingBox.max.clone()).getSize(
    boundingBox.min.clone(),
  );
  const volumeCm3 = calculateMeshVolume(geometry);
  const position = geometry.getAttribute("position");
  const triangleCount = position ? Math.floor(position.count / 3) : 0;
  const invalidGeometry =
    triangleCount <= 0 ||
    !Number.isFinite(size.x) ||
    !Number.isFinite(size.y) ||
    !Number.isFinite(size.z) ||
    volumeCm3 <= 0;

  if (invalidGeometry) {
    throw new Error("Unable to read this STL file. Please verify that the file is valid.");
  }

  return {
    fileName,
    fileSize,
    geometry,
    dimensions: {
      x: size.x,
      y: size.y,
      z: size.z,
    },
    volumeCm3,
    triangleCount,
    tooLarge: size.x > buildVolume.x || size.y > buildVolume.y || size.z > buildVolume.z,
  };
}
