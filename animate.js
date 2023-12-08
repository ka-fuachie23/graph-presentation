// @ts-check
"use-strict"

window.UpdateLoop = class UpdateLoop {
  /** @type {number=} */
  startTime
  /** @type {number=} */
  currTime
  /** @type {number=} */
  prevTime
  /** @type {number=} */
  elapsedTime
  /** @type {number=} */
  dt
  /** @type {number=} */
  frameId

  constructor(fn) {
    this.fn = fn
    this.start()
  }

  get isRunning() {
    return this.frameId != null
  }

  start() {
    this.frameId = window.requestAnimationFrame(this.run.bind(this))
  }

  run(timestamp) {
    if(this.startTime == null) this.startTime = timestamp
    this.currTime = timestamp
    this.elapsedTime = this.currTime - this.startTime
    if(this.elapsedTime === 0) this.prevTime = this.currTime
    this.dt = this.currTime - this.prevTime
    this.prevTime = this.currTime

    this.fn({ 
      startTime: this.startTime,
      currTime: this.currTime,
      preTime: this.prevTime,
      elapsedTime: this.elapsedTime,
      dt: this.dt,
    })

    console.log(this.frameId)
    if(!this.isRunning) return
    this.frameId = window.requestAnimationFrame(this.run.bind(this))
  }

  end() {
    window.cancelAnimationFrame(this.frameId)
    this.frameId = undefined
  }
}