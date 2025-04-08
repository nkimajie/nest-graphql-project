import { Module } from '@nestjs/common';
import { UtilsService } from './services/utils/utils.service';
import { JwtModule } from '@nestjs/jwt';

@Module({
  providers: [UtilsService],
  exports: [UtilsService],
  imports: [
    JwtModule.register({
      secret: process.env.PORT,
      signOptions: { expiresIn: '1d' },
    }),
  ],
})
export class SharedModule {}
