import { CanvasInterface } from '../type/canvas'
import { TILE_SIZE } from '../const/tile'
import { Game } from './game'

export class Canvas implements CanvasInterface {
  _domRef: HTMLCanvasElement | undefined

  constructor (
    readonly game: Game,
    public identifier: string,
  ) {
    this.createDomElement()
    this.initContext()
  }

  get domRef (): HTMLCanvasElement {
    if (typeof this._domRef === 'undefined') {
      throw new Error('Canvas is undefined !')
    }

    return this._domRef
  }

  set domRef (value: HTMLCanvasElement) {
    this._domRef = value
  }

  get context (): CanvasRenderingContext2D {
    const ctx = this.domRef.getContext('2d')
    if (ctx === null) {
      throw new Error('Error when get canvas context')
    }

    return ctx
  }

  createDomElement () {
    if (document.getElementById(this.identifier) !== null) {
      throw new Error('Canvas element is already created !')
    }

    const canvas = document.createElement('canvas')

    Object.assign(canvas, {
      id: this.identifier,
      width: TILE_SIZE * this.game.widthSize,
      height: TILE_SIZE * this.game.heightSize,
    })

    this.domRef = canvas
    this.game.domRef.appendChild(this.domRef)
  }

  initContext () {
    this.context.font = `${(7).toString()}px sans-serif`
  }
}
