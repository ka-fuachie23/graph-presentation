
// @ts-check
"use-strict"

class Presentation {
  static SLIDE_ATTR = "data-slide"
  static CURRENT_SLIDE_ATTR = "data-current"

  /** @type {number} */
  #currentIdx
  /** @type {number} */
  #prevIdx
  /** @type {HTMLElement} */
  #presentationEl
  /** @type {HTMLElement[]} */
  #slideEls
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

    this.#handleResize = () => {
      const presentationRect = this.#presentationEl.getBoundingClientRect()
      const domAspectRatio = presentationRect.width/presentationRect.height
      console.log(this.#aspectRatio, domAspectRatio)
      if(domAspectRatio <= this.#aspectRatio) {
        this.#presentationEl.style.setProperty("--slide-scale", (presentationRect.width/ this.#width).toString())
      } else {
        this.#presentationEl.style.setProperty("--slide-scale", (presentationRect.height/ (this.#width / this.#aspectRatio)).toString())
      }
  
      this.#presentationEl.style.setProperty("--slide-width", this.#width.toString())
      this.#presentationEl.style.setProperty("--slide-height", (this.#width / this.#aspectRatio).toString())
    }
  }

  get #totalSlideCount() {
    return this.#slideEls.length
  }

  get currentIdx() {
    return this.#currentIdx
  }

  set currentIdx(idx) {
    this.#prevIdx = this.#currentIdx
    this.#currentIdx = Math.min(Math.max(idx, 0), this.#totalSlideCount)
    if(this.#prevIdx != null) {
      this.#slideEls[this.#prevIdx].removeAttribute(Presentation.CURRENT_SLIDE_ATTR)
    }

    this.#slideEls[this.#currentIdx].setAttribute(Presentation.CURRENT_SLIDE_ATTR, "")
  }

  init() {
    this.#handleResize()
    window.addEventListener("resize", this.#handleResize)
  }
  
  destroy() {
    window.removeEventListener("resize", this.#handleResize)
  }
}

const presentation = new Presentation(document.querySelector("[data-presentation]"), { width: 600 })
presentation.init()
console.log(presentation)