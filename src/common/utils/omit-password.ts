import { User } from '@prisma/client';

export function omitPassword(user: User): Omit<User, 'password'> {
  const { password, ...rest } = user;
  return rest;
}

export function omitPasswordFromArray(users: User[]): Omit<User, 'password'>[] {
  return users.map(omitPassword);
}
