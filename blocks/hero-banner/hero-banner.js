export default function decorate(block) {
  // Check the image cell (first row) for a video link
  const firstRow = block.querySelector(':scope > div:first-child');
  if (!firstRow) return;

  const videoLink = firstRow.querySelector('a[href*=".mp4"]');
  if (!videoLink) return;

  const videoSrc = videoLink.href;
  videoLink.remove();

  // Create video element to replace/supplement the poster image
  const video = document.createElement('video');
  video.src = videoSrc;
  video.autoplay = true;
  video.muted = true;
  video.loop = true;
  video.playsInline = true;

  // Use existing image as poster
  const img = firstRow.querySelector('img');
  if (img) {
    video.poster = img.src;
    img.replaceWith(video);
  } else {
    const cell = firstRow.querySelector(':scope > div');
    if (cell) cell.appendChild(video);
  }
}
