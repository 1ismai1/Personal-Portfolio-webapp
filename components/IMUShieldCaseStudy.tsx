import Image from 'next/image'
import Reveal from './Reveal'
import Figure from './Figure'

const stats = [
  { num: '2', unit: 'layers', label: 'Ground pour on both sides' },
  { num: '16', unit: 'signals', label: 'Mapped from the shield to STM32 pins' },
  { num: '0', unit: 'errors', label: 'Electrical DRC violations (1 cosmetic silkscreen)' },
  { num: '68.6', unit: '× 53.3 mm', label: 'Arduino Uno shield outline' },
]

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

export default function IMUShieldCaseStudy() {
  return (
    <div className="reflection imu">
      <div className="container">

        {/* First impression: the board, both sides */}
        <Reveal>
          <figure className="shield-hero">
            <div className="shield-hero-tiles">
              <div className="shield-tile">
                <Image
                  src="/imu-shield/board-top.png"
                  alt="Top of the IMU Logger Shield, showing the microSD socket, IMU and XIAO headers, and the Nucleo header footprints"
                  fill priority sizes="(max-width: 600px) 100vw, 580px"
                />
              </div>
              <div className="shield-tile">
                <Image
                  src="/imu-shield/board-bottom.png"
                  alt="Bottom of the IMU Logger Shield, showing routing and the ground pour"
                  fill priority sizes="(max-width: 600px) 100vw, 580px"
                />
              </div>
              <div className="img-overlay" aria-hidden="true" />
            </div>
            <figcaption className="shield-hero-cap">
              <span>Top</span><span>Bottom</span>
              <p>Both sides of the v1 board, rendered from the Gerbers sent to JLCPCB.</p>
            </figcaption>
          </figure>
        </Reveal>

        {/* Numbers */}
        <Reveal className="imu-stats" delay={80}>
          {stats.map(s => (
            <div key={s.label} className="imu-stat">
              <div className="imu-stat-num">{s.num}<em>{s.unit}</em></div>
              <div className="imu-stat-lbl">{s.label}</div>
            </div>
          ))}
        </Reveal>

        <div className="refl-steps">

          {/* Overview */}
          <Reveal className="refl-step">
            <div className="refl-step-marker">
              <div className="refl-step-num">Overview</div>
            </div>
            <div>
              <h3 className="refl-step-q">The bench setup, folded onto one board</h3>
              <p>
                The IMU logger first ran as a Nucleo with an IMU breakout and an SD module on loose wires. This shield plugs onto the Nucleo’s Arduino headers (CN5, CN6, CN8, CN9) and puts the IMU, a microSD socket, a wireless link, a battery input, and a debug header on one board. The firmware that runs on it is the <a href="/projects/imu-logger" className="shield-inline-link">IMU Logger</a>.
              </p>
              <p>
                <strong style={{ color: 'var(--txt)', fontWeight: 500 }}>My role:</strong> solo design. I drew the schematic, laid out the board in Altium Designer, and prepared the Gerbers, bill of materials, and pick-and-place files for JLCPCB to fabricate and assemble the SMD parts.
              </p>
            </div>
          </Reveal>

          {/* What's on it */}
          <Reveal className="refl-step">
            <div className="refl-step-marker">
              <div className="refl-step-num">What’s on it</div>
            </div>
            <div>
              <h3 className="refl-step-q">Eight blocks on one board</h3>
              <ul className="shield-blocks">
                {blocks.map(b => (
                  <li key={b.name} className="shield-block">
                    <div className="shield-block-name">{b.name}</div>
                    <div className="shield-block-parts">{b.parts}</div>
                    <p>{b.what}</p>
                  </li>
                ))}
              </ul>
            </div>
          </Reveal>

          {/* Design choice */}
          <Reveal className="refl-step">
            <div className="refl-step-marker">
              <div className="refl-step-num">Design choice</div>
            </div>
            <div>
              <div className="pbadge badge-silver">Power design</div>
              <h3 className="refl-step-q">A power switch for the SD card</h3>

              <dl className="imu-bug">
                <div className="imu-bug-row">
                  <dt>The goal</dt>
                  <dd>
                    Let firmware hard power-cycle a hung SD card, instead of relying on the card to recover by itself.
                  </dd>
                </div>
                <div className="imu-bug-row">
                  <dt>The design</dt>
                  <dd>
                    The card runs from its own 3.3 V rail, <code>SD_3V3</code>, made by an AP2112K LDO. The MCU drives the LDO’s enable pin (<code>SD_EN</code>), and a 100k pull-down keeps the card off until firmware turns it on.
                  </dd>
                </div>
                <div className="imu-bug-row">
                  <dt>The catch</dt>
                  <dd>
                    Before pulling <code>SD_EN</code> low, firmware has to set the SPI and CS pins low or to inputs. Otherwise the STM32 can partly power the “off” card through its I/O pins and the pull-ups, and the reset isn’t clean.
                  </dd>
                </div>
                <div className="imu-bug-row imu-bug-lesson">
                  <dt>Lesson</dt>
                  <dd>Switching off a supply doesn’t switch off a part that’s still fed by its signal lines.</dd>
                </div>
              </dl>
            </div>
          </Reveal>

          {/* Bring-up watch list */}
          <Reveal className="refl-step">
            <div className="refl-step-marker">
              <div className="refl-step-num">Bring-up</div>
            </div>
            <div>
              <div className="pbadge badge-aub">Not yet tested on hardware</div>
              <h3 className="refl-step-q">What I’m checking when the boards arrive</h3>

              <dl className="imu-bug">
                {watch.map(w => (
                  <div key={w.name} className="imu-bug-row">
                    <dt>{w.name}</dt>
                    <dd>{w.note}</dd>
                  </div>
                ))}
              </dl>
            </div>
          </Reveal>

          {/* Status */}
          <Reveal className="refl-step">
            <div className="refl-step-marker">
              <div className="refl-step-num">Status</div>
            </div>
            <div>
              <div className="pbadge badge-aub">v1 in fabrication</div>
              <h3 className="refl-step-q">Ordered from JLCPCB on October 14, 2026</h3>
              <p>
                The boards are being fabricated and the SMD parts assembled. Next is bringing it up on the Nucleo with the logger firmware, then using the reset jumper to build the over-the-air update path.
              </p>
            </div>
          </Reveal>
        </div>

        {/* Schematic + pin map */}
        <Reveal>
          <div className="imu-more">
            <div className="sec-label">Schematic</div>
            <div className="imu-gallery">
              <Figure
                src="/imu-shield/schematic.png"
                alt="Schematic of the IMU Logger Shield: SD power LDO, microSD socket with pull-ups, IMU and XIAO headers, battery divider, and the Nucleo Arduino headers"
                width={2573}
                height={1819}
                caption="The full schematic, one sheet, drawn in Altium Designer."
              />
            </div>
          </div>
        </Reveal>

        <Reveal>
          <div className="imu-more">
            <div className="sec-label">Pin map</div>
            <div className="pin-wrap">
              <table className="pin-table">
                <caption className="sr-only">Shield signals, mapped to Nucleo pins, STM32 pins, and peripherals</caption>
                <thead>
                  <tr><th scope="col">Signal</th><th scope="col">Nucleo pin</th><th scope="col">STM32</th><th scope="col">Peripheral</th></tr>
                </thead>
                <tbody>
                  {pinMap.map(([sig, nuc, stm, per]) => (
                    <tr key={sig}>
                      <th scope="row">{sig}</th><td>{nuc}</td><td>{stm}</td><td>{per}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="pin-note">USART2 (PA2/PA3, D0/D1) stays free for the ST-Link virtual COM port.</p>
          </div>
        </Reveal>

      </div>
    </div>
  )
}
