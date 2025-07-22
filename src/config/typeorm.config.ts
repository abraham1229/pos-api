import type { TypeOrmModuleOptions } from "@nestjs/typeorm"

export const typeOrmConfig = (): TypeOrmModuleOptions => ({
  type: 'postgres',
})