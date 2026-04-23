import { useEffect, useRef, useState } from "react";
import TurndownService from "turndown";
import ToolsLayout from "../../components/layout/ToolsLayout";

function yamlString(value) {
  if (value === undefined || value === null) return '""';
  return `"${String(value).replace(/"/g, '\\"')}"`;
}

function createSlug(value) {
  return value
    .toLowerCase()
    .trim()
    .replace(/ä/g, "ae")
    .replace(/ö/g, "oe")
    .replace(/ü/g, "ue")
    .replace(/ß/g, "ss")
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

export default function EditorPage() {
  const editorRef = useRef(null);
  const today = new Date().toISOString().split("T")[0];

  const [advancedOpen, setAdvancedOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [articleNumber, setArticleNumber] = useState("");
  const [slug, setSlug] = useState("");
  const [date, setDate] = useState(today);
  const [author, setAuthor] = useState("");
  const [imageSource, setImageSource] = useState("");
  const [preview, setPreview] = useState("");
  const [tagInput, setTagInput] = useState("");
  const [tags, setTags] = useState([]);
  const [contentHtml, setContentHtml] = useState("");
  const [markdown, setMarkdown] = useState("");

  const titleTooLong = title.length > 70;
  const previewTooLong = preview.length > 120;

  const plainTextContent = contentHtml
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ")
    .trim();

  const articleNumberValid = articleNumber.trim().length > 0;

  const isValidPost =
    title.trim() &&
    !titleTooLong &&
    articleNumberValid &&
    preview.trim() &&
    !previewTooLong &&
    author.trim() &&
    slug.trim() &&
    plainTextContent;

  const formatText = (command, value = null) => {
    document.execCommand(command, false, value);
    setContentHtml(editorRef.current?.innerHTML || "");
  };

  useEffect(() => {
    setSlug(createSlug(title));
  }, [title]);

  const addTag = () => {
    const cleaned = tagInput.trim().toLowerCase();

    if (!cleaned) return;

    if (tags.includes(cleaned)) {
      setTagInput("");
      return;
    }

    setTags((prev) => [...prev, cleaned]);
    setTagInput("");
  };

  const removeTag = (tagToRemove) => {
    const nextTags = tags.filter((tag) => tag !== tagToRemove);
    setTags(nextTags);
  };

  const handleTagKeyDown = (event) => {
    if (event.key === "Enter" || event.key === ",") {
      event.preventDefault();
      addTag();
    }

    if (event.key === "Backspace" && !tagInput && tags.length > 0) {
      setTags((prev) => prev.slice(0, -1));
    }
  };

  const buildMarkdown = () => {
    const turndownService = new TurndownService({
      headingStyle: "atx",
      codeBlockStyle: "fenced",
      bulletListMarker: "-",
    });

    const contentMarkdown = turndownService.turndown(contentHtml);

    return [
      "---",
      `title: ${yamlString(title)}`,
      `articleNumber: ${yamlString(articleNumber)}`,
      `slug: ${yamlString(slug)}`,
      `date: ${yamlString(date)}`,
      `author: ${yamlString(author)}`,
      `image_source: ${yamlString(imageSource)}`,
      `preview: ${yamlString(preview)}`,
      `tags: [${tags.map((tag) => yamlString(tag)).join(", ")}]`,
      "---",
      "",
      contentMarkdown,
    ].join("\n");
  };

  useEffect(() => {
    setMarkdown(buildMarkdown());
  }, [
    title,
    articleNumber,
    slug,
    date,
    author,
    imageSource,
    preview,
    tags,
    contentHtml,
  ]);

  const downloadMarkdown = () => {
    if (!isValidPost) return;

    const md = buildMarkdown();
    const blob = new Blob([md], {
      type: "text/markdown;charset=utf-8",
    });

    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");

    link.href = url;
    link.download = `${articleNumber.trim()}.md`;

    document.body.appendChild(link);
    link.click();
    link.remove();

    URL.revokeObjectURL(url);
  };

  return (
    <div className="editor-page">
      <input
        type="text"
        placeholder="Titel (max 70 Zeichen)"
        value={title}
        onChange={(event) => setTitle(event.target.value)}
        className={`editor-input ${titleTooLong ? "editor-input-error" : ""}`.trim()}
      />

      <div className="editor-char-count">{title.length}/70</div>

      <input
        type="text"
        placeholder="Artikelnummer (gleich wie Bild)"
        value={articleNumber}
        onChange={(event) => setArticleNumber(event.target.value)}
        className="editor-input"
      />

      <input
        type="date"
        value={date}
        onChange={(event) => setDate(event.target.value)}
        className="editor-input"
      />

      <input
        type="text"
        placeholder="Author (Vorname, Klassenstufe, zb Clara, 10.Klasse)"
        value={author}
        onChange={(event) => setAuthor(event.target.value)}
        className="editor-input"
      />

      <input
        type="text"
        placeholder="Bild Link (rechtliche Bildquelle)"
        value={imageSource}
        onChange={(event) => setImageSource(event.target.value)}
        className="editor-input"
      />

      <textarea
        rows={2}
        placeholder="Textvorschau (ein interessanter Anfang, der Neugier. max 120 Zeichen)"
        value={preview}
        onChange={(event) => setPreview(event.target.value)}
        className={`editor-textarea ${previewTooLong ? "editor-input-error" : ""}`.trim()}
      />

      <div className="editor-char-count">{preview.length}/120</div>

      <div className="editor-tags-box">
        {tags.map((tag) => (
          <span key={tag} className="editor-tag-chip">
            {tag}
            <button onClick={() => removeTag(tag)} className="editor-tag-remove">
              ×
            </button>
          </span>
        ))}

        <input
          value={tagInput}
          onChange={(event) => setTagInput(event.target.value)}
          onKeyDown={handleTagKeyDown}
          onBlur={addTag}
          placeholder="Tags (normal leer lassen)"
          className="editor-tag-input"
        />
      </div>

      {advancedOpen ? (
        <input value={slug} readOnly className="editor-input editor-read-only" />
      ) : null}

      <div className="editor-toolbar">
        <button onClick={() => formatText("bold")}>Fett</button>
        <button onClick={() => formatText("italic")}>Kursiv</button>
        <button onClick={() => formatText("insertUnorderedList")}>Liste</button>
        <button onClick={() => formatText("insertOrderedList")}>Nummeriert</button>
      </div>

      <div
        ref={editorRef}
        contentEditable
        suppressContentEditableWarning
        onInput={(event) => setContentHtml(event.currentTarget.innerHTML)}
        className="editor-content"
      />

      {!isValidPost ? (
        <div className="editor-error-box">Download gesperrt — Felder prüfen</div>
      ) : null}

      <div className="editor-actions-row">
        <button
          onClick={downloadMarkdown}
          disabled={!isValidPost}
          className={`editor-download-button ${!isValidPost ? "editor-disabled-button" : ""}`.trim()}
        >
          Markdown herunterladen
        </button>

        <button
          onClick={() => setAdvancedOpen((prev) => !prev)}
          className="editor-advanced-toggle"
          type="button"
        >
          {advancedOpen ? "Advanced schließen" : "Advanced"}
        </button>
      </div>

      {advancedOpen ? (
        <>
          <h2>Markdown Preview</h2>
          <pre className="editor-preview-box">{markdown}</pre>
        </>
      ) : null}
    </div>
  );
}

EditorPage.getLayout = function getLayout(page) {
  return (
    <ToolsLayout title="Blog Post Editor">
      {page}
    </ToolsLayout>
  );
};
