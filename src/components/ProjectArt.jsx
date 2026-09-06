import React, { useId } from 'react';

// Bespoke conceptual diagrams: these are illustrations, not clinical readouts.
export default function ProjectArt({ kind = 'timeline' }) {
  const id = useId().replace(/:/g, '');
  const strokes = ['#56ded5', '#499ac1', '#3d9f95'];
  return (
    <div className={'project-art art-' + kind} aria-hidden="true">
      <span className="art-label">
        {kind === 'imaging'
          ? 'MULTIMODAL REPRESENTATION'
          : kind === 'signals'
            ? 'FINDING THE EARLY SIGNAL'
            : kind === 'systems'
              ? 'CONNECTED INTELLIGENCE'
              : 'FROM EVENTS TO INSIGHT'}
      </span>
      <svg viewBox="0 0 400 225" fill="none">
        <defs>
          <radialGradient id={id}>
            <stop stopColor="#53e3d5" stopOpacity=".22" />
            <stop offset="1" stopColor="#53e3d5" stopOpacity="0" />
          </radialGradient>
        </defs>
        <ellipse cx="200" cy="125" rx="150" ry="95" fill={'url(#' + id + ')'} />
        {kind === 'timeline' && (
          <>
            {[72, 112, 152].map((y, i) => (
              <g key={y}>
                <path
                  d={'M35 ' + y + 'H365'}
                  stroke="#4a767a"
                  strokeOpacity=".2"
                  strokeDasharray="3 5"
                />
                <text
                  x="30"
                  y={y - 12}
                  fill="#7f9fa6"
                  fontSize="6"
                  fontFamily="monospace"
                >
                  {
                    [
                      'CLINICAL EVENTS',
                      'TEMPORAL ENCODING',
                      'MODEL ATTRIBUTION',
                    ][i]
                  }
                </text>
                {Array.from({ length: 14 }, (_, n) => (
                  <rect
                    key={n}
                    x={42 + n * 23}
                    y={y - 3 - ((n * 7 + i * 13) % 22)}
                    width="9"
                    height={6 + ((n * 7 + i * 13) % 22)}
                    rx="2"
                    fill={strokes[i]}
                    opacity={0.22 + ((n * 3 + i) % 6) * 0.12}
                  />
                ))}
              </g>
            ))}
            <path d="M36 183H365" stroke="#7cbdbd" strokeOpacity=".3" />
            {[45, 125, 205, 285, 360].map((x, i) => (
              <g key={x}>
                <circle cx={x} cy="183" r="3" fill="#53e3d5" />
                <text
                  x={x - 7}
                  y="200"
                  fill="#96b4b8"
                  fontSize="7"
                  fontFamily="monospace"
                >
                  {i * 4}h
                </text>
              </g>
            ))}
          </>
        )}
        {kind === 'imaging' && (
          <>
            <rect
              x="101"
              y="42"
              width="197"
              height="150"
              rx="6"
              stroke="#65bdbf"
              strokeOpacity=".25"
            />
            <path
              d="M200 60v101m0-81-11 11m11-11 12 11"
              stroke="#66cfc5"
              strokeWidth="2"
              opacity=".6"
            />
            {[-1, 1].map((side) => (
              <g
                key={side}
                transform={'translate(200 0) scale(' + side + ' 1)'}
              >
                <path
                  d="M14 84C35 54 60 70 66 105S72 164 44 171 12 144 14 84Z"
                  fill="#51c7ca"
                  fillOpacity=".05"
                  stroke="#72e1d7"
                  strokeOpacity=".55"
                />
                {[0, 1, 2, 3, 4, 5].map((i) => (
                  <path
                    key={i}
                    d={
                      'M17 ' +
                      (91 + i * 11) +
                      'Q38 ' +
                      (73 + i * 14) +
                      ' 61 ' +
                      (94 + i * 11)
                    }
                    stroke="#57b4b8"
                    strokeOpacity=".28"
                  />
                ))}
                {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11].map((i) => (
                  <circle
                    key={i}
                    cx={23 + ((i * 17) % 32)}
                    cy={90 + ((i * 29) % 64)}
                    r={1 + (i % 3) * 0.4}
                    fill="#78e6dc"
                    opacity=".5"
                  />
                ))}
              </g>
            ))}
            <rect
              x="216"
              y="105"
              width="44"
              height="35"
              rx="3"
              stroke="#53e3d5"
              strokeDasharray="3 2"
            />
            <path d="M261 118h60v-30h27" stroke="#53e3d5" strokeOpacity=".5" />
            <circle cx="349" cy="88" r="4" fill="#53e3d5" />
            <path d="M143 145H73v-31H48" stroke="#499ac1" strokeOpacity=".6" />
            <circle cx="47" cy="113" r="4" fill="#499ac1" />
            <text
              x="277"
              y="158"
              fill="#91bbc0"
              fontSize="6"
              fontFamily="monospace"
            >
              IMAGE × LANGUAGE
            </text>
          </>
        )}
        {kind === 'signals' && (
          <>
            {[80, 120, 160].map((y, i) => (
              <g key={y}>
                <path
                  d={'M28 ' + y + 'H374'}
                  stroke="#4a767a"
                  strokeOpacity=".15"
                />
                <path
                  d={
                    'M28 ' +
                    y +
                    'h22l9-5 9 9 8-4h17l8-20 8 34 9-21 9 7h25l8-4 10 9 8-5h20l8-22 9 38 9-24 9 8h20l9-4 8 8 9-4h28l8-18 9 30 8-20 9 8h28'
                  }
                  stroke={strokes[i]}
                  strokeOpacity={0.85 - i * 0.2}
                  strokeWidth="1.2"
                />
              </g>
            ))}
            <rect
              x="219"
              y="49"
              width="34"
              height="130"
              fill="#53e3d5"
              opacity=".05"
            />
            <path
              d="M236 49v130"
              stroke="#53e3d5"
              strokeOpacity=".5"
              strokeDasharray="3 4"
            />
            <circle cx="236" cy="83" r="5" fill="#53e3d5" />
            <text
              x="220"
              y="198"
              fill="#a0d6d0"
              fontSize="7"
              fontFamily="monospace"
            >
              SIGNAL → INSIGHT
            </text>
          </>
        )}
        {kind === 'systems' && (
          <>
            {[0, 1, 2, 3, 4, 5].map((n) => {
              const x = 200 + Math.cos((n * Math.PI) / 3) * 111,
                y = 120 + Math.sin((n * Math.PI) / 3) * 67;
              return (
                <g key={n}>
                  <path
                    d={'M200 120L' + x + ' ' + y}
                    stroke="#53e3d5"
                    strokeOpacity=".4"
                    strokeDasharray="4 4"
                  />
                  <rect
                    x={x - 20}
                    y={y - 13}
                    width="40"
                    height="26"
                    rx="4"
                    fill="#0d252b"
                    stroke="#53e3d5"
                    strokeOpacity=".5"
                  />
                  <circle cx={x} cy={y} r="3" fill="#53e3d5" />
                </g>
              );
            })}
            <circle
              cx="200"
              cy="120"
              r="30"
              fill="#0b2329"
              stroke="#53e3d5"
              strokeOpacity=".6"
            />
            <circle
              cx="200"
              cy="120"
              r="17"
              stroke="#53e3d5"
              strokeDasharray="2 3"
            />
            <circle cx="200" cy="120" r="5" fill="#53e3d5" />
          </>
        )}
      </svg>
      <span className="art-caption">
        CONCEPTUAL STUDY / {kind.toUpperCase()}
      </span>
    </div>
  );
}
