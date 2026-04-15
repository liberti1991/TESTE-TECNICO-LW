import { ApiProperty } from '@nestjs/swagger';

export class TokenAuthQuery {
  @ApiProperty()
  token: string;
}
