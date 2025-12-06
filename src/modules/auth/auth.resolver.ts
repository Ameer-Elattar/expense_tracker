import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { AuthService } from './auth.service';
import { CreateUserInput } from '../user/dto/create-user.input';
import { TokenResponse } from 'src/common/utils/types';
import { LoginInput } from './dto/login.dto';
import { Public } from 'src/common/decorators/public.decorator';
@Resolver()
export class AuthResolver {
  constructor(private readonly authService: AuthService) {}

  @Mutation(() => TokenResponse)
  @Public()
  register(@Args('createUserInput') createUserInput: CreateUserInput) {
    return this.authService.register(createUserInput);
  }

  @Mutation(() => TokenResponse)
  @Public()
  login(@Args('loginInput') loginInput: LoginInput) {
    return this.authService.login(loginInput);
  }
}
