import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { AdminService } from './admin.service';
import { Admin } from './admin.entity';
import * as argon2 from 'argon2';

@Resolver(() => Admin)
export class AdminResolver {
  constructor(private readonly adminService: AdminService) {}

  @Query(() => [Admin], { name: 'admins' })
  async findAll(): Promise<Admin[]> {
    return this.adminService.adminsRepository.find();
  }

  @Query(() => Admin, { name: 'admin', nullable: true })
  async findOne(@Args('id') id: number): Promise<Admin | null> {
    return this.adminService.adminsRepository.findOneBy({ id });
  }

  @Mutation(() => Admin)
  async changeAdminPassword(
    @Args('id') id: number,
    @Args('newPassword') newPassword: string,
  ): Promise<Admin> {
    return this.adminService.updatePassword(id, newPassword);
  }
}