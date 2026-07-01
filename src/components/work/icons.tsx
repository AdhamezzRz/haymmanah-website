import type { Sector, Discipline } from '@/lib/work'

/* ─── Sector icons ───────────────────────────────────── */

function Ring({ size, ring = true, children }: { size: number; ring?: boolean; children: React.ReactNode }) {
  return (
    <svg viewBox="0 0 96 96" width={size} height={size} fill="none">
      {ring && <circle cx="48" cy="48" r="40" fill="rgba(201,161,74,0.08)" stroke="rgba(201,161,74,0.2)" strokeWidth="1" />}
      <g transform="translate(24,24)" stroke="var(--gold)" strokeWidth={ring ? 2.5 : 4} strokeLinecap="round" strokeLinejoin="round" fill="none">
        {children}
      </g>
    </svg>
  )
}

const sectorIcons: Record<Sector, (size: number, ring: boolean) => React.ReactNode> = {
  'مطاعم': (size, ring) => (
    <Ring size={size} ring={ring}>
      <path d="M8 0v18c0 5.523 4.477 10 10 10h4" />
      <path d="M14 0v12M20 0v12" opacity={0.6} strokeWidth={2} />
      <circle cx="34" cy="14" r="10" />
      <path d="M34 4v4M34 20v4" strokeWidth={2} />
      <path d="M24 38v10M10 48h28" />
    </Ring>
  ),
  'كافيهات': (size, ring) => (
    <Ring size={size} ring={ring}>
      <path d="M2 16h26a4 4 0 0 1 4 4v2a6 6 0 0 1-6 6h-2" />
      <path d="M2 16v16a8 8 0 0 0 8 8h12a8 8 0 0 0 8-8V16" />
      <path d="M8 4c0 2-2 2-2 4M16 4c0 2-2 2-2 4M24 4c0 2-2 2-2 4" strokeWidth={2} />
    </Ring>
  ),
  'تجزئة': (size, ring) => (
    <Ring size={size} ring={ring}>
      <path d="M4 6h40l-5 26H9L4 6z" />
      <path d="M4 6l-4-8H-6" />
      <circle cx="13" cy="40" r="3" fill="var(--gold)" />
      <circle cx="35" cy="40" r="3" fill="var(--gold)" />
      <path d="M14 6c0-5.523 4.477-10 10-10s10 4.477 10 10" opacity={0.5} />
    </Ring>
  ),
  'سيارات': (size, ring) => (
    <Ring size={size} ring={ring}>
      <path d="M-4 30h56v8h-56z" />
      <path d="M0 30l8-16h32l8 16" />
      <circle cx="8" cy="40" r="5" />
      <circle cx="40" cy="40" r="5" />
      <path d="M10 22h28" strokeWidth={1.5} opacity={0.4} />
    </Ring>
  ),
  'أمن': (size, ring) => (
    <Ring size={size} ring={ring}>
      <path d="M24 -4L2 6v16c0 13.255 9.401 25.647 22 29 12.599-3.353 22-15.745 22-29V6L24-4z" />
      <path d="M14 24l7 7 13-14" />
    </Ring>
  ),
  'عقارات': (size, ring) => (
    <Ring size={size} ring={ring}>
      <path d="M0 48V8h28v40" />
      <path d="M28 48V20h20v28" />
      <path d="M-4 48h56" />
      <rect x="6" y="16" width="8" height="8" rx="1" opacity={0.6} strokeWidth={1.5} />
      <rect x="6" y="30" width="8" height="8" rx="1" opacity={0.6} strokeWidth={1.5} />
      <rect x="20" y="16" width="8" height="8" rx="1" opacity={0.6} strokeWidth={1.5} />
      <rect x="34" y="28" width="8" height="8" rx="1" opacity={0.6} strokeWidth={1.5} />
    </Ring>
  ),
  'تعليم': (size, ring) => (
    <Ring size={size} ring={ring}>
      <path d="M24 2L-4 16l28 14 28-14-28-14z" />
      <path d="M52 16v14" />
      <path d="M6 24v12c0 5 8 10 18 10s18-5 18-10V24" />
      <circle cx="52" cy="32" r="3" fill="var(--gold)" />
    </Ring>
  ),
  'مقاولات': (size, ring) => (
    <Ring size={size} ring={ring}>
      <path d="M-12 26a12 12 0 0 1 24 0z" transform="translate(12,0)" />
      <path d="M24 26a12 12 0 0 1 24 0" />
      <path d="M-2 26h52" />
      <path d="M24-6v8" />
    </Ring>
  ),
  'عيادات': (size, ring) => (
    <Ring size={size} ring={ring}>
      <circle cx="24" cy="24" r="22" />
      <path d="M24 14v20M14 24h20" />
    </Ring>
  ),
  'مناسبات وفعاليات': (size, ring) => (
    <Ring size={size} ring={ring}>
      <path d="M24-6v10M24 38v10M-6 24h10M38 24h10" />
      <path d="M3 3l7 7M38 38l7 7M45 3l-7 7M10 38l-7 7" />
      <circle cx="24" cy="24" r="7" />
    </Ring>
  ),
  'بودكاست': (size, ring) => (
    <Ring size={size} ring={ring}>
      <path d="M24-2a7 7 0 0 0-7 7v18a7 7 0 0 0 14 0V5a7 7 0 0 0-7-7z" />
      <path d="M7 22v4a17 17 0 0 0 34 0v-4" />
      <path d="M24 43v8M14 51h20" />
    </Ring>
  ),
}

