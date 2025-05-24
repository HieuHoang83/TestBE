import {
  IsString,
  IsNotEmpty,
  IsEmail,
  IsOptional,
  Length,
  Matches,
} from 'class-validator';

export class CreateContactDto {
  @IsString()
  @IsNotEmpty({ message: 'Tên không được để trống' })
  @Length(2, 100, { message: 'Tên phải từ 2 đến 100 ký tự' })
  @Matches(/^[^\d]*$/, { message: 'Tên không được chứa số' })
  name: string;

  @IsEmail({}, { message: 'Email không hợp lệ' })
  @IsNotEmpty({ message: 'Email không được để trống' })
  email: string;

  @IsString()
  @IsOptional()
  @Length(0, 500, { message: 'Ghi chú tối đa 500 ký tự' })
  note?: string;

  @IsString()
  @IsNotEmpty({ message: 'Chức vụ không được để trống' })
  position: string;

  @IsString()
  @IsNotEmpty({ message: 'CustomerId không được để trống' })
  customerId: string;
}
