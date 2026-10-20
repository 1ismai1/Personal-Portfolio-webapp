import Image from 'next/image'
import Reveal from './Reveal'
import Figure from './Figure'

const stats = [
  { num: '100', unit: 'Hz', label: 'Sample rate' },
  { num: '1.54', unit: 'ms', label: '14-byte I2C burst read' },
  { num: '5.3', unit: 'ms', label: 'Loop with an SD write (10 ms period)' },
  { num: '<0.06', unit: '%', label: 'Clock timing error, down from 1.5%' },
]

const progression = [
  {
    name: 'Bare metal',
    what: 'Hand-written drivers for GPIO, I2C, SPI, UART, and timers. No HAL.',
    why: 'Knowing exactly what every register does made each bus problem traceable to a cause.',
  },
  {
    name: 'FreeRTOS',
    what: 'Acquisition, filtering, and SD logging run as separate tasks, joined by queues and a ring buffer.',
    why: 'A slow SD write can no longer make the sampler miss a tick.',
  },
  {
    name: 'DMA',
    what: 'The IMU’s burst read is moved into memory by DMA.',
    why: 'The CPU stops shifting bytes off the I2C peripheral and stays free for the filter and the logger.',
  },
]

export default function IMULoggerCaseStudy() {
  return (
    <div className="reflection imu">
      <div className="container">

        {/* First impression: the hardware */}
        <Reveal>
          <figure className="imu-hero">
            <Image
              src="/imu-logger/hero-shot.jpg"
              alt="STM32 Nucleo board wired to an IMU breakout, a microSD module, and a logic analyzer on a work mat"
              width={2000}
              height={1096}
              priority
              sizes="(max-width: 1320px) 100vw, 1160px"
            />
            <div className="img-overlay" aria-hidden="true" />
            <figcaption className="refl-device-cap">
              The bench setup: STM32F411 Nucleo, IMU, microSD module, and a logic analyzer on every bus
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
              <h3 className="refl-step-q">A data logger built from the registers up</h3>
              <p>
                An STM32F411 reads an IMU over I2C, estimates roll and pitch with a complementary filter, and writes every sample to a microSD card over SPI as a CSV row. The peripherals are configured directly in registers, with no vendor HAL in between.
              </p>
              <p>
                <strong style={{ color: 'var(--txt)', fontWeight: 500 }}>My role:</strong> solo build. The drivers, task structure, filter, and logging path are all mine.
              </p>
            </div>
          </Reveal>

          {/* How it works */}
          <Reveal className="refl-step">
            <div className="refl-step-marker">
              <div className="refl-step-num">How it works</div>
            </div>
            <div>
              <h3 className="refl-step-q">Three steps, each removing the last one&apos;s limit</h3>
              <ol className="imu-prog">
                {progression.map((p, i) => (
                  <li key={p.name} className="imu-prog-item">
                    <div className="imu-prog-name">
                      <span aria-hidden="true">{i + 1}</span>{p.name}
                    </div>
                    <p>{p.what}</p>
                    <p className="imu-prog-why"><strong>Why it mattered:</strong> {p.why}</p>
                  </li>
                ))}
              </ol>

              <Figure
                src="/imu-logger/i2c-burst-read.png"
                alt="Logic analyzer decode of an I2C burst read: start, address 0x68, register 0x3B, repeated start, then 14 data bytes and stop"
                width={1344}
                height={300}
                caption="One I2C burst read, decoded: write to address 0x68, register 0x3B, repeated start, then all 14 sensor bytes (accel, temperature, gyro) in 1.54 ms."
              />
              <Figure
                src="/imu-logger/filter-demo.png"
                alt="Roll and pitch over a 38 second run comparing accelerometer-only, gyro-only, and complementary filter estimates"
                width={1650}
                height={1050}
                caption="Roll and pitch from a logged run (LOG011.CSV). The accelerometer alone is noisy, the gyro alone drifts, and the complementary filter holds both in check."
              />
            </div>
          </Reveal>

          {/* Challenges */}
          <Reveal className="refl-step">
            <div className="refl-step-marker">
              <div className="refl-step-num">Challenges</div>
            </div>
            <div>
              <div className="pbadge badge-silver">Fault injection</div>
              <h3 className="refl-step-q">The sensor came back from a power cut asleep</h3>
              <div className="refl-pullquote">
                <p>&ldquo;I unplugged my sensor mid-flight-log. It came back reporting zeros, and my code called it a success.&rdquo;</p>
              </div>

              <dl className="imu-bug">
                <div className="imu-bug-row">
                  <dt>What happened</dt>
                  <dd>
                    Every wait in the driver already had a timeout, so a dead sensor couldn&apos;t hang the loop. But after a power cut the sensor boots asleep, and it still answers on the bus. The driver saw a reply and moved on, while every reading was zero.
                  </dd>
                </div>
                <div className="imu-bug-row">
                  <dt>How I found it</dt>
                  <dd>In the log data, not the code. Rows of zeros appeared in the CSV after each reconnect.</dd>
                </div>
                <div className="imu-bug-row">
                  <dt>The fix</dt>
                  <dd>
                    An awake accelerometer always feels gravity, so all three axes reading exactly 0 is physically impossible. Now all-zero means asleep: re-wake the sensor and read again.
                  </dd>
                </div>
                <div className="imu-bug-row">
                  <dt>Proof</dt>
                  <dd>
                    <div className="imu-proof">
                      <div><span>24<em>s</em></span>test run</div>
                      <div><span>2</span>unplugs, ~4 s each</div>
                      <div><span>0</span>bad rows</div>
                    </div>
                    Logging never stopped.
                  </dd>
                </div>
                <div className="imu-bug-row imu-bug-lesson">
                  <dt>Lesson</dt>
                  <dd>&ldquo;The device answered&rdquo; is not &ldquo;the device is working.&rdquo;</dd>
                </div>
              </dl>

              <p className="imu-also">
                <strong>Also caught:</strong> the logic analyzer itself broke the bus. Left unpowered, it dragged the signals down through its internal protection circuits.
              </p>
            </div>
          </Reveal>

          {/* What's next */}
          <Reveal className="refl-step">
            <div className="refl-step-marker">
              <div className="refl-step-num">What&apos;s next</div>
            </div>
            <div>
              <div className="pbadge badge-aub">In progress</div>
              <h3 className="refl-step-q">OTA bootloader</h3>
              <p>
                A custom bootloader so the board can take new firmware over the air instead of through a programmer.
              </p>
            </div>
          </Reveal>
        </div>

        {/* Extra captures */}
        <Reveal>
          <div className="imu-more">
            <div className="sec-label">More captures</div>
            <div className="imu-gallery">
              <Figure
                src="/imu-logger/loop-timing.png"
                alt="Logic analyzer view of SCL, SDA, SPI, and a debug pin across several 10 millisecond frames, with one frame highlighted at 5.3 milliseconds"
                width={990}
                height={463}
                caption="Loop timing: every bus plus a debug pin across 10 ms frames. The frame that includes an SD write (highlighted) finishes in 5.3 ms."
              />
              <Figure
                src="/imu-logger/spi-write.png"
                alt="Logic analyzer SPI decode showing command 0x58, the 0xFE data token, and CSV text as ASCII bytes"
                width={967}
                height={254}
                caption="The SD write on the wire: command 0x58 (CMD24), the 0xFE data token, then the CSV row as plain ASCII."
              />
              <Figure
                src="/imu-logger/freertos-preemption.png"
                alt="Logic analyzer view of eight debug channels. D0 pulses every 10 milliseconds, including during a long D1 pulse"
                width={1636}
                height={365}
                caption="FreeRTOS tasks on debug pins: D0 fires every 10 ms (100 Hz), including while D1 is mid-run around 397–407 ms."
              />
            </div>
          </div>
        </Reveal>

      </div>
    </div>
  )
}
