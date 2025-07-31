import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MalpracticeService } from './malpractice.service';
import { MalpracticeController } from './malpractice.controller';
import { Malpractice } from './entities/malpractice.entity';
import { CloudinaryService } from '../cloudinary/cloudinary.service';

@Module({
  imports: [TypeOrmModule.forFeature([Malpractice])],
  controllers: [MalpracticeController],
  providers: [MalpracticeService, CloudinaryService],
})
export class MalpracticeModule {}