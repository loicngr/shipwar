import {
  KeyboardInterface, MouseKeyBindingEnum,
  MouseKeyEnum, WheelKeyBindingEnum,
  WheelKeyEnum,
} from '../type/keyboard'

export class Keyboard implements KeyboardInterface {
  readonly keys: Record<string, boolean>
  readonly keysEvents: Record<string, MouseEvent | PointerEvent | WheelEvent>

  constructor () {
    this.keys = {}
    this.keysEvents = {}
  }

  listenForWheelEvents (keys: WheelKeyEnum[]): void {
    keys.forEach((k) => {
      this.keys[k] = false
      window.addEventListener(k, this[WheelKeyBindingEnum[k]].bind(this))
    })
  }

  listenForMouseEvents (keys: MouseKeyEnum[]): void {
    keys.forEach((k) => {
      this.keys[k] = false
      window.addEventListener(k, this[MouseKeyBindingEnum[k]].bind(this))
    })
  }

  listenForEvents (keys: string[]): void {
    window.addEventListener('keydown', this.onKeyDown.bind(this))
    window.addEventListener('keyup', this.onKeyUp.bind(this))

    keys.forEach((k) => (this.keys[k] = false))
  }

  isPressed (key: string): boolean {
    return key in this.keys && this.keys[key]
  }

  resetKey (key: string): void {
    this.keys[key] = false
  }

  [WheelKeyBindingEnum.wheel] (event: WheelEvent): void {
    const type = event.type

    if (type in this.keys) {
      this.keys[type] = true
      this.keysEvents[type] = event
    }
  }

  [MouseKeyBindingEnum.mousedown] (event: MouseEvent): void {
    const type = event.type

    if (type in this.keys) {
      event.preventDefault()
      this.keys[type] = true
      this.keys.click = false
    }
  }

  [MouseKeyBindingEnum.mouseup] (event: MouseEvent): void {
    const type = 'mousedown'

    if (type in this.keys) {
      event.preventDefault()
      this.keys[type] = false
    }
  }

  [MouseKeyBindingEnum.click] (event: MouseEvent): void {
    const type = event.type

    if (type in this.keys) {
      event.preventDefault()
      this.keys[type] = true
    }
  }

  onKeyDown (event: KeyboardEvent) {
    const code = event.code

    if (code in this.keys) {
      event.preventDefault()
      this.keys[code] = true
    }
  }

  onKeyUp (event: KeyboardEvent) {
    const code = event.code

    if (code in this.keys) {
      event.preventDefault()
      this.keys[code] = false
    }
  }
}
