/* eslint-disable @typescript-eslint/no-unused-vars */
import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { PrismaService } from '../../prisma.service';
import { UtilsService } from '../../shared/services/utils/utils.service';
import { UnauthorizedException } from '@nestjs/common';

const mockPrismaService = {
  user: {
    findFirst: jest.fn(),
    findUnique: jest.fn(),
    create: jest.fn(),
  },
};

const mockUtilsService = {
  hashValue: jest.fn(),
  compareHash: jest.fn(),
  signToken: jest.fn(),
};

describe('AuthService', () => {
  let authService: AuthService;
  let prismaService: PrismaService;
  let utilsService: UtilsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: PrismaService, useValue: mockPrismaService },
        { provide: UtilsService, useValue: mockUtilsService },
      ],
    }).compile();

    authService = module.get<AuthService>(AuthService);
    prismaService = module.get<PrismaService>(PrismaService);
    utilsService = module.get<UtilsService>(UtilsService);
  });

  describe('register', () => {
    it('should successfully register a new user and return a signed token', async () => {
      const registerDto = {
        email: 'john@test.com',
        password: 'password123',
        biometricKey: 'biometricKey123',
      };

      const Password = 'Password123';
      const signTokenResponse = { accessToken: 'testAccessToken' };

      mockUtilsService.hashValue.mockResolvedValue(Password);
      mockPrismaService.user.findFirst.mockResolvedValue(null);
      mockPrismaService.user.create.mockResolvedValue({
        id: 1,
        email: 'john@test.com',
        biometricKey: 'biometricKey123',
      });
      mockUtilsService.signToken.mockResolvedValue(signTokenResponse);

      const result = await authService.register(
        registerDto.email,
        registerDto.password,
        registerDto.biometricKey,
      );

      expect(result).toEqual(signTokenResponse);
      expect(mockPrismaService.user.create).toHaveBeenCalledWith({
        data: {
          email: registerDto.email,
          password: Password,
          biometricKey: registerDto.biometricKey,
        },
      });
      expect(mockUtilsService.signToken).toHaveBeenCalledWith(
        1,
        'john@test.com',
      );
    });

    it('should throw an error if the user already exists', async () => {
      const registerDto = {
        email: 'john@test.com',
        password: 'password123',
      };

      mockPrismaService.user.findFirst.mockResolvedValue({
        id: 1,
        email: 'john@test.com',
      });

      await expect(
        authService.register(registerDto.email, registerDto.password),
      ).rejects.toThrowError(UnauthorizedException);
    });
  });

  describe('login', () => {
    it('should successfully login a user and return a signed token', async () => {
      const loginDto = { email: 'john@test.com', password: 'password123' };
      const signTokenResponse = { accessToken: 'testAccessToken' };

      const user = {
        id: 1,
        email: 'john@test.com',
        password: 'Password123',
      };

      mockPrismaService.user.findUnique.mockResolvedValue(user);
      mockUtilsService.compareHash.mockResolvedValue(true);
      mockUtilsService.signToken.mockResolvedValue(signTokenResponse);

      const result = await authService.login(loginDto.email, loginDto.password);

      expect(result).toEqual(signTokenResponse);
      expect(mockPrismaService.user.findUnique).toHaveBeenCalledWith({
        where: { email: loginDto.email },
      });
      expect(mockUtilsService.compareHash).toHaveBeenCalledWith(
        loginDto.password,
        user.password,
      );
      expect(mockUtilsService.signToken).toHaveBeenCalledWith(
        user.id,
        user.email,
      );
    });

    it('should throw an error if credentials are invalid', async () => {
      const loginDto = { email: 'john@test.com', password: 'password123' };

      mockPrismaService.user.findUnique.mockResolvedValue(null);

      await expect(
        authService.login(loginDto.email, loginDto.password),
      ).rejects.toThrowError(UnauthorizedException);
    });
  });

  describe('biometricLogin', () => {
    it('should successfully login using biometricKey and return a signed token', async () => {
      const biometricLoginDto = { biometricKey: 'biometricKey123' };
      const signTokenResponse = { accessToken: 'testAccessToken' };

      const user = {
        id: 1,
        email: 'john@test.com',
        biometricKey: 'biometricKey123',
      };

      mockPrismaService.user.findUnique.mockResolvedValue(user);
      mockUtilsService.signToken.mockResolvedValue(signTokenResponse);

      const result = await authService.biometricLogin(
        biometricLoginDto.biometricKey,
      );

      expect(result).toEqual(signTokenResponse);
      expect(mockPrismaService.user.findUnique).toHaveBeenCalledWith({
        where: { biometricKey: biometricLoginDto.biometricKey },
      });
      expect(mockUtilsService.signToken).toHaveBeenCalledWith(
        user.id,
        user.email,
      );
    });

    it('should throw an error if biometricKey is invalid', async () => {
      const biometricLoginDto = { biometricKey: 'invalidBiometricKey' };

      mockPrismaService.user.findUnique.mockResolvedValue(null);

      await expect(
        authService.biometricLogin(biometricLoginDto.biometricKey),
      ).rejects.toThrowError(UnauthorizedException);
    });
  });
});
