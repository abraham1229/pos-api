import { ConfigService } from "@nestjs/config"
import type { TypeOrmModuleOptions } from "@nestjs/typeorm"
import { join } from "path"

export const typeOrmConfig = (ConfigService: ConfigService): TypeOrmModuleOptions => ({
  type: 'postgres',
  host: ConfigService.get('DATABASE_HOST'),
  port: ConfigService.get('DATABASE_PORT'),
  username: ConfigService.get('DATABASE_USER'),
  password: ConfigService.get('DATABASE_PASS'),
  database: ConfigService.get('DATABASE_NAME'),
  // logging: true
  ssl: true,
  entities: [join(__dirname + '../../**/*.entity.{js,ts}')],
  synchronize: true //Add entities when connecting
})