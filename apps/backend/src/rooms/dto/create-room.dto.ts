import { IsInt, IsOptional, Min, Max } from 'class-validator';

export class CreateRoomDto {
  @IsOptional()
  @IsInt()
  @Min(4)
  @Max(8)
  maxPlayers?: number = 8;
}
