import { ProfilesService } from './profiles.service';
import { loggerMock } from '../../test/mocks/loggerMock';
import { createProfileDtoValid } from '../../test/test-data';

describe('ProfilesService', () => {
  let service: ProfilesService;

  beforeEach(() => {
    service = new ProfilesService(loggerMock);
  });

  it('creates a profile and returns id', () => {
    const profile = service.create(createProfileDtoValid);
    expect(profile.id).toBeDefined();
    expect(profile.email).toBe(createProfileDtoValid.email);
  });

  it('does not allow duplicate email', () => {
    service.create(createProfileDtoValid);
    expect(() =>
      service.create({ ...createProfileDtoValid, displayName: 'Vesemir' }),
    ).toThrow();
  });

  it('findById returns item', () => {
    const profile = service.create(createProfileDtoValid);
    expect(service.findById(profile.id)).toEqual(profile);
  });

  it('findById throws if not found', () => {
    const id = '999';
    expect(() => service.findById(id)).toThrow();
  });
});
