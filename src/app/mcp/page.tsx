import Link from 'next/link';
import type { Metadata } from 'next';
import SubpageHeader from '@/components/SubpageHeader';
import SubpageFooter from '@/components/SubpageFooter';

export const metadata: Metadata = { title: 'Claude Accord — MCP' };

export default function McpPage() {
  return (
    <>
      <div className="subpage">
        <SubpageHeader activeNav="mcp" />
        <main className="page-content" style={{ justifyContent: 'flex-start', paddingTop: '60px' }}>
          <div className="page-inner">
            <p className="section-label">Claude Accord</p>
            <h2><em>MCP</em></h2>
            <p className="lead">
              Connect Claude Accord directly to your Claude. No app to download.
              No interface to learn. Just Claude, with memory, trust, and a protocol that knows you.
            </p>

            <div className="info-grid">
              <div className="info-block">
                <div className="block-num">01</div>
                <h3>Get your key</h3>
                <p>Complete your first course. Your key activates automatically. One key, one identity, verified.</p>
              </div>
              <div className="info-block">
                <div className="block-num">02</div>
                <h3>Connect</h3>
                <p>Add the MCP server to your Claude account. One URL. Thirty seconds. Claude recognises you from that moment on.</p>
              </div>
              <div className="info-block">
                <div className="block-num">03</div>
                <h3>Start talking</h3>
                <p>Claude knows you now. Your level, your context, your history. Every session builds on the last one.</p>
              </div>
            </div>

            <div className="mcp-details">
              <h3>What the MCP server does</h3>

              <div className="mcp-tools">
                <div className="mcp-tool">
                  <span className="mcp-tool-name">Verify</span>
                  <span className="mcp-tool-desc">Confirms who you are and loads your full context at the start of every session.</span>
                </div>
                <div className="mcp-tool">
                  <span className="mcp-tool-name">Protocol</span>
                  <span className="mcp-tool-desc">Delivers the right collaboration level based on the trust you have earned.</span>
                </div>
                <div className="mcp-tool">
                  <span className="mcp-tool-name">Context</span>
                  <span className="mcp-tool-desc">Claude writes observations back to the server. Remembers you. Grows with you.</span>
                </div>
                <div className="mcp-tool">
                  <span className="mcp-tool-name">Sessions</span>
                  <span className="mcp-tool-desc">Every conversation is logged. Your trust builds over time through real interaction.</span>
                </div>
                <div className="mcp-tool">
                  <span className="mcp-tool-name">Conflicts</span>
                  <span className="mcp-tool-desc">Detects when old habits clash with the collaboration protocol. Helps you grow past them.</span>
                </div>
              </div>

              <h3>Technical</h3>

              <div className="mcp-tech">
                <div className="mcp-tech-row"><span className="mcp-tech-label">Endpoint</span><code>getaccord.online/api/mcp</code></div>
                <div className="mcp-tech-row"><span className="mcp-tech-label">Transport</span><span>Streamable HTTP</span></div>
                <div className="mcp-tech-row"><span className="mcp-tech-label">Tools</span><span>5</span></div>
                <div className="mcp-tech-row"><span className="mcp-tech-label">Auth</span><span>API key (OAuth 2.1 planned)</span></div>
                <div className="mcp-tech-row"><span className="mcp-tech-label">Stack</span><span>Next.js, Supabase, Vercel</span></div>
              </div>
            </div>

            <div className="about-cta">
              <h3>Ready to connect? Start your first course.</h3>
              <div className="page-cta">
                <Link href="/about" className="btn btn-primary">Step In</Link>
              </div>
            </div>
          </div>
        </main>
        <SubpageFooter />
      </div>
    </>
  );
}
