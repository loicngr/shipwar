import { BulletInterface } from '../type/bullet'
import { Player } from './player'
import { Vector } from './vector'

export class Bullet implements BulletInterface {
  constructor (
    public player: Player,
    public from: Vector,
    public to: Vector,
  ) {
    this.player = player
    this.from = from
    this.to = to
  }
}
