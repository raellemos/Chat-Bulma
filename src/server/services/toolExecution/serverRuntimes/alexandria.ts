import { AlexandriaIdentifier } from '@lobechat/builtin-tool-alexandria';
import type { BuiltinServerRuntimeOutput } from '@lobechat/types';

import type { ServerRuntimeRegistration } from './types';

interface SearchArtifactsParams {
  artifactType?: string;
  limit?: number;
  query: string;
}

interface GetArtifactParams {
  artifactId: string;
}

interface BuildContextPackParams {
  limit?: number;
  query: string;
}

type AlexandriaAction = 'context_pack' | 'get_artifact' | 'search';

class AlexandriaExecutionRuntime {
  private readonly url = process.env.ALEXANDRIA_MCP_URL || '';
  private readonly token = process.env.ALEXANDRIA_MCP_TOKEN || '';

  private async request(action: AlexandriaAction, payload: Record<string, unknown>) {
    if (!this.url || !this.token) {
      throw new Error(
        'Alexandria bridge is not configured. Set ALEXANDRIA_MCP_URL and ALEXANDRIA_MCP_TOKEN.',
      );
    }

    const response = await fetch(this.url, {
      body: JSON.stringify({ action, ...payload }),
      headers: {
        'Content-Type': 'application/json',
        'x-alexandria-token': this.token,
      },
      method: 'POST',
    });

    const data = await response.json().catch(() => ({}));

    if (!response.ok) {
      throw new Error(
        typeof data?.error === 'string' ? data.error : `Alexandria request failed (${response.status})`,
      );
    }

    return data;
  }

  private success(content: unknown, state?: Record<string, unknown>): BuiltinServerRuntimeOutput {
    return {
      content: typeof content === 'string' ? content : JSON.stringify(content, null, 2),
      state,
      success: true,
    };
  }

  private failure(error: unknown): BuiltinServerRuntimeOutput {
    const message = error instanceof Error ? error.message : String(error);

    return {
      content: message,
      error: { message },
      success: false,
    };
  }

  searchArtifacts = async (params: SearchArtifactsParams): Promise<BuiltinServerRuntimeOutput> => {
    if (!params?.query?.trim()) return this.failure('query is required');

    try {
      const data = await this.request('search', {
        artifactType: params.artifactType,
        limit: params.limit || 8,
        query: params.query.trim(),
      });

      return this.success(data, {
        artifactType: params.artifactType,
        limit: params.limit || 8,
        query: params.query.trim(),
      });
    } catch (error) {
      return this.failure(error);
    }
  };

  getArtifact = async (params: GetArtifactParams): Promise<BuiltinServerRuntimeOutput> => {
    if (!params?.artifactId?.trim()) return this.failure('artifactId is required');

    try {
      const data = await this.request('get_artifact', {
        artifactId: params.artifactId.trim(),
      });

      return this.success(data, { artifactId: params.artifactId.trim() });
    } catch (error) {
      return this.failure(error);
    }
  };

  buildContextPack = async (
    params: BuildContextPackParams,
  ): Promise<BuiltinServerRuntimeOutput> => {
    if (!params?.query?.trim()) return this.failure('query is required');

    try {
      const data = await this.request('context_pack', {
        limit: params.limit || 6,
        query: params.query.trim(),
      });

      return this.success(data, {
        limit: params.limit || 6,
        query: params.query.trim(),
      });
    } catch (error) {
      return this.failure(error);
    }
  };
}

const runtime = new AlexandriaExecutionRuntime();

export const alexandriaRuntime: ServerRuntimeRegistration = {
  factory: () => runtime,
  identifier: AlexandriaIdentifier,
};
