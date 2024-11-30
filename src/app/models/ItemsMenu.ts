export interface IMenuItem {
  label: string;
  icon?: string;
  route?: string;
  active?: boolean;
  children?: IMenuItem[];
  isOpen?: boolean;
}
