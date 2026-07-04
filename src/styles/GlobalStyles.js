import { createGlobalStyle } from 'styled-components';
import theme from '../config/theme';

const GlobalStyles = createGlobalStyle`
  *, *::before, *::after {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
  }

  html {
    scroll-behavior: smooth;
    scroll-padding-top: 76px;
    font-size: 16px;
  }

  body {
    font-family: ${theme.fonts.main};
    background-color: ${theme.colors.dark};
    color: ${theme.colors.light};
    overflow-x: hidden;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    /* light-on-dark reads lighter; give it room */
    line-height: 1.8;
  }

  body::-webkit-scrollbar {
    width: 5px;
  }

  body::-webkit-scrollbar-track {
    background: ${theme.colors.dark};
  }

  body::-webkit-scrollbar-thumb {
    background-color: ${theme.colors.primaryMuted};
    border-radius: 3px;

    &:hover {
      background-color: ${theme.colors.primary};
    }
  }

  h1, h2, h3, h4, h5, h6 {
    font-family: ${theme.fonts.heading};
    font-weight: 700;
    line-height: 1.25;
    letter-spacing: -0.02em;
    color: ${theme.colors.light};
    text-wrap: balance;
  }

  p {
    line-height: 1.8;
    color: ${theme.colors.light};
  }

  a {
    color: ${theme.colors.primary};
    text-decoration: none;
    transition: color ${theme.transitions.fast};

    &:hover {
      color: ${theme.colors.accent};
    }
  }

  button {
    font-family: ${theme.fonts.main};
    cursor: pointer;
    border: none;
  }

  /* Keyboard focus is a feature, not a blemish */
  :focus-visible {
    outline: none;
    box-shadow: ${theme.shadows.focusRing};
    border-radius: 4px;
  }

  img {
    max-width: 100%;
    display: block;
  }

  ::selection {
    background: rgba(91, 141, 239, 0.35);
    color: ${theme.colors.light};
  }

  .visually-hidden {
    position: absolute;
    width: 1px;
    height: 1px;
    padding: 0;
    margin: -1px;
    overflow: hidden;
    clip: rect(0, 0, 0, 0);
    white-space: nowrap;
    border: 0;
  }

  @media (prefers-reduced-motion: reduce) {
    html {
      scroll-behavior: auto;
    }
    *, *::before, *::after {
      animation-duration: 0.01ms !important;
      animation-iteration-count: 1 !important;
      transition-duration: 0.01ms !important;
    }
  }
`;

export default GlobalStyles;
