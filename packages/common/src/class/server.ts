import { ServerInterface, ServerSendEventInterface } from '../type/server'
import { Game } from './game'
import { io, Socket } from 'socket.io-client'

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

    ws.onAny(this.onReceived)
  }

  tryConnection () {
    this.webSocket = io(this.webSocketSettings.url, {
      transports: ['websocket'],
    })
  }

  onOpen () {
    console.log('Connected to server')
  }

  onReceived (event: MessageEvent): void {
    console.log(event)
  }

  send (event: ServerSendEventInterface): void {
    const ws = this.webSocket
    if (typeof ws === 'undefined' || !this.isOk) {
      return
    }

    ws.emit(event.key, typeof event.payload === 'string' ? event.payload : JSON.stringify(event.payload))
  }

  get isOk (): boolean {
    return typeof this.webSocket !== 'undefined' && this.webSocket.active
  }
}
