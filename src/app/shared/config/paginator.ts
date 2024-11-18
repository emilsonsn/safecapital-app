import {MatPaginatorIntl} from "@angular/material/paginator";
import {Injectable} from "@angular/core";


@Injectable({
  providedIn: 'root'
})
export class PaginatorPtBR extends MatPaginatorIntl {
  override itemsPerPageLabel = 'Itens por página';
  override nextPageLabel = 'Próxima';
  override previousPageLabel = 'Anterior';
  override firstPageLabel = 'Primeira';
  override lastPageLabel = 'Última';

  override getRangeLabel = (page: number, pageSize: number, length: number) => {
    if (length === 0 || pageSize === 0) {
      return '0 de ' + length;
    }
    length = Math.max(length, 0);
    const startIndex = page * pageSize;
    const endIndex = startIndex < length ? Math.min(startIndex + pageSize, length) : startIndex + pageSize;
    return startIndex + 1 + ' - ' + endIndex + ' de ' + length;
  };
}

