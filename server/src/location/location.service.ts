import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  MessageBody,
} from '@nestjs/websockets';
import { Server } from 'socket.io';

@Injectable()
@WebSocketGateway({ cors: true })
export class LocationService {
  @WebSocketServer()
  server: Server;

  constructor(private readonly prisma: PrismaService) {}

  @SubscribeMessage('addLocation')
  async addLocation(@MessageBody() body: any) {
    console.log(body, 'body');
    this.server.emit('locationAdded', body);
    const addLocation = await this.prisma.location.create({
      data: { ...body },
    });

    return { data: addLocation, message: 'location is created' };
  }

  @SubscribeMessage('deleteLocation') // Listen for delete requests
  async deleteLocation(
    @MessageBody() body: { id: string; locationId: string },
  ) { 
    console.log(body.id, 'Id in deleteLocation at services');
  
    try {
      // Delete the location from the database
      const deletedLocation = await this.prisma.location.delete({
        where: { locationId: body.id },
      });

      // Emit an event to notify clients
      this.server.emit('locationDeleted', { id: body.id });

      return {
        message: 'Location deleted successfully',
        data: deletedLocation,
      };
    } catch (error) {
      console.error('Error deleting location:', error);
      return { message: 'Error deleting location', error: error.message };
    }
  }
}
