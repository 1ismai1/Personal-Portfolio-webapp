import Link from 'next/link'
import { Figure, Section, StatusBadge } from '@/components/kit'
import CaptureViewer from '@/components/kit/CaptureViewer'
import ProofStrip from '@/components/home/ProofStrip'
import Replay from '@/components/replay/Replay'

const blocks = [
  {
    name: 'microSD',
    parts: 'Molex 104031-0811',
    what: 'A bare socket on SPI1, with 47k pull-ups on CS, MOSI, MISO, and the unused DAT pins. A card-detect switch has its own pull-up.',
  },
  {
    name: 'Switchable SD power',
    parts: 'AP2112K-3.3 LDO',
    what: 'The card sits on its own 3.3 V rail. The MCU controls the enable pin, and a 100k resistor keeps the card off until firmware turns it on.',
  },
  {
    name: 'IMU',
    parts: 'Two 6-pin headers',
    what: 'A socket for the Adafruit MPU-6050 breakout on I²C1 plus an interrupt line. The second header carries no signals and only holds the breakout steady.',
  },
  {
    name: 'Wireless',
    parts: 'XIAO ESP32-C3, B5819W',
    what: 'The XIAO talks to the STM32 over USART1. It runs from the Nucleo’s 5 V through a Schottky diode so its own USB can’t back-feed the Nucleo.',
  },
  {
    name: 'XIAO to STM32 reset',
    parts: '2-pin jumper',
    what: 'Connects XIAO D0 to the STM32’s NRST so the ESP32 can reset it. It’s the groundwork for an over-the-air firmware update path.',
  },
  {
    name: 'Battery input',
    parts: '7–12 V, 100k/33k divider',
    what: 'The battery feeds the Nucleo’s VIN pin. The divider scales 12 V down to 3.0 V or less so the ADC can read battery voltage.',
  },
  {
    name: 'Debug header',
    parts: '3 signals + GND',
    what: 'Spare GPIOs for heartbeat, SD activity, and IMU activity, brought out for a logic analyzer to time the firmware on real hardware.',
  },
  {
    name: 'SD test header',
    parts: 'SPI1 + 3.3 V + GND',
    what: 'For probing the SD bus, or plugging in an external SD breakout if the onboard socket misbehaves.',
  },
]

const watch = [
  {
    name: 'Battery power',
    note: 'When the board runs from the battery input, the Nucleo’s power-source jumper (JP5) must sit on E5V, not U5V.',
  },
  {
    name: 'J_RST',
    note: 'The XIAO pin should only ever pull NRST low or float, like an open-drain output. If it drives high while the ST-Link resets the board, the two fight.',
  },
  {
    name: 'C3 capacitor',
    note: 'It’s a 100 µF, 6.3 V ceramic on a 5 V rail, and ceramics lose a lot of capacitance under DC bias. Fine for v1. A higher-voltage part is a candidate for v2.',
  },
  {
    name: 'DRC',
    note: 'No electrical violations. The one flag is cosmetic: a silkscreen arc touches the board edge.',
  },
]

const pinMap = [
  ['IMU_SCL', 'D15 (CN5-10)', 'PB8', 'I2C1_SCL'],
  ['IMU_SDA', 'D14 (CN5-9)', 'PB9', 'I2C1_SDA'],
  ['IMU_INT', 'A1 (CN8-2)', 'PA1', 'GPIO / EXTI'],
  ['SD_SCK', 'D13 (CN5-6)', 'PA5', 'SPI1_SCK'],
  ['SD_MISO', 'D12 (CN5-5)', 'PA6', 'SPI1_MISO'],
  ['SD_MOSI', 'D11 (CN5-4)', 'PA7', 'SPI1_MOSI'],
  ['SD_CS', 'D10 (CN5-3)', 'PB6', 'GPIO'],
  ['SD_EN', 'D9 (CN5-2)', 'PC7', 'GPIO (SD power on/off)'],
  ['SD_CD', 'D5 (CN9-6)', 'PB4', 'GPIO (card detect)'],
  ['UART1_TX', 'D8 (CN5-1)', 'PA9', 'USART1_TX (STM32 → XIAO)'],
  ['UART1_RX', 'D2 (CN9-3)', 'PA10', 'USART1_RX (XIAO → STM32)'],
  ['VBAT_SENSE', 'A0 (CN8-1)', 'PA0', 'ADC1_IN0'],
  ['DBG_HB', 'D4 (CN9-5)', 'PB5', 'GPIO'],
  ['DBG_SD', 'D6 (CN9-7)', 'PB10', 'GPIO'],
  ['DBG_IMU', 'D7 (CN9-8)', 'PA8', 'GPIO'],
  ['NRST', 'RESET (CN6-3)', 'NRST', 'Reset (via J_RST)'],
]

