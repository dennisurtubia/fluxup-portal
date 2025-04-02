import { lazy } from 'react';
import { RouteObject } from 'react-router-dom';

const TagsPage = lazy(() => import('../pages/TagsPage'));

export const tagsRouter: RouteObject[] = [
  {
    path: '/app/tags',
    element: <TagsPage />,
  },
];
