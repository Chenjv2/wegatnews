import Link from "next/link";
import ToolsLayout from "../../components/layout/ToolsLayout";

export default function ToolsIndexPage() {
  return (
    <section className="archiv">
      <h1>Hier sind die tools für die Redaktion</h1>
      <p>Textbearbeitung:</p>
      <Link href="/tools/editor">Texteditor</Link>
      <p>Bildbearbeitung:</p>
      <Link href="/tools/converter">Bildconverter</Link>
    </section>
  );
}

ToolsIndexPage.getLayout = function getLayout(page) {
  return (
    <ToolsLayout title="Redaktions-Tools">
      {page}
    </ToolsLayout>
  );
};
