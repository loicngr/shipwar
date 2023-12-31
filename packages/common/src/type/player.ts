import { DirectionEnum } from './direction'
import { Game } from '../class/game'
import { Vector } from '../class/vector'

export interface NewPlayerInterface {
  id: string
  name: string
  position: Vector
  direction: DirectionEnum
}

export interface PlayerInterface {
  id?: string
  name?: string
  direction?: DirectionEnum
  position?: Vector

  handleMovement: (gameInstance: Game, delta: number) => boolean
}
