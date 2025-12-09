// src/auth/decorators/roles.decorator.ts
import { SetMetadata } from '@nestjs/common';

/**
 * Décorateur pour spécifier les rôles autorisés sur une route.
 * Exemple : @Roles('admin')
 */
export const Roles = (...roles: string[]) => SetMetadata('roles', roles);