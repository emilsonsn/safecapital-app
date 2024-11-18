import {Component, EventEmitter, Input, OnChanges, Output, SimpleChanges} from '@angular/core';

@Component({
    selector: 'app-avatar',
    templateUrl: './avatar.component.html',
    styleUrls: ['./avatar.component.scss']
})
export class AvatarComponent implements OnChanges {
    @Input() imageUrl: string;
    @Input() altText: string;
    @Input() color: string = '#e7b403';
    @Input() size: number = 40;
    @Input() sizeTxt: number = 110;
    @Input() edit: boolean = false;
    @Input() onCircle: boolean = true;

    @Output() method: EventEmitter<any> = new EventEmitter<any>();

    initials: string;

    ngOnChanges(changes: SimpleChanges) {
        if (changes.imageUrl) {
            this.validateImageUrl();
        }
    }

    private validateImageUrl() {
        if (this.isValidImageUrl(this.imageUrl)) {
            this.initials = '';
            this.color = null;
        } else {
            this.imageUrl = null;
            this.initials = this.calculateInitials();
        }
    }

    private isValidImageUrl(url: string): boolean {
        return url && (url.startsWith('http://') || url.startsWith('https://') || url.startsWith('assets/'));
    }


    private calculateInitials(): string {
        if (this.altText) {
            const names = this.altText.split(' ').slice(0, 2);
            return names.map(name => name[0]).join('').toUpperCase();
        }
        return '';
    }

    getContainerStyle() {
        if (this.onCircle) {
            return {
                'background-color': this.color,
                'width': this.size + 'px',
                'height': this.size + 'px',
            };
        }
        return {
            'border-radius': '15px',
            'position': 'relative',
            'overflow': 'hidden',
            'background-color': this.color,
            'width': this.size + 'px',
            'height': this.size + 'px',
        };
    }

    getIconStyle() {
        return {
            'font-size': (this.size - 5) + 'px',
            'width': (this.size - 5) + 'px',
            'height': (this.size - 5) + 'px',
        };
    }

    getSizeTxt() {
        return {
            'font-size': this.sizeTxt + '%'
        };
    }

    getAvatarImageStyle() {
        if (this.onCircle) {
            return {
                'width': '100%',
                'height': '100%',
                'border-radius': '50%',
                'object-fit': 'cover',
            }
        }
        return {
            'width': '100%',
            'height': '100%',
            'border-radius': '10px',
            'object-fit': 'cover',
        }
    }

    getEditOverleyStyle() {
        if (this.onCircle) {
            return {
                'border-radius': '50%'
            };
        }
    }
}
