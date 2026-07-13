export interface User {
  id: string;
  email: string;
}

export interface LoginFormValues {
  email: string;
  password: string;
}

export interface NavItem {
  label: string;
  href: string;
}

export interface DashboardNavItem {
  label: string;
  href: string;
  icon: string;
}
