import { cn } from "@/lib/utils";
import Link from "next/link";
import type { FooterLink, SocialLink } from "@/types";

export interface FooterProps {
  copyright?: string;
  links?: FooterLink[];
  social?: SocialLink[];
  className?: string;
}

export function Footer({
  copyright = `© ${new Date().getFullYear()} Wireframe Kit`,
  links,
  social,
  className,
}: FooterProps) {
  return (
    <footer
      className={cn("w-full border-t border-neutral-800 bg-black", className)}
    >
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          {/* Copyright */}
          <p className="text-sm text-neutral-500">{copyright}</p>

          {/* Links */}
          {links && links.length > 0 && (
            <nav className="flex items-center gap-4">
              {links.map((link, idx) => (
                <Link
                  key={idx}
                  href={link.href}
                  className="text-sm text-neutral-400 hover:text-white transition-colors"
                >
                  {link.label}
                </Link>
              ))}
            </nav>
          )}

          {/* Social */}
          {social && social.length > 0 && (
            <div className="flex items-center gap-2">
              {social.map((item) => (
                <a
                  key={item.href}
                  href={item.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={item.label}
                  className="p-2 rounded-lg text-neutral-400 hover:text-white hover:bg-white/5 transition-colors"
                >
                  {item.icon}
                </a>
              ))}
            </div>
          )}
        </div>
      </div>
    </footer>
  );
}
