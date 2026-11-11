# IMU Logger content audit, November 11, 2026

The user confirmed that GitHub is authoritative and `C:/Users/ismai/IMULogger/Core/Src/main.c` is an older bring-up version. That local file performs polled raw reads, UART output and a 100 ms delay; it does not contain the RTOS/DMA logger. Neither firmware copy was modified.

Reviewed [GitHub main.c](https://github.com/1ismai1/imu-logger-stm32/blob/main/Core/Src/main.c), blob `c20d13b10775c9fca126933a451beca3cb5ae4ae`, plus Core/Inc/FreeRTOSConfig.h, Core/Src/freertos.c, Core/Src/diskio.c and README.md on main. Line references below refer to that main.c snapshot, not the older local file.

| Topic | Code evidence | Website treatment |
| --- | --- | --- |
| Scheduling | Lines 931–947 create four pipeline tasks plus defaultTask; lines 1134–1163 use vTaskDelayUntil(10 ms), fail/reinitialize, and non-blocking queue sends | Four logging tasks plus a heartbeat; target rate, not an unconditional scheduling guarantee |
| Queues/buffers | Lines 718–739 and 921–924: 16 raw samples, 64 rows, two 512-byte blocks; full queues increment drop counters | State buffer capacities and finite-stall limitation |
| Task jobs | Lines 1134–1394: sampling, calibration/filter, formatting/stats, FatFS writer/sync | Preserve the four confirmed job descriptions with accurate details |
| DMA | I2C payload lines 666–700, SPI payload lines 326–364 and 492–525 | Task sleeps for payload completion; register addressing, command bytes and several flag waits still poll. Remove “0 ms” total busy-wait claim |
| Timeouts | I2C register helpers have bounded waits; DMA task waits are 5 ms (I2C) and 20 ms (SPI). SPI TXE/RXNE/BSY and DMA disable loops include unbounded polls | Remove “every bus wait is time-bounded” |
| Filter | Lines 751–756 and 1175–1250: 200-sample calibration, five attempts, fallback bias; gyro /16.4, accel /4096 plus offsets, dt=0.01, gain=0.02; roll wrapping and pitch clamping | Match the fixed-step algorithm; all-zero accelerometer detection is a heuristic, not a physical impossibility claim |
| Persistence | Lines 1370–1391: f_write on full blocks, f_sync target every 1000 ticks; errors counted without retry. Partial formatter block stays in RAM | Remove guaranteed one-second power-loss bound; distinguish sensor reconnect in the same open file from reboot recovery |
| Clock | Lines 987–993: HSE bypass, PLL M=4/N=168/P=4. README documents 8 MHz ST-Link source and 200.11 ms over 20 periods | Explain actual clock source; accuracy remains a documented analyzer measurement |
| Stack detection | FreeRTOSConfig.h enables mode 2; freertos.c prints task name and halts in overflow hook | Retain. 3.5 KB RAM saving is a historical measurement documented in README, not a value inferred from current allocations |
| Disk driver | diskio.c calls sd_read_block/sd_write_block with 512-byte sectors | Custom FatFS disk driver confirmed |

The replay builder's scale factors, fixed offsets, fixed 10 ms integration step, 0.02 gain, wrap and clamp match this code. Replay displays the angles stored in the log; it does not rerun gyro calibration on already bias-corrected CSV values.

Performance figures (1.5 ms CPU-time reduction, ~5.1 KB/s, zero drops in tested runs, 10.6 ms save, 3.5 KB saved, and clock error) remain attributed to the resume, recorded logs and repository measurement documentation. Source inspection is not a new hardware test. The timing diagram is explicitly conceptual and no longer equates the CPU-time reduction with a combined I2C/SPI transfer duration.

Validation: TypeScript and production build pass; home first-load JavaScript stays 119 kB. Production home/IMU pages checked at 390 and 1440 px for corrected text, horizontal overflow and runtime errors. Both DMA states pass SVG label-bound checks at both widths. No firmware code or recorded datasets changed.
