import { IsString, Length, IsNotEmpty } from 'class-validator';

export class JoinRoomDto {
  @IsNotEmpty()
  @IsString()
  @Length(6, 6)
  roomCode: string;
}
