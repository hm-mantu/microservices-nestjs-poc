import { Test, TestingModule } from '@nestjs/testing';
import { OathServerService } from './oath-server.service';

describe('OathServerService', () => {
  let service: OathServerService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [OathServerService],
    }).compile();

    service = module.get<OathServerService>(OathServerService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
