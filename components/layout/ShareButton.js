import { FiShare2 } from "react-icons/fi";

export default function ShareButton({
  title = "wegatnews",
  text = "Schau dir diese Seite an:",
  url,
  className = "",
}) {
  async function handleShare() {
    const shareUrl = url || window.location.href;

    const shareData = {
      title,
      text,
      url: shareUrl,
    };

    try {
      if (navigator.share) {
        await navigator.share(shareData);
      } else {
        await navigator.clipboard.writeText(shareUrl);
        alert("Link copied.");
      }
    } catch (error) {
      console.error("Share failed:", error);
    }
  }

  return (
    <button type="button" onClick={handleShare} className={className}>
      <FiShare2 style={{ marginRight: "8px" }} />
      Share
    </button>
  );
}