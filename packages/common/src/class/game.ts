import { GameInterface } from '../type/game'
import { Canvas } from './canvas'
import { Loader } from './loader'
import { Player } from './player'
import { Bullet } from './bullet'
import {
  TILE_SIZE, TILE_SPACE,
} from '../const/tile'
import { Keyboard } from './keyboard'
import { Server } from './server'
import {
  KeyEnum, MouseKeyEnum, WheelKeyEnum,
} from '../type/keyboard'
import { PrepareBullet } from './prepareBullet'

export class Game implements GameInterface {
  domRef: HTMLElement
  readonly widthSize: number
  readonly heightSize: number
  readonly canvas: Canvas
  readonly loader: Loader
  previousElapsed: number
  players: Map<string, Player>
  player: string | undefined
  keyboard: Keyboard
  readonly server: Server
  readonly bullets: Bullet[]
  prepareBullet: PrepareBullet | undefined

  constructor (ref: string) {
    const domRef = document.getElementById(ref)
    if (domRef === null) {
      throw new Error('App html element not found.')
    }

    this.domRef = domRef

    this.widthSize = 50
    this.heightSize = 50

    this.server = new Server(this)
    this.keyboard = new Keyboard()
    this.loader = new Loader()
    this.canvas = new Canvas(this, 'game_canvas')
    this.players = new Map()

    this.previousElapsed = 0
    this.bullets = []

    this.run()
  }

  run (): void {
    void Promise.all(this.load())
      .then(() => {
        this.init()
        requestAnimationFrame(this.tick.bind(this))
      })
  }

  load (): Array<Promise<HTMLImageElement | string>> {
    return [
      this.loader.loadImage('tilesheet', './assets/kenney_tiny-battle/Tilemap/tilemap.png'),
    ]
  }

  init () {
    // Init components
    const keysValues = Object.values(KeyEnum)
    this.keyboard.listenForEvents(keysValues)
    const mouseKeysValues = Object.values(MouseKeyEnum)
    this.keyboard.listenForMouseEvents(mouseKeysValues)
    const wheelKeysValues = Object.values(WheelKeyEnum)
    this.keyboard.listenForWheelEvents(wheelKeysValues)

    // const playerName = (Math.random() + 1).toString(36).substring(7)
    const player = new Player()

    this.server.send({
      key: 'newPlayer',
      payload: {
        position: {
          x: player.position?.x,
          y: player.position?.y,
        },
      },
    })
  }

  getPlayerOrThrow (): Player {
    if (typeof this.player !== 'string') {
      throw new Error('no player')
    }

    const player = this.players.get(this.player)

    if (typeof player === 'undefined') {
      throw new Error('no player')
    }

    return player
  }

  update (
    delta: number,
  ): void {
    // Update components
    let player

    try {
      player = this.getPlayerOrThrow()
    } catch (e) {
      return
    }

    const hasMovement = player.handleMovement(this, delta)

    if (this.keyboard.isPressed(KeyEnum.F)) {
      this.keyboard.resetKey(KeyEnum.F)

      if (typeof this.prepareBullet === 'undefined') {
        this.prepareBullet = new PrepareBullet(player.id, player.position)
        this.prepareBullet.start()
      } else {
        this.prepareBullet.stop()
        const bullet = this.prepareBullet
        this.prepareBullet = undefined

        this.server.send({
          key: 'newBullet',
          payload: {
            player: {
              id: player.id,
            },
            to: {
              x: bullet.to.x,
              y: bullet.to.y,
            },
            from: {
              x: bullet.from.x,
              y: bullet.from.y,
            },
          },
        })
      }
    }

    if (hasMovement) {
      this.server.send({
        key: 'updatePlayerPosition',
        payload: {
          position: {
            x: player.position?.x,
            y: player.position?.y,
          },
        },
      })
    }
  }

  render (): void {
    this.renderMap()
    this.renderPlayers()
    this.renderPreparedBullet()
    this.renderBullets()
    this.renderUtils()
  }

  renderMap (): void {
    // Draw map layer
    const tiles = this.loader.getImage('tilesheet')

    for (let w = 0; w < this.widthSize; ++w) {
      for (let h = 0; h < this.heightSize; ++h) {
        this.canvas.context.drawImage(
          tiles,
          (TILE_SIZE + TILE_SPACE),
          (TILE_SIZE + TILE_SPACE) * 2,
          TILE_SIZE,
          TILE_SIZE,
          w * TILE_SIZE,
          h * TILE_SIZE,
          TILE_SIZE,
          TILE_SIZE,
        )
      }
    }
  }

  renderPlayers (): void {
    // Draw players layer
    const tiles = this.loader.getImage('tilesheet')
    const players = new Map(this.players)

    players.forEach((player: Player) => {
      this.canvas.context.drawImage(
        tiles,
        (TILE_SIZE + TILE_SPACE) * 13,
        (TILE_SIZE + TILE_SPACE) * 8,
        TILE_SIZE,
        TILE_SIZE,
        player.position?.x ?? 0,
        player.position?.y ?? 0,
        TILE_SIZE,
        TILE_SIZE,
      )

      this.canvas.context.fillText(
        player.name ?? '',
        player.position?.x ?? 0,
        player.position?.y ?? 0,
        TILE_SIZE,
      )
    })
  }

  renderBullets (): void {
    // Draw bullets layer
    const bullets = this.bullets

    bullets.forEach((bullet: Bullet) => {
      this.canvas.context.beginPath()
      this.canvas.context.lineWidth = 5
      this.canvas.context.moveTo(bullet.from.x, bullet.from.y)
      this.canvas.context.lineTo(bullet.to.x, bullet.to.y)
      this.canvas.context.stroke()
    })
  }

  renderPreparedBullet (): void {
    // Draw bullets layer
    const bullet = this.prepareBullet

    if (typeof bullet === 'undefined') {
      return
    }

    this.canvas.context.beginPath()
    this.canvas.context.lineWidth = 5
    this.canvas.context.moveTo(bullet.from.x, bullet.from.y)
    this.canvas.context.lineTo(bullet.to.x, bullet.to.y)
    this.canvas.context.stroke()
  }

  renderUtils (): void {
    this.canvas.context.fillText(
      this.server.isOk
        ? 'Server : OK'
        : 'Server : NOT OK',
      TILE_SIZE / 2,
      TILE_SIZE / 2,
    )
  }

  tick (elapsed: number): void {
    requestAnimationFrame(this.tick.bind(this))

    this.canvas.context.clearRect(0, 0, this.widthSize, this.heightSize)
    const elapsedDelta = elapsed - this.previousElapsed
    const delta = Math.min(elapsedDelta / 1000.0, 0.25)

    this.previousElapsed = elapsed
    this.update(delta)
    this.render()
  }

  setPlayers (players: Map<string, Player>): void {
    this.players = new Map(players)
  }

  getPlayerById (id: string): Player | undefined {
    return this.players.get(id)
  }

  addBullet (bullet: Bullet) {
    this.bullets.push(bullet)
  }

  addPlayer (player: Player) {
    if (typeof player.id === 'undefined') {
      return
    }

    this.players.set(player.id, player)
  }
}
