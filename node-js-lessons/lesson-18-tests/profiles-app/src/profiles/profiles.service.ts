import {
  Injectable,
  ConflictException,
  NotFoundException,
} from '@nestjs/common';
import { CreateProfileDto } from './dto/create-profile.dto';
import { Profile } from './entities/profile.entity';
import { randomUUID } from 'node:crypto';
import { AppLogger } from '../logger/logger.service';

@Injectable()
export class ProfilesService {
  private profiles: Profile[] = [];

  constructor(private readonly logger: AppLogger) {}

  findByEmail(email: Profile['email']) {
    return this.profiles.find((profile) => profile.email === email);
  }

  create(dto: CreateProfileDto): Profile {
    const existedProfile = this.findByEmail(dto.email);

    if (existedProfile) {
      throw new ConflictException(
        `Profile with email ${dto.email} already exists.`,
      );
    }

    const profile: Profile = {
      ...dto,
      id: randomUUID(),
    };

    this.profiles.push(profile);

    this.logger.log('profile.created', {
      id: profile.id,
      email: profile.email,
    });

    return profile;
  }

  findById(id: string): Profile {
    const profile = this.profiles.find((p) => p.id === id);

    if (!profile) throw new NotFoundException('Profile not found');

    return profile;
  }

  findAll(): Profile[] {
    return this.profiles;
  }
}
