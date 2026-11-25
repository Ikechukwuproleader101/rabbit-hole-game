import './index.css';

import { requestExpandedMode } from '@devvit/web/client';
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { Splash } from './components/Splash';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Splash onPlay={(e) => requestExpandedMode(e.nativeEvent, 'game')} />
  </StrictMode>
);
