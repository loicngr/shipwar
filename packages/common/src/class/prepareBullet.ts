import { DirectionEnum } from '../type/direction'
import { Vector } from './vector'
// import { TILE_SIZE } from '../const/tile'

export class PrepareBullet {
  direction: DirectionEnum
  player: string
  from: Vector
  to: Vector
  circleRadius: number
  // circleMinusArc: number
  // circleCircumference: number
  size: number
  interval: number | undefined

  constructor (
    player: string,
    from: Vector,
  ) {
    this.player = player
    this.from = from

    this.size = 100
    this.circleRadius = 10
    this.direction = DirectionEnum.Right

    // this.circleCircumference = 2 * Math.PI * this.circleRadius
    // this.circleMinusArc = this.circleCircumference / 4

    this.to = new Vector(this.from.x, this.from.y)
    this.to.x += 50
    this.to.y += this.size
  }

  start () {
    const maxDelay = 20
    let delay = 0
    let isSub = this.direction === DirectionEnum.Right

    this.interval = setInterval(() => {
      if (isSub) {
        this.to.x -= 5
      } else {
        this.to.x += 5
      }

      delay += 1

      if (delay >= maxDelay) {
        delay = 0
        isSub = !isSub
      }
    }, 100)
  }

  stop () {
    clearInterval(this.interval)
  }
}
