import { ApiProperty } from '@nestjs/swagger';
import { IsOptional } from 'class-validator';

export class SinginUserDto {
  @ApiProperty()
  @IsOptional()
  userName: string;

  @ApiProperty()
  @IsOptional()
  passWord: string;
}
