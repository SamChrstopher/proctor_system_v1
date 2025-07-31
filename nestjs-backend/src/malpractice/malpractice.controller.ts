import {
  Controller,
  Post,
  UploadedFile,
  UseInterceptors,
  Body,
  BadRequestException,
  Header,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { MalpracticeService } from './malpractice.service';
import { CloudinaryService } from '../cloudinary/cloudinary.service';

@Controller('malpractice')
export class MalpracticeController {
  constructor(
    private readonly service: MalpracticeService,
    private readonly cloudinary: CloudinaryService,
  ) {}

  @Post('register-candidate')
  @UseInterceptors(FileInterceptor('file'))
  @Header('Access-Control-Allow-Origin', 'http://localhost:5173')
  @Header('Access-Control-Allow-Credentials', 'true')
  async registerCandidate(
    @UploadedFile() file: Express.Multer.File,
    @Body() body: { applicantId: string },
  ) {
    if (!file) throw new BadRequestException('No file uploaded');
    
    try {
      const imageUrl = await this.cloudinary.uploadImage(file, 'profile');
      const result = await this.service.registerCandidate({
        applicantId: body.applicantId,
        profileImageUrl: imageUrl,
      });

      return {
        success: true,
        profileImageUrl: result.profileImageUrl,
        applicantId: result.applicantId,
      };
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  @Post('alert')
  @UseInterceptors(FileInterceptor('file'))
  async addAlert(
    @UploadedFile() file: Express.Multer.File,
    @Body() body: { alertMessage: string; applicantId: string },
  ) {
    if (!file) {
      throw new BadRequestException('No image file provided');
    }

    try {
      const imageUrl = await this.cloudinary.uploadImage(file, 'alerts');
      return this.service.addAlert({
        applicantId: body.applicantId,
        alertMessage: body.alertMessage,
        malpracticeImageUrl: imageUrl,
      });
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  @Post('screen-violation')
  @UseInterceptors(FileInterceptor('file'))
  async addScreenViolation(
    @UploadedFile() file: Express.Multer.File,
    @Body() body: { 
      alertMessage: string; 
      applicantId: string;
    },
  ) {
    if (!file) {
      throw new BadRequestException('No image file provided');
    }

    try {
      const imageUrl = await this.cloudinary.uploadImage(file, 'screen-violations');
      return this.service.addAlert({
        applicantId: body.applicantId,
        alertMessage: body.alertMessage,
        malpracticeImageUrl: imageUrl,
      });
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }
}