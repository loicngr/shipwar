import { Module } from '@nestjs/common'
import { EventsGateway } from './events/events.gateway'

@Module({
  imports: [],
  controllers: [],
  providers: [EventsGateway],
})
export class AppModule {}
