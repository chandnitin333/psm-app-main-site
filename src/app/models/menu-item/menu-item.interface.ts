export interface MenuItem {
  label: string;
  icon: string;
  url: string;
  subItems?: MenuItem[];
}