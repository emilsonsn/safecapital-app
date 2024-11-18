import { Router } from "@angular/router";
import { PageControl } from "@models/application";
import { LocalStorageService } from "@services/local-storage.service";

export class Utils {

    // private readonly _localStorage : LocalStorageService = new LocalStorageService();

    // public isUserMaster : boolean = this._localStorage.get("type") == "MASTER";

  public static patternEmail = "[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}";

    static toBase64(file: File): Promise<string | ArrayBuffer> {
        return new Promise((resolve, reject) => {
          const reader = new FileReader();
          reader.readAsDataURL(file);
          reader.onload = () => resolve(reader.result);
          reader.onerror = error => reject(error);
        })
      }
	static isMobile() {
		return window && window.matchMedia('(max-width: 1199px)').matches;
	}

	static mountPageControl(pageControl: PageControl): string {
		let result = '';

		if (!pageControl) {
			return result;
		}

		Object.entries(pageControl).forEach(([key, value]) => {
			result += `${key}=${value}&`;
		});

		return result;
	}

	static filterAutocomplete(items, value, field = 'name', field2 = '') {
        if (typeof value === 'string' && items.length) {
            const filterValue = value
                .toLowerCase()
                .normalize('NFD')
                .replace(/[\u0300-\u036f]/g, '');
            return items.filter(option => {
                return (
                    filterValue === '' ||
                    String(field2 ? option[field][field2] : option[field])
                        .toLowerCase()
                        .normalize('NFD')
                        .replace(/[\u0300-\u036f]/g, '')
                        .includes(filterValue)
                );
            });
        }
    }

    static capitalizeCase(str: string): string {
        let result: string = '';

        str.split(' ').forEach((word, index) => {
            if (index) {
                result += ` ${word[0].toUpperCase()}${word.substring(1).toLowerCase()}`;
                return
            }
            result += `${word[0].toUpperCase()}${word.substring(1).toLowerCase()}`;
        })

        return result;
    }

    static routerBack() : void {
        window.history.back();
    }
}
