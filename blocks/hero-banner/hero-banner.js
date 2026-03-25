export default function decorate(block) {
  // Check the image column (first column in the row) for a video link
  const imageCol = block.querySelector(':scope > div > div:first-child');
  if (!imageCol) return;

  const videoLink = imageCol.querySelector('a[href*=".mp4"]');
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
  const img = imageCol.querySelector('img');
  if (img) {
    video.poster = img.src;
    img.replaceWith(video);
  } else {
    imageCol.appendChild(video);
  }
}
