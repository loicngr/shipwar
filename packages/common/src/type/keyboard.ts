// https://developer.mozilla.org/en-US/docs/Web/API/UI_Events/Keyboard_event_code_values
export enum KeyEnum {
  Right = 'KeyD',
  Left = 'KeyA',
  Up = 'KeyW',
  Down = 'KeyS',
  E = 'KeyE',
  R = 'KeyR',
  F = 'KeyF',
  F1 = 'F1',
  Digit1 = 'Digit1',
  Digit2 = 'Digit2',
  Digit3 = 'Digit3',
  Digit4 = 'Digit4',
  Digit5 = 'Digit5',
  Digit6 = 'Digit6',
  Digit7 = 'Digit7',
  Digit8 = 'Digit8',
  Digit9 = 'Digit9',
  Escape = 'Escape',
}

export enum WheelKeyEnum {
  Wheel = 'wheel',
}

export enum MouseKeyEnum {
  Click = 'click',
  MouseUp = 'mouseup',
  MouseDown = 'mousedown',
}

export enum WheelKeyBindingEnum {
  wheel = 'onWheel',
}

export enum MouseKeyBindingEnum {
  click = 'onClick',
  mouseup = 'onMouseUp',
  mousedown = 'onMouseDown',
}

export interface KeyboardInterface {
  readonly keys: Record<string, boolean>
  readonly keysEvents: Record<string, MouseEvent | PointerEvent | WheelEvent>

  listenForWheelEvents: (keys: WheelKeyEnum[]) => void
  listenForMouseEvents: (keys: MouseKeyEnum[]) => void
  listenForEvents: (keys: string[]) => void
  isPressed: (key: string) => boolean
  resetKey: (key: string) => void
  onKeyDown: (event: KeyboardEvent) => void
  onKeyUp: (event: KeyboardEvent) => void

  [WheelKeyBindingEnum.wheel]: (event: WheelEvent) => void
  [MouseKeyBindingEnum.mousedown]: (event: MouseEvent) => void
  [MouseKeyBindingEnum.mouseup]: (event: MouseEvent) => void
  [MouseKeyBindingEnum.click]: (event: MouseEvent) => void
}
