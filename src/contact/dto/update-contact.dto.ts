import {
  IsString,
  IsEmail,
  IsOptional,
  Length,
  Matches,
} from 'class-validator';

export class UpdateContactDto {
  @IsString()
  @IsOptional()
  @Length(2, 100, { message: 'Tên phải từ 2 đến 100 ký tự' })
  @Matches(/^[^\d]*$/, { message: 'Tên không được chứa số' })
  name?: string;

  @IsEmail({}, { message: 'Email không hợp lệ' })
  @IsOptional()
  email?: string;

  @IsString()
  @IsOptional()
  @Length(0, 500, { message: 'Ghi chú tối đa 500 ký tự' })
  note?: string;

  @IsString()
  @IsOptional()
  position?: string;
}
