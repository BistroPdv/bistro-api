import { PartialType } from '@nestjs/swagger';
import { CreateCommandedDto } from './create-commanded.dto';

export class UpdateCommandedDto extends PartialType(CreateCommandedDto) {}
