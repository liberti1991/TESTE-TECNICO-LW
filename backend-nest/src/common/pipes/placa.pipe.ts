import { BadRequestException, Injectable, PipeTransform } from '@nestjs/common';
import { normalizarPlaca, placaValida, PLACA_INVALIDA_MESSAGE } from 'src/common/utils/placa.util';

@Injectable()
export class PlacaPipe implements PipeTransform<string, string> {
  transform(value: string): string {
    const placa = normalizarPlaca(value);

    if (!placaValida(placa)) {
      throw new BadRequestException(PLACA_INVALIDA_MESSAGE);
    }

    return placa;
  }
}
