import { WebSocketServer } from 'ws'
import { v4 as uuidv4 } from 'uuid'

const wss = new WebSocketServer({ port: 8080 })
const clients = new Map()

interface IGameBullet {
  from: {
    x: number,
    y: number,
  },
  to: {
    x: number,
    y: number,
  },
  player: {
    id: string,
  }
}

wss.on('connection', function connection (ws) {
  const id = uuidv4()
  clients.set(ws, { id })

  ws.on('error', console.error)

  sendPlayers()

  ws.on('close', function () {
    clients.delete(ws)

    sendPlayers()
  })

  ws.on('message', function (event) {
    const client = clients.get(ws) as {
      id: string,
      name?: string
      position?: unknown
    }

    try {
      const eventData = JSON.parse(event.toString()) as {
        key: string,
        subject: unknown
      }

      switch (eventData.key) {
      case 'newPlayer': {
        const player = eventData.subject as Record<string, unknown> | undefined
        client.name = player?.name as string | undefined ?? `${client.id.slice(0, 4)}`
        client.position = player?.position

        ws.send(JSON.stringify({
          key: 'newPlayer',
          subject: client
        }))

        sendPlayers()

        break
      }
      case 'updatePlayerPosition': {
        client.position = eventData.subject
        sendPlayers()
        break
      }
      case 'newBullet': {
        const payload = eventData.subject as {
          player: { id: string },
          position: {
            x: number,
            y: number,
          },
          direction: string
        }

        if (payload.direction === 'DOWN') {
          const bullet: IGameBullet = {
            player: payload.player,
            from: { ...payload.position },
            to: {
              x: payload.position.x,
              y: payload.position.y + 300
            },
          }

          sendBullet(bullet)
        }

        break
      }
      default:
        break
      }
    } catch (err) {
      console.error('Unable to parse message:', err)
    }
  })
})

function sendPlayers (
  // clientId?: string
) {
  sendToAllClients(JSON.stringify({
    key: 'players',
    subject: Array.from(clients.values())
      .filter((c) => {
        return typeof c.name !== 'undefined'
        // && typeof clientId !== 'undefined'
        //   ? c.id !== clientId
        //   : true
      })
  }))
}

function sendBullet (bullet: IGameBullet) {
  sendToAllClients(JSON.stringify({
    key: 'bullet',
    subject: bullet
  }))
}

function sendToAllClients (payload: string) {
  wss.clients.forEach(function (ws) {
    ws.send(payload)
  })
}

