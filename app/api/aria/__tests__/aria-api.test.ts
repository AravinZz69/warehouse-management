import { describe, it, expect, vi, beforeEach } from 'vitest';
import { NextRequest } from 'next/server';

// Mock lib/gemini/client
vi.mock('@/lib/gemini/client', () => ({
  runGeminiJSON: vi.fn(),
  getEffectiveApiKey: vi.fn().mockReturnValue('mock-api-key'),
}));

import { runGeminiJSON } from '@/lib/gemini/client';
import { POST } from '../query/route';

describe('ARIA API Integration Test — /api/aria/query', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('Mocks Gemini response and asserts correct JSON shape returned from POST /api/aria/query', async () => {
    const mockGeminiOutput = {
      answer: 'Optimal picking sequence generated for Zone A.',
      sql_hint: 'SELECT * FROM inventory_levels WHERE bin_code LIKE "A-%";',
      recommended_actions: ['Initiate wave pick batch #104'],
    };

    (runGeminiJSON as any).mockResolvedValueOnce(mockGeminiOutput);

    const request = new NextRequest('http://localhost:3000/api/aria/query', {
      method: 'POST',
      body: JSON.stringify({ query: 'Show optimal picking sequence for Zone A' }),
      headers: {
        'Content-Type': 'application/json',
      },
    });

    const response = await POST(request);
    const json = await response.json();

    expect(response.status).toBe(200);
    expect(json).toHaveProperty('success', true);
    expect(json).toHaveProperty('data');
    expect(json.data.answer).toBe('Optimal picking sequence generated for Zone A.');
    expect(json.data.sql_hint).toContain('SELECT * FROM inventory_levels');
    expect(json.data.recommended_actions).toContain('Initiate wave pick batch #104');
  });
});
