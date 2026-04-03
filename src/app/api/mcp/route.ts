import { createAccordMcpServer } from '@/lib/mcp/server';
import { StreamableHTTPServerTransport } from '@modelcontextprotocol/sdk/server/streamableHttp.js';
import { IncomingMessage, ServerResponse } from 'http';
import { Readable } from 'stream';
import { Socket } from 'net';

function createMockReqRes(request: Request, body: string): { req: IncomingMessage; res: ServerResponse } {
  const url = new URL(request.url);

  const readable = new Readable();
  readable.push(body);
  readable.push(null);

  const req = Object.assign(readable, {
    method: request.method,
    url: url.pathname + url.search,
    headers: Object.fromEntries(request.headers.entries()),
  }) as unknown as IncomingMessage;

  const socket = new Socket();
  const res = new ServerResponse(req);
  res.assignSocket(socket);

  return { req, res };
}

function serverResponseToResponse(res: ServerResponse, chunks: Buffer[]): Response {
  const body = Buffer.concat(chunks).toString();
  const headers: Record<string, string> = {};
  const rawHeaders = res.getHeaders();
  for (const [key, value] of Object.entries(rawHeaders)) {
    if (value !== undefined) {
      headers[key] = Array.isArray(value) ? value.join(', ') : String(value);
    }
  }
  return new Response(body, {
    status: res.statusCode,
    headers,
  });
}

async function handleMcpRequest(request: Request): Promise<Response> {
  try {
    const server = createAccordMcpServer();
    const transport = new StreamableHTTPServerTransport({
      sessionIdGenerator: undefined,
      enableJsonResponse: true,
    });

    await server.connect(transport);

    const body = await request.text();
    const { req, res } = createMockReqRes(request, body);

    const chunks: Buffer[] = [];
    const originalWrite = res.write.bind(res);
    const originalEnd = res.end.bind(res);

    res.write = function (chunk: any, ...args: any[]) {
      if (chunk) chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk));
      return originalWrite(chunk, ...args);
    } as any;

    return new Promise<Response>((resolve) => {
      res.end = function (chunk?: any, ...args: any[]) {
        if (chunk) chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk));
        originalEnd(chunk, ...args);
        resolve(serverResponseToResponse(res, chunks));
      } as any;

      transport.handleRequest(req, res).catch((error) => {
        console.error('MCP transport error:', error);
        resolve(new Response(
          JSON.stringify({
            jsonrpc: '2.0',
            error: { code: -32603, message: 'Internal server error' },
            id: null,
          }),
          { status: 500, headers: { 'Content-Type': 'application/json' } }
        ));
      });
    });
  } catch (error) {
    console.error('MCP server error:', error);
    return new Response(
      JSON.stringify({
        jsonrpc: '2.0',
        error: { code: -32603, message: 'Internal server error' },
        id: null,
      }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  }
}

export async function GET(request: Request) {
  return handleMcpRequest(request);
}

export async function POST(request: Request) {
  return handleMcpRequest(request);
}

export async function DELETE() {
  return new Response(null, { status: 405 });
}
