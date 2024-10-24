export interface AppRoute {
  path: string;
  element: React.ReactNode;
  children?: [
    {
      path: string;
      element: React.ReactNode;
    }
  ];
}
