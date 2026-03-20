import { useMemo, useState } from "react";

const TARGET_WIDTH = 1200;
const TARGET_HEIGHT = 800;

export default function ImageConverterPage() {
  const [previewUrl, setPreviewUrl] = useState(null);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [fileName, setFileName] = useState("");

  const accept = useMemo(() => "image/*", []);

  const sanitizeFileName = (name) => {
    return name
      .trim()
      .replace(/\.webp$/i, "")
      .replace(/[<>:"/\\|?*\x00-\x1F]/g, "")
      .replace(/\s+/g, "-");
  };

  const cleanupOldPreview = () => {
    if (previewUrl) URL.revokeObjectURL(previewUrl);
  };

  const cleanupOldResult = () => {
    if (result?.url) URL.revokeObjectURL(result.url);
  };

  const handleFileChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setError(null);
    cleanupOldResult();
    cleanupOldPreview();

    const originalBaseName = file.name.replace(/\.[^/.]+$/, "");

    setFileName((prev) => {
      if (prev.trim() === "") {
        return originalBaseName;
      }
      return prev;
    });

    const preview = URL.createObjectURL(file);
    setPreviewUrl(preview);

    try {
      const imageBitmap = await createImageBitmap(file);

      const canvas = document.createElement("canvas");
      canvas.width = TARGET_WIDTH;
      canvas.height = TARGET_HEIGHT;

      const ctx = canvas.getContext("2d");

      ctx.fillStyle = "#ffffff";
      ctx.fillRect(0, 0, TARGET_WIDTH, TARGET_HEIGHT);

      const scale = Math.max(
        TARGET_WIDTH / imageBitmap.width,
        TARGET_HEIGHT / imageBitmap.height,
      );

      const drawWidth = imageBitmap.width * scale;
      const drawHeight = imageBitmap.height * scale;

      const offsetX = (TARGET_WIDTH - drawWidth) / 2;
      const offsetY = (TARGET_HEIGHT - drawHeight) / 2;

      ctx.drawImage(imageBitmap, offsetX, offsetY, drawWidth, drawHeight);

      const blob = await new Promise((resolve) => {
        canvas.toBlob(resolve, "image/webp", 0.9);
      });

      const url = URL.createObjectURL(blob);

      setResult({
        url,
        sizeKB: Math.round(blob.size / 1024),
      });

      if (imageBitmap.close) imageBitmap.close();
    } catch {
      setError("Fehler beim Konvertieren.");
    }

    e.target.value = "";
  };

  const downloadName = `${sanitizeFileName(fileName) || "bild-1200x800"}.webp`;

  return (
    <main style={styles.page}>
      <div style={styles.card}>
        <h1 style={styles.h1}>Image Converter</h1>

        <p style={styles.text}>
          Konvertiere Bilder zu <strong>1200 × 800 WebP</strong>.
        </p>

        <div style={styles.field}>
          <label style={styles.label}>Dateiname</label>
          <input
            type="text"
            value={fileName}
            onChange={(e) => setFileName(e.target.value)}
            placeholder="mein-bild"
            style={styles.input}
          />
        </div>

        <div style={styles.actions}>
          <label style={styles.uploadButton}>
            <input
              type="file"
              accept={accept}
              onChange={handleFileChange}
              style={{ display: "none" }}
            />
            Bild auswählen
          </label>

          <a
            href={result?.url || "#"}
            download={downloadName}
            style={{
              ...styles.downloadButton,
              opacity: result ? 1 : 0.5,
              pointerEvents: result ? "auto" : "none",
            }}
          >
            Herunterladen
          </a>
        </div>

        {error && <p style={styles.error}>{error}</p>}

        {previewUrl && (
          <div style={styles.section}>
            <h3>Original</h3>
            <img src={previewUrl} style={styles.image} />
          </div>
        )}

        {result && (
          <div style={styles.section}>
            <h3>Konvertiert</h3>
            <img src={result.url} style={styles.image} />
            <p>
              Größe: <strong>{result.sizeKB} KB</strong>
            </p>
          </div>
        )}
      </div>
    </main>
  );
}

const styles = {
  page: {
    minHeight: "100vh",
    padding: "40px",
    display: "flex",
    justifyContent: "center",
    background: "#f5f5f5",
  },

  card: {
    width: "100%",
    maxWidth: "750px",
    background: "white",
    padding: "30px",
    borderRadius: "14px",
    boxShadow: "0 10px 30px rgba(0,0,0,0.08)",
  },

  h1: {
    marginBottom: "10px",
  },

  text: {
    marginBottom: "20px",
  },

  field: {
    marginBottom: "20px",
  },

  label: {
    display: "block",
    marginBottom: "6px",
    fontWeight: "600",
  },

  input: {
    width: "100%",
    padding: "10px",
    borderRadius: "8px",
    border: "1px solid #ddd",
  },

  actions: {
    display: "flex",
    gap: "10px",
    flexWrap: "wrap",
  },

  uploadButton: {
    padding: "10px 16px",
    borderRadius: "8px",
    background: "#111",
    color: "white",
    cursor: "pointer",
  },

  downloadButton: {
    padding: "10px 16px",
    borderRadius: "8px",
    background: "#2563eb",
    color: "white",
    textDecoration: "none",
  },

  error: {
    color: "red",
    marginTop: "10px",
  },

  section: {
    marginTop: "30px",
  },

  image: {
    width: "100%",
    borderRadius: "10px",
    border: "1px solid #eee",
  },
};
