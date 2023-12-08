// @ts-check
"use-strict"

window.Renderer = class Renderer {
  /** @type {HTMLCanvasElement} */
  canvas
  /** @type {CanvasRenderingContext2D} */
  ctx
  /** @type {Camera} */
  camera
  /** @type {() => void} */
  #handleResize
  /** @type {(e: WheelEvent) => void} */
  #handleWheel
  /** @type {(e: KeyboardEvent) => void} */
  #handleKeydown

  constructor(canvas) {
    this.canvas = canvas
    this.ctx = this.canvas.getContext("2d")
    this.camera = new Camera(this.ctx)

    this.#handleResize = () => {
      this.canvas.width = window.innerWidth * window.devicePixelRatio
      this.canvas.height = window.innerHeight * window.devicePixelRatio
      this.camera.updateViewport()
    }

    this.#handleWheel = e => {
      e.preventDefault()
      if (e.ctrlKey) {
        this.camera.zoomBy(-e.deltaY * 20); 
      } else {
        this.camera.moveBy(e.deltaX * 2, e.deltaY * 2);
      }
    }

    this.#handleKeydown = e => {
      if(e.key == "r") {
        this.camera.zoomTo(1000)
        this.camera.moveTo(0, 0)
      }
    }
  }

  init() {
    this.#handleResize()
    window.addEventListener("resize", this.#handleResize)
    window.addEventListener("wheel", this.#handleWheel, { passive: false })
    window.addEventListener("keydown", this.#handleKeydown)
  }

  destroy() {
    window.removeEventListener("resize", this.#handleResize)
    window.removeEventListener("wheel", this.#handleWheel)
    window.removeEventListener("keydown", this.#handleKeydown)
  }
}

class Camera {
  /** @type {CanvasRenderingContext2D} */
  #ctx
  /** @type {HTMLCanvasElement} */
  #canvas

  constructor(ctx) {
    this.distance =  1000,
    this.fov =  Math.PI / 4,
    this.position =  {x: 0, y: 0},
    this.viewport =  {
      width: 0,
      height: 0,
      scale: {x: 0, y: 0}
    }
    this.#ctx = ctx
    this.#canvas = this.#ctx.canvas
  }

  begin() {
    this.#ctx.save()
    this.applyScale()
    this.applyTranslation()
  }

  end() {
    this.#ctx.restore()
  }

  applyScale() {
    this.#ctx.scale(this.viewport.scale.x, this.viewport.scale.y)
  }

  applyTranslation() {
    this.#ctx.translate(-(this.position.x - this.viewport.width/2), -(this.position.y - this.viewport.height/2))
  }

  updateViewport(){
    this.aspectRatio = this.#canvas.width/this.#canvas.height
    this.viewport.width = this.distance * Math.tan(this.fov)
    this.viewport.height = this.viewport.width / this.aspectRatio
    this.viewport.scale.x = this.#canvas.width/this.viewport.width
    this.viewport.scale.y = this.#canvas.height/this.viewport.height
  }

  zoomTo(z) {
    this.distance = z
    if(this.distance <= 1) {
      this.distance = 1
    }
    this.updateViewport()
  }

  zoomBy(z) {
    this.distance += z
    if(this.distance <= 1) {
      this.distance = 1
    }
    this.updateViewport()
  }

  moveTo(x, y) {
    this.position.x = x
    this.position.y = y
    this.updateViewport()
  }

  moveBy(x, y) {
    this.position.x += x
    this.position.y += y
    this.updateViewport()
  }

  screenToWorld(x, y, obj = {}) {
    obj.x = 2 * (x / this.viewport.scale.x) + (this.position.x - this.viewport.width/2);
    obj.y = 2 * (y / this.viewport.scale.y) + (this.position.y - this.viewport.height/2);
    return obj;
  }

  worldToScreen(x, y, obj = {}) {
    obj.x = (x - (this.position.x - this.viewport.width/2)) * (this.viewport.scale.x) / 2;
    obj.y = (y - (this.position.y - this.viewport.height/2)) * (this.viewport.scale.y) / 2;
    return obj;
  }
}