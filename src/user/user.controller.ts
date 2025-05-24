import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Put,
  Query,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateCustomerDto } from './dto/create-user.dto';
import { UpdateCustomerDto } from './dto/update-user.dto';
import { GetPaginateInfo } from 'src/core/query.guard';
import { PaginateParams } from 'src/interface/paginate.interface';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  create(@Body() createUserDto: CreateCustomerDto) {
    return this.userService.create(createUserDto);
  }

  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() updateCustomerDto: UpdateCustomerDto,
  ) {
    return this.userService.update(id, updateCustomerDto);
  }
  @Get()
  async findAll(@GetPaginateInfo() paginate: PaginateParams) {
    return this.userService.findAll(paginate);
  }
  @Get('search')
  findByNameOrEmail(
    @Query('query') query: string,
    @GetPaginateInfo() paginate: PaginateParams,
  ) {
    return this.userService.findByNameOrEmail(query, paginate);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.userService.remove(id);
  }
}
