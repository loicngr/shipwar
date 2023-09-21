import {
  ConnectedSocket,
  MessageBody,
  type OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets'
import { type Server, Socket } from 'socket.io'
import {
  EVENT_KEY_NEW_PLAYER,
  EVENT_KEY_UPDATE_PLAYER_POSITION,
  EVENT_KEY_NEW_BULLET,
  EVENT_KEY_PLAYERS,
  Player,
  NewBullet,
  type Vector,
} from '@shipwar/common'

@WebSocketGateway(8000, {
  transports: ['websocket'],
  cors: {
    origin: '*',
  },
})
export class EventsGateway implements OnGatewayDisconnect {
  @WebSocketServer()
  server: Server | undefined

  players: Map<string, Player>

  constructor() {
    this.players = new Map()
  }

  serverSend(key: string, payload: unknown) {
    this.server?.emit(key, payload)
  }

  sendPlayers() {
    this.serverSend(EVENT_KEY_PLAYERS, Array.from(this.players.values()))
  }

  handleDisconnect(client: Socket) {
    this.players.delete(client.id)
    this.sendPlayers()
  }

  @SubscribeMessage(EVENT_KEY_UPDATE_PLAYER_POSITION)
  async [EVENT_KEY_UPDATE_PLAYER_POSITION](
    @ConnectedSocket() client: Socket,
    @MessageBody('position') position: Vector,
  ) {
    const player = this.players.get(client.id)

    if (typeof player === 'undefined') {
      return
    }

    player.position.x = position.x
    player.position.y = position.y

    this.sendPlayers()
  }

  @SubscribeMessage(EVENT_KEY_NEW_BULLET)
  async [EVENT_KEY_NEW_BULLET](
    @ConnectedSocket() client: Socket,
    @MessageBody() payload: NewBullet,
  ) {
    this.serverSend(EVENT_KEY_NEW_BULLET, {
      ...payload,
    })
  }

  @SubscribeMessage(EVENT_KEY_NEW_PLAYER)
  async [EVENT_KEY_NEW_PLAYER](
    @ConnectedSocket() client: Socket,
    @MessageBody('position') position: Vector,
  ) {
    const newPlayer = new Player(client.id, client.id.slice(0, 4), position)

    this.players.set(newPlayer.id, newPlayer)

    client.emit(EVENT_KEY_NEW_PLAYER, newPlayer)
    this.sendPlayers()
  }
}
