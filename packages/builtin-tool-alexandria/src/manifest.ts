import { type BuiltinToolManifest } from '@lobechat/types';

import { systemPrompt } from './systemRole';
import { AlexandriaApiName, AlexandriaIdentifier } from './types';

export const AlexandriaManifest: BuiltinToolManifest = {
  api: [
    {
      description:
        'Search Alexandria for approved operational artifacts such as skills, POPs, prompts, decisions, summaries, documents, and context packs.',
      name: AlexandriaApiName.searchArtifacts,
      parameters: {
        additionalProperties: false,
        properties: {
          artifactType: {
            description: 'Optional artifact type filter.',
            enum: ['skill', 'pop', 'prompt', 'decision', 'summary', 'document', 'context_pack'],
            type: 'string',
          },
          limit: {
            description: 'Maximum number of results. Defaults to 8.',
            maximum: 20,
            minimum: 1,
            type: 'number',
          },
          query: {
            description: 'Search term or task description.',
            type: 'string',
          },
        },
        required: ['query'],
        type: 'object',
      },
      renderDisplayControl: 'expand',
    },
    {
      description: 'Load a full Alexandria artifact by ID.',
      name: AlexandriaApiName.getArtifact,
      parameters: {
        additionalProperties: false,
        properties: {
          artifactId: {
            description: 'Artifact ID returned by searchArtifacts.',
            type: 'string',
          },
        },
        required: ['artifactId'],
        type: 'object',
      },
      renderDisplayControl: 'expand',
    },
    {
      description: 'Build a compact Alexandria context pack for the current task.',
      name: AlexandriaApiName.buildContextPack,
      parameters: {
        additionalProperties: false,
        properties: {
          limit: {
            description: 'Maximum number of artifacts used in the context pack. Defaults to 6.',
            maximum: 12,
            minimum: 1,
            type: 'number',
          },
          query: {
            description: 'Task or topic used to assemble the context pack.',
            type: 'string',
          },
        },
        required: ['query'],
        type: 'object',
      },
      renderDisplayControl: 'expand',
    },
  ],
  executors: ['server'],
  identifier: AlexandriaIdentifier,
  meta: {
    avatar: '🏛️',
    description: 'Governed bridge to Alexandria knowledge and context packs.',
    tags: ['knowledge', 'rag', 'totum'],
    title: 'Alexandria',
  },
  systemRole: systemPrompt,
};
