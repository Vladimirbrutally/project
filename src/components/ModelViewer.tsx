import { Bounds, Center, Grid, OrbitControls, PerspectiveCamera } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import { Suspense, useMemo } from "react";
import { BufferGeometry, MeshStandardMaterial } from "three";

interface ModelViewerProps {
  geometry?: BufferGeometry;
  onResetCamera: () => void;
  cameraKey: number;
}

function ModelMesh({ geometry }: { geometry: BufferGeometry }) {
  const displayGeometry = useMemo(() => geometry.clone(), [geometry]);
  const material = useMemo(
    () =>
      new MeshStandardMaterial({
        color: "#1d8b80",
        roughness: 0.42,
        metalness: 0.06,
      }),
    [],
  );

  return <mesh geometry={displayGeometry} material={material} castShadow receiveShadow />;
}

export function ModelViewer({ geometry, onResetCamera, cameraKey }: ModelViewerProps) {
  return (
    <section className="viewer-panel">
      <div className="viewer-toolbar">
        <span>3D Model Preview</span>
        <button type="button" onClick={onResetCamera}>
          Reset Camera
        </button>
      </div>
      <div className="viewer-canvas">
        {geometry ? (
          <Canvas key={cameraKey} shadows dpr={[1, 2]} gl={{ preserveDrawingBuffer: true }}>
            <PerspectiveCamera makeDefault position={[120, 120, 120]} fov={45} />
            <ambientLight intensity={0.75} />
            <directionalLight position={[3, 6, 4]} intensity={1.7} castShadow />
            <Suspense fallback={null}>
              <Bounds fit clip observe margin={1.25}>
                <Center>
                  <ModelMesh geometry={geometry} />
                </Center>
              </Bounds>
            </Suspense>
            <Grid
              args={[320, 320]}
              cellSize={10}
              sectionSize={40}
              cellColor="#aeb8b2"
              sectionColor="#60736c"
              fadeDistance={500}
              position={[0, -0.01, 0]}
            />
            <OrbitControls makeDefault enableDamping dampingFactor={0.08} />
          </Canvas>
        ) : (
          <div className="empty-viewer">
            <div className="empty-cube" aria-hidden="true" />
            <p>Upload your STL file</p>
          </div>
        )}
      </div>
    </section>
  );
}
