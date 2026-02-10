'use client';

import Link from 'next/link';
import { Github, Linkedin, Twitter, Rss } from 'lucide-react';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t border-border bg-muted/30">
      <div className="mx-auto max-w-3xl px-6 py-12">
        <div className="flex flex-col gap-8 md:flex-row md:items-center md:justify-between">
          <nav aria-label="Footer navigation">
            <h3 className="text-sm font-medium text-foreground mb-4">
                Navigation
              </h3>
            <ul className="space-y-2">
              <li>
                <Link href="/blog" className="text-sm text-muted hover:text-foreground">
                  Blog
                </Link>
              </li>
              <li>
                <Link href="/portfolio" className="text-sm text-muted hover:text-foreground">
                  Portfolio
                </Link>
              </li>
              <li>
                <Link href="/research" className="text-sm text-muted hover:text-foreground">
                  Research
                </Link>
              </li>
              <li>
                <Link href="/about" className="text-sm text-muted hover:text-foreground">
                  About
                </Link>
              </li>
            </ul>
          </nav>
        </div>

        <div className="text-sm text-muted">
          <p>
            Copyright {currentYear}{' '}
            <Link href="/" className="text-foreground hover:text-accent">
              depp
            </Link>
            . Built with{' '}
            <Link href="https://nextjs.org" className="text-accent">
              Next.js
            </Link>.
          </p>
        </div>

        <div className="mt-4 flex gap-4 text-xs text-muted">
          <a
            href="https://github.com/lightwater2/the-house-of-the-depp"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 hover:text-foreground"
            aria-label="Source code on GitHub"
          >
            <Github className="h-4 w-4" aria-hidden="true" />
            <span>GitHub</span>
          </a>

          <a
            href="https://twitter.com/lightwater2"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 hover:text-foreground"
            aria-label="Follow on Twitter"
          >
            <Twitter className="h-4 w-4" aria-hidden="true" />
            <span>Twitter</span>
          </a>

          <a
            href="https://linkedin.com/in/lightwater2"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 hover:text-foreground"
            aria-label="Connect on LinkedIn"
          >
            <Linkedin className="h-4 w-4" aria-hidden="true" />
            <span>LinkedIn</span>
          </a>

          <a
            href="/blog/rss"
            className="inline-flex items-center gap-1 hover:text-accent"
            aria-label="RSS feed"
          >
            <Rss className="h-4 w-4" aria-hidden="true" />
            <span>RSS</span>
          </a>
        </div>
      </div>
    </footer>
  );
}
