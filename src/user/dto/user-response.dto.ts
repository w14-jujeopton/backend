import { Expose } from 'class-transformer';


export class UserResponse{
  @Expose()
  username: string;
  @Expose()
  nickname: string;
}