/** Skills, straight from the resume, laid out like a pin table: group, then what is on it. */
const rows: [string, string[]][] = [
  ['Languages', ['C/C++', 'Python', 'Verilog']],
  ['Embedded firmware', ['Real-time C', 'Device drivers', 'FreeRTOS', 'DMA', 'Interrupts', 'Timers', 'FatFS']],
  ['Protocols', ['I2C', 'SPI', 'UART', 'SD card (SPI mode)']],
  ['Hardware', ['STM32 (Cortex-M4)', 'ESP32', 'Altium Designer', 'KiCad', 'Soldering and rework']],
  ['Debug and validation', ['Logic analyzer with I2C/SPI decoding (PulseView)', 'Fault-injection tests', 'SPI loopback and block read-back tests', 'Stack high-water-mark analysis', 'Python log analysis']],
  ['Tools', ['STM32CubeIDE', 'STM32CubeMX', 'Git/GitHub', 'Quartus']],
]

export default function Skills() {
  return (
    <dl className="m-0 border-b border-line">
      {rows.map(([group, items]) => (
        <div key={group} className="grid gap-x-12 gap-y-2 border-t border-line py-5 md:grid-cols-[220px_minmax(0,1fr)]">
          <dt className="ref pt-1">{group}</dt>
          <dd className="flex flex-wrap gap-x-6 gap-y-1 text-base text-silk">
            {items.map(i => <span key={i}>{i}</span>)}
          </dd>
        </div>
      ))}
    </dl>
  )
}
