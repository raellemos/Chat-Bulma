export const AlexandriaIdentifier = 'lobe-alexandria';

export const AlexandriaApiName = {
  buildContextPack: 'buildContextPack',
  getArtifact: 'getArtifact',
  searchArtifacts: 'searchArtifacts',
} as const;

export type AlexandriaApiNameType =
  (typeof AlexandriaApiName)[keyof typeof AlexandriaApiName];

export interface SearchArtifactsParams {
  artifactType?: 'context_pack' | 'decision' | 'document' | 'pop' | 'prompt' | 'skill' | 'summary';
  limit?: number;
  query: string;
}

export interface GetArtifactParams {
  artifactId: string;
}

export interface BuildContextPackParams {
  limit?: number;
  query: string;
}
