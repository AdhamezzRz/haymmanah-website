/**
 * Server-side business rules that run around every create/update — server only.
 *
 * `beforeSave` may stamp server-managed fields onto the data or reject the write;
 * `afterSave` propagates effects to other records (e.g. logging a call updates
 * the client's "last contact"). Keep these small and explicit: this file is the
 * portal's whole "automation" layer.
 */
import { store, logActivity } from './store'
import { dayKey } from './format'
import { DEAL_CLOSED } from './modules'
import type { BaseRecord, ModuleDef } from './schema'
import type { PortalUser } from './auth'

const now = () => new Date().toISOString()

/** Returns field errors to reject the write, or null to continue. Mutates `data`. */
export function beforeSave(
  def: ModuleDef,
  data: Record<string, unknown>,
  existing: BaseRecord | undefined,
  user: PortalUser,
): Record<string, string> | null {
  const next = { ...(existing ?? {}), ...data }

  if (def.key === 'tasks') {
    const wasDone = existing?.status === 'done'
    const isDone = next.status === 'done'
    if ('status' in data && data.status !== existing?.status) data.statusChangedAt = now()
    if (isDone && !wasDone) data.completedAt = now()
    if (!isDone && wasDone) {
      // reopened: the old rating no longer describes the work
      data.completedAt = null
      data.rating = null
      data.ratingNote = ''
      data.ratedAt = null
      data.ratedBy = null
    }
    if ('rating' in data && data.rating !== null && data.rating !== undefined) {
      if (!isDone) return { rating: 'يمكن تقييم المهمة بعد اكتمالها فقط' }
      if (data.rating !== existing?.rating) { data.ratedAt = now(); data.ratedBy = user.id }
    }
    if ('assignee' in data && data.assignee !== existing?.assignee) {
      data.assignedAt = now()
      data.assignedBy = user.id
    }
  }

  if (def.key === 'deals') {
    const wasClosed = DEAL_CLOSED.includes(String(existing?.stage ?? ''))
    const isClosed = DEAL_CLOSED.includes(String(next.stage ?? ''))
    if ('stage' in data && data.stage !== existing?.stage) data.stageChangedAt = now()
    if (isClosed && !wasClosed) data.closedAt = dayKey()
    if (!isClosed && wasClosed) data.closedAt = null
    if (next.stage !== 'lost' && 'lostReason' in next && next.lostReason) data.lostReason = ''
  }

  if (def.key === 'interactions') {
    if (!next.by) data.by = user.id
    if (!next.at) data.at = now()
  }

  if (def.key === 'invoices') {
    if (next.status === 'paid' && !next.paidAt) data.paidAt = dayKey()
  }

  return null
}

export async function afterSave(
  def: ModuleDef,
  rec: BaseRecord,
  existing: BaseRecord | undefined,
  user: PortalUser,
): Promise<void> {
  // Logging a conversation keeps the client (and deal) follow-up dates honest.
  if (def.key === 'interactions' && rec.client) {
    const client = await store.get('clients', String(rec.client))
    if (client) {
      const patch: Record<string, unknown> = {}
      if (!client.lastContactAt || String(rec.at) > String(client.lastContactAt)) patch.lastContactAt = rec.at
      if (rec.nextDate && rec.nextDate !== existing?.nextDate) patch.nextFollowUp = rec.nextDate
      if (Object.keys(patch).length) await store.update('clients', client.id, patch)
    }
    if (rec.deal && rec.nextDate && rec.nextDate !== existing?.nextDate) {
      const deal = await store.get('deals', String(rec.deal))
      if (deal && !DEAL_CLOSED.includes(String(deal.stage))) await store.update('deals', deal.id, { nextFollowUp: rec.nextDate })
    }
  }

  // Winning a deal turns a prospect into an active client.
  if (def.key === 'deals' && rec.stage === 'won' && existing?.stage !== 'won' && rec.client) {
    const client = await store.get('clients', String(rec.client))
    if (client && (client.status === 'lead' || client.status === 'proposal')) {
      await store.update('clients', client.id, { status: 'active', startDate: client.startDate || dayKey() })
      await logActivity({ userId: user.id, userName: user.name, module: 'clients', recordId: client.id, recordTitle: String(client.name), action: 'update', summary: 'أصبح عميلاً نشطاً بعد كسب الفرصة' })
    }
  }
}
