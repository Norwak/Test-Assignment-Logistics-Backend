import 'dotenv/config'
import { DataSourceOptions } from "typeorm";

export const dataSourceOptions: DataSourceOptions = {
  type: "sqlite",
  database: process.env.TEST_DB_NAME as string,
  dropSchema: true,
  entities: ['**/*.entity.ts'],
  synchronize: true,
  logging: false,
}