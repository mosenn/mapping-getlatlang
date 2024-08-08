import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaService } from './prisma/prisma.service';
import { PrismaModule } from './prisma/prisma.module';
import { LocationModule } from './location/location.module';
import { LocationController } from './location/location.controller';

@Module({
  imports: [PrismaModule, LocationModule],
  controllers: [AppController , LocationController],
  providers: [AppService, PrismaService],
})
export class AppModule {}
