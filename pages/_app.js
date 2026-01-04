import "../styles/globals.css";
import "../styles/post.css";
import Link from "next/link";
import Head from "next/head";
import { useState, useEffect } from "react";

export default function App({ Component, pageProps }) {
  const [open, setOpen] = useState(false);

  // Close menu when clicking outside
  useEffect(() => {
    const closeMenu = () => setOpen(false);
    document.addEventListener("click", closeMenu);
    return () => document.removeEventListener("click", closeMenu);
  }, []);

  return (
    <>
      {/* GLOBAL HEAD (applies to all pages) */}
      <Head>
        <title>Dein Seitenname</title>
        <meta
          name="description"
          content="Unabhängiger Blog für Information, Meinung und Umfragen"
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />

        {/* SEO / Social sharing */}
        <meta property="og:title" content="Dein Seitenname" />
        <meta
          property="og:description"
          content="Unabhängiger Blog für Information, Meinung und Umfragen"
        />
        <meta property="og:type" content="website" />
      </Head>

      <header>
        <nav>
          <Link href="/" className="logo">
            <img src="/basic-images/logo.webp" alt="logo" />
          </Link>

          <ul>
            <li><Link href="/informativ">Informativ📖</Link></li>
            <li><Link href="/Meinung">Meinung💣</Link></li>
            <li><Link href="/umfragen">Umfragen🎤</Link></li>
            <li><Link href="/mach-mit">Mach mit👋</Link></li>
          </ul>

          <div
            className="menu-toggle"
            onClick={(e) => {
              e.stopPropagation();
              setOpen(!open);
            }}
          >
            <div></div>
            <div></div>
            <div></div>
          </div>
        </nav>

        <div className={`sidebar ${open ? "active" : ""}`}>
          <ul>
            <li><Link href="/informativ">Informativ📖</Link></li>
            <li><Link href="/Meinung">Meinung💣</Link></li>
            <li><Link href="/umfragen">Umfragen🎤</Link></li>
            <li><Link href="/mach-mit">Mach mit👋</Link></li>
          </ul>
        </div>
      </header>

      <Component {...pageProps} />

      <footer>
        <Link href="/datenschutz">Datenschutz</Link>
        <Link href="/impressum">Impressum</Link>
        <Link href="/cookies">Cookies</Link>
        <p>© 2026 Keine Rechte vorbehalten</p>
      </footer>
    </>
  );
}
