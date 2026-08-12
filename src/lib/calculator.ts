/**
 * Rough, illustrative benchmark ranges for the Saudi digital market —
 * used to give a directional estimate, not a guarantee. Numbers are
 * deliberately conservative. Real figures are always audience- and
 * offer-specific, which is why the calculator's CTA is "book a real
 * consultation" rather than "here's your exact number."
 */
export interface Industry {
  slug: string
  name: string
  icon: string
  costPerLead: number       // SAR
  leadToCustomerRate: number // 0-1
  avgOrderValue: number      // SAR
}

export const industries: Industry[] = [
  {
    slug: 'restaurants',
    name: 'مطاعم وكافيهات',
    icon: 'M8 2v7a2 2 0 0 0 2 2h0M12 2v10M16 2c0 3-2 4-2 7v9M8 2c0 2-1.5 2-1.5 4.5S8 9 8 9',
    costPerLead: 12,
    leadToCustomerRate: 0.35,
    avgOrderValue: 85,
  },
  {
    slug: 'retail',
    name: 'تجزئة وتجارة إلكترونية',
    icon: 'M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4M3 6h18M16 10a4 4 0 0 1-8 0',
    costPerLead: 18,
    leadToCustomerRate: 0.22,
    avgOrderValue: 220,
  },
  {
    slug: 'real-estate',
    name: 'عقارات',
    icon: 'M3 9.5 12 3l9 6.5V20a1 1 0 0 1-1 1h-5v-7H9v7H4a1 1 0 0 1-1-1V9.5Z',
    costPerLead: 45,
    leadToCustomerRate: 0.04,
    avgOrderValue: 15000,
  },
  {
    slug: 'professional-services',
    name: 'خدمات مهنية واستشارية',
    icon: 'M20 7h-3V5a2 2 0 0 0-2-2h-6a2 2 0 0 0-2 2v2H4a1 1 0 0 0-1 1v3a4 4 0 0 0 4 4h1M20 7v10a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2v-6',
    costPerLead: 35,
    leadToCustomerRate: 0.18,
    avgOrderValue: 1200,
  },
  {
    slug: 'education',
    name: 'تعليم وتدريب',
    icon: 'M22 10 12 5 2 10l10 5 10-5Zm-5 3v5c0 1.5-2.5 3-5 3s-5-1.5-5-3v-5',
    costPerLead: 25,
    leadToCustomerRate: 0.20,
    avgOrderValue: 1800,
  },
  {
    slug: 'health',
    name: 'صحة وعيادات',
    icon: 'M20 12h-4l-3 9-4-18-3 9H2',
    costPerLead: 30,
    leadToCustomerRate: 0.28,
    avgOrderValue: 350,
  },
]

export interface CalculatorResult {
  leads: number
  customers: number
  revenue: number
  roas: number
}

export function calculate(budget: number, industry: Industry): CalculatorResult {
  const leads = budget / industry.costPerLead
  const customers = leads * industry.leadToCustomerRate
  const revenue = customers * industry.avgOrderValue
  const roas = budget > 0 ? revenue / budget : 0
  return { leads, customers, revenue, roas }
}

export function formatSAR(n: number): string {
  return Math.round(n).toLocaleString('ar-SA')
}
