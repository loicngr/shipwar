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
  Player,
  type Vector,
  EVENT_KEY_NEW_PLAYER,
  EVENT_KEY_PLAYERS,
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

  players: Player[]

  constructor () {
    this.players = []
  }

  handleDisconnect (client: Socket) {
    const i = this.players.findIndex((player) => player.id === client.id)

    if (i !== -1) {
      this.players.splice(i, 1)
    }

    this.server?.emit(EVENT_KEY_PLAYERS, this.players)
  }

  @SubscribeMessage(EVENT_KEY_NEW_PLAYER)
  async [EVENT_KEY_NEW_PLAYER] (
  @ConnectedSocket() client: Socket,
    @MessageBody() payload: { position: Vector },
  ) {
    const newPlayer = new Player(client.id, client.id.slice(0, 4), payload.position)
    this.players.push(newPlayer)

    client.emit(EVENT_KEY_NEW_PLAYER, newPlayer)
    this.server?.emit(EVENT_KEY_PLAYERS, this.players)

    return newPlayer
  }
}
