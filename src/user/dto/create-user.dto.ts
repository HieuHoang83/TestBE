import {
  IsString,
  IsNotEmpty,
  IsEmail,
  Matches,
  Length,
} from 'class-validator';

export class CreateCustomerDto {
  @IsString()
  @IsNotEmpty({ message: 'Tên không được để trống' })
  @Length(2, 100, { message: 'Tên phải từ 2 đến 100 ký tự' })
  @Matches(/^[^\d]*$/, { message: 'Tên không được chứa số' })
  name: string;

  @IsEmail({}, { message: 'Email không hợp lệ' })
  email: string;

  @IsString({ message: 'Số điện thoại phải là chuỗi' })
  @IsNotEmpty({ message: 'Số điện thoại không được để trống' })
  phone: string;

  @IsString({ message: 'Tên công ty phải là chuỗi ký tự' })
  company: string;
}
