'use client'

import { Suspense, useRef } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { Float } from '@react-three/drei'
import { motion, useScroll, useTransform, type Variants } from 'framer-motion'
import { ArrowDown } from 'lucide-react'
import { MagneticButton } from '@/components/ui'
import type { Group } from 'three'

function FloatingShapes() {
  const groupRef = useRef<Group>(null)

  useFrame((_, delta) => {
    if (groupRef.current) {
      groupRef.current.rotation.y += delta * 0.08
    }
  })

  return (
    <group ref={groupRef}>
      <Float speed={2} rotationIntensity={0.4} floatIntensity={1}>
        <mesh position={[-2.5, 1.2, 0]}>
          <icosahedronGeometry args={[0.8, 0]} />
          <meshNormalMaterial wireframe />
        </mesh>
      </Float>
      <Float speed={1.5} rotationIntensity={0.6} floatIntensity={1.2}>
        <mesh position={[2.5, -0.8, -1]}>
          <torusGeometry args={[0.6, 0.25, 16, 32]} />
          <meshNormalMaterial wireframe />
        </mesh>
      </Float>
      <Float speed={1.8} rotationIntensity={0.5} floatIntensity={0.8}>
        <mesh position={[0, -1.5, 1]}>
          <octahedronGeometry args={[0.7, 0]} />
          <meshNormalMaterial wireframe />
        </mesh>
      </Float>
      <Float speed={2.2} rotationIntensity={0.3} floatIntensity={1.5}>
        <mesh position={[-1.5, -2, -0.5]}>
          <dodecahedronGeometry args={[0.5, 0]} />
          <meshNormalMaterial wireframe />
        </mesh>
      </Float>
      <Float speed={1.2} rotationIntensity={0.7} floatIntensity={0.6}>
        <mesh position={[1.8, 2, 0.5]}>
          <tetrahedronGeometry args={[0.6, 0]} />
          <meshNormalMaterial wireframe />
        </mesh>
      </Float>
    </group>
  )
}

function Scene() {
  return (
    <>
      <ambientLight intensity={0.5} />
      <pointLight position={[10, 10, 10]} intensity={0.8} />
      <FloatingShapes />
    </>
  )
}

export function HeroSection() {
  const containerRef = useRef<HTMLElement>(null)
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end start'],
  })

  const canvasY = useTransform(scrollYProgress, [0, 1], ['0%', '30%'])
  const textOpacity = useTransform(scrollYProgress, [0, 0.5], [1, 0])
  const textY = useTransform(scrollYProgress, [0, 0.5], ['0%', '-20%'])

  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.15, delayChildren: 0.3 },
    },
  }

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: 'easeOut' },
    },
  }

  const handleScrollToProjects = () => {
    document.getElementById('projects')?.scrollIntoView({ behavior: 'smooth' })
  }

  const handleScrollToContact = () => {
    document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <section
      ref={containerRef}
      id="hero"
      className="relative flex min-h-screen items-center justify-center overflow-hidden"
    >
      {/* 3D Canvas Background */}
      <motion.div className="absolute inset-0" style={{ y: canvasY }}>
        <Suspense fallback={null}>
          <Canvas
            camera={{ position: [0, 0, 5], fov: 45 }}
            style={{ background: 'transparent' }}
          >
            <Scene />
          </Canvas>
        </Suspense>
      </motion.div>

      {/* Text Overlay */}
      <motion.div
        className="relative z-10 mx-auto max-w-4xl px-6 text-center"
        style={{ opacity: textOpacity, y: textY }}
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.p
          variants={itemVariants}
          className="mb-4 text-sm font-medium uppercase tracking-widest text-[var(--accent)]"
        >
          Full-Stack Developer & AI Engineer
        </motion.p>

        <motion.h1
          variants={itemVariants}
          className="mb-6 text-5xl font-bold leading-tight tracking-tight text-[var(--text-primary)] sm:text-7xl lg:text-8xl"
        >
          Max
        </motion.h1>

        <motion.p
          variants={itemVariants}
          className="mx-auto mb-10 max-w-2xl text-lg text-[var(--text-secondary)] sm:text-xl"
        >
          AI 에이전트 시스템과 인터랙티브 웹 경험을 만듭니다.
          <br className="hidden sm:block" />
          코드로 아이디어를 현실로 바꾸는 개발자입니다.
        </motion.p>

        <motion.div
          variants={itemVariants}
          className="flex flex-col items-center justify-center gap-4 sm:flex-row"
        >
          <MagneticButton>
            <button
              onClick={handleScrollToProjects}
              className="rounded-lg bg-[var(--accent)] px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-[var(--accent-hover)]"
            >
              프로젝트 보기
            </button>
          </MagneticButton>
          <MagneticButton>
            <button
              onClick={handleScrollToContact}
              className="rounded-lg border border-[var(--border-default)] px-6 py-3 text-sm font-medium text-[var(--text-primary)] transition-colors hover:border-[var(--border-hover)] hover:bg-[var(--bg-tertiary)]"
            >
              연락하기
            </button>
          </MagneticButton>
        </motion.div>
      </motion.div>

      {/* Scroll indicator */}
      <motion.div
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5 }}
      >
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
        >
          <ArrowDown size={20} className="text-[var(--text-muted)]" />
        </motion.div>
      </motion.div>
    </section>
  )
}
