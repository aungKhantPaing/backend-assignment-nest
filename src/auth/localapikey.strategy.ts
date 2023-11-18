import { Strategy } from 'passport-localapikey';
import { Injectable, Logger } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { AuthService } from './auth.service';

@Injectable()
export class LocalAPIKeyStrategy extends PassportStrategy(Strategy) {
  constructor(private authService: AuthService) {
    super();
  }

  async validate(apikey: string): Promise<any> {
    Logger.log('LocalAPIKeyStrategy.validate()', { apikey });
    if (this.authService.validateApiKey(apikey)) {
      return apikey;
    }
  }
}
