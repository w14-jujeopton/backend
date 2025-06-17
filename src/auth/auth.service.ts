import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../user/entities/user.entity';
import { Repository } from 'typeorm';
import { use } from 'passport';

@Injectable()
export class AuthService {
  constructor(@InjectRepository(User) private userRepo: Repository<User>) {}

  /**
   * 이미 회원인지 확인
   * @param username
   */
  async isAlreadySignedUp(username: string) {
    console.log(`username = ${username}`)
    const user = await this.userRepo.findOneBy({ username });
    console.log(`user.username = ${user?.username}`)
    return user;
  }

  /**
   * 처음 소셜로그인을 했을 때 회원가입
   * @param username
   * @param nickname
   */
  socialSignUp(username:string, nickname:string) {
    const password = '<PASSWORD>';
    const new_user = this.userRepo.create({ username, nickname, password });
    return this.userRepo.save(new_user);
  }

}
