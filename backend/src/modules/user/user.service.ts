import { Injectable } from '@nestjs/common';
import { ClientSession, Schema as MongooseSchema } from 'mongoose';
import { UserRepository } from '../../repositories/user.repository';
import { CreateUserDto } from './dto/createUser.dto';

@Injectable()
export class UserService {
  constructor(private readonly userRepository: UserRepository) {}

  async createUser(createUserDto: CreateUserDto, session: ClientSession) {
    return await this.userRepository.createUser(createUserDto, session);
  }

  async getUserById(id: MongooseSchema.Types.ObjectId) {
    return await this.userRepository.getUserById(id);
  }
}
