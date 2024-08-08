import {Controller} from '@nestjs/common';
import { LocationService } from './location.service';

@Controller('location')
export class LocationController {
  constructor(private readonly locationService: LocationService) {}
//   @Post('add')
//   addLocation(@Body() body: any) {
//     return this.locationService.addLocation(body);
//   }
}
