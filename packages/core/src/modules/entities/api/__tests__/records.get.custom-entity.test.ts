/** @jest-environment node */
import { GET } from '@open-mercato/core/modules/entities/api/records'

const mockQE = {
  query: jest.fn(async () => ({
    items: [
      { id: 'rec-1', cf_date: '1', cf_how_long: 2, created_at: '2024-10-03T00:00:00Z' },
    ],
    total: 1,
    page: 1,
    pageSize: 50,
  })),
}

const mockEm = {
  findOne: jest.fn(async () => ({ id: 'ce-1', entityId: 'example:custom' })),
}

jest.mock('@/lib/di/container', () => ({
  createRequestContainer: async () => ({ resolve: (k: string) => (k === 'queryEngine' ? mockQE : mockEm) }),
}))

jest.mock('@/lib/auth/server', () => ({ getAuthFromRequest: () => ({ orgId: 'org', tenantId: 't1', roles: ['admin'] }) }))

describe('GET /api/entities/records for custom entities', () => {
  beforeEach(() => { jest.clearAllMocks() })

  it('returns items with bare keys (no cf_ prefix) and passes bare-key filters to QE', async () => {
    const url = 'http://x/api/entities/records?entityId=example:custom&page=1&pageSize=50&sortField=id&sortDir=asc&date=1&how_long=2'
    const req = new Request(url)
    const res = await GET(req)
    expect(res.status).toBe(200)
    const json = await res.json()
    expect(Array.isArray(json.items)).toBe(true)
    expect(json.items[0]).toMatchObject({ id: 'rec-1', date: '1', how_long: 2 })

    // QE called with filters containing bare keys when custom entity
    expect(mockQE.query).toHaveBeenCalled()
    const [, opts] = mockQE.query.mock.calls[0]
    expect(opts.filters).toMatchObject({ date: '1', how_long: '2' })
  })
})
