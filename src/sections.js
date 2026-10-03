function el(tag, className, text) {
  const e = document.createElement(tag)
  if (className) e.className = className
  if (text) e.textContent = text
  return e
}

export function renderGate(root, gate, onBegin) {
  gate.text.forEach((t) => root.append(el('p', 'headline', t)))
  const btn = el('button', 'btn', gate.button)
  btn.addEventListener('click', onBegin)
  root.append(btn)
}

export function renderSections(scroller, progress, slides, onDone) {
  slides.forEach((s, i) => {
    const sec = el('section', 'beat')
    sec.dataset.id = s.id
    if (s.bg) {
      const bg = el('div', 'bg')
      bg.style.backgroundImage = `url(${s.bg})`
      if (s.dim) bg.style.setProperty('--dim', s.dim)
      sec.append(bg)
    }
    if (s.frames) {
      const f = el('div', s.fit === 'contain' ? 'frames contain' : 'frames')
      s.frames.forEach((art) => {
        const { src, dim } = typeof art === 'string' ? { src: art } : art
        const img = el('img')
        img.src = src
        if (dim) img.style.filter = `brightness(${dim}) saturate(0.9)`
        img.alt = ''
        // portrait art (e.g. the whisper illustration) is shown whole instead of cropped
        img.addEventListener('load', () => img.naturalHeight > img.naturalWidth && img.classList.add('tall'))
        f.append(img)
      })
      sec.append(f)
    }
    if (s.fx === 'glow') sec.append(el('div', 'glow'))
    if (s.eyebrow) sec.append(el('p', 'eyebrow', s.eyebrow))
    s.text.forEach((t) => sec.append(el('p', 'headline', t)))
    if (s.reveal) {
      const row = el('p', 'reveal')
      s.reveal.forEach((w) => row.append(el('span', 'word', w)))
      sec.append(row)
    }
    if (s.cta) sec.append(el('p', 'cta', s.cta))
    if (s.button) {
      const b = el('button', 'btn', s.button)
      b.addEventListener('click', onDone)
      sec.append(b)
    }
    if (s.hint) {
      const h = el('div', 'hint')
      h.append(el('span', null, s.hint), el('i'))
      sec.append(h)
    }
    scroller.append(sec)
    progress.append(el('span', i === 0 ? 'dash active' : 'dash'))
  })

  const dashes = [...progress.children]
  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) {
          const i = [...scroller.children].indexOf(e.target)
          dashes.forEach((d, j) => d.classList.toggle('active', j === i))
        }
      })
    },
    { root: scroller, threshold: 0.6 },
  )
  scroller.querySelectorAll('.beat').forEach((s) => io.observe(s))
}

// Back to the first beat's dash (the observer will not fire if the scroller was hidden meanwhile).
export function resetProgress(progress) {
  ;[...progress.children].forEach((d, i) => d.classList.toggle('active', i === 0))
}
