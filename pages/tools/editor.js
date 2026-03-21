import { useEffect, useRef, useState } from "react";
import TurndownService from "turndown";

export default function EditorPage() {

  const editorRef = useRef(null);
  const today = new Date().toISOString().split("T")[0];

  const [advancedOpen, setAdvancedOpen] = useState(false);

  const [title, setTitle] = useState("");
  const [articleNumber, setArticleNumber] = useState("");
  const [slug, setSlug] = useState("");
  const [date, setDate] = useState(today);
  const [author, setAuthor] = useState("");

  const [preview, setPreview] = useState("");

  const [tagInput, setTagInput] = useState("");
  const [tags, setTags] = useState(["informativ"]);

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

  const createSlug = (value) => {
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

    setTags(nextTags.length ? nextTags : ["informativ"]);

  };

  const handleTagKeyDown = (e) => {

    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      addTag();
    }

    if (e.key === "Backspace" && !tagInput && tags.length > 1) {
      setTags((prev) => prev.slice(0, -1));
    }

  };

  const buildMarkdown = () => {

    const turndownService = new TurndownService({
      headingStyle: "atx",
      codeBlockStyle: "fenced",
      bulletListMarker: "-"
    });

    const contentMarkdown = turndownService.turndown(contentHtml);

    return [

      "---",
      `title: ${title}`,
      `articleNumber: ${articleNumber}`,
      `slug: ${slug}`,
      `date: ${date}`,
      `author: ${author}`,
      `preview: ${preview}`,
      `tags: [${tags.map(tag => `"${tag}"`).join(", ")}]`,
      "---",
      "",
      contentMarkdown

    ].join("\n");

  };

  useEffect(() => {
    setMarkdown(buildMarkdown());
  }, [title, articleNumber, slug, date, author, preview, tags, contentHtml]);

  const downloadMarkdown = () => {

    if (!isValidPost) return;

    const md = buildMarkdown();

    const blob = new Blob([md], { type: "text/markdown;charset=utf-8" });

    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");

    a.href = url;
    a.download = `${articleNumber.trim()}.md`;

    document.body.appendChild(a);
    a.click();
    a.remove();

    URL.revokeObjectURL(url);

  };

  return (
    <div style={styles.page}>

      <div style={styles.headerRow}>

        <h1 style={{margin:0}}>Blog Post Editor</h1>

        <button
          onClick={() => setAdvancedOpen(!advancedOpen)}
          style={styles.advancedToggle}
        >
          {advancedOpen ? "Advanced schließen" : "Advanced"}
        </button>

      </div>

      <input
        type="text"
        placeholder="Titel (max 70 Zeichen)"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        style={{
          ...styles.input,
          ...(titleTooLong ? styles.inputError : {})
        }}
      />

      <div style={styles.charCount}>
        {title.length}/70
      </div>

      <input
        type="text"
        placeholder="Artikelnummer (Dateiname)"
        value={articleNumber}
        onChange={(e) => setArticleNumber(e.target.value)}
        style={styles.input}
      />

      <input
        type="date"
        value={date}
        onChange={(e) => setDate(e.target.value)}
        style={styles.input}
      />

      <input
        type="text"
        placeholder="Author"
        value={author}
        onChange={(e) => setAuthor(e.target.value)}
        style={styles.input}
      />

      <textarea
        rows={2}
        placeholder="Preview (max 120 Zeichen)"
        value={preview}
        onChange={(e) => setPreview(e.target.value)}
        style={{
          ...styles.textarea,
          ...(previewTooLong ? styles.inputError : {})
        }}
      />

      <div style={styles.charCount}>
        {preview.length}/120
      </div>

      <div style={styles.tagsBox}>

        {tags.map(tag => (

          <span key={tag} style={styles.tagChip}>

            {tag}

            <button
              onClick={() => removeTag(tag)}
              style={styles.tagRemove}
            >
              ×
            </button>

          </span>

        ))}

        <input
          value={tagInput}
          onChange={(e) => setTagInput(e.target.value)}
          onKeyDown={handleTagKeyDown}
          onBlur={addTag}
          placeholder="Tag"
          style={styles.tagInput}
        />

      </div>

      {advancedOpen && (
        <input
          value={slug}
          readOnly
          style={{...styles.input, ...styles.readOnly}}
        />
      )}

      <div style={styles.toolbar}>

        <button onClick={() => formatText("bold")}>Fett</button>
        <button onClick={() => formatText("italic")}>Kursiv</button>
        <button onClick={() => formatText("insertUnorderedList")}>Liste</button>
        <button onClick={() => formatText("insertOrderedList")}>Nummeriert</button>

      </div>

      <div
        ref={editorRef}
        contentEditable
        suppressContentEditableWarning
        onInput={(e) => setContentHtml(e.currentTarget.innerHTML)}
        style={styles.editor}
      />

      {!isValidPost && (
        <div style={styles.errorBox}>
          Download gesperrt — Felder prüfen
        </div>
      )}

      <button
        onClick={downloadMarkdown}
        disabled={!isValidPost}
        style={{
          ...styles.downloadButton,
          ...(!isValidPost ? styles.disabledButton : {})
        }}
      >
        Markdown herunterladen
      </button>

      {advancedOpen && (
        <>
          <h2>Markdown Preview</h2>
          <pre style={styles.previewBox}>{markdown}</pre>
        </>
      )}

    </div>
  );
}

