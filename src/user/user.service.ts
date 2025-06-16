import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { ValidationError } from 'class-validator';

@Injectable()
export class UserService {

  constructor(@InjectRepository(User) private repo: Repository<User> ) {
  }

  async login(username:string, password:string) {
    const user = await this.findOne(username);
    if(!user)
      throw new NotFoundException(`이 ${username}은 가입되지 않았습니다`);

    if (user.password !== password)
      throw new UnauthorizedException('올바른 패스워드가 아닙니다');

    return user;
  }

  create(username: string, password: string, nickname: string) {

    const user = this.repo.create({ username, password, nickname });

    return this.repo.save(user);
  }

  findAll() {
    return this.repo.find();
  }

  async findOne(username: string) {
    const findUser = await this.repo.findOneBy({username});
    if (!findUser)
      throw new NotFoundException(`해당 유저를 찾을 수 없음!! id : ${username}`);

    return findUser;
  }

  async update(username: string, attrs : Partial<User>) {
    const user = await this.findOne(username)

    if (!user)
        throw new NotFoundException(`해당 유저를 찾을 수 없음!! id : ${username}`);

    Object.assign(user, attrs);

    return this.repo.save(user);
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
