'use client';

import Link from 'next/link';
import { useState } from 'react';

interface StaticNavProps {
  activeNav?: string;
  showAuth?: boolean;
}

export default function StaticNav({ activeNav, showAuth = true }: StaticNavProps) {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <nav className="static-nav">
      <div className="container">
        <Link href="/" className="logo">Claude <span>Accord</span></Link>
        <button className="hamburger" onClick={() => setMenuOpen(!menuOpen)}>&#9776;</button>
        <ul className={`nav-links${menuOpen ? ' open' : ''}`}>
          <li><Link href="/">Home</Link></li>
          <li><Link href="/guest" className={activeNav === 'guest' ? 'active' : ''}>Preview</Link></li>
          <li><Link href="/about" className={activeNav === 'about' ? 'active' : ''}>About</Link></li>
          <li><Link href="/contact" className={activeNav === 'contact' ? 'active' : ''}>Contact</Link></li>
          {showAuth && (
            <>
              <li className="auth-logged-out"><Link href="/login" className="btn btn-ghost">Log in</Link></li>
              <li className="auth-logged-out"><Link href="/signup" className="btn btn-primary">Sign up</Link></li>
              <li className="auth-logged-in" style={{ display: 'none' }}><a href="#" id="logoutBtn" className="btn btn-ghost">Log out</a></li>
            </>
          )}
        </ul>
      </div>
    </nav>
  );
}
