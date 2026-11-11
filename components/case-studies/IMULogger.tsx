import { BugCard, Figure, Section } from '@/components/kit'
import CaptureViewer from '@/components/kit/CaptureViewer'
import ProofStrip from '@/components/home/ProofStrip'
import TimingDiagram from '@/components/home/TimingDiagram'
import Replay from '@/components/replay/Replay'

/**
 * IMU Logger case study: the reference example for the kit.
 * Copy this file's structure when porting the other case studies.
 * Facts: resume + firmware repo (task names and priorities are from
 * Core/Src/main.c) + captures in public/imu-logger/.
 */
const tasks = [
  { name: 'imu', prio: 'High', job: 'Reads the sensor on every 10 ms tick. Nothing below it can delay a sample.' },
  { name: 'filter', prio: 'Above normal', job: 'Calibrates gyro bias, runs the complementary filter, queues the row.' },
  { name: 'sd', prio: 'Below normal', job: 'Formats rows as CSV text into the ping-pong buffers.' },
  { name: 'sdw', prio: 'Low', job: 'Writes each full buffer to the SD card while the other one fills.' },
]

export default function IMULogger() {
  return (
    <div className="wrap pb-8">
      <Figure
        src="/imu-logger/hero-shot.jpg" width={2000} height={1096} priority
        alt="STM32 Nucleo board wired to an IMU breakout, a microSD module, and a logic analyzer on a work mat"
        caption="The bench setup: STM32F411 Nucleo, IMU, microSD module, and a logic analyzer on every bus."
        sizes="(max-width: 1240px) 100vw, 1180px"
      />

      <Section refId="TP1" label="Overview" title="A data logger built from the registers up">
        <p>
          An STM32F411 reads an MPU-6050 over I2C at 100 Hz, estimates roll and pitch with a complementary filter, and writes every sample to a microSD card over SPI as a CSV row. I wrote the drivers for GPIO, UART, I2C, SPI and timers at register level, plus a custom SPI disk driver under FatFS.
        </p>
        <p><strong>My role:</strong> solo build. Drivers, task structure, filter, logging path and fault recovery are all mine.</p>
        <CaptureViewer
          src="/imu-logger/i2c-burst-read.png" width={1344} height={300}
          alt="Logic analyzer decode of an I2C burst read: start, address 0x68, register 0x3B, repeated start, then 14 data bytes and stop"
          caption="One sensor read on the wire: write to address 0x68, register 0x3B, repeated start, then all 14 bytes (accel, temperature, gyro)."
        />
      </Section>

      <Section refId="TP2" label="Architecture" title="Four tasks, so storage never delays sampling">
        <p>
          SD cards stall. A save can take longer than a whole sample period, so sampling and storage cannot share a loop. The firmware splits the work into four prioritized FreeRTOS tasks joined by queues and interrupt-driven notifications.
        </p>
        <div className="my-6 overflow-x-auto rounded border border-line">
          <table className="w-full min-w-[520px] border-collapse text-left text-sm">
            <thead>
              <tr className="bg-mask-700 font-mono text-xs text-silk-3">
                <th scope="col" className="px-4 py-3 font-normal">Task</th>
                <th scope="col" className="px-4 py-3 font-normal">Priority</th>
                <th scope="col" className="px-4 py-3 font-normal">Job</th>
              </tr>
            </thead>
            <tbody>
              {tasks.map(t => (
                <tr key={t.name} className="border-t border-line bg-mask-800">
                  <th scope="row" className="px-4 py-3 font-mono font-medium text-phos">{t.name}</th>
                  <td className="whitespace-nowrap px-4 py-3 text-silk">{t.prio}</td>
                  <td className="px-4 py-3 text-silk-2">{t.job}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p>
          The proof is on the logic analyzer: a sensor read fires on time in the middle of a 10.6 ms SD save. Every task stack is sized from its measured high-water mark, which freed 3.5 KB of RAM, and stack-overflow checking halts and names the task instead of silently corrupting memory.
        </p>
        <CaptureViewer
          src="/imu-logger/freertos-preemption.png" width={1636} height={365}
          alt="Logic analyzer view of eight debug channels. D0 pulses every 10 milliseconds, including during a long D1 pulse"
          caption="Tasks on debug pins: D0 (sampling) fires every 10 ms, including while D1 (storage) is mid-run."
        />
      </Section>

      <Section refId="TP3" label="DMA" title="1.5 ms of every 10 ms, handed back to the CPU" id="timing">
        <p>
          Polling a bus means the CPU waits on every byte. I moved sensor reads and SD writes to DMA with ping-pong buffers, which removed 1.5 ms of busy-waiting per 10 ms sample, measured on a logic analyzer. That is about 15% of each period. The logger sustains about 5.1 KB/s with zero dropped samples or SD errors.
        </p>
        <TimingDiagram />
        <CaptureViewer
          src="/imu-logger/spi-write.png" width={967} height={254}
          alt="Logic analyzer SPI decode showing command 0x58, the 0xFE data token, and CSV text as ASCII bytes"
          caption="An SD write on the wire: command 0x58 (CMD24), the 0xFE data token, then the CSV row as plain ASCII."
        />
      </Section>

      <Section refId="TP4" label="Filter" title="Why the firmware does not trust either sensor alone">
        <p>
          The accelerometer knows which way is down but shakes with every vibration. The gyro is smooth but drifts. The complementary filter takes fast motion from the gyro and pulls 2% toward the accelerometer each sample. Switch the source below: it is a real log from the board.
        </p>
        <div className="my-6"><Replay /></div>
      </Section>

      <Section refId="TP5" label="Fault recovery" title="Unplug it while it is running">
        <p>
          Every bus wait is time-bounded, so a dead device cannot hang the loop. I verified recovery with fault-injection tests: logging resumes in the same file after the sensor is unplugged or power-cycled, and a power cut loses about 1 s of data.
        </p>
        <div className="my-6"><ProofStrip /></div>
        <BugCard
          title="The sensor came back from a power cut asleep"
          tag="Fault injection"
          symptom="After I unplugged and reconnected the sensor mid-log, rows of zeros appeared in the CSV. The driver reported every read as a success."
          cause="After a power cut the MPU-6050 boots in sleep mode, and it still answers on the bus. The driver saw a reply and moved on."
          fix="An awake accelerometer always feels gravity, so all three axes reading exactly 0 is physically impossible. All-zero now means asleep: wake the sensor and read again."
          lesson="“The device answered” is not “the device is working.”"
        />
      </Section>

      <Section refId="TP6" label="More captures" title="Loop timing across the buses">
        <CaptureViewer
          src="/imu-logger/loop-timing.png" width={990} height={463}
          alt="Logic analyzer view of SCL, SDA, SPI, and a debug pin across several 10 millisecond frames"
          caption="Every bus plus a debug pin across 10 ms frames, captured before the DMA work."
        />
      </Section>
    </div>
  )
}
