import { Vector } from '../class/vector'

export interface NewBullet {
  player: {
    id: string
  }
  to: Vector
  from: Vector
}
