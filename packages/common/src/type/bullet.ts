import { Vector } from '../class/vector'
import { Player } from '../class/player'

export interface BulletInterface {
  from: Vector
  to: Vector
  player: Player
}
