/* eslint-disable @typescript-eslint/no-unused-vars */
import { Test, TestingModule } from '@nestjs/testing';
import { AuthResolver } from './auth.resolver';
import { AuthService } from '../service/auth.service';
import { BiometricLoginDto, LoginDto, RegisterDto } from '../dto/auth.dto';

const mockAuthService = {
  register: jest.fn(),
  login: jest.fn(),
  biometricLogin: jest.fn(),
};

describe('AuthResolver', () => {
  let resolver: AuthResolver;
  let authService: AuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthResolver,
        { provide: AuthService, useValue: mockAuthService },
      ],
    }).compile();

    resolver = module.get<AuthResolver>(AuthResolver);
    authService = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });

  describe('register', () => {
    it('should successfully register a user and return an access token', async () => {
      const registerDto: RegisterDto = {
        email: 'john@test.com',
        password: 'Password123',
        biometricKey: 'biometricKey123',
      };

      mockAuthService.register.mockResolvedValue({
        accessToken: 'testAccessToken',
      });

      const result = await resolver.register(registerDto);

      expect(result.message).toBe('Registration successful');
      expect(result.accessToken).toBe('testAccessToken');
      expect(mockAuthService.register).toHaveBeenCalledWith(
        registerDto.email,
        registerDto.password,
        registerDto.biometricKey,
      );
    });
  });

  describe('login', () => {
    it('should successfully login a user and return an access token', async () => {
      const loginDto: LoginDto = {
        email: 'john@test.com',
        password: 'Password123',
      };

      mockAuthService.login.mockResolvedValue({
        accessToken: 'testAccessToken',
      });

      const result = await resolver.login(loginDto);

      expect(result.message).toBe('Login successful');
      expect(result.accessToken).toBe('testAccessToken');
      expect(mockAuthService.login).toHaveBeenCalledWith(
        loginDto.email,
        loginDto.password,
      );
    });
  });

  describe('biometricLogin', () => {
    it('should successfully perform biometric login and return an access token', async () => {
      const biometricLoginDto: BiometricLoginDto = {
        biometricKey: 'biometricKey123',
      };

      mockAuthService.biometricLogin.mockResolvedValue({
        accessToken: 'testAccessToken',
      });

      const result = await resolver.biometricLogin(biometricLoginDto);

      expect(result.message).toBe('Login successful');
      expect(result.accessToken).toBe('testAccessToken');
      expect(mockAuthService.biometricLogin).toHaveBeenCalledWith(
        biometricLoginDto.biometricKey,
      );
    });
  });
});
