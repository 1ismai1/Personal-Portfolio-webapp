# Four portfolio transitions

User request: make the site feel more animated, specifically the hero-to-work transition and opening IMU Logger, Sensor Shield, and OTA Firmware Update.

Use the existing bench palette and type. One signal sweep introduces the work heading and lead card when reached by scrolling or the hero link. Each of the three project headers has a distinct, brief entrance: waveform acquisition, board layers aligning, and moving update packets. Decorative graphics fade away after the entrance; the content remains readable and interactive.

Approaches considered: a global navigation overlay could connect both pages but introduces navigation state and can obstruct slow routes; a heavy animation library is unnecessary. Selected implementation: CSS project entrances and a small IntersectionObserver for the work section. Keep normal Next links, browser history, modified clicks, and native anchor navigation.

Only transform and opacity animate. No loops, artificial loading progress, new dependency, or extra network asset. Reduced motion disables all four sequences. Content is visible without JavaScript. The user's explicit request overrides the earlier no-scroll-reveal rule for this one section only. Preserve the replay between hero and work. Work on the existing redesign-fable branch; no publish or merge.
