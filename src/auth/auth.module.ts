import { Module } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { AuthResolver } from './resolver/auth.resolver';
import { AuthService } from './service/auth.service';
import { SharedModule } from '../shared/shared.module';

@Module({
  imports: [SharedModule],
  providers: [AuthService, AuthResolver, PrismaService],
})
export class AuthModule {}
