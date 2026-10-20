import Image from 'next/image'

interface FigureProps {
  src: string
  alt: string
  width: number
  height: number
  caption: string
  className?: string
}

/** A capture or drawing on a light plate. Unoptimized + uncropped so fine detail stays crisp; click opens full size. */
export default function Figure({ src, alt, width, height, caption, className = '' }: FigureProps) {
  return (
    <figure className={`imu-fig ${className}`}>
      <a href={src} target="_blank" rel="noopener noreferrer" className="imu-fig-plate" aria-label={`${alt} (opens full size)`}>
        <Image src={src} alt={alt} width={width} height={height} unoptimized sizes="(max-width: 960px) 100vw, 1100px" />
      </a>
      <figcaption>{caption} <span className="imu-fig-hint">Tap to enlarge.</span></figcaption>
    </figure>
  )
}
