import { lightTheme } from '@strapi/design-system';
import { fireEvent, render, screen } from '@testing-library/react';
import { createMemoryHistory } from 'history';
import { IntlProvider } from 'react-intl';
import { Router } from 'react-router-dom';
import { ThemeProvider } from 'styled-components';

import { ContentTypeSelector } from '../ContentTypeSelector';

const setup = () => {
  const history = createMemoryHistory({
    initialEntries: ['/content-manager/collection-types/articles/42'],
  });
  render(
    <IntlProvider locale="en" messages={{}}>
      <ThemeProvider theme={lightTheme}>
        <Router history={history}>
          <ContentTypeSelector
            collectionTypes={[
              {
                title: 'Articles',
                to: '/content-manager/collection-types/articles',
                search: 'page=1&pageSize=10',
              },
              {
                title: 'Authors',
                to: '/content-manager/collection-types/authors',
                search: 'page=1&pageSize=20',
              },
            ]}
            singleTypes={[]}
          />
        </Router>
      </ThemeProvider>
    </IntlProvider>
  );
  return history;
};

it('shows the active collection while editing an entry', () => {
  setup();
  expect(screen.getByRole('combobox', { name: 'Content type' })).toHaveValue(
    '/content-manager/collection-types/articles'
  );
});

it('navigates using the collection link and its query defaults', () => {
  const history = setup();
  fireEvent.change(screen.getByRole('combobox'), {
    target: { value: '/content-manager/collection-types/authors' },
  });
  expect(history.location.pathname).toBe('/content-manager/collection-types/authors');
  expect(history.location.search).toBe('?page=1&pageSize=20');
});

it('retains the current collection when unsaved-change navigation is blocked', () => {
  const history = setup();
  const unblock = history.block(() => false);
  fireEvent.change(screen.getByRole('combobox'), {
    target: { value: '/content-manager/collection-types/authors' },
  });
  expect(history.location.pathname).toBe('/content-manager/collection-types/articles/42');
  expect(screen.getByRole('combobox')).toHaveValue('/content-manager/collection-types/articles');
  unblock();
});
