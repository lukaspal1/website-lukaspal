// ============================================================
// Currently-reading widget — details live on #book-card in index.html.
// Cover comes from Open Library by ISBN (or data-cover for your own image).
// ============================================================

(function () {
  const card = document.getElementById('book-card');
  if (!card) return;

  const isbn = (card.dataset.isbn || '').replace(/[^0-9X]/gi, '');
  const cover = document.getElementById('book-cover');

  if (isbn) card.href = 'https://openlibrary.org/isbn/' + isbn;
  else card.removeAttribute('href');

  // Draw the cover into the tiny canvas; CSS scales it up pixelated
  const src = card.dataset.cover ||
    (isbn ? 'https://covers.openlibrary.org/b/isbn/' + isbn + '-M.jpg?default=false' : '');
  if (src) {
    const img = new Image();
    img.onload = function () {
      const ctx = cover.getContext('2d');
      ctx.imageSmoothingEnabled = true;
      ctx.drawImage(img, 0, 0, cover.width, cover.height);
    };
    img.src = src;
  }
})();
