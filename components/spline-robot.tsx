'use client';

import dynamic from 'next/dynamic';

const Spline = dynamic(() => import('@splinetool/react-spline'), { ssr: false });

export default function SplineRobot() {
  return (
    <Spline scene="https://prod.spline.design/E74YaxYBe2pJTDbH/scene.splinecode" />
  );
}