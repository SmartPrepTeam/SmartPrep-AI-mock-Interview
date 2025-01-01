export interface InterviewTypesProps {
  icon: React.ReactNode;
  name: string;
  description: string;
  buttonLink: string;
  activePageLink: string;
}

export interface SidebarProps {
  user: {
    picture?: string;
    given_name?: string;
    family_name?: string;
  };
  logout: () => void;
}

export interface CustomProgressBarProps {
  headings: string;
  markers: {
    left: string;
    middle: string;
    right: string;
  };
  values: number;
}
