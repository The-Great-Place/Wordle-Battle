import { createBrowserRouter } from 'react-router-dom';

import { AppShell } from './AppShell';
import { LandingPage } from '../pages/LandingPage/LandingPage';
import { MatchPage } from '../pages/MatchPage/MatchPage';
import { RoomLobbyPage } from '../pages/RoomLobbyPage/RoomLobbyPage';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <AppShell />,
    children: [
      {
        index: true,
        element: <LandingPage />,
      },
      {
        path: 'room/:roomCode',
        element: <RoomLobbyPage />,
      },
      {
        path: 'match/:roomCode',
        element: <MatchPage />,
      },
    ],
  },
]);
