import './index.css';

import { StrictMode, useEffect, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { Gallery } from './components/Gallery';
import { GameScreen } from './components/GameScreen';
import { Splash } from './components/Splash';

type Screen = 'splash' | 'game' | 'runOver' | 'gallery';

const isDev = import.meta.env.DEV;
const devScreens: Screen[] = ['splash', 'game', 'runOver', 'gallery'];

function initialScreen(): Screen {
  if (isDev && window.location.hash === '#gallery') {
    return 'gallery';
  }
  return 'splash';
}

export const App = () => {
  const [screen, setScreen] = useState<Screen>(initialScreen);

  useEffect(() => {
    if (!isDev) return;
    const onHashChange = () => {
      if (window.location.hash === '#gallery') {
        setScreen('gallery');
      }
    };
    window.addEventListener('hashchange', onHashChange);
    return () => window.removeEventListener('hashchange', onHashChange);
  }, []);

  return (
    <div className="min-h-dvh w-full flex flex-col bg-[var(--bg)]">
      {isDev && (
        <nav
          aria-label="Dev screen switcher"
          className="w-full flex flex-wrap items-center justify-center gap-2 p-2 bg-black/80 text-white text-xs z-50"
        >
          {devScreens.map((s) => (
            <button
              key={s}
              type="button"
              onClick={() => setScreen(s)}
              className={`px-3 py-2 min-h-[44px] min-w-[44px] rounded font-medium cursor-pointer ${
                screen === s ? 'bg-[var(--tunnel)] text-white' : 'bg-white/15'
              }`}
            >
              {s}
            </button>
          ))}
        </nav>
      )}

      <main className="w-full flex-1 flex flex-col">
        {screen === 'splash' && <Splash onPlay={() => setScreen('game')} />}
        {screen === 'game' && <GameScreen variant="twist" />}
        {screen === 'runOver' && (
          <div className="flex-1 flex items-center justify-center p-6 font-bold text-[var(--text-brand)]">
            Run Over (Placeholder)
          </div>
        )}
        {screen === 'gallery' && isDev && <Gallery />}
      </main>
    </div>
  );
};

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>
);
