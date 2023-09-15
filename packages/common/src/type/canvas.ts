import { GameInterface } from './game'

export interface CanvasInterface {
  _domRef: HTMLCanvasElement | undefined
  identifier: string
  game: GameInterface

  get domRef(): HTMLCanvasElement
  set domRef(value: HTMLCanvasElement)
  get context(): CanvasRenderingContext2D
  createDomElement: () => void
  initContext: () => void
}
