import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const UserRoles = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    return request.user.role;
  },
);
