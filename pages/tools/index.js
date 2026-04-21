import Link from "next/link";
import ToolsLayout from "../../components/layout/ToolsLayout";

export default function ToolsIndexPage() {
  return (
    <section className="archiv">
      <p>Textbearbeitung:</p>
      <Link href="/tools/editor">Texteditor</Link>
      <p>Bildbearbeitung:</p>
      <Link href="/tools/converter">Bildconverter</Link>
    </section>
  );
}

ToolsIndexPage.getLayout = function getLayout(page) {
  return (
    <ToolsLayout
      title="Redaktions-Tools"
      description="Werkzeuge für die Redaktion"
    >
      {page}
    </ToolsLayout>
  );
};