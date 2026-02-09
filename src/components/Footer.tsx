import Link from 'next/link';

const footerLinks = [
  { href: '/blog', label: 'Blog' },
  { href: '/portfolio', label: 'Portfolio' },
  { href: '/research', label: 'Research' },
  { href: '/about', label: 'About' },
];

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t border-border bg-muted/50">
      <div className="mx-auto max-w-3xl px-6 py-12">
        <div className="flex flex-col items-center gap-8 md:flex-row md:justify-between">
          {/* Navigation Links */}
          <nav aria-label="Footer navigation">
            <ul className="flex flex-wrap justify-center gap-6 md:justify-start">
              {footerLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-muted transition-colors hover:text-foreground"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* Copyright */}
          <p className="text-sm text-muted">
            &copy; {currentYear}{' '}
            <span className="text-foreground">depp</span>. Built with{' '}
            <span className="text-accent">♥</span> and Next.js.
          </p>
        </div>
      </div>
    </footer>
  );
}
