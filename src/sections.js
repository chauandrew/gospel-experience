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
    if (s.bg) sec.style.setProperty('--bg-image', `url(${s.bg})`)
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
