import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Put,
} from '@nestjs/common';
import { ContactService } from './contact.service';
import { CreateContactDto } from './dto/create-contact.dto';
import { UpdateContactDto } from './dto/update-contact.dto';
import { GetPaginateInfo } from 'src/core/query.guard';
import { PaginateParams } from 'src/interface/paginate.interface';

@Controller('contact')
export class ContactController {
  constructor(private readonly contactService: ContactService) {}

  @Post()
  create(@Body() createContactDto: CreateContactDto) {
    return this.contactService.create(createContactDto);
  }

  // Lấy tất cả liên hệ của một khách hàng với phân trang
  @Get('customer/:customerId')
  findAllByCustomer(
    @Param('customerId') customerId: string,
    @GetPaginateInfo() paginate: PaginateParams,
  ) {
    return this.contactService.findAllByCustomer(customerId, paginate);
  }

  // Lấy một liên hệ theo ID
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.contactService.findOne(id);
  }

  // Cập nhật liên hệ
  @Put(':id')
  update(@Param('id') id: string, @Body() updateContactDto: UpdateContactDto) {
    return this.contactService.update(id, updateContactDto);
  }

  // Xoá liên hệ
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.contactService.remove(id);
  }
}
