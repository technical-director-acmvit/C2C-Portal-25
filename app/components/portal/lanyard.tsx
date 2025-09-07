'use client';
import { useEffect, useRef, useState, useMemo } from 'react';
import { Canvas, extend, useFrame } from '@react-three/fiber';
import { useGLTF, useTexture, Environment, Lightformer } from '@react-three/drei';
import {
  BallCollider,
  CuboidCollider,
  Physics,
  RigidBody,
  useRopeJoint,
  useSphericalJoint,
  RigidBodyProps
} from '@react-three/rapier';
import { MeshLineGeometry, MeshLineMaterial } from 'meshline';
import * as THREE from 'three';

import HKBox from '@/app/components/portal/hk-box';
import { createTextTexture } from '@/app/components/portal/createTextTexture';

// replace with your own imports, see the usage snippet for details
const cardGLB = '/portal/card.glb';
const lanyard = '/portal/lanyard.png'

extend({ MeshLineGeometry, MeshLineMaterial });

interface LanyardProps {
  position?: [number, number, number];
  gravity?: [number, number, number];
  fov?: number;
  transparent?: boolean;
  text?: [string, string, string, string, [string, string, string, string]];
}

export default function Lanyard({
  position = [0, -1, 10],
  gravity = [0, -40, 0],
  fov = 20,
  transparent = true,
  text = ["Aditya", "aditya.vardhan2024@vitstudent.ac.in", "7439227054", "BlackHats", ["AVK", "Virat", "Cherrukuri", "Titan"]]
}: LanyardProps) {
  return (
    <div className="relative z-0 w-full h-screen flex justify-center items-center transform scale-100 origin-center">
      <Canvas
        camera={{ position, fov}}
        gl={{ alpha: transparent }}
        onCreated={({ gl }) => gl.setClearColor(new THREE.Color(0x000000), transparent ? 0 : 1)}
        className=''
      >
        <ambientLight intensity={Math.PI} />
    <Physics gravity={gravity} timeStep={1 / 60}>
      <Band position={[-2, 4, 0]} text={text} front={true}/>
      <Band position={[2, 4, 0]}  text={text} front={false}/>
        </Physics>
        <Environment blur={0.75}>
          <Lightformer
            intensity={0}
            color="white"
            position={[0, -1, 5]}
            rotation={[0, 0, Math.PI / 3]}
            scale={[100, 0.1, 1]}
          />
          <Lightformer
            intensity={0}
            color="white"
            position={[-1, -1, 1]}
            rotation={[0, 0, Math.PI / 3]}
            scale={[100, 0.1, 1]}
          />
          <Lightformer
            intensity={0}
            color="white"
            position={[1, 1, 1]}
            rotation={[0, 0, Math.PI / 3]}
            scale={[100, 0.1, 1]}
          />
          <Lightformer
            intensity={5}
            color="white"
            position={[-10, 0, 14]}
            rotation={[0, Math.PI / 2, Math.PI / 3]}
            scale={[100, 10, 1]}
          />
          <Lightformer
            intensity={5}
            color="white"
            position={[10, 0, 14]}
            rotation={[0, -Math.PI / 2, Math.PI / 3]}
            scale={[100, 10, 1]}
          />
        </Environment>
        
      </Canvas>
    </div>
  );
}

interface BandProps {
  maxSpeed?: number;
  minSpeed?: number;
  text: [string, string, string, string, [string, string, string, string]]
  position?: [number, number, number];
  front: boolean;
}

