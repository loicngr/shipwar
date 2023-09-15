import { ServerInterface } from '../type/server'
import { Player } from './player'
import { Vector } from './vector'
import { Game } from './game'
import { Bullet } from './bullet'

export class Server implements ServerInterface {
  private readonly webSocketSettings: { url: string, protocols: string[] }
  private webSocket: WebSocket | undefined

  constructor (
    private readonly game: Game,
  ) {
    this.webSocketSettings = {
      url: `ws://${window.location.hostname}:8080`,
      protocols: [],
    }

    this.tryConnection()
    this.init()
  }

  private init () {
    const ws = this.webSocket
    if (typeof ws === 'undefined') {
      return
    }

    ws.onopen = this.onOpen.bind(this)
    ws.onmessage = (data: MessageEvent<unknown>) => { this.onReceived(data) }
  }

  private tryConnection () {
    this.webSocket = new WebSocket(
      this.webSocketSettings.url,
      this.webSocketSettings.protocols,
    )
  }

  private onOpen () {
    console.log('Connected to server')
  }

  private onReceived (event: MessageEvent): void {
    const payload = JSON.parse(event.data) as {
      key: string
      subject: Record<string, unknown> | Array<Record<string, unknown>>
    }

    switch (payload.key) {
      case 'players': {
        const payloadPlayers = payload.subject as Array<{
          id: string
          name: string
          position: { x: number, y: number }
        }>

        const players = new Map()

        payloadPlayers.forEach((player) => {
          if (typeof player.position !== 'undefined') {
            players.set(player.id, new Player(
              player.id,
              player.name,
              new Vector(player.position.x, player.position.y),
            ))
          }
        })

        this.game.setPlayers(players)

        break
      }
      case 'newPlayer': {
        if (
          typeof payload.subject.id === 'string' &&
          this.game.player?.id !== payload.subject.id
        ) {
          console.log('define %s as current player', payload.subject.name)

          this.game.player = new Player(
            payload.subject.id as string,
            payload.subject.name as string,
          )

          this.game.addPlayer(this.game.player)
        }
        break
      }
      case 'bullet': {
        const bullet = payload.subject as unknown as Bullet
        const bulletPlayer = this.game.getPlayerById(bullet.player.id)
        if (typeof bulletPlayer === 'undefined') {
          break
        }

        this.game.addBullet(new Bullet(
          bulletPlayer,
          new Vector(bullet.from.x, bullet.from.y),
          new Vector(bullet.to.x, bullet.to.y),
        ))
        break
      }
      default:
        break
    }
  }

  public send (payload: Record<string, unknown>): void {
    const ws = this.webSocket
    if (
      typeof ws === 'undefined' ||
      !this.isOk
    ) {
      return
    }

    ws.send(JSON.stringify(payload))
  }

  public get isOk (): boolean {
    return typeof this.webSocket !== 'undefined' && this.webSocket.readyState === this.webSocket.OPEN
  }
}
