import Link from "next/link";

export default function toolsIndex() {
  return (
    <main>
      <section className="archiv">
        <h1>Hier sind die tools für die Redaktion</h1>
        <p>Textbearbeitung:</p><Link href="/tools/editor">Texteditor</Link>
        <p>Bildbearbeitung:</p><Link href="/tools/converter">Bildconverter</Link>
      </section>
    </main>
  );
}
