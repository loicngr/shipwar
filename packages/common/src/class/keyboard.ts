import {
  KeyboardInterface, MouseKeyBindingEnum,
  MouseKeyEnum, WheelKeyBindingEnum,
  WheelKeyEnum,
} from '../type/keyboard'

export class Keyboard implements KeyboardInterface {
  private readonly keys: Record<string, boolean>
  private readonly keysEvents: Record<string, MouseEvent | PointerEvent | WheelEvent>

  constructor () {
    this.keys = {}
    this.keysEvents = {}
  }

  public listenForWheelEvents (keys: WheelKeyEnum[]): void {
    keys.forEach((k) => {
      this.keys[k] = false
      window.addEventListener(k, this[WheelKeyBindingEnum[k]].bind(this))
    })
  }

  public listenForMouseEvents (keys: MouseKeyEnum[]): void {
    keys.forEach((k) => {
      this.keys[k] = false
      window.addEventListener(k, this[MouseKeyBindingEnum[k]].bind(this))
    })
  }

  public listenForEvents (keys: string[]): void {
    window.addEventListener('keydown', this.onKeyDown.bind(this))
    window.addEventListener('keyup', this.onKeyUp.bind(this))

    keys.forEach((k) => (this.keys[k] = false))
  }

  public isPressed (key: string): boolean {
    return key in this.keys && this.keys[key]
  }

  public resetKey (key: string): void {
    this.keys[key] = false
  }

  private [WheelKeyBindingEnum.wheel] (event: WheelEvent): void {
    const type = event.type

    if (type in this.keys) {
      this.keys[type] = true
      this.keysEvents[type] = event
    }
  }

  private [MouseKeyBindingEnum.mousedown] (event: MouseEvent): void {
    const type = event.type

    if (type in this.keys) {
      event.preventDefault()
      this.keys[type] = true
      this.keys.click = false
    }
  }

  private [MouseKeyBindingEnum.mouseup] (event: MouseEvent): void {
    const type = 'mousedown'

    if (type in this.keys) {
      event.preventDefault()
      this.keys[type] = false
    }
  }

  private [MouseKeyBindingEnum.click] (event: MouseEvent): void {
    const type = event.type

    if (type in this.keys) {
      event.preventDefault()
      this.keys[type] = true
    }
  }

  private onKeyDown (event: KeyboardEvent) {
    const code = event.code

    if (code in this.keys) {
      event.preventDefault()
      this.keys[code] = true
    }
  }

  private onKeyUp (event: KeyboardEvent) {
    const code = event.code

    if (code in this.keys) {
      event.preventDefault()
      this.keys[code] = false
    }
  }
}
