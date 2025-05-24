import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateContactDto } from './dto/create-contact.dto';
import { UpdateContactDto } from './dto/update-contact.dto';
import { PrismaService } from 'prisma/prisma.service';
import { PaginateParams } from 'src/interface/paginate.interface';
import { UserService } from 'src/user/user.service';

@Injectable()
export class ContactService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly userservice: UserService,
  ) {}

  // Tạo mới liên hệ
  private async checkDuplicateEmail(email: string, customerId: string) {
    const existing = await this.prisma.contact.findFirst({
      where: {
        email,
        customerId,
      },
    });

    if (existing) {
      throw new BadRequestException('Email đã tồn tại cho khách hàng này');
    }
  }
  async create(dto: CreateContactDto) {
    await this.userservice.checkExist(dto.customerId);
    await this.checkDuplicateEmail(dto.email, dto.customerId);

    return this.prisma.contact.create({
      data: {
        name: dto.name,
        email: dto.email,
        note: dto.note,
        position: dto.position,
        customer: {
          connect: { id: dto.customerId },
        },
      },
    });
  }

  // Lấy danh sách liên hệ theo customerId, có phân trang
  async findAllByCustomer(customerId: string, paginate: PaginateParams) {
    const [totalItems, contacts] = await this.prisma.$transaction([
      this.prisma.contact.count({
        where: { customerId },
      }),
      this.prisma.contact.findMany({
        where: { customerId },
        skip: paginate.offset,
        take: paginate.limit,
      }),
    ]);

    const totalPages = Math.ceil(totalItems / paginate.limit);
    const currentPage = Math.floor(paginate.offset / paginate.limit) + 1;

    return {
      totalItems,
      totalPages,
      currentPage,
      contacts,
    };
  }

  // Lấy 1 liên hệ
  async findOne(id: string) {
    const contact = await this.prisma.contact.findUnique({
      where: { id },
    });

    if (!contact) {
      throw new NotFoundException('Không tìm thấy liên hệ');
    }

    return contact;
  }

  // Cập nhật
  async update(id: string, dto: UpdateContactDto) {
    if (dto.email) {
      await this.checkDuplicateEmail(dto.email, id);
    }
    try {
      return await this.prisma.contact.update({
        where: { id },
        data: dto,
      });
    } catch (error) {
      throw new NotFoundException('Không thể cập nhật liên hệ');
    }
  }

  // Xoá
  async remove(id: string) {
    try {
      await this.prisma.contact.delete({
        where: { id },
      });
      return { message: 'Xoá liên hệ thành công' };
    } catch (error) {
      throw new NotFoundException('Không thể xoá liên hệ');
    }
  }
}
