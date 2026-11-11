import type { ComponentType } from 'react'
import IMULogger from '@/components/case-studies/IMULogger'
import OTAUpdate from '@/components/case-studies/OTAUpdate'
import SensorShield from '@/components/case-studies/SensorShield'
import EndEffector from '@/components/case-studies/EndEffector'
import ExoArm from '@/components/case-studies/ExoArm'
import DisillusionaryTale from '@/components/case-studies/DisillusionaryTale'
export const bodies: Record<string, ComponentType> = {
  'imu-logger': IMULogger, 'ota-update': OTAUpdate, 'imu-shield': SensorShield,
  'end-effector': EndEffector, 'exo-arm': ExoArm, 'disillusionary-tale': DisillusionaryTale,
}
