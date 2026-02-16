import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { TypeOrmModuleOptions, TypeOrmOptionsFactory } from '@nestjs/typeorm';

@Injectable()
export class TypeOrmConfigService implements TypeOrmOptionsFactory {
    constructor(private configService: ConfigService) { }

    createTypeOrmOptions(): TypeOrmModuleOptions {
        const searchPath = this.configService.get<string>('DB_SCHEMA', 'public');

        return {
            type: 'postgres',
            host: this.configService.get<string>('DB_HOST'),
            port: this.configService.get<number>('DB_PORT', 5432),
            username: this.configService.get<string>('DB_USERNAME'),
            password: this.configService.get<string>('DB_PASSWORD'),
            database: this.configService.get<string>('DB_DATABASE'),
            entities: [__dirname + '/../**/*.entity{.ts,.js}'],
            synchronize: false, // Production-safe default
            extra: {
                // Enforce search_path at connection level
                options: `-c search_path=${searchPath}`,
            },
            logging: this.configService.get<string>('NODE_ENV') === 'development',
        };
    }
}
