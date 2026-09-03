import { createBrowserRouter } from 'react-router-dom'

import { SimulationResultsPage } from '@/pages/SimulationResultsPage'

import { RootLayout } from './components/layout/RootLayout'
import { SimulationFormPage } from './pages/SimulationFormPage'
import { SimulationHistoryPage } from './pages/SimulationHistoryPage'

export const router = createBrowserRouter([
  {
    element: <RootLayout />,
    children: [
      {
        path: '/',
        element: <SimulationFormPage />,
      },
      {
        path: '/resultado/:id',
        element: <SimulationResultsPage />,
      },
      {
        path: '/historico',
        element: <SimulationHistoryPage />,
      },
    ],
  },
])
