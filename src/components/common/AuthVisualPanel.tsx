import {
  BarChart3,
  Lightbulb,
  ListTree,
} from 'lucide-react'
import { RexaLogoArtwork } from './Logo'

const features = [
  {
    icon: ListTree,
    title: 'Detect reasoning roles',
    description: 'Identify claims, evidence, explanations and more.',
  },
  {
    icon: BarChart3,
    title: 'Measure reasoning depth',
    description: 'Get clear, explainable insights from 0 to 5 stars.',
  },
  {
    icon: Lightbulb,
    title: 'Build better learners',
    description: 'Turn feedback into stronger answers over time.',
  },
]

function AnalysisIllustration() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 760 300"
      className="mx-auto block w-full max-w-[760px]"
      role="presentation"
    >
      <defs>
        <linearGradient id="answer-card" x1="0" y1="0" x2="1" y2="1">
          <stop stopColor="#FFFFFF" />
          <stop offset="1" stopColor="#EAF6EF" />
        </linearGradient>
        <linearGradient id="depth-card" x1="0" y1="0" x2="0" y2="1">
          <stop stopColor="#174B3A" />
          <stop offset="1" stopColor="#0B2D23" />
        </linearGradient>
      </defs>

      <path d="M8 274H752" stroke="white" strokeOpacity=".12" />
      <circle cx="85" cy="44" r="2" fill="#8AD5B6" fillOpacity=".65" />
      <circle cx="707" cy="28" r="2" fill="#8AD5B6" fillOpacity=".55" />
      <circle cx="673" cy="268" r="2" fill="#8AD5B6" fillOpacity=".45" />

      <g filter="drop-shadow(0px 14px 18px rgba(0,0,0,.18))">
        <rect x="22" y="66" width="220" height="174" rx="18" fill="url(#answer-card)" />
        <text x="44" y="99" fill="#173C34" fontSize="17" fontWeight="700">Student answer</text>
        <text x="44" y="124" fill="#6C8177" fontSize="11">Descriptive response</text>
        <rect x="44" y="145" width="170" height="9" rx="4.5" fill="#BDD7CA" />
        <rect x="44" y="164" width="147" height="9" rx="4.5" fill="#80C9A9" />
        <rect x="44" y="183" width="160" height="9" rx="4.5" fill="#BDD7CA" />
        <rect x="44" y="202" width="111" height="9" rx="4.5" fill="#F2CE68" />
      </g>

      <path d="M258 153h40m-12-12 12 12-12 12" fill="none" stroke="#8AD5B6" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />

      <g filter="drop-shadow(0px 14px 18px rgba(0,0,0,.16))">
        <rect x="315" y="38" width="205" height="214" rx="20" fill="#0A271F" fillOpacity=".72" stroke="#8AD5B6" strokeOpacity=".28" />
        <text x="338" y="69" fill="#D9F3E4" fontSize="15" fontWeight="700">Reasoning map</text>
        <rect x="338" y="88" width="158" height="27" rx="9" fill="#F7FCF9" />
        <circle cx="353" cy="101.5" r="4" fill="#3187F5" />
        <text x="365" y="106" fill="#173C34" fontSize="12" fontWeight="600">Claim</text>
        <rect x="338" y="122" width="158" height="27" rx="9" fill="#F7FCF9" />
        <circle cx="353" cy="135.5" r="4" fill="#00A878" />
        <text x="365" y="140" fill="#173C34" fontSize="12" fontWeight="600">Evidence</text>
        <rect x="338" y="156" width="158" height="27" rx="9" fill="#F7FCF9" />
        <circle cx="353" cy="169.5" r="4" fill="#9155FF" />
        <text x="365" y="174" fill="#173C34" fontSize="12" fontWeight="600">Explanation</text>
        <rect x="338" y="190" width="158" height="27" rx="9" fill="#F7FCF9" />
        <circle cx="353" cy="203.5" r="4" fill="#00A878" />
        <text x="365" y="208" fill="#173C34" fontSize="12" fontWeight="600">Conclusion</text>
      </g>

      <path d="M536 153h28m-12-12 12 12-12 12" fill="none" stroke="#8AD5B6" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />

      <g filter="drop-shadow(0px 14px 18px rgba(0,0,0,.18))">
        <rect x="579" y="75" width="158" height="156" rx="20" fill="url(#depth-card)" stroke="#8AD5B6" strokeOpacity=".4" />
        <text x="601" y="106" fill="#D9F3E4" fontSize="14" fontWeight="600">Reasoning depth</text>
        <text x="600" y="148" fill="#F6C94C" fontSize="25" letterSpacing="2">★★★★☆</text>
        <text x="600" y="187" fill="white" fontSize="28" fontWeight="700">4/5</text>
        <text x="600" y="207" fill="#B8D8C8" fontSize="11">Explainable feedback</text>
      </g>
    </svg>
  )
}

export function AuthVisualPanel() {
  return (
    <div
      className="relative flex min-h-svh flex-col overflow-hidden px-8 py-8 text-white sm:px-10 lg:h-full lg:px-12 xl:px-16"
      style={{
        backgroundImage:
          'radial-gradient(circle at 12% 8%, color-mix(in srgb, var(--sidebar-primary) 16%, transparent), transparent 34%), radial-gradient(circle at 88% 80%, color-mix(in srgb, var(--sidebar-primary) 12%, transparent), transparent 34%), linear-gradient(145deg, var(--sidebar-accent), var(--sidebar) 58%, color-mix(in srgb, var(--sidebar) 65%, #000))',
      }}
    >
      <div aria-hidden="true" className="pointer-events-none absolute -right-28 top-[12%] h-80 w-80 rounded-full border border-white/[0.08]" />
      <div aria-hidden="true" className="pointer-events-none absolute -right-12 top-[18%] h-56 w-56 rounded-full border border-white/[0.08]" />

      <div className="relative z-10 mx-auto flex w-full max-w-[650px] flex-1 flex-col">
        <RexaLogoArtwork className="h-12 self-start text-[16px] sm:h-14 sm:text-[18px]" tone="dark" />

        <div className="mt-10 sm:mt-12">
          <h2 className="max-w-[560px] text-4xl font-bold leading-[1.04] tracking-[-0.04em] sm:text-5xl xl:text-[58px]">
            Smarter Analysis.
            <br />
            <span className="text-[#8AD88A]">Better Reasoning.</span>
          </h2>
          <p className="mt-5 max-w-[570px] text-sm leading-6 text-emerald-50/85 sm:text-base sm:leading-7">
            REXA analyzes the reasoning structure and depth of descriptive student answers — not just whether an answer is right or wrong.
          </p>
        </div>

        <div className="mt-7 grid gap-4 sm:grid-cols-3 lg:grid-cols-1 lg:gap-3 xl:mt-8">
          {features.map(({ icon: Icon, title, description }) => (
            <div key={title} className="flex items-center gap-3">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-emerald-200/25 bg-emerald-100/[0.06] text-[#8AD88A] sm:h-11 sm:w-11">
                <Icon className="h-5 w-5" strokeWidth={1.8} />
              </span>
              <div className="min-w-0">
                <p className="text-sm font-semibold leading-5 text-white sm:text-base">{title}</p>
                <p className="mt-0.5 text-xs leading-5 text-emerald-50/70 sm:text-sm">{description}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-auto pt-7 sm:pt-8">
          <AnalysisIllustration />
        </div>
      </div>
    </div>
  )
}
