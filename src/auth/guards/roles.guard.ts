import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY } from '../decorators/roles.decorator';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) { }

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<string[]>(
      ROLES_KEY,
      [context.getHandler(), context.getClass()],
    );
    if (!requiredRoles) {
      return true;
    }
    const { user } = context.switchToHttp().getRequest();
    
    // Debug: In ra xem nó nhận được gì (có thể xóa sau này)
    console.log("RolesGuard Check:", { userRole: user?.role, required: requiredRoles });

    if (!user || !user.role) {
      return false;
    }

    // --- DÒNG SỬA QUAN TRỌNG NHẤT ---
    // Chuyển cả 2 về chữ in hoa rồi mới so sánh
    return requiredRoles.some((role) => user.role.toUpperCase() === role.toUpperCase());
  }
}