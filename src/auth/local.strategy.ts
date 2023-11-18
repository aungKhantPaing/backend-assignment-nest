import { Strategy } from 'passport-local';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException, Logger } from '@nestjs/common';
import { AuthService } from './auth.service';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private authService: AuthService) {
    super({ usernameField: 'deviceid', passwordField: 'deviceid' });
  }

  async validate(phoneNumber: string, otpCode: string): Promise<any> {
    Logger.log('LocalStrategy.validate()', { phoneNumber, otpCode });

    const user = await this.authService.validateUser(phoneNumber, otpCode);
    if (!user) {
      throw new UnauthorizedException({ phoneNumber, otpCode });
    }
    return user;
  }
}
