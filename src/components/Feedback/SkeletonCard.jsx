import React from 'react'

export default function SkeletonCard({ height = 120 }) {
  return <div className="card skeleton" style={{ height }} aria-hidden />
}

