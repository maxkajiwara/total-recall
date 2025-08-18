import { ImageResponse } from 'next/og'

export const runtime = 'edge'

export const size = {
  width: 32,
  height: 32,
}
export const contentType = 'image/png'

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          background: 'radial-gradient(circle at center, #001a4d 0%, #000614 100%)',
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          position: 'relative',
        }}
      >
        {/* Eye shape */}
        <div
          style={{
            width: '24px',
            height: '12px',
            borderRadius: '50%',
            background: 'linear-gradient(to bottom, #0066ff, #003d99)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 0 8px rgba(0, 102, 255, 0.8)',
          }}
        >
          {/* Pupil */}
          <div
            style={{
              width: '8px',
              height: '8px',
              borderRadius: '50%',
              background: '#000',
              boxShadow: 'inset 0 0 4px rgba(0, 102, 255, 0.5)',
            }}
          />
        </div>
      </div>
    ),
    {
      ...size,
    }
  )
}