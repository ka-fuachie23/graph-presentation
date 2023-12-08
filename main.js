// @ts-check
"use-strict"

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

document.addEventListener("keydown", e => {
  // console.log(e.key)
  switch(e.code) {
    case "Space":
      e.preventDefault()
      if(e.ctrlKey) {
        presentation.advanceSlide()
      } else if(e.shiftKey) {
        presentation.advanceFragment()
      } else {
        presentation.advance()
      }
      break
    case "ArrowRight":
      e.preventDefault()
      if(e.ctrlKey) {
        presentation.advanceSlide()
      } else {
        presentation.advance()
      }
      break
    case "ArrowLeft":
      e.preventDefault()
      if(e.ctrlKey) {
        presentation.retreatSlide()
      } else {
        presentation.retreat()
      }
      break
    case "KeyF":
      e.preventDefault()
      toggleFullScreen()
      break;
  }
})

function toggleFullScreen() {
  if (!document.fullscreenElement) {
    document.documentElement.requestFullscreen();
  } else if (document.exitFullscreen) {
    document.exitFullscreen();
  }
}

window.presentation = presentation

// const titleGraphRenderer = new Renderer(document.querySelector(`[data-slide="title"]`))