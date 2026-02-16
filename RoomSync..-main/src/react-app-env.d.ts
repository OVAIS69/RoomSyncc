/// <reference types="react-scripts" />

declare module 'lucide-react' {
  import { ComponentType } from 'react';
  
  export interface IconProps {
    size?: number | string;
    className?: string;
    color?: string;
  }
  
  export const Calendar: ComponentType<IconProps>;
  export const Clock: ComponentType<IconProps>;
  export const Users: ComponentType<IconProps>;
  export const MapPin: ComponentType<IconProps>;
  export const Building: ComponentType<IconProps>;
  export const Search: ComponentType<IconProps>;
  export const Menu: ComponentType<IconProps>;
  export const X: ComponentType<IconProps>;
  export const Moon: ComponentType<IconProps>;
  export const Sun: ComponentType<IconProps>;
  export const CheckCircle: ComponentType<IconProps>;
  export const AlertCircle: ComponentType<IconProps>;
  export const User: ComponentType<IconProps>;
  export const Mail: ComponentType<IconProps>;
  export const MessageSquare: ComponentType<IconProps>;
  export const ChevronDown: ComponentType<IconProps>;
  export const ChevronUp: ComponentType<IconProps>;
}
