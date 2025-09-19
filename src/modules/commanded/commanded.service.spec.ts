import { Test, TestingModule } from '@nestjs/testing';
import { CommandedService } from './commanded.service';

describe('CommandedService', () => {
  let service: CommandedService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CommandedService],
    }).compile();

    service = module.get<CommandedService>(CommandedService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
