import { AgentDocumentsIdentifier } from '@lobechat/builtin-tool-agent-documents';
import { AlexandriaIdentifier } from '@lobechat/builtin-tool-alexandria';

import type { BuiltinAgentDefinition } from '../../types';
import { BUILTIN_AGENT_SLUGS } from '../../types';
import { createSystemRole } from './systemRole';

/**
 * Inbox Agent - the default assistant agent for general conversations
 *
 * Note: model and provider are intentionally undefined to use user's default settings
 */
export const INBOX: BuiltinAgentDefinition = {
  avatar: '🫧',
  runtime: (ctx) => ({
    plugins: [
      AgentDocumentsIdentifier,
      ...(process.env.ALEXANDRIA_MCP_URL && process.env.ALEXANDRIA_MCP_TOKEN
        ? [AlexandriaIdentifier]
        : []),
      ...(ctx.plugins || []),
    ],
    systemRole: createSystemRole(ctx.userLocale, {
      hasAlexandria:
        !!process.env.ALEXANDRIA_MCP_URL && !!process.env.ALEXANDRIA_MCP_TOKEN,
    }),
  }),

  slug: BUILTIN_AGENT_SLUGS.inbox,
};
