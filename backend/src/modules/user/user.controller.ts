import {
  BadRequestException,
  Body,
  Controller,
  Get,
  HttpStatus,
  Param,
  Post,
  Res,
} from '@nestjs/common';
import { InjectConnection } from '@nestjs/mongoose';
import { Response } from 'express';
import { Connection, Schema as MongooseSchema } from 'mongoose';
import { CreateUserDto } from './dto/createUser.dto';
import { UserService } from './user.service';

@Controller('/users')
export class UserController {
  constructor(
    @InjectConnection() private readonly mongoConnection: Connection,
    private userService: UserService,
  ) {}

  @Post('/')
  async createUser(@Body() createUserDto: CreateUserDto, @Res() res: Response) {
    const session = await this.mongoConnection.startSession();
    session.startTransaction();
    try {
      const newUser: any = await this.userService.createUser(
        createUserDto,
        session,
      );
      await session.commitTransaction();
      return res.status(HttpStatus.CREATED).send(newUser);
    } catch (error) {
      await session.abortTransaction();
      throw new BadRequestException(error);
    } finally {
      await session.endSession();
    }
  }

  @Get('/:userId')
  async getCompanyById(
    @Param('userId') userId: MongooseSchema.Types.ObjectId,
    @Res() res: Response,
  ) {
    const user: any = await this.userService.getUserById(userId);
    return res.status(HttpStatus.OK).send(user);
  }
}
