/** Types and static data shared by the replay shell and the lazy 3D view. */

export type Mode = 'accel' | 'gyro' | 'filt'
export interface Series { r: number[]; p: number[] } // degrees x10

/** Shape of public/data/motion.json (written by scripts/build-data.mjs). */
export interface Motion {
  meta: { hz: number; samples: number; durationS: number; gyroSaturatedSamples: number; gyroLsbPerDps: number }
  saturated: [number, number][]
  filt: Series
  accel: Series
  gyro: Series
}

export const MODES: { id: Mode; label: string; blurb: string }[] = [
  {
    id: 'accel',
    label: 'Accel only',
    blurb: 'Angle from gravity alone. Right on average, but every vibration and fast move shows up as jitter.',
  },
  {
    id: 'gyro',
    label: 'Gyro only',
    blurb: 'Angle from integrating rotation rate. Smooth, but small errors add up, so it drifts away from the truth.',
  },
  {
    id: 'filt',
    label: 'Complementary filter',
    blurb: 'What the firmware logged: the gyro for fast motion, pulled 2% toward the accelerometer every sample so drift cannot build.',
  },
]

export type PartId = 'mpu' | 'sd' | 'xiao' | 'reg'

/**
 * Hover targets on the board. The GLB exported from Altium merges meshes by
 * material (Node1..Node19, no component names), so parts are located by their
 * position on the board instead. Units: mm, origin at the board's bottom-left
 * corner, z up from the top copper. `solid` parts are plug-in modules that are
 * not in the GLB and are drawn as simple blocks.
 */
export const PARTS: { id: PartId; name: string; refdes: string; does: string; center: [number, number, number]; size: [number, number, number]; solid?: boolean }[] = [
  {
    id: 'mpu', name: 'MPU-6050', refdes: 'J_IMU',
    does: '6-axis IMU. The firmware reads accelerometer and gyro over I2C at 100 Hz: this is the sensor that recorded the motion you are watching.',
    center: [32.2, 26.6, 9.4], size: [25.4, 17.8, 1.6], solid: true,
  },
  {
    id: 'sd', name: 'microSD socket', refdes: 'J1',
    does: 'Push-pull socket on SPI at 10.5 MHz. Every sample is written here as a CSV row. Vibration cannot eject the card.',
    center: [7, 26.8, 1], size: [12.4, 13.2, 2],
  },
  {
    id: 'xiao', name: 'XIAO ESP32-C3 socket', refdes: 'J_XIAO',
    does: 'Socket for the radio module, wired to a USART. It is the Wi-Fi link for the OTA update project.',
    center: [58.8, 26.7, 4.5], size: [19, 17.8, 9],
  },
  {
    id: 'reg', name: '3.3 V regulator', refdes: 'U1',
    does: 'GPIO-switched regulator for the SD card. Firmware can power-cycle a locked card: measured 0 V when off.',
    center: [19.8, 9.85, 0.8], size: [3.6, 4.4, 1.8],
  },
]

export const wrap180 = (a: number) => (a > 180 ? a - 360 : a < -180 ? a + 360 : a)