function Band({ maxSpeed = 50, minSpeed = 0, text, position = [0, 4, 0], front }: BandProps) {
  // Using "any" for refs since the exact types depend on Rapier's internals
  const band = useRef<any>(null);
  const fixed = useRef<any>(null);
  const j1 = useRef<any>(null);
  const j2 = useRef<any>(null);
  const j3 = useRef<any>(null);
  const card = useRef<any>(null);

  const vec = new THREE.Vector3();
  const ang = new THREE.Vector3();
  const rot = new THREE.Vector3();
  const dir = new THREE.Vector3();

  const segmentProps: any = {
    type: 'dynamic' as RigidBodyProps['type'],
    canSleep: true,
    colliders: false,
    angularDamping: 4,
    linearDamping: 4
  };

  const gltf = useGLTF(cardGLB);
  const nodes = gltf?.nodes || {};
  const materials = gltf?.materials || {};
  const  texture = useTexture('/portal/lanyard.png');
  const [curve] = useState(
    () =>
      new THREE.CatmullRomCurve3([new THREE.Vector3(), new THREE.Vector3(), new THREE.Vector3(), new THREE.Vector3()])
  );
  const [dragged, drag] = useState<false | THREE.Vector3>(false);
  const [hovered, hover] = useState(false);

  const [isSmall, setIsSmall] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      return window.innerWidth < 1024;
    }
    return false;
  });

  useEffect(() => {
    const handleResize = (): void => {
      setIsSmall(window.innerWidth < 1024);
    };

    window.addEventListener('resize', handleResize);
    return (): void => window.removeEventListener('resize', handleResize);
  }, []);

  // All anchor points are relative to their local group, so no change needed for offset bands
  useRopeJoint(fixed, j1, [[0, 0, 0], [0, 0, 0], 1]);
  useRopeJoint(j1, j2, [[0, 0, 0], [0, 0, 0], 1]);
  useRopeJoint(j2, j3, [[0, 0, 0], [0, 0, 0], 1]);
  useSphericalJoint(j3, card, [
    [0, 0, 0],
    [0, 1.45, 0]
  ]);

  useEffect(() => {
    if (hovered) {
      document.body.style.cursor = dragged ? 'grabbing' : 'grab';
      return () => {
        document.body.style.cursor = 'auto';
      };
    }
  }, [hovered, dragged]);

  useFrame((state, delta) => {
    if (dragged && typeof dragged !== 'boolean') {
      vec.set(state.pointer.x, state.pointer.y, 0.5).unproject(state.camera);
      dir.copy(vec).sub(state.camera.position).normalize();
      vec.add(dir.multiplyScalar(state.camera.position.length()));
      [card, j1, j2, j3, fixed].forEach(ref => ref.current?.wakeUp());
      card.current?.setNextKinematicTranslation({
        x: vec.x - dragged.x,
        y: vec.y - dragged.y,
        z: vec.z - dragged.z
      });
    }
    if (fixed.current) {
      [j1, j2].forEach(ref => {
        if (!ref.current.lerped) ref.current.lerped = new THREE.Vector3().copy(ref.current.translation());
        const clampedDistance = Math.max(0.1, Math.min(1, ref.current.lerped.distanceTo(ref.current.translation())));
        ref.current.lerped.lerp(
          ref.current.translation(),
          delta * (minSpeed + clampedDistance * (maxSpeed - minSpeed))
        );
      });
  // All curve points should be relative to the local group
  const offset = new THREE.Vector3(position[0], position[1], position[2]);
  curve.points[0].copy(j3.current.translation()).sub(offset);
  curve.points[1].copy(j2.current.lerped).sub(offset);
  curve.points[2].copy(j1.current.lerped).sub(offset);
  curve.points[3].copy(fixed.current.translation()).sub(offset);
      band.current.geometry.setPoints(curve.getPoints(32));
      ang.copy(card.current.angvel());
      rot.copy(card.current.rotation());
      card.current.setAngvel({ x: ang.x, y: ang.y - rot.y * 0.25, z: ang.z });
    }
  });

  curve.curveType = 'chordal';
  texture.wrapS = texture.wrapT = THREE.RepeatWrapping;

  const textTexture = useMemo(() => createTextTexture(text, front), [text]);

  return (
    <>
      <group position={position}>
        <RigidBody ref={fixed} {...segmentProps} type={'fixed' as RigidBodyProps['type']} />
        <RigidBody position={[0.5, 0, 0]} ref={j1} {...segmentProps} type={'dynamic' as RigidBodyProps['type']}>
          <BallCollider args={[0.1]} />
        </RigidBody>
        <RigidBody position={[1, 0, 0]} ref={j2} {...segmentProps} type={'dynamic' as RigidBodyProps['type']}>
          <BallCollider args={[0.1]} />
        </RigidBody>
        <RigidBody position={[1.5, 0, 0]} ref={j3} {...segmentProps} type={'dynamic' as RigidBodyProps['type']}>
          <BallCollider args={[0.1]} />
        </RigidBody>
        <RigidBody
          position={[2, 0, 0]}
          ref={card}
          {...segmentProps}
          type={dragged ? ('kinematicPosition' as RigidBodyProps['type']) : ('dynamic' as RigidBodyProps['type'])}
        >
          <CuboidCollider args={[0.8, 1.125, 0.01]} />
          <group
            scale={2.25}
            position={[0, -1.2, -0.05]}
            onPointerOver={() => hover(true)}
            onPointerOut={() => hover(false)}
            onPointerUp={(e: any) => {
              e.target.releasePointerCapture(e.pointerId);
              drag(false);
            }}
            onPointerDown={(e: any) => {
              e.target.setPointerCapture(e.pointerId);
              drag(new THREE.Vector3().copy(e.point).sub(vec.copy(card.current.translation())));
            }}
          >
            {nodes.card && (
              <mesh geometry={(nodes.card as THREE.Mesh).geometry}>
                <meshPhysicalMaterial
                  map={textTexture}
                  map-anisotropy={16}
                  clearcoat={1}
                  clearcoatRoughness={0.15}
                  roughness={0.9}
                  metalness={0.8}
                />
              </mesh>
            )}
            {nodes.clip && (
              <mesh geometry={(nodes.clip as THREE.Mesh).geometry} material={materials.metal as THREE.MeshPhysicalMaterial} material-roughness={0.3} />
            )}
            {nodes.clamp && (
              <mesh geometry={(nodes.clamp as THREE.Mesh).geometry} material={materials.metal as THREE.MeshPhysicalMaterial} />
            )}
          </group>
        </RigidBody>
        <mesh ref={band}>
          <primitive object={new MeshLineGeometry()} attach="geometry" />
          <primitive
            object={new MeshLineMaterial({
              color: 'gray',
              resolution: new THREE.Vector2(isSmall ? 1000 : 1000, isSmall ? 2000 : 1000),
              useMap: 1,
              map: texture,
              repeat: new THREE.Vector2(-4, 1),
              lineWidth: 1
            })}
            attach="material"
          />
        </mesh>
      </group>
    </>
  );
}
