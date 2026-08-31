import { Vector3, type BufferGeometry } from "three";

export function calculateMeshVolume(geometry: BufferGeometry): number {
  const position = geometry.getAttribute("position");

  if (!position || position.count < 3) {
    return 0;
  }

  const index = geometry.getIndex();
  let volumeMm3 = 0;
  const v1 = new Vector3();
  const v2 = new Vector3();
  const v3 = new Vector3();

  const addTriangle = (a: number, b: number, c: number) => {
    v1.fromBufferAttribute(position, a);
    v2.fromBufferAttribute(position, b);
    v3.fromBufferAttribute(position, c);
    // Signed tetrahedron volume from the mesh triangle and origin.
    volumeMm3 += v1.dot(v2.clone().cross(v3)) / 6;
  };

  if (index) {
    for (let i = 0; i < index.count; i += 3) {
      addTriangle(index.getX(i), index.getX(i + 1), index.getX(i + 2));
    }
  } else {
    for (let i = 0; i < position.count; i += 3) {
      addTriangle(i, i + 1, i + 2);
    }
  }

  return Math.abs(volumeMm3) / 1000;
}