export default function SensorShield() {
  return (
    <div className="wrap pb-8">
      <Figure src="/imu-shield/shield-on-nucleo.jpg" width={2000} height={1532} priority
        alt="Assembled sensor shield on a powered NUCLEO-F411RE with the IMU and microSD card fitted"
        caption="The assembled board, running the IMU logger." sizes="(max-width: 1240px) 100vw, 1180px" />
      <Section refId="TP1" label="Overview" title="The bench setup, folded onto one board">
        <p>A 2-layer, 68.6 × 53.3 mm shield turns the IMU logger’s loose wiring into a board that plugs onto the Nucleo’s Arduino headers. It carries the MPU-6050, XIAO ESP32-C3, microSD socket, battery sensing and debug test points.</p>
        <p><strong>My role:</strong> solo design. I drew the schematic, laid out the board in Altium Designer and prepared the Gerbers, bill of materials and pick-and-place files for JLCPCB. The firmware is documented in the <Link href="/projects/imu-logger" className="link">IMU Logger case study</Link>.</p>
        <div className="grid gap-6 md:grid-cols-2">
          <Figure src="/imu-shield/board-top.png" width={1400} height={1077} alt="Top board render showing the microSD socket, MPU-6050 and XIAO headers" caption="Top layer and component placement." sizes="(max-width: 768px) 100vw, 440px" />
          <Figure src="/imu-shield/board-bottom.png" width={1400} height={1077} alt="Bottom board render showing signal routing and the ground pour" caption="Bottom layer and ground pour." sizes="(max-width: 768px) 100vw, 440px" />
        </div>
      </Section>
      <Section refId="TP2" label="Hardware" title="Eight blocks on one board">
        <dl className="divide-y divide-line">
          {blocks.map(b => <div key={b.name} className="grid gap-2 py-5 first:pt-0 md:grid-cols-[180px_minmax(0,1fr)]">
            <dt className="text-sm font-medium text-silk">{b.name}<span className="mt-1 block font-mono text-xs text-silk-3">{b.parts}</span></dt>
            <dd className="max-w-prose text-base text-silk-2">{b.what}</dd>
          </div>)}
        </dl>
      </Section>
      <Section refId="TP3" label="Power" title="A reset the firmware can control">
        <p>A locked SD card previously needed a USB unplug. The shield gives the card its own GPIO-switched 3.3 V regulator, so firmware can power-cycle it. I measured 0 V on the SD rail when it was off.</p>
        <p>The AP2112K enable pin is controlled by <code className="chip">SD_EN</code>, with a 100k pull-down keeping the rail off until firmware enables it. Before switching off, the SPI and chip-select pins must be low or inputs to avoid feeding the card through its signal lines.</p>
        <p>A push-pull socket also replaces the spring-eject mechanism, so vibration cannot eject the card.</p>
        {/* TODO(ismail): supply notebook details before turning the SD lockup into a four-field BugCard. */}
      </Section>
      <Section refId="TP4" label="Bring-up" title="Assembled, checked and logging">
        <StatusBadge tone="ok">Assembled and tested</StatusBadge>
        <p className="mt-5">I caught 3 pin conflicts before power-on and logged 30 minutes with zero dropped samples. The design passed electrical rule checks with zero violations. This endurance log was recorded on the assembled shield.</p>
        <ProofStrip />
        {/* TODO(ismail): supply the three pin-conflict symptom/cause/fix/lesson notes. */}
        <h3 className="mb-3 mt-8 text-lg font-medium text-silk">Board notes</h3>
        <dl className="divide-y divide-line">{watch.map(w => <div key={w.name} className="py-4"><dt className="mb-1 text-sm font-medium text-silk">{w.name}</dt><dd className="max-w-prose text-sm text-silk-2">{w.note}</dd></div>)}</dl>
      </Section>
      <Section refId="TP5" label="Schematic" title="The hardware and software interface">
        <CaptureViewer src="/imu-shield/schematic.png" width={2573} height={1819}
          alt="Altium schematic showing SD power switching, microSD socket, IMU and XIAO headers, battery divider and Nucleo connections"
          caption="The complete shield schematic. Open it to inspect the signals." />
        <div className="my-6 overflow-x-auto rounded border border-line" tabIndex={0} role="region" aria-label="Shield pin map, horizontally scrollable">
          <table className="w-full min-w-[620px] border-collapse text-left text-sm">
            <caption className="sr-only">Shield signals mapped to Nucleo pins, STM32 pins and peripherals</caption>
            <thead><tr className="bg-mask-700 text-xs text-silk-2">{['Signal', 'Nucleo pin', 'STM32', 'Peripheral'].map(h => <th key={h} scope="col" className="px-4 py-3 font-medium">{h}</th>)}</tr></thead>
            <tbody>{pinMap.map(([sig,nuc,stm,per]) => <tr key={sig} className="border-t border-line bg-mask-800"><th scope="row" className="px-4 py-3 font-mono font-medium text-phos">{sig}</th>{[nuc,stm,per].map((v,i) => <td key={i} className="px-4 py-3 text-silk-2">{v}</td>)}</tr>)}</tbody>
          </table>
        </div>
        <p>USART2 (PA2/PA3, D0/D1) stays free for the ST-Link virtual COM port. Pins are assigned across I2C, SPI, USART, ADC and GPIO without DMA-stream conflicts.</p>
      </Section>
      <Section refId="TP6" label="The board in 3D" title="Explore the board while it moves">
        <p>The replay uses a real motion log. Select a part to see its role, or compare the filtered orientation with the raw sensor estimates.</p>
        <Replay />
      </Section>
    </div>
  )
}

