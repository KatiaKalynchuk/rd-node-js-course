import { UserDto } from '../users/dto/user.dto';

export enum Role {
  ADMIN = 'admin',
  USER = 'user',
}

export type TokenPayload = {
  sub: UserDto['id'];
  email: UserDto['email'];
  roles?: Role[];
};
