'use client';

import dynamic from 'next/dynamic';

const Spline = dynamic(() => import('@splinetool/react-spline'), { ssr: false });

export default function SplineRobot() {
  return (
    <div style={{ position: 'relative', width: '100%', height: '100%' }}>
      <Spline scene="https://prod.spline.design/E74YaxYBe2pJTDbH/scene.splinecode" />
      <div style={{
        position: 'absolute',
        bottom: 0,
        right: 0,
        width: '220px',
        height: '60px',
        background: '#0a0a0a',
        zIndex: 10
      }} />
    </div>
  );
}