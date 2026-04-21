import Head from "next/head";
import Link from "next/link";

const TOOL_LINKS = [
  { href: "/tools", label: "Tools" },
  { href: "/tools/editor", label: "Editor" },
  { href: "/tools/converter", label: "Converter" },
];

export default function ToolsLayout({ title, description, children }) {
  const fullTitle = title ? `${title} | WE G(A)T NEWS` : "WE G(A)T NEWS";

  return (
    <>
      <Head>
        <title>{fullTitle}</title>
        {description ? <meta name="description" content={description} /> : null}
      </Head>

      <main className="tools-page">
        <div className="tools-shell">
          <div className="tools-nav">
            {TOOL_LINKS.map((link) => (
              <Link key={link.href} href={link.href} className="tools-nav-link">
                {link.label}
              </Link>
            ))}
          </div>

          {title ? <h1 className="tools-title">{title}</h1> : null}
          {children}
        </div>
      </main>
    </>
  );
}