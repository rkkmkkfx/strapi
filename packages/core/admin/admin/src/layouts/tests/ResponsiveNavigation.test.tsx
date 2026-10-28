import * as React from 'react';

import { lightTheme } from '@strapi/design-system';
import { act, fireEvent, render, screen } from '@testing-library/react';
import { createMemoryHistory } from 'history';
import { IntlProvider } from 'react-intl';
import { Link, Router } from 'react-router-dom';
import { ThemeProvider } from 'styled-components';

import { ResponsiveNavigation } from '../ResponsiveNavigation';

const history = createMemoryHistory();
let mediaListeners: Set<() => void>;
let mediaQuery: MediaQueryList;

const setup = () =>
  render(
    <IntlProvider locale="en" messages={{}}>
      <ThemeProvider theme={lightTheme}>
        <Router history={history}>
          <ResponsiveNavigation id="main-menu" label="Main menu">
            <Link to="/content-manager">Content manager</Link>
          </ResponsiveNavigation>
          <ResponsiveNavigation id="content-menu" label="Content types">
            <Link to="/articles">Articles</Link>
          </ResponsiveNavigation>
          <main>Content remains available</main>
        </Router>
      </ThemeProvider>
    </IntlProvider>
  );

beforeEach(() => {
  history.replace('/');
  document.body.style.overflow = '';
  mediaListeners = new Set();
  mediaQuery = {
    matches: true,
    addEventListener: (_: string, listener: () => void) => {
      mediaListeners.add(listener);
    },
    removeEventListener: (_: string, listener: () => void) => {
      mediaListeners.delete(listener);
    },
  } as unknown as MediaQueryList;
  window.matchMedia = jest.fn().mockReturnValue(mediaQuery);
  // jsdom does not implement the browser's modal dialog API.
  HTMLDialogElement.prototype.showModal = function showModal() {
    this.setAttribute('open', '');
  };
  HTMLDialogElement.prototype.close = function close() {
    this.removeAttribute('open');
  };
});

it('keeps closed navigation out of the page and exposes it from the menu button', () => {
  setup();
  expect(screen.queryByRole('link', { name: 'Content manager' })).not.toBeInTheDocument();
  fireEvent.click(screen.getByRole('button', { name: 'Main menu' }));
  expect(screen.getByRole('dialog', { name: 'Main menu' })).toBeInTheDocument();
  expect(screen.getByRole('link', { name: 'Content manager' })).toBeVisible();
  expect(document.body).toHaveStyle({ overflow: 'hidden' });
});

it('closes with Escape and restores focus and the previous scroll setting', () => {
  document.body.style.overflow = 'auto';
  setup();
  const trigger = screen.getByRole('button', { name: 'Main menu' });
  trigger.focus();
  fireEvent.click(trigger);
  fireEvent(screen.getByRole('dialog'), new Event('cancel', { cancelable: true }));
  expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  expect(trigger).toHaveFocus();
  expect(document.body).toHaveStyle({ overflow: 'auto' });
});

it('closes after navigating without changing link destinations', () => {
  setup();
  fireEvent.click(screen.getByRole('button', { name: 'Main menu' }));
  fireEvent.click(screen.getByRole('link', { name: 'Content manager' }));
  expect(history.location.pathname).toBe('/content-manager');
  expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  expect(document.body).toHaveStyle({ overflow: '' });
});

it('allows only one navigation panel to be open', () => {
  setup();
  fireEvent.click(screen.getByRole('button', { name: 'Main menu' }));
  fireEvent.click(screen.getByRole('button', { name: 'Content types' }));
  expect(screen.getAllByRole('dialog')).toHaveLength(1);
  expect(screen.getByRole('dialog', { name: 'Content types' })).toBeInTheDocument();
  expect(document.body).toHaveStyle({ overflow: 'hidden' });
});

it('releases scroll lock on unmount', () => {
  const { unmount } = setup();
  fireEvent.click(screen.getByRole('button', { name: 'Main menu' }));
  unmount();
  expect(document.body).toHaveStyle({ overflow: '' });
});

it('shows desktop navigation without a dialog after resizing', () => {
  setup();
  fireEvent.click(screen.getByRole('button', { name: 'Content types' }));
  act(() => {
    Object.defineProperty(mediaQuery, 'matches', { value: false });
    mediaListeners.forEach((listener) => listener());
  });
  expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  expect(screen.getByRole('link', { name: 'Articles' })).toBeVisible();
  expect(screen.getByRole('link', { name: 'Content manager' })).toBeVisible();
  expect(document.body).toHaveStyle({ overflow: '' });
});

it('keeps router navigation guards intact', () => {
  setup();
  const unblock = history.block(() => false);
  fireEvent.click(screen.getByRole('button', { name: 'Main menu' }));
  fireEvent.click(screen.getByRole('link', { name: 'Content manager' }));
  expect(history.location.pathname).toBe('/');
  expect(screen.getByRole('dialog', { name: 'Main menu' })).toBeInTheDocument();
  unblock();
});

it('closes with the close button', () => {
  setup();
  const trigger = screen.getByRole('button', { name: 'Main menu' });
  fireEvent.click(trigger);
  fireEvent.click(screen.getByRole('button', { name: 'Close' }));
  expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  expect(trigger).toHaveFocus();
});

it('closes when query parameters change', () => {
  setup();
  fireEvent.click(screen.getByRole('button', { name: 'Main menu' }));
  act(() => history.push('/?page=2'));
  expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
});
