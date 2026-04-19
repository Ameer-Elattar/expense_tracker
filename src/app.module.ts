import { Module } from '@nestjs/common';
import { DatabaseModule } from './database/database.module';
import { ConfigModule } from '@nestjs/config';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { CategoryModule } from './modules/category/category.module';
import { ApolloServerPluginLandingPageLocalDefault } from '@apollo/server/plugin/landingPage/default';
import { AccountModule } from './modules/account/account.module';
import { UserModule } from './modules/user/user.module';
import { AuthModule } from './modules/auth/auth.module';
import { TransactionModule } from './modules/transaction/transaction.module';


@Module({
  imports: [
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      playground: false,
      autoSchemaFile: 'src/schema.gql',
      plugins: [ApolloServerPluginLandingPageLocalDefault()],
      includeStacktraceInErrorResponses: false,
      context: ({ req, res }) => ({ req, res }),
    }),
    ConfigModule.forRoot({ isGlobal: true }),
    DatabaseModule,
    CategoryModule,
    AccountModule,
    UserModule,
    AuthModule,
    TransactionModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
