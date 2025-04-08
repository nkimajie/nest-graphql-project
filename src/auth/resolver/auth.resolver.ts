// src/auth/auth.resolver.ts
import { Resolver, Mutation, Args } from '@nestjs/graphql';
import { AuthService } from '../service/auth.service';
import { BiometricLoginDto, LoginDto, RegisterDto } from '../dto/auth.dto';
import { AuthResponse } from '../../shared/services/base/base.dto';

@Resolver()
export class AuthResolver {
  constructor(private authService: AuthService) {}

  @Mutation(() => AuthResponse)
  async register(@Args('data') data: RegisterDto) {
    const response = await this.authService.register(
      data.email,
      data.password,
      data?.biometricKey,
    );

    return {
      message: 'Registration successful',
      accessToken: response?.accessToken,
    };
  }

  @Mutation(() => AuthResponse)
  async login(@Args('data') data: LoginDto) {
    const response = await this.authService.login(data.email, data.password);

    return {
      message: 'Login successful',
      accessToken: response?.accessToken,
    };
  }

  @Mutation(() => AuthResponse)
  async biometricLogin(@Args('data') data: BiometricLoginDto) {
    const response = await this.authService.biometricLogin(data.biometricKey);
    return {
      message: 'Login successful',
      accessToken: response?.accessToken,
    };
  }
}
