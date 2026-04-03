import Link from 'next/link';

export default function SubpageFooter() {
  return (
    <footer className="page-footer">
      <Link href="/">Home</Link>
      <Link href="/about">About</Link>
      <Link href="/contact">Contact</Link>
      <Link href="/gdpr">Privacy</Link>
    </footer>
  );
}
