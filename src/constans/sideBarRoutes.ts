import {
  places,
  cities,
  products,
} from 'assets/svg/sidebar';

export type RouteType = {
  path: string;
  label: string;
  icon?: string;
  sublinks?: RouteType[];
  handleOnClick?: () => void;
};

export type SideBarProps = {
  displayText: string;
  icon?: string;
};

const sideBarRoutes: RouteType[] = [
  {
    label: 'Cities',
    path: '/cities',
    icon: cities,
    sublinks: [
      { path: '/cities/all-cities', label: 'All cities' },
      { path: '/cities/new', label: 'New' },
    ],
  },
  {
    label: 'Places',
    path: '/places',
    icon: places,
    sublinks: [
      { path: '/places/all-places', label: 'All places' },
      { path: '/places/new', label: 'New' },
    ],
  },
  {
    label: 'Products',
    path: '/products',
    icon: products,
  },
];

export default sideBarRoutes;
