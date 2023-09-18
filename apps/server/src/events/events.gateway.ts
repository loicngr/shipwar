import { ConnectedSocket, MessageBody, SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets'
import { type Server, Socket } from 'socket.io'
import { Player, type Vector } from '@shipwar/common'

@WebSocketGateway(8000, {
  transports: ['websocket'],
  cors: {
    origin: '*',
  },
})
export class EventsGateway {
  @WebSocketServer()
    server: Server | undefined

  @SubscribeMessage('newPlayer')
  async newPlayer (
  @ConnectedSocket() client: Socket,
    @MessageBody() payload: { position: Vector },
  ) {
    console.log(
      client.id,
      payload,
      new Player(client.id, client.id.slice(0, 4), payload.position),
    )
  }
}
