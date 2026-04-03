import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { z } from 'zod';
import { verifyUser } from './tools/verify-user';
import { getProtocol } from './tools/get-protocol';
import { updateUser } from './tools/update-user';
import { logSession } from './tools/log-session';
import { detectConflicts } from './tools/detect-conflicts';

export function createAccordMcpServer(): McpServer {
  const server = new McpServer({
    name: 'claude-accord-mcp',
    version: '1.0.0',
  });

  // Tool 1: Verify user and load full context
  server.tool(
    'accord_verify_user',
    'Verify a Claude Accord user key and load their full context including trust level, protocol, notes, competencies, gifts, and growth zones. Call this first in every session.',
    { api_key: z.string().describe('The user Claude Accord API key') },
    async ({ api_key }) => {
      try {
        const context = await verifyUser(api_key);
        return {
          content: [{ type: 'text' as const, text: JSON.stringify(context, null, 2) }],
        };
      } catch (err: any) {
        return {
          isError: true,
          content: [{ type: 'text' as const, text: err.message }],
        };
      }
    }
  );

  // Tool 2: Get protocol for a specific level
  server.tool(
    'accord_get_protocol',
    'Get the collaboration protocol text for a specific trust level (1-10). Use when adjusting protocol mid-session.',
    { level: z.number().int().min(1).max(10).describe('Trust level 1-10') },
    async ({ level }) => {
      try {
        const protocol = await getProtocol(level);
        return {
          content: [{ type: 'text' as const, text: JSON.stringify(protocol, null, 2) }],
        };
      } catch (err: any) {
        return {
          isError: true,
          content: [{ type: 'text' as const, text: err.message }],
        };
      }
    }
  );

  // Tool 3: Update user context (bidirectional — Claude writes back)
  server.tool(
    'accord_update_user',
    'Update user context with new observations. Appends notes, merges competencies/gifts/preferences. Never overwrites existing data.',
    {
      user_id: z.string().uuid().describe('User ID from verify_user response'),
      notes_to_append: z.string().optional().describe('Notes to append to claude_notes'),
      competencies_update: z.array(z.object({
        skill: z.string(),
        verified: z.boolean(),
        evidence: z.string(),
        detected_at: z.string(),
      })).optional().describe('New or updated competencies'),
      gifts_update: z.array(z.object({
        gift: z.string(),
        confidence: z.string(),
        first_observed: z.string(),
        notes: z.string(),
      })).optional().describe('New or updated gifts detected'),
      growth_zones_update: z.record(z.string(), z.unknown()).optional().describe('Updated growth zones'),
      interaction_preferences_update: z.record(z.string(), z.unknown()).optional().describe('Updated preferences'),
      trust_change: z.number().int().min(-1).max(1).optional().describe('Trust adjustment: -1, 0, or +1'),
    },
    async (params) => {
      try {
        const result = await updateUser(params);
        return {
          content: [{ type: 'text' as const, text: JSON.stringify(result) }],
        };
      } catch (err: any) {
        return {
          isError: true,
          content: [{ type: 'text' as const, text: err.message }],
        };
      }
    }
  );

  // Tool 4: Log a session
  server.tool(
    'accord_log_session',
    'Record a completed session with summary, trust change, and observations.',
    {
      user_id: z.string().uuid().describe('User ID'),
      summary: z.string().describe('Brief session summary'),
      trust_change: z.number().int().min(-1).max(1).describe('Trust change: -1, 0, or +1'),
      observations_added: z.string().optional().describe('New observations from this session'),
      protocol_level_used: z.number().int().min(1).max(10).describe('Protocol level used in session'),
    },
    async (params) => {
      try {
        const result = await logSession(params);
        return {
          content: [{ type: 'text' as const, text: JSON.stringify(result) }],
        };
      } catch (err: any) {
        return {
          isError: true,
          content: [{ type: 'text' as const, text: err.message }],
        };
      }
    }
  );

  // Tool 5: Detect preference conflicts
  server.tool(
    'accord_detect_conflicts',
    'Record a detected conflict between Accord protocol and user existing preferences or behaviour. Idempotent — same conflict is not duplicated.',
    {
      user_id: z.string().uuid().describe('User ID'),
      conflict_description: z.string().describe('Description of the detected conflict'),
      severity: z.enum(['low', 'medium', 'high', 'critical']).describe('Conflict severity'),
    },
    async (params) => {
      try {
        const result = await detectConflicts(params);
        return {
          content: [{ type: 'text' as const, text: JSON.stringify(result) }],
        };
      } catch (err: any) {
        return {
          isError: true,
          content: [{ type: 'text' as const, text: err.message }],
        };
      }
    }
  );

  return server;
}