export function SectorIcon({ sector, size = 80, ring = true }: { sector: Sector; size?: number; ring?: boolean }) {
  return <>{sectorIcons[sector]?.(size, ring) ?? null}</>
}

/* ─── Discipline icons (compact, no ring) ────────────── */

const disciplineIcons: Record<Discipline, (size: number, color: string) => React.ReactNode> = {
  'برمجة وتطوير': (size, color) => (
    <svg viewBox="0 0 24 24" width={size} height={size} fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="8 6 2 12 8 18" />
      <polyline points="16 6 22 12 16 18" />
    </svg>
  ),
  'تسويق وإدارة حملات': (size, color) => (
    <svg viewBox="0 0 24 24" width={size} height={size} fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="3 17 9 11 13 15 21 7" />
      <polyline points="14 7 21 7 21 14" />
    </svg>
  ),
  'كتابة محتوى': (size, color) => (
    <svg viewBox="0 0 24 24" width={size} height={size} fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 20h9" />
      <path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4Z" />
    </svg>
  ),
  'تصوير': (size, color) => (
    <svg viewBox="0 0 24 24" width={size} height={size} fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2Z" />
      <circle cx="12" cy="13" r="4" />
    </svg>
  ),
  'هوية بصرية وجرافيك': (size, color) => (
    <svg viewBox="0 0 24 24" width={size} height={size} fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="9" />
      <circle cx="8.5" cy="9" r="1.1" fill={color} stroke="none" />
      <circle cx="9.5" cy="14.5" r="1.1" fill={color} stroke="none" />
      <circle cx="14.5" cy="15" r="1.1" fill={color} stroke="none" />
      <circle cx="15.5" cy="9.5" r="1.1" fill={color} stroke="none" />
    </svg>
  ),
  'مونتاج وفيديو': (size, color) => (
    <svg viewBox="0 0 24 24" width={size} height={size} fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="2" width="20" height="20" rx="2.18" />
      <line x1="7" y1="2" x2="7" y2="22" />
      <line x1="17" y1="2" x2="17" y2="22" />
      <line x1="2" y1="12" x2="22" y2="12" />
      <line x1="2" y1="7" x2="7" y2="7" />
      <line x1="2" y1="17" x2="7" y2="17" />
      <line x1="17" y1="17" x2="22" y2="17" />
      <line x1="17" y1="7" x2="22" y2="7" />
    </svg>
  ),
  'سيو وخرائط جوجل': (size, color) => (
    <svg viewBox="0 0 24 24" width={size} height={size} fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
      <circle cx="12" cy="10" r="3" />
    </svg>
  ),
  'بلوجرز ومودلز': (size, color) => (
    <svg viewBox="0 0 24 24" width={size} height={size} fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M19 8l.8 1.6 1.8.3-1.3 1.3.3 1.8-1.6-.85-1.6.85.3-1.8L16.4 9.9l1.8-.3z" />
    </svg>
  ),
}

export function DisciplineIcon({ discipline, size = 18, color }: { discipline: Discipline; size?: number; color?: string }) {
  return <>{disciplineIcons[discipline]?.(size, color ?? 'var(--gold)') ?? null}</>
}
