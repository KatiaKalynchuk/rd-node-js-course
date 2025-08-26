import { CreateProfileDto } from '../../src/profiles/dto/create-profile.dto';

export const createProfileDtoValid: CreateProfileDto = {
  age: 150,
  displayName: 'Geralt of Rivia',
  email: 'thewitcher@test.com',
};

export const createProfileDtoInvalid: CreateProfileDto = {
  age: 150,
  displayName: 'Geralt of Rivia',
  email: 'thewitcher.com',
};
