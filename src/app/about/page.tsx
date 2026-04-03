import Link from 'next/link';
import type { Metadata } from 'next';
import StaticNav from '@/components/StaticNav';
import StaticFooter from '@/components/StaticFooter';
import SupabaseProvider from '@/components/SupabaseProvider';

export const metadata: Metadata = { title: 'About | Claude Accord' };

export default function AboutPage() {
  return (
    <>
      <SupabaseProvider />
      <StaticNav activeNav="about" />
      <div className="static-page">
        <h1>About Claude Accord</h1>
        <p>Claude Accord is a curated library of AI prompts designed to help you get the most out of artificial intelligence — whether for personal productivity, business workflows, or creative projects.</p>

        <h2>Our Mission</h2>
        <p>We believe that the right prompt makes all the difference. Our mission is to bridge the gap between people and AI by providing ready-to-use, expertly crafted prompts that deliver real results.</p>

        <h2>How It Works</h2>
        <ul>
          <li><strong>Choose your tier</strong> — Personal, Business, or Creative — based on your needs.</li>
          <li><strong>Browse prompts</strong> — Each prompt is tested, refined, and categorized for easy discovery.</li>
          <li><strong>Copy &amp; use</strong> — Paste prompts directly into Claude, ChatGPT, or any AI assistant.</li>
        </ul>

        <h2>Who&apos;s Behind This?</h2>
        <p>Claude Accord is built by Claudiu Cornea — a developer, creator, and AI enthusiast based in Europe. This project combines a passion for technology with a desire to make AI accessible to everyone.</p>

        <h2>Open &amp; Transparent</h2>
        <p>We respect your privacy and follow GDPR guidelines. We only collect the data necessary to provide our service. Read our <Link href="/gdpr">Privacy Policy</Link> for details.</p>
      </div>
      <StaticFooter />
    </>
  );
}
