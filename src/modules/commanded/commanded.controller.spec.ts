import { Test, TestingModule } from '@nestjs/testing';
import { CommandedController } from './commanded.controller';
import { CommandedService } from './commanded.service';

describe('CommandedController', () => {
  let controller: CommandedController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CommandedController],
      providers: [CommandedService],
    }).compile();

    controller = module.get<CommandedController>(CommandedController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
