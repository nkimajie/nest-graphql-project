import { Resolver, Mutation, Args } from '@nestjs/graphql';
import { AuthService } from '../service/auth.service';
import { BiometricLoginDto, LoginDto, RegisterDto } from '../dto/auth.dto';
import { AuthResponse } from '../../shared/services/base/base.dto';

@Resolver()
export class AuthResolver {
  constructor(private authService: AuthService) {}

  /**
   * Register a new user.
   *
   * @param data The registration data.
   * @returns An object containing a success message and the JWT token.
   */
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

  /**
   * Login an existing user.
   *
   * @param data The login data.
   * @returns An object containing a success message and the JWT token.
   */
  @Mutation(() => AuthResponse)
  async login(@Args('data') data: LoginDto) {
    const response = await this.authService.login(data.email, data.password);

    return {
      message: 'Login successful',
      accessToken: response?.accessToken,
    };
  }

  /**
   * Login an existing user with a biometric key.
   *
   * @param data The biometric key.
   * @returns An object containing a success message and the JWT token.
   */
  @Mutation(() => AuthResponse)
  async biometricLogin(@Args('data') data: BiometricLoginDto) {
    const response = await this.authService.biometricLogin(data.biometricKey);
    return {
      message: 'Login successful',
      accessToken: response?.accessToken,
    };
  }
}
