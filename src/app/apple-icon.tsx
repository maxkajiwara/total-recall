import { ImageResponse } from 'next/og'

export const runtime = 'edge'

export const size = {
  width: 180,
  height: 180,
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
            width: '120px',
            height: '60px',
            borderRadius: '50%',
            background: 'linear-gradient(to bottom, #0066ff, #003d99)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 0 40px rgba(0, 102, 255, 0.8)',
          }}
        >
          {/* Iris */}
          <div
            style={{
              width: '50px',
              height: '50px',
              borderRadius: '50%',
              background: 'radial-gradient(circle at center, #003d99, #001a4d)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            {/* Pupil */}
            <div
              style={{
                width: '20px',
                height: '20px',
                borderRadius: '50%',
                background: '#000',
                boxShadow: 'inset 0 0 10px rgba(0, 102, 255, 0.5)',
              }}
            />
          </div>
        </div>
        {/* Title text */}
        <div
          style={{
            position: 'absolute',
            bottom: '20px',
            fontSize: '16px',
            color: '#0066ff',
            fontWeight: 'bold',
            letterSpacing: '2px',
            textTransform: 'uppercase',
          }}
        >
          Total Recall
        </div>
      </div>
    ),
    {
      ...size,
    }
  )
}