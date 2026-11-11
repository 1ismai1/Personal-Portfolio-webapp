import type { ComponentType } from 'react'
import IMULogger from '@/components/case-studies/IMULogger'
import OTAUpdate from '@/components/case-studies/OTAUpdate'
import IMUShieldCaseStudy from '@/components/legacy/IMUShieldCaseStudy'
import EndEffectorCaseStudy from '@/components/legacy/EndEffectorCaseStudy'
import ExoArmCaseStudy from '@/components/legacy/ExoArmCaseStudy'
import DisillusionaryTaleCaseStudy from '@/components/legacy/DisillusionaryTaleCaseStudy'

/**
 * slug -> case-study body. Bodies built on the kit live in
 * components/case-studies/. The four in components/legacy/ still use the old
 * markup and app/legacy.css; port them to the kit (see HANDOFF.md) and move
 * them over.
 */
export const bodies: Record<string, ComponentType> = {
  'imu-logger': IMULogger,
  'ota-update': OTAUpdate,
  'imu-shield': IMUShieldCaseStudy,
  'end-effector': EndEffectorCaseStudy,
  'exo-arm': ExoArmCaseStudy,
  'disillusionary-tale': DisillusionaryTaleCaseStudy,
}
