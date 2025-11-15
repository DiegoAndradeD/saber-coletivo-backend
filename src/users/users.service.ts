import { Injectable } from '@nestjs/common';
import { UsersRepository } from './users.repository';
import { GetUsersDto } from './dto/get-users.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UsersService {
  constructor(private usersRepository: UsersRepository) {}

  findAll(getUsersDto: GetUsersDto) {
    return this.usersRepository.findAll(getUsersDto);
  }

  findOne(id: string) {
    return this.usersRepository.findOne(id);
  }

  update(id: string, updateUserDto: UpdateUserDto) {
    return this.usersRepository.update(id, updateUserDto);
  }

  remove(id: string) {
    return this.usersRepository.remove(id);
  }

  findMostActiveAuthorsPaginated(dto: GetUsersDto) {
    return this.usersRepository.findMostActiveAuthorsPaginated(
      Number(dto.page),
      Number(dto.pageSize),
    );
  }
}
