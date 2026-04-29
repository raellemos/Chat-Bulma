import { AlexandriaIdentifier } from '@lobechat/builtin-tool-alexandria';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { type ToolExecutionContext } from '../../types';

const fetchMock = vi.fn();

describe('alexandriaRuntime', () => {
  const originalUrl = process.env.ALEXANDRIA_MCP_URL;
  const originalToken = process.env.ALEXANDRIA_MCP_TOKEN;

  beforeEach(() => {
    vi.resetModules();
    fetchMock.mockReset();
    vi.stubGlobal('fetch', fetchMock);
  });

  afterEach(() => {
    process.env.ALEXANDRIA_MCP_URL = originalUrl;
    process.env.ALEXANDRIA_MCP_TOKEN = originalToken;
    vi.unstubAllGlobals();
  });

  it('uses the correct identifier', async () => {
    process.env.ALEXANDRIA_MCP_URL = 'https://example.com/alexandria';
    process.env.ALEXANDRIA_MCP_TOKEN = 'token';

    const { alexandriaRuntime } = await import('../alexandria');

    expect(alexandriaRuntime.identifier).toBe(AlexandriaIdentifier);
  });

  it('returns a clear error when bridge env vars are missing', async () => {
    delete process.env.ALEXANDRIA_MCP_URL;
    delete process.env.ALEXANDRIA_MCP_TOKEN;

    const { alexandriaRuntime } = await import('../alexandria');
    const runtime = alexandriaRuntime.factory({ toolManifestMap: {} } as ToolExecutionContext);

    const result = await runtime.searchArtifacts({ query: 'Totum' });

    expect(result.success).toBe(false);
    expect(result.content).toContain('ALEXANDRIA_MCP_URL');
  });

  it('calls the Alexandria bridge with the expected payload', async () => {
    process.env.ALEXANDRIA_MCP_URL = 'https://example.com/alexandria';
    process.env.ALEXANDRIA_MCP_TOKEN = 'token';

    fetchMock.mockResolvedValue({
      json: async () => ({ items: [{ id: 'artifact-1', title: 'POP Deploy' }] }),
      ok: true,
      status: 200,
    });

    const { alexandriaRuntime } = await import('../alexandria');
    const runtime = alexandriaRuntime.factory({ toolManifestMap: {} } as ToolExecutionContext);

    const result = await runtime.searchArtifacts({
      artifactType: 'pop',
      limit: 3,
      query: 'deploy',
    });

    expect(fetchMock).toHaveBeenCalledWith('https://example.com/alexandria', {
      body: JSON.stringify({
        action: 'search',
        artifactType: 'pop',
        limit: 3,
        query: 'deploy',
      }),
      headers: {
        'Content-Type': 'application/json',
        'x-alexandria-token': 'token',
      },
      method: 'POST',
    });
    expect(result.success).toBe(true);
    expect(result.content).toContain('POP Deploy');
  });
});
