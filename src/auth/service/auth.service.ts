// src/auth/auth.service.ts
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from '../../prisma.service';
import { UtilsService } from '../../shared/services/utils/utils.service';
import { ISignToken } from '../interface/auth.interface';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private utils: UtilsService,
  ) {}

  /**
   * Register a new user and return the signed JWT token
   * @param email user email
   * @param password user password
   * @param biometricKey optional biometric key
   * @returns signed JWT token
   * @throws UnauthorizedException if user with email already exist
   */
  async register(
    email: string,
    password: string,
    biometricKey?: string,
  ): Promise<ISignToken> {
    const hashed = await this.utils.hashValue(password);

    let user = await this.prisma.user.findFirst({ where: { email } });

    if (user) throw new UnauthorizedException('User with email already exist');

    user = await this.prisma.user.create({
      data: { email, password: hashed, biometricKey },
    });

    return this.utils.signToken(user.id, user.email);
  }

  /**
   * Login a user and return the signed JWT token
   * @param email user email
   * @param password user password
   * @returns signed JWT token
   * @throws UnauthorizedException if user with email doesn't exist or password is incorrect
   */
  async login(email: string, password: string): Promise<ISignToken> {
    const user = await this.prisma.user.findUnique({ where: { email } });

    if (!user || !(await this.utils.compareHash(password, user.password))) {
      throw new UnauthorizedException('Invalid credentials');
    }

    return this.utils.signToken(user.id, user.email);
  }

  /**
   * Login a user using biometric key and return the signed JWT token
   * @param biometricKey user's biometric key
   * @returns signed JWT token
   * @throws UnauthorizedException if user with biometricKey doesn't exist
   */
  async biometricLogin(biometricKey: string): Promise<ISignToken> {
    const user = await this.prisma.user.findUnique({ where: { biometricKey } });

    if (!user) throw new UnauthorizedException('Invalid biometricKey');

    return this.utils.signToken(user.id, user.email);
  }
}
