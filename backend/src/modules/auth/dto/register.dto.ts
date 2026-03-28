import { IsEmail, IsString, MinLength, Matches, IsNotEmpty, IsBoolean } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class RegisterDto {
  @ApiProperty({ example: 'Ana Silva' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ example: 'Família Silva' })
  @IsString()
  @IsNotEmpty()
  familyName: string;

  @ApiProperty({ example: 'ana@email.com' })
  @IsEmail()
  email: string;

  @ApiProperty({ example: 'Senha@123' })
  @IsString()
  @MinLength(8)
  @Matches(/^(?=.*[A-Z])(?=.*\d).+$/, {
    message: 'Senha deve ter no mínimo 8 caracteres, 1 maiúscula e 1 número',
  })
  password: string;

  @ApiProperty({ example: true })
  @IsBoolean()
  lgpdConsent: boolean;
}
