
// @ts-check
"use-strict"

class Presentation {
  static SLIDE_ATTR = "data-slide"
  static CURRENT_SLIDE_ATTR = "data-current"
  static FRAGMENT_ATTR = "data-fragment"
  static ACTIVE_FRAGMENT_ATTR = "data-active"

  /** @type {number} */
  #currentIdx
  /** @type {number} */
  #activeFragmentIdx
  /** @type {HTMLElement} */
  #presentationEl
  /** @type {HTMLElement[]} */
  #slideEls
  /** @type {HTMLElement[]} */
  #currFragmentEls
  /** @type {number} */
  #width
  /** @type {number} */
  #aspectRatio
  /** @type {() => void} */
  #handleResize

  constructor(presentationEl, {
    width = 1000,
    aspectRatio = 16/9
  } = {}) {
    this.#presentationEl = presentationEl
    this.#slideEls = Array.from(this.#presentationEl.querySelectorAll(`[${Presentation.SLIDE_ATTR}]`))
    this.#width = width
    this.#aspectRatio = aspectRatio

    this.currentIdx = 0

    this.#presentationEl.style.setProperty("--slide-width", this.#width.toString())
    this.#presentationEl.style.setProperty("--slide-height", (this.#width / this.#aspectRatio).toString())
    this.#presentationEl.style.setProperty("--slide-scale", "1")

    this.#handleResize = () => {
      const presentationRect = this.#presentationEl.getBoundingClientRect()
      const domAspectRatio = presentationRect.width/presentationRect.height
      if(domAspectRatio <= this.#aspectRatio) {
        this.#presentationEl.style.setProperty("--slide-scale", (presentationRect.width/ this.#width).toString())
      } else {
        this.#presentationEl.style.setProperty("--slide-scale", (presentationRect.height/ (this.#width / this.#aspectRatio)).toString())
      }
    }
  }

  get #totalSlideCount() {
    return this.#slideEls.length
  }

  get #currTotalFragmentCount() {
    return this.#currFragmentEls.length
  }

  get currentIdx() {
    return this.#currentIdx
  }

  set currentIdx(idx) {
    if(this.#totalSlideCount <= 0) return

    const prevIdx = this.#currentIdx
    this.#currentIdx = Math.min(Math.max(idx, 0), this.#totalSlideCount - 1)
    if(this.#currentIdx === prevIdx) return

    if(prevIdx != null) {
      this.#slideEls[prevIdx].removeAttribute(Presentation.CURRENT_SLIDE_ATTR)
    }

    this.#slideEls[this.#currentIdx].setAttribute(Presentation.CURRENT_SLIDE_ATTR, "")

    this.#currFragmentEls = Array
      .from(this.#slideEls[this.#currentIdx].querySelectorAll(`[${Presentation.FRAGMENT_ATTR}]`))
      .filter(el => el.closest(`[${Presentation.SLIDE_ATTR}]`) === this.#slideEls[this.#currentIdx])
    this.activeFragmentIdx = prevIdx < this.#currentIdx
      ? -1 : this.#currTotalFragmentCount - 1
  }

  get activeFragmentIdx() {
    return this.#activeFragmentIdx
  }

  set activeFragmentIdx(idx) {
    if(this.#currTotalFragmentCount <= 0) return
    
    const prevIdx = this.#activeFragmentIdx
    this.#activeFragmentIdx = Math.min(Math.max(idx, -1), this.#currTotalFragmentCount - 1)
    if(this.#activeFragmentIdx === prevIdx) return

    if(prevIdx !== -1) {
      this.#currFragmentEls[prevIdx]?.removeAttribute(Presentation.ACTIVE_FRAGMENT_ATTR)
    }

    if(this.#activeFragmentIdx === -1) return

    this.#currFragmentEls[this.#activeFragmentIdx]?.setAttribute(Presentation.ACTIVE_FRAGMENT_ATTR, "")
  }

  init() {
    this.#handleResize()
    window.addEventListener("resize", this.#handleResize)
  }
  
  destroy() {
    window.removeEventListener("resize", this.#handleResize)
  }

  advance() {
    if(!this.advanceFragment()) this.advanceSlide()
  }

  advanceSlide() {
    const prevIdx = this.#currentIdx
    this.currentIdx += 1
    return this.#currentIdx !== prevIdx
  }

  advanceFragment() {
    const prevIdx = this.#activeFragmentIdx
    this.activeFragmentIdx += 1
    return this.#activeFragmentIdx !== prevIdx
  }

  retreat() {
    if(!this.retreatFragment()) this.retreatSlide()
  }

  retreatSlide() {
    const prevIdx = this.#currentIdx
    this.currentIdx -= 1
    return this.#currentIdx !== prevIdx
  }

  retreatFragment() {
    const prevIdx = this.#activeFragmentIdx
    this.activeFragmentIdx -= 1
    return this.#activeFragmentIdx !== prevIdx
  }
}

const presentation = new Presentation(document.querySelector("[data-presentation]"))
presentation.init()
document.querySelector("[data-control-next]")?.addEventListener("click", () => {
  presentation.advance()
})
document.querySelector("[data-control-prev]")?.addEventListener("click", () => {
  presentation.retreat()
})
document.querySelector("[data-control-full-screen]")?.addEventListener("click", () => {
  toggleFullScreen()
})

function toggleFullScreen() {
  if (!document.fullscreenElement) {
    document.documentElement.requestFullscreen();
  } else if (document.exitFullscreen) {
    document.exitFullscreen();
  }
}