import { lazy } from 'react';
import { RouteObject } from 'react-router-dom';

const TagPage = lazy(() => import('../pages/TagsPage'));

export const tagsRouter: RouteObject[] = [
  {
    path: '/app/tags',
    element: <TagPage />,
  },
];
