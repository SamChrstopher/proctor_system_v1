import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Malpractice } from './entities/malpractice.entity';

@Injectable()
export class MalpracticeService {
  constructor(
    @InjectRepository(Malpractice)
    private readonly repo: Repository<Malpractice>,
  ) {}

  async registerCandidate(data: {
    applicantId: string;
    profileImageUrl: string;
  }): Promise<Malpractice> {
    try {
      // Create initial record with only profile image (other fields null)
      const record = this.repo.create({
        applicantId: data.applicantId,
        profileImageUrl: data.profileImageUrl,
        alertMessage: null,
        malpracticeImageUrl: null,
        timestamp: new Date()
      });
      return this.repo.save(record);
    } catch (error) {
      console.error('Registration error:', error);
      throw new Error('Failed to register candidate');
    }
  }

  async addAlert(data: {
    applicantId: string;
    alertMessage: string;
    malpracticeImageUrl: string;
  }): Promise<Malpractice> {
    try {
      // Get the original profile image from first record
      const profileRecord = await this.repo.findOne({
        where: { applicantId: data.applicantId },
        order: { timestamp: 'ASC' }
      });

      if (!profileRecord) {
        throw new Error('Candidate not registered');
      }

      // Create alert record with reference to original profile image
      const alertRecord = this.repo.create({
        applicantId: data.applicantId,
        profileImageUrl: profileRecord.profileImageUrl,
        alertMessage: data.alertMessage,
        malpracticeImageUrl: data.malpracticeImageUrl,
        timestamp: new Date()
      });

      return this.repo.save(alertRecord);
    } catch (error) {
      console.error('Alert creation error:', error);
      throw new Error('Failed to add alert');
    }
  }
}