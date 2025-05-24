import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';
import { CreateCustomerDto } from './dto/create-user.dto';
import { PaginateParams } from 'src/interface/paginate.interface';
import { UpdateCustomerDto } from './dto/update-user.dto';

@Injectable()
export class UserService {
  constructor(private readonly prisma: PrismaService) {}

  // Tạo khách hàng mới, chỉ admin mới được tạo (ví dụ)
  async create(createCustomerDto: CreateCustomerDto) {
    // Kiểm tra email đã tồn tại chưa
    const existing = await this.prisma.customer.findUnique({
      where: { email: createCustomerDto.email },
    });

    if (existing) {
      throw new BadRequestException('Email khách hàng đã tồn tại');
    }

    // Tạo khách hàng mới
    return this.prisma.customer.create({
      data: createCustomerDto,
    });
  }

  async update(id: string, updateUserDto: UpdateCustomerDto) {
    const user = await this.prisma.customer.findUnique({ where: { id } });
    if (!user) {
      throw new NotFoundException('Không tìm thấy khách hàng');
    }

    if (updateUserDto.email && updateUserDto.email !== user.email) {
      const existing = await this.prisma.customer.findFirst({
        where: { email: updateUserDto.email },
      });
      if (existing) {
        throw new BadRequestException('Email khách hàng đã tồn tại');
      }
    }

    try {
      return await this.prisma.customer.update({
        where: { id },
        data: updateUserDto,
      });
    } catch (error) {
      throw new BadRequestException(
        'Không thể cập nhật khách hàng: ' + error.message,
      );
    }
  }
  async findByNameOrEmail(query: string, paginate: PaginateParams) {
    const { limit, offset, page } = paginate;

    const whereCondition = {
      OR: [{ name: { contains: query } }, { email: { contains: query } }],
    };

    const totalItems = await this.prisma.customer.count({
      where: whereCondition,
    });
    const totalPages = Math.ceil(totalItems / limit);

    const customers = await this.prisma.customer.findMany({
      where: whereCondition,
      skip: offset,
      take: limit,
      orderBy: { name: 'asc' },
    });

    return {
      customers,
      totalItems,
      totalPages,
      currentPage: page,
    };
  }

  async findAll(paginate: PaginateParams) {
    const { limit, offset, page } = paginate;

    const totalItems = await this.prisma.customer.count();
    const totalPages = Math.ceil(totalItems / limit);

    const customers = await this.prisma.customer.findMany({
      skip: offset,
      take: limit,
      orderBy: { name: 'asc' },
    });

    return {
      customers,
      totalItems,
      totalPages,
      currentPage: page,
    };
  }
  async remove(id: string) {
    try {
      await this.prisma.customer.delete({
        where: { id },
      });
      return { message: 'Xóa khách hàng thành công' };
    } catch (error) {
      throw new NotFoundException('Không tìm thấy khách hàng hoặc đã bị xóa');
    }
  }
  async checkExist(id: string) {
    const customer = await this.prisma.customer.findUnique({
      where: { id },
    });

    if (!customer) {
      throw new NotFoundException('Khách hàng không tồn tại');
    }

    return customer;
  }
}
