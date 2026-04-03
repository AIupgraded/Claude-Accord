'use client';

import Link from 'next/link';
import { useState } from 'react';

interface SubpageHeaderProps {
  activeNav?: string;
}

export default function SubpageHeader({ activeNav }: SubpageHeaderProps) {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="site-header">
      <div className="site-title-group">
        <h1 className="site-title">
          <Link href="/">Claude <em>Accord</em></Link>
        </h1>
        <span className="site-slogan">Working together. Building trust.</span>
      </div>

      <nav className={`nav-menu${menuOpen ? ' open' : ''}`}>
        <Link href="/" className={activeNav === 'home' ? 'active' : ''}>Home</Link>
        <Link href="/info" className={activeNav === 'info' ? 'active' : ''}>Info</Link>
        <Link href="/blog" className={activeNav === 'blog' ? 'active' : ''}>Blog</Link>
        <Link href="/resources" className={activeNav === 'resources' ? 'active' : ''}>Resources</Link>
        <Link href="/contact" className={activeNav === 'contact' ? 'active' : ''}>Contact</Link>
      </nav>

      <div className="header-auth">
        <div className="auth-logged-out">
          <Link href="/login" className="btn-header">Log In</Link>
          <Link href="/signup" className="btn-header primary">Sign Up</Link>
        </div>
        <div className="auth-logged-in">
          <span className="greeting" id="headerGreeting"></span>
          <button className="btn-header ghost-small" id="logoutBtn">Sign out</button>
        </div>
      </div>
      <button className="hamburger" onClick={() => setMenuOpen(!menuOpen)}>&#9776;</button>
    </header>
  );
}
