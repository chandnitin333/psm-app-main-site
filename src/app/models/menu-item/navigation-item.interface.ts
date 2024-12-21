export interface NavigationItem {
    label: string;
    icon?: string;
    route?: string;
    children?: NavigationItem[];
    expanded?: boolean;
}