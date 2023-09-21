import type { ServerInterface, ServerSendEventInterface } from '../type/server'
import { type NewPlayerInterface } from '../type/player'
import { Game } from './game'
import { io, Socket } from 'socket.io-client'
import { EVENT_KEY_NEW_BULLET, EVENT_KEY_NEW_PLAYER, EVENT_KEY_PLAYERS } from '../const/event'
import { Player } from './player'
import { Vector } from './vector'
import { NewBullet } from '../type/event'
import { Bullet } from './bullet'

export class Server implements ServerInterface {
  readonly webSocketSettings: { url: string }
  webSocket: Socket | undefined
  readonly game: Game

  constructor (
    game: Game,
  ) {
    this.game = game
    this.webSocketSettings = {
      url: `ws://${window.location.hostname}:8000`,
    }

    this.tryConnection()
    this.init()
  }

  init () {
    const ws = this.webSocket
    if (typeof ws === 'undefined') {
      return
    }

    ws.on('connect', this.onOpen)

    ws.onAny(this.onReceived.bind(this))
  }

  tryConnection () {
    this.webSocket = io(this.webSocketSettings.url, {
      transports: ['websocket'],
    })
  }

  onOpen () {
    console.log('Connected to server')
  }

  onReceived (event: string, payload: unknown): void {
    if (typeof payload === 'undefined' || payload === null) {
      return
    }

    if (event === EVENT_KEY_NEW_PLAYER) {
      this.onNewPlayer(payload as NewPlayerInterface)
    }

    if (event === EVENT_KEY_PLAYERS) {
      this.onPlayers(payload as Array<Required<Player>>)
    }

    if (event === EVENT_KEY_NEW_BULLET) {
      this.onNewBullet(payload as NewBullet)
    }
  }

  onNewBullet (payload: NewBullet): void {
    const bulletPlayer = this.game.players.get(payload.player.id)
    if (typeof bulletPlayer === 'undefined') {
      return
    }

    this.game.addBullet(new Bullet(
      bulletPlayer,
      new Vector(payload.from.x, payload.from.y),
      new Vector(payload.to.x, payload.to.y),
    ))
  }

  onPlayers (payload: Array<Required<Player>>) {
    const players = new Map()

    payload.forEach((player) => {
      if (typeof player.position !== 'undefined') {
        players.set(player.id, new Player(
          player.id,
          player.name,
          new Vector(player.position.x, player.position.y),
          player.direction,
        ))
      }
    })

    this.game.setPlayers(players)
  }

  onNewPlayer (payload: NewPlayerInterface) {
    if (
      typeof payload.id === 'undefined' ||
      (typeof this.game.player === 'string' && this.game.player === payload.id)
    ) {
      return
    }

    console.log('define %s as current player', payload.name)

    const player = new Player(
      payload.id,
      payload.name,
      new Vector(payload.position.x, payload.position.y),
      payload.direction,
    )

    this.game.player = player.id
    this.game.addPlayer(player)
  }

  send (event: ServerSendEventInterface): void {
    const ws = this.webSocket
    if (typeof ws === 'undefined' || !this.isOk) {
      return
    }

    ws.emit(event.key, event.payload)
  }

  get isOk (): boolean {
    return typeof this.webSocket !== 'undefined' && this.webSocket.active
  }
}
