import { GameInterface } from './game'

export interface ServerInterface {
  webSocketSettings: { url: string, protocols: string[] }
  webSocket: WebSocket | undefined
  readonly game: GameInterface

  init: () => void
  tryConnection: () => void
  onOpen: () => void
  onReceived: (event: MessageEvent) => void
  send: (payload: Record<string, unknown>) => void
  get isOk(): boolean
}
