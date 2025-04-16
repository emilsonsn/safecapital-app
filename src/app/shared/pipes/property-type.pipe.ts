import { Pipe, PipeTransform } from '@angular/core';
import { PropertyTypeEnum } from '@models/client';

@Pipe({
  name: 'property_type'
})
export class PropertyTypePipe implements PipeTransform {

  transform(value: PropertyTypeEnum) {
    switch (value) {
      case PropertyTypeEnum.Residential:
        return 'Resindencial';
      case PropertyTypeEnum.Commercial:
        return 'Comercial';
      default:
        return value;
    }
  }

}
