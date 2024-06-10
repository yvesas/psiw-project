export function VideoPlayer({ ...rest }) {
  return (
    <video
      // src={src}
      // onPlay={onPlay}
      // onClick={!hasVideoEnded ? onClick : undefined}
      {...rest}
      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
      controls={false}
      preload="metadata"
      playsInline
    />
  )
}