const styles = {

  page:{
    maxWidth:"900px",
    margin:"40px auto",
    fontFamily:"Arial"
  },

  headerRow:{
    display:"flex",
    justifyContent:"space-between",
    alignItems:"center",
    marginBottom:"20px"
  },

  advancedToggle:{
    padding:"8px 12px",
    borderRadius:"6px",
    border:"1px solid #ccc",
    cursor:"pointer",
    background:"#fafafa"
  },

  input:{
    width:"100%",
    padding:"12px",
    borderRadius:"6px",
    border:"1px solid #ccc",
    marginBottom:"6px"
  },

  textarea:{
    width:"100%",
    padding:"12px",
    borderRadius:"6px",
    border:"1px solid #ccc",
    marginBottom:"6px",
    resize:"vertical"
  },

  readOnly:{
    background:"#f5f5f5",
    color:"#666"
  },

  inputError:{
    border:"1px solid red"
  },

  charCount:{
    fontSize:"12px",
    textAlign:"right",
    marginBottom:"12px"
  },

  tagsBox:{
    border:"1px solid #ccc",
    borderRadius:"6px",
    padding:"8px",
    display:"flex",
    flexWrap:"wrap",
    gap:"8px",
    marginBottom:"14px"
  },

  tagChip:{
    background:"#eee",
    borderRadius:"999px",
    padding:"6px 10px",
    display:"flex",
    alignItems:"center",
    gap:"6px"
  },

  tagRemove:{
    border:"none",
    background:"transparent",
    cursor:"pointer"
  },

  tagInput:{
    border:"none",
    outline:"none",
    flex:1
  },

  toolbar:{
    display:"flex",
    gap:"10px",
    marginBottom:"12px"
  },

  editor:{
    height:"400px",
    overflowY:"auto",
    border:"1px solid #ccc",
    borderRadius:"6px",
    padding:"15px",
    marginBottom:"20px"
  },

  errorBox:{
    background:"#fff3f3",
    border:"1px solid red",
    padding:"10px",
    borderRadius:"6px",
    marginBottom:"10px",
    color:"red"
  },

  downloadButton:{
    padding:"10px 16px",
    borderRadius:"6px",
    border:"1px solid #ccc",
    cursor:"pointer"
  },

  disabledButton:{
    opacity:0.5,
    cursor:"not-allowed"
  },

  previewBox:{
    background:"#f7f7f7",
    padding:"15px",
    borderRadius:"6px",
    border:"1px solid #ddd"
  }

};