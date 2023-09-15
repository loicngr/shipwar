import { PlayerInterface } from '../type/player'
import { DirectionEnum } from '../type/direction'
import { Vector } from './vector'
import { TILE_SIZE } from '../const/tile'
import { Game } from './game'
import { KeyEnum } from '../type/keyboard'

export class Player implements PlayerInterface {
  public id: string
  public name: string
  public position: Vector
  public direction: DirectionEnum

  constructor (
    id?: string,
    name?: string,
    position?: Vector,
    direction?: DirectionEnum,
  ) {
    this.id = id ?? ''
    this.name = name ?? '???'
    this.position = position ?? new Vector(TILE_SIZE, TILE_SIZE)
    this.direction = direction ?? DirectionEnum.Down
  }

  handleMovement (gameInstance: Game, delta: number): boolean {
    let x = 0
    let y = 0

    if (gameInstance.keyboard.isPressed(KeyEnum.Left)) {
      this.direction = DirectionEnum.Left
      x = -1
    }
    if (gameInstance.keyboard.isPressed(KeyEnum.Right)) {
      this.direction = DirectionEnum.Right
      x = 1
    }
    if (gameInstance.keyboard.isPressed(KeyEnum.Up)) {
      this.direction = DirectionEnum.Up
      y = -1
    }
    if (gameInstance.keyboard.isPressed(KeyEnum.Down)) {
      this.direction = DirectionEnum.Down
      y = 1
    }

    if (x === 0 && y === 0) {
      return false
    }

    const speed = 200
    const nextXDirection = x * speed * delta
    const nextYDirection = y * speed * delta

    this.position.x += nextXDirection
    this.position.y += nextYDirection

    const maxX = (gameInstance.widthSize * TILE_SIZE) - TILE_SIZE
    const maxY = (gameInstance.heightSize * TILE_SIZE) - TILE_SIZE

    this.position.x = Math.max(0, Math.min(this.position.x, maxX))
    this.position.y = Math.max(0, Math.min(this.position.y, maxY))

    return true
  }
}
