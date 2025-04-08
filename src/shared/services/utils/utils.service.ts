import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { ISignToken } from 'src/auth/interface/auth.interface';

@Injectable()
export class UtilsService {
  constructor(private jwt: JwtService) {}

  /**
   * Hashes a given plain text value.
   * @param value The plain text value to hash.
   * @param salt The cost factor for the hash. Defaults to 12.
   * @returns The hashed value.
   */
  async hashValue(value: string, salt = 12): Promise<string> {
    const genSalt = await bcrypt.genSalt(salt);
    const hashedPassword = await bcrypt.hash(value, genSalt);

    return hashedPassword;
  }

  /**
   * Compares a plain text value with a hashed value to check if they match.
   * @param value The plain text value to compare.
   * @param hash The hashed value to compare against.
   * @returns A promise that resolves to true if the values match, false otherwise.
   */
  async compareHash(value: string, hash: string): Promise<boolean> {
    return await bcrypt.compare(value, hash);
  }

  /**
   * Creates a signed JWT token for a user
   * @param userId user's unique id
   * @param email user's email
   * @returns signed JWT token
   * @private
   */
  signToken(userId: string, email: string): ISignToken {
    const payload = { sub: userId, email };
    return {
      accessToken: this.jwt.sign(payload),
    };
  }
}
