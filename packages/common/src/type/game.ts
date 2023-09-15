import { Player } from '../class/player'
import { Server } from '../class/server'
import { Keyboard } from '../class/keyboard'
import { Loader } from '../class/loader'
import { Canvas } from '../class/canvas'
import { Bullet } from '../class/bullet'

export interface GameInterface {
  domRef: HTMLElement
  readonly widthSize: number
  readonly heightSize: number
  canvas: Canvas
  loader: Loader
  previousElapsed: number
  players: Map<string, Player>
  player: Player | undefined
  keyboard: Keyboard
  server: Server
  bullets: Bullet[]

  run: () => void

  load: () => Array<Promise<HTMLImageElement | string>>

  init: () => void

  update: (delta: number) => void

  render: () => void

  renderMap: () => void

  renderPlayers: () => void

  renderBullets: () => void

  renderUtils: () => void

  tick: (elapsed: number) => void

  setPlayers: (players: Map<string, Player>) => void

  getPlayerById: (id: string) => Player | undefined

  addBullet: (bullet: Bullet) => void

  addPlayer: (player: Player) => void
}
