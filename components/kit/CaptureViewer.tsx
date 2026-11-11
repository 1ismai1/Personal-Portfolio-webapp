'use client'
import Image from 'next/image'
import { useRef, useState, type ReactNode } from 'react'

interface Props {
  src: string
  alt: string
  width: number
  height: number
  caption?: ReactNode
}

const ZOOMS = [1, 2, 4]

/**
 * A logic-analyzer capture on a scope-style plate. Click (or Enter/Space) opens
 * a native <dialog> where the capture can be zoomed to 2x / 4x and scrolled.
 * Keyboard: Tab to the zoom buttons, Esc closes, arrow keys scroll the capture.
 */
export default function CaptureViewer({ src, alt, width, height, caption }: Props) {
  const dialog = useRef<HTMLDialogElement>(null)
  const [zoom, setZoom] = useState(1)

  return (
    <figure className="my-6">
      <button
        type="button"
        onClick={() => { setZoom(1); dialog.current?.showModal() }}
        aria-label={`Zoom capture: ${alt}`}
        className="group relative block w-full cursor-zoom-in overflow-hidden rounded border border-line bg-mask-950 p-2 shadow-raised transition-transform duration-base ease-spring hover:-translate-y-0.5 active:translate-y-0 md:p-3"
      >
        <Image src={src} alt={alt} width={width} height={height} sizes="(max-width: 1240px) 100vw, 900px" className="block h-auto w-full rounded-xs" />
        <span className="ctl pointer-events-none absolute bottom-4 right-4 opacity-80 transition-opacity duration-fast group-hover:opacity-100 group-focus-visible:opacity-100" aria-hidden="true">
          Zoom
        </span>
      </button>
      {caption && <figcaption className="mt-3 max-w-prose text-xs text-silk-3">{caption}</figcaption>}

      <dialog
        ref={dialog}
        aria-label={`Capture viewer: ${alt}`}
        onClick={e => { if (e.target === dialog.current) dialog.current?.close() }}
        className="m-auto h-[92vh] w-[96vw] max-w-[1600px] rounded border border-line-2 bg-mask-800 p-0 text-silk-2 shadow-floating backdrop:bg-mask-950/80"
      >
        <div className="flex h-full flex-col">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-line px-4 py-3">
            <div className="flex items-center gap-2" role="group" aria-label="Zoom level">
              {ZOOMS.map(z => (
                <button key={z} type="button" className="ctl" aria-pressed={zoom === z} onClick={() => setZoom(z)}>
                  {z}×
                </button>
              ))}
            </div>
            <button type="button" className="ctl" onClick={() => dialog.current?.close()}>Close</button>
          </div>
          <div className="min-h-0 flex-1 overflow-auto bg-mask-950 p-3" tabIndex={0} aria-label="Capture, scrollable">
            {/* Plain img on purpose: full resolution, no resampling, so decode text stays sharp. */}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={src} alt={alt} style={{ width: `${zoom * 100}%`, maxWidth: 'none' }} className="block h-auto" />
          </div>
          {caption && <p className="border-t border-line px-4 py-3 text-xs text-silk-3">{caption}</p>}
        </div>
      </dialog>
    </figure>
  )
}
