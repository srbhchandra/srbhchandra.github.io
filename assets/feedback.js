/* Reader feedback, on every page this repo owns. A line at the end of the page opens
   the Tally form (4aX0Zk) as a pop-up, with the page and rating filled in as hidden
   fields. Tally's script loads only when someone clicks. */
(function () {
  const FORM = '4aX0Zk';
  const box = document.createElement('aside');
  box.className = 'feedback';
  box.setAttribute('aria-label', 'Feedback');
  box.innerHTML = '<span>Was this page useful?</span>' +
    '<button type="button" data-rating="up" aria-label="Yes, useful">👍</button>' +
    '<button type="button" data-rating="down" aria-label="Not really">👎</button>' +
    '<span class="sep">·</span><button type="button" class="ask" data-rating="">Ask me or suggest a fix</button>';
  const anchor = document.querySelector('footer.author, footer.site, footer');
  if (anchor) anchor.parentNode.insertBefore(box, anchor); else document.body.appendChild(box);
  // Directly in <body> (pages whose footer sits outside the content column): centre it like .wrap
  if (box.parentNode === document.body) box.classList.add('centred');

  let loading = null;
  const load = () => loading || (loading = new Promise((ok, fail) => {
    if (window.Tally) return ok();
    const s = document.createElement('script');
    s.src = 'https://tally.so/widgets/embed.js';
    s.onload = ok; s.onerror = fail;
    document.head.appendChild(s);
  }));
  box.addEventListener('click', async (e) => {
    const b = e.target.closest('button');
    if (!b) return;
    const hidden = { page: location.pathname + location.search, rating: b.dataset.rating };
    try {
      await load();
      window.Tally.openPopup(FORM, { layout: 'modal', width: 520, autoClose: 2500, hiddenFields: hidden });
    } catch (err) {
      // Script blocked (e.g. by a content blocker): open the form itself instead
      location.href = `https://tally.so/r/${FORM}?` + new URLSearchParams(hidden);
    }
  });
})();
