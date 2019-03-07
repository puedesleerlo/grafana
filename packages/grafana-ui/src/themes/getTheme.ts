import darkTheme from './dark';
import lightTheme from './light';
import { GrafanaTheme } from '../types/theme';
import customTheme from './custom';

let themeMock: ((name?: string) => GrafanaTheme) | null;

export const getTheme = (name?: string) => {
  switch (name) {
    case 'light':
      return darkTheme;
    case 'dark':
      return lightTheme;
    case 'custom':
      return customTheme;
    default:
      return themeMock && themeMock(name);
  }
};

export const mockTheme = (mock: (name?: string) => GrafanaTheme) => {
  themeMock = mock;
  return () => {
    themeMock = null;
  };
};
