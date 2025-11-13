import React from 'react'
import { severityColor } from '../../utils/severity.js'
import { FEATURE_FLAGS } from '../../utils/constants.js'

export default function SeverityLegend() {
  if (!FEATURE_FLAGS.severityLegend) return null
  const bands = [
    { label: 'Low', from: 0, to: 1.5 },
    { label: 'Moderate', from: 1.5, to: 2.5 },
    { label: 'High', from: 2.5, to: 3.5 },
    { label: 'Very High', from: 3.5, to: 4.5 },
    { label: 'Extreme', from: 4.5, to: 5 }
  ]
  return (
    <div className="card" aria-label="Severity Legend">
      <h3 style={{ marginTop: 0, fontFamily: 'Bangers, cursive' }}>Weather Severity</h3>
      <div style={{ display: 'grid', gap: 6 }}>
        {bands.map((b) => (
          <div key={b.label} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{ width: 24, height: 10, background: severityColor(b.to - 0.01), borderRadius: 2 }} />
            <span>{b.label}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

