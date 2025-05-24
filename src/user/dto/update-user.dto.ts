import {
  IsString,
  IsOptional,
  IsEmail,
  Matches,
  Length,
} from 'class-validator';

export class UpdateCustomerDto {
  @IsOptional()
  @IsString({ message: 'Tên phải là chuỗi ký tự' })
  @Length(2, 100, { message: 'Tên phải từ 2 đến 100 ký tự' })
  @Matches(/^[^\d]+$/, { message: 'Tên không được chứa số' })
  name?: string;

  @IsOptional()
  @IsEmail({}, { message: 'Email không hợp lệ' })
  email?: string;

  @IsOptional()
  @IsString({ message: 'Số điện thoại phải là chuỗi' })
  phone?: string;

  @IsOptional()
  @IsString({ message: 'Tên công ty phải là chuỗi ký tự' })
  company?: string;
}
