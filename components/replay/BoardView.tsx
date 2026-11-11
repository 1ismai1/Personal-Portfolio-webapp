'use client'
/**
 * The 3D half of the IMU replay. Loaded only via next/dynamic from Replay.tsx,
 * so three.js never lands in the home page's first-load bundle.
 */
import { Canvas, useFrame, useLoader } from '@react-three/fiber'
import { Suspense, useEffect, useMemo, useRef, type MutableRefObject } from 'react'
import * as THREE from 'three'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import { PARTS, type Motion, type Mode, type PartId } from './shared'

const MODEL_URL = '/models/imu-shield.glb'
const MM = 0.1 // scene units per millimetre (the GLB is in metres; we scale it by 100)
const BOARD = { w: 68.6, h: 53.3 }

const qRoll = new THREE.Quaternion(), qPitch = new THREE.Quaternion()
const X = new THREE.Vector3(1, 0, 0), Z = new THREE.Vector3(0, 0, 1)

/** Sensor frame is Z-up, three.js is Y-up: sensor (x, y, z) -> three (x, z, -y).
 *  world_from_board = Ry(pitch) * Rx(roll) in the sensor frame, which is the
 *  rotation whose gravity vector gives back the firmware's roll and pitch. */
function orient(out: THREE.Quaternion, rollDeg: number, pitchDeg: number) {
  qRoll.setFromAxisAngle(X, THREE.MathUtils.degToRad(rollDeg))
  qPitch.setFromAxisAngle(Z, -THREE.MathUtils.degToRad(pitchDeg))
  return out.copy(qPitch).multiply(qRoll)
}

function Board({ data, mode, pos, active, onActive }: Props) {
  const gltf = useLoader(GLTFLoader, MODEL_URL)
  const tilt = useRef<THREE.Group>(null)
  const qa = useMemo(() => new THREE.Quaternion(), [])
  const qb = useMemo(() => new THREE.Quaternion(), [])

  const scene = useMemo(() => {
    const s = gltf.scene.clone(true)
    s.traverse(o => {
      const m = o as THREE.Mesh
      if (!m.isMesh) return
      const mat = (m.material as THREE.MeshStandardMaterial).clone()
      // The Altium export writes alpha 0 on some materials; they are opaque parts.
      mat.transparent = false; mat.opacity = 1; mat.side = THREE.DoubleSide
      mat.metalness = Math.min(mat.metalness, 0.4); mat.roughness = Math.max(mat.roughness, 0.55)
      // The bare board comes out as pure RGB green; pull it to a real soldermask colour.
      if (mat.color.g > 0.15 && mat.color.r < 0.05 && mat.color.b < 0.05) { mat.color.set('#1d6b45'); mat.roughness = 0.5 }
      m.material = mat
    })
    return s
  }, [gltf])

  useFrame(() => {
    if (!tilt.current) return
    const series = data[mode]
    const p = Math.min(Math.max(pos.current, 0), series.r.length - 1)
    const i = Math.floor(p), j = Math.min(i + 1, series.r.length - 1)
    orient(qa, series.r[i] / 10, series.p[i] / 10)
    orient(qb, series.r[j] / 10, series.p[j] / 10)
    // Slerp between samples: always the short way round, so the ±180° wrap never spins the board.
    tilt.current.quaternion.copy(qa).slerp(qb, p - i)
  })

  return (
    <group ref={tilt}>
      <group position={[(-BOARD.w / 2) * MM, 0, (BOARD.h / 2) * MM]}>
        <primitive object={scene} scale={100} />
        {PARTS.map(part => {
          const on = active === part.id
          const [x, y, z] = part.center, [sx, sy, sz] = part.size
          return (
            <mesh
              key={part.id}
              position={[x * MM, z * MM, -y * MM]}
              onPointerOver={e => { e.stopPropagation(); onActive(part.id) }}
              onClick={e => { e.stopPropagation(); onActive(part.id) }}
            >
              <boxGeometry args={[sx * MM, sz * MM, sy * MM]} />
              <meshStandardMaterial
                color={part.solid ? '#12201d' : '#F5B546'}
                emissive="#F5B546"
                emissiveIntensity={on ? 0.55 : 0}
                transparent
                opacity={part.solid ? (on ? 0.95 : 0.9) : on ? 0.45 : 0.0}
                depthWrite={!!part.solid}
              />
            </mesh>
          )
        })}
      </group>
    </group>
  )
}

interface Props {
  data: Motion
  mode: Mode
  pos: MutableRefObject<number>
  active: PartId | null
  onActive: (id: PartId | null) => void
}

export default function BoardView(props: Props & { running: boolean; onReady?: () => void }) {
  const { running, onReady, ...rest } = props
  useEffect(() => { onReady?.() }, [onReady])
  return (
    <Canvas
      dpr={[1, 2]}
      frameloop={running ? 'always' : 'never'}
      camera={{ position: [0, 8.2, 10.8], fov: 34 }}
      gl={{ antialias: true, alpha: true, powerPreference: 'low-power' }}
      onPointerMissed={() => props.onActive(null)}
      aria-hidden="true"
    >
      <ambientLight intensity={1.4} />
      <directionalLight position={[5, 10, 6]} intensity={2.4} />
      <directionalLight position={[-6, -8, -4]} intensity={1.1} color="#5CD6C0" />
      {/* A fixed floor grid, so the tilt reads against something level. */}
      <gridHelper args={[18, 18, "#2B6E63", "#162623"]} position={[0, -3.4, 0]} />
      <Suspense fallback={null}>
        <Board {...rest} />
      </Suspense>
    </Canvas>
  )
}
