// NavigationContext.tsx
import { createContext } from 'react';
import type { Location } from 'react-router-dom';
import type { Update } from 'history';
import { createBrowserHistory } from 'history';
import { useEffect, useMemo, useState } from 'react';
import { useLocation } from 'react-router-dom';

export interface NavigationBundle {
  from: Location | undefined;
  to: Location | undefined;
}

export const defaultNavigationBundle = {
  from: undefined,
  to: undefined,
};

export const NavigationContext = createContext<NavigationBundle>(
  defaultNavigationBundle
);

type NavigationProviderProps = {
  children: React.ReactNode;
};

const history = createBrowserHistory();

export const NavigationProvider: React.FC<NavigationProviderProps> = ({
  children,
}: NavigationProviderProps) => {
  const [from, setFrom] = useState<Location | undefined>(undefined);
  const [to, setTo] = useState<Location | undefined>(undefined);
  const location = useLocation();

  useEffect(() => {
    setFrom(location);
  }, [location]);

  useEffect(() => {
    history.listen((update: Update) => {
      if (update.action === 'POP') setTo(update.location);
    });
  }, []);

  const navigationBundle: NavigationBundle = useMemo(() => {
    return {
      from,
      to,
    };
  }, [from, to]);

  return (
    <NavigationContext.Provider value={navigationBundle}>
      {children}
    </NavigationContext.Provider>
  );
};
