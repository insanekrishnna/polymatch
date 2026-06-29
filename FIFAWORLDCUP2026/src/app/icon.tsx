import { ImageResponse } from 'next/og'

// Image metadata
export const size = {
  width: 32,
  height: 32,
}
export const contentType = 'image/png'

// Image generation
export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: '#16a34a',
          borderRadius: '50%',
        }}
      >
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="white"
          strokeWidth="1.6"
          strokeLinecap="round"
          strokeLinejoin="round"
          style={{ width: '65%', height: '65%' }}
        >
          <circle cx="12" cy="12" r="9.2" />
          <path d="M12 4.5l3.8 2.8-1.5 4.4h-4.6L8.2 7.3 12 4.5z" />
          <path d="M10.2 11.7l1.8 5.6 1.8-5.6" />
          <path d="M3.8 10.2l3 2.2-.7 4.2" />
          <path d="M20.2 10.2l-3 2.2.7 4.2" />
          <path d="M6.1 17.2l2.6-.5" />
          <path d="M17.9 17.2l-2.6-.5" />
        </svg>
      </div>
    ),
    {
      ...size,
    }
  )
}
