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
// Checked against GitHub main.c blob c20d13b10775c9fca126933a451beca3cb5ae4ae.
// The user's local C:/Users/ismai/IMULogger copy is an older bring-up version.
const tasks = [
  { name: 'imu', prio: 'High', job: 'Targets a read every 10 ms, receives 14 sensor bytes by DMA, and retries initialization after a failed read.' },
  { name: 'filter', prio: 'Above normal', job: 'Calibrates gyro bias, runs the complementary filter, queues the row.' },
  { name: 'sd', prio: 'Below normal', job: 'Formats CSV into two alternating 512-byte buffers and reports queue, fault and stack statistics.' },
  { name: 'sdw', prio: 'Low', job: 'Writes full buffers through FatFS and SPI DMA, returns empty buffers, and requests a file sync once per second.' },
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
          An STM32F411 targets a sensor read every 10 ms over I2C, estimates roll and pitch with a complementary filter, and logs CSV rows to a microSD card over SPI. I wrote the data-path drivers at register level, plus a custom SPI disk driver under FatFS. STM32 HAL handles startup configuration and the time base.
        </p>
        <p><strong>My role:</strong> solo build. Drivers, task structure, filter, logging path and fault recovery are all mine.</p>
        <CaptureViewer
          src="/imu-logger/i2c-burst-read.png" width={1344} height={300}
          alt="Logic analyzer decode of an I2C burst read: start, address 0x68, register 0x3B, repeated start, then 14 data bytes and stop"
          caption="One sensor read on the wire: write to address 0x68, register 0x3B, repeated start, then all 14 bytes (accel, temperature, gyro)."
        />
      </Section>

      <Section refId="TP2" label="Architecture" title="Four logging tasks, separate from storage stalls">
        <p>
          SD cards stall. A save can take longer than a whole sample period, so the firmware splits sampling, filtering, CSV formatting and writing into four prioritized FreeRTOS tasks joined by queues and interrupt-driven notifications. A separate normal-priority heartbeat task toggles a debug pin every 250 ms.
        </p>
        <div className="my-6 overflow-x-auto rounded border border-line" tabIndex={0} role="region" aria-label="Firmware tasks, horizontally scrollable">
          <table className="w-full min-w-[520px] border-collapse text-left text-sm">
            <thead>
              <tr className="bg-mask-700 font-mono text-xs text-silk-2">
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
          The raw-sample queue holds 16 entries and the log queue holds 64. Sampling and filtering use non-blocking sends and count a dropped entry if a queue is full. These buffers absorb storage stalls; they do not guarantee lossless logging through an unlimited stall.
        </p>
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
          I moved the 14-byte sensor payload and 512-byte SD write payloads to DMA. The transfer task sleeps until an interrupt notifies it, leaving the CPU available to other tasks. The SD formatter and writer share two ping-pong buffers. Register addressing, SD commands and some flag checks still use polling.
        </p>
        <p>
          The measured CPU busy-wait reduction was 1.5 ms per 10 ms sample, about 15% of the period. Hardware tests recorded about 5.1 KB/s with zero dropped samples or SD errors; these are test results, not guarantees for every card or fault.
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
          The accelerometer estimates tilt from gravity but is disturbed by motion and vibration. The gyro tracks fast motion but drifts. Each update integrates gyro rate over a fixed 10 ms step and adds 2% of the previous angle’s error relative to the accelerometer estimate. Roll wraps at ±180°; pitch is clamped to ±90°. Switch the source below: it is a real log from the board.
        </p>
        <p>
          At startup, the filter measures gyro bias over 200 samples. If the board moves too much, it retries up to five windows, then keeps fallback bias values. Logging continues during calibration. After a sensor reconnect, both angle estimates restart from the accelerometer.
        </p>
        <div className="my-6"><Replay /></div>
      </Section>

      <Section refId="TP5" label="Fault recovery" title="Unplug it while it is running">
        <p>
          Failed sensor reads trigger an I2C reset and MPU-6050 reinitialization. Register transactions use bounded waits, and sensor DMA completion has a 5 ms timeout. Fault-injection tests showed logging resume in the same open file after unplugging and reconnecting the sensor. Some low-level SPI and DMA flag waits still have no timeout.
        </p>
        <p>
          The writer requests a file sync once per second. A power cut can also lose a partially filled RAM buffer or an unfinished write, so this interval is not a guaranteed one-second limit on data loss. Failed SD writes and syncs increment an error counter; they are not automatically retried.
        </p>
        <div className="my-6"><ProofStrip /></div>
        <BugCard
          title="The sensor came back from a power cut asleep"
          tag="Fault injection"
          symptom="After I unplugged and reconnected the sensor mid-log, rows of zeros appeared in the CSV. The driver reported every read as a success."
          cause="After a power cut the MPU-6050 boots in sleep mode, and it still answers on the bus. The driver saw a reply and moved on."
          fix="Treat six all-zero accelerometer bytes as a failed sample, reset I2C, and reinitialize the sensor before the next read. This is a recovery heuristic, not proof of the sensor’s state."
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
      <Section refId="TP7" label="Clock" title="From 1.5% clock error to under 0.06%">
        <p>
          I traced a 1.5% clock error to the internal RC oscillator. The current firmware uses the ST-Link’s 8 MHz clock through HSE bypass and the PLL to run at 84 MHz. The documented analyzer measurement was 200.11 ms for twenty target 10 ms periods, an error under 0.06%.
        </p>
        {/* TODO(ismail): export the PulseView clock capture to public/imu-logger/clock-hse.png before adding CaptureViewer. */}
      </Section>
    </div>
  )
}
