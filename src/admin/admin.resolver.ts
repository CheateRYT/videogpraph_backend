// src/admin/admin.resolver.ts
import { Resolver, Query, Mutation, Args, Context } from '@nestjs/graphql';
import { AdminService } from './admin.service';
import { Admin } from './admin.entity';
import { AdminLoginDto } from './dto/login.dto';
import { AuthService } from '../auth/auth.service';
import { UseGuards } from '@nestjs/common';
import { GqlAuthGuard } from 'src/gql-auth.guard';
import { Logger } from '@nestjs/common';
import { Int } from '@nestjs/graphql';
import { Tokens } from 'src/auth/dto/token.dto';

const logger = new Logger('AdminResolver');

@Resolver(() => Admin)
export class AdminResolver {
  constructor(private readonly adminService: AdminService, private readonly authService: AuthService) {}

  @Query(() => [Admin], { name: 'admins' })
  async findAll(): Promise<Admin[]> {
    logger.log('Fetching all admins');
    return this.adminService.adminsRepository.find();
  }

  @Query(() => Admin, { name: 'admin', nullable: true })
  async findOne(@Args('id', { type: () => Int }) id: number): Promise<Admin | null> {
    logger.log(`Fetching admin with ID ${id}`);
    return this.adminService.adminsRepository.findOneBy({ id });
  }

  @Mutation(() => Admin)
  async changeAdminPassword(
    @Args('id', { type: () => Int }) id: number,
    @Args('newPassword') newPassword: string,
  ): Promise<Admin> {
    logger.log(`Changing password for admin with ID ${id}`);
    return this.adminService.updatePassword(id, newPassword);
  }

  @Mutation(() => Tokens)
  async login(@Args('loginInput') loginInput: AdminLoginDto): Promise<Tokens> {
    logger.log('Attempting to log in');
    const { login, password } = loginInput;
    const admin = await this.authService.validateAdmin(login, password);
    if (!admin) {
      throw new Error('Invalid credentials');
    }
    return this.authService.login(admin);
  }

  @UseGuards(GqlAuthGuard)
  @Mutation(() => Tokens)
  async refreshTokens(@Context('req') req: any): Promise<Tokens> {
    logger.log('Refreshing tokens');
    const refreshToken = req.headers.authorization.split(' ')[1];
    return this.authService.refreshTokens(refreshToken);
  }
}