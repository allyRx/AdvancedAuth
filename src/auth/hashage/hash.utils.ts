/**
 * Génère un hash SHA-256 d'une chaîne.
 * Utilisé pour stocker les refresh tokens de façon sécurisée.
 */


import * as crypto from 'crypto';

export function hashToken(token: string): string {
  return crypto.createHash('sha256').update(token).digest('hex');
}