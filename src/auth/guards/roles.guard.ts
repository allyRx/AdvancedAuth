// src/auth/guards/roles.guard.ts
import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    // 1. Récupère les rôles autorisés sur la route (via @Roles)
    const requiredRoles = this.reflector.getAllAndOverride<string[]>('roles', [
      context.getHandler(),     // décorateur sur la méthode
      context.getClass(),      // décorateur sur la classe
    ]);

    // 2. Si aucune restriction → accès autorisé
    if (!requiredRoles) {
      return true;
    }

    // 3. Récupère l'utilisateur courant (injecté par JwtAuthGuard)
    const { user } = context.switchToHttp().getRequest();

    // 4. Vérifie que le rôle de l'utilisateur est dans les rôles requis
    return requiredRoles.some((role) => user?.role === role);
  }
}