import { Injectable } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import { API_KEY, jwtConstants } from './constants';
import { isDeepStrictEqual } from 'util';
import { UserDocument } from 'src/schemas/user.schema';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  validateApiKey(apikey): boolean {
    return isDeepStrictEqual(apikey, API_KEY);
  }

  async validateUser(
    phoneNumber: string,
    otpCode: string,
  ): Promise<UserDocument> {
    const user = await this.usersService.findOne({
      phoneNumber: phoneNumber,
      otpCode: otpCode,
    });
    return user;
  }

  // async validateUser(deviceId: string): Promise<any> {
  //   const hashedDeviceId = await bcrypt.hash(deviceId, await bcrypt.genSalt());
  //   const user = await this.usersService.findOne(hashedDeviceId);
  //   if (user) {
  //     return user;
  //   }
  //   const newUser = await this.usersService.create({
  //     deviceId: hashedDeviceId,
  //   });
  //   return newUser;
  // }

  async login(user: UserDocument) {
    const payload = { sub: user._id.toString(), phoneNumber: user.phoneNumber };
    return {
      createdAt: new Date(),
      access_token: this.jwtService.sign(payload),
      refresh_token: this.jwtService.sign(payload, {
        secret: jwtConstants.refreshSecret,
        expiresIn: '30d',
      }),
    };
  }

  async refreshToken(user: UserDocument) {
    const payload = { sub: user._id.toString(), phoneNumber: user.phoneNumber };
    return {
      createdAt: new Date(),
      access_token: this.jwtService.sign(payload),
      refresh_token: this.jwtService.sign(payload, {
        secret: jwtConstants.refreshSecret,
        expiresIn: '30d',
      }),
    };
  }

  // static async _getHashOf(s) {
  //   return bcrypt.hash(s, await bcrypt.genSalt());
  // }
}
