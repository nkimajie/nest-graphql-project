/* eslint-disable @typescript-eslint/unbound-method */
import { Test, TestingModule } from '@nestjs/testing';
import { UtilsService } from './utils.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

jest.mock('bcrypt', () => ({
  genSalt: jest.fn(),
  hash: jest.fn(),
  compare: jest.fn(),
}));

describe('UtilsService', () => {
  let service: UtilsService;
  let jwtService: JwtService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UtilsService,
        {
          provide: JwtService,
          useValue: {
            sign: jest.fn().mockReturnValue('mockToken'),
          },
        },
      ],
    }).compile();

    service = module.get<UtilsService>(UtilsService);
    jwtService = module.get<JwtService>(JwtService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should hash the value', async () => {
    const plainText = 'pass';
    const hashedValue = 'pass';

    bcrypt.genSalt.mockResolvedValue('salt');
    bcrypt.hash.mockResolvedValue(hashedValue);

    const result = await service.hashValue(plainText);

    expect(result).toBe(hashedValue);
    expect(bcrypt.genSalt).toHaveBeenCalled();
    expect(bcrypt.hash).toHaveBeenCalledWith(plainText, 'salt');
  });

  it('should compare hash with value', async () => {
    const plainText = 'pass';
    const hash = 'pass';

    bcrypt.compare.mockResolvedValue(true);

    const result = await service.compareHash(plainText, hash);

    expect(result).toBe(true);
    expect(bcrypt.compare).toHaveBeenCalledWith(plainText, hash);
  });

  it('JWT token', () => {
    const userId = '123';
    const email = 'test@test.com';

    const result = service.signToken(userId, email);

    expect(result.accessToken).toBe('mockToken');
    expect(jwtService.sign).toHaveBeenCalledWith({ sub: userId, email });
  });
});
