// src/auth/guards/roles.guard.ts
import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  // src/auth/guards/roles.guard.ts
canActivate(context: ExecutionContext): boolean {
  const requiredRoles = this.reflector.getAllAndOverride<string[]>('roles', [
    context.getHandler(),
    context.getClass(),
  ]);


  if (!requiredRoles) {
    return true;
  }

  const { user } = context.switchToHttp().getRequest();

  const allowed = requiredRoles.some((role) => user?.role === role);
 
  return allowed;
}

}


