import Link from 'next/link';

export default function StaticFooter() {
  return (
    <footer className="static-footer">
      <div className="container">
        <div className="footer-links">
          <Link href="/about">About</Link>
          <Link href="/contact">Contact</Link>
          <Link href="/gdpr">Privacy / GDPR</Link>
        </div>
        <p>&copy; 2026 Claude Accord. All rights reserved.</p>
      </div>
    </footer>
  );
}
