import { Socket } from 'socket.io-client'
import { type Game } from '../class/game'

export interface ServerSendEventInterface {
  key: string
  payload: string | Record<string, unknown>
}

export interface ServerInterface {
  webSocketSettings: { url: string }
  webSocket: Socket | undefined
  readonly game: Game

  init: () => void
  tryConnection: () => void
  onOpen: () => void
  onReceived: (event: string, payload: unknown) => void
  send: (payload: ServerSendEventInterface) => void
  get isOk(): boolean
}
