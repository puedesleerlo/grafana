import { GrafanaThemeType } from '../types/theme';
import { selectThemeVariant } from './selectThemeVariant';
import { mockTheme } from './index';

const lightThemeMock = {
  color: {
    red: '#ff0000',
    green: '#00ff00',
    black: '#000000',
  },
};

const darkThemeMock = {
  color: {
    red: '#ff0000',
    green: '#00ff00',
    black: '#000000',
  },
};
const customThemeMock = {
  color: {
    red: '#ff0000',
    green: '#00ff00',
    black: '#000000',
  },
};

describe('Theme variable variant selector', () => {
  // @ts-ignore
  const restoreTheme = mockTheme(name => (name === GrafanaThemeType.Light ? lightThemeMock : darkThemeMock));

  afterAll(() => {
    restoreTheme();
  });
  it('return correct variable value for given theme', () => {
    const theme = lightThemeMock;

    const selectedValue = selectThemeVariant(
      {
        dark: theme.color.red,
        light: theme.color.green,
        custom: theme.color.black,
      },
      GrafanaThemeType.Light
    );

    expect(selectedValue).toBe(lightThemeMock.color.green);
  });

  it('return dark theme variant if no theme given', () => {
    const theme = lightThemeMock;

    const selectedValue = selectThemeVariant({
      dark: theme.color.red,
      light: theme.color.green,
      custom: theme.color.black,
    });

    expect(selectedValue).toBe(lightThemeMock.color.red);
  });
});
