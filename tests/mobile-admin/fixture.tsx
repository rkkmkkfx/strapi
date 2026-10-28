import * as React from 'react';

import {
  Box,
  Button,
  DesignSystemProvider,
  Grid,
  GridItem,
  lightTheme,
  Main,
  Table,
  TextInput,
  Textarea,
  Typography,
} from '@strapi/design-system';
import { PageSizeURLQuery, PaginationURLQuery } from '@strapi/helper-plugin';
import { MainNav, NavLink, SubNav, SubNavLink } from '@strapi/design-system/v2';
import { createRoot } from 'react-dom/client';
import { IntlProvider } from 'react-intl';
import { Link, MemoryRouter } from 'react-router-dom';
import { createGlobalStyle } from 'styled-components';

import {
  ResponsiveActionLayout,
  ResponsiveContentLayout,
  ResponsiveHeaderLayout,
  ResponsivePagination,
  ScrollableTable,
} from '../../packages/core/admin/admin/src/content-manager/components/ResponsiveLayouts';
import { AppLayout } from '../../packages/core/admin/admin/src/layouts/AppLayout';
import { ContentManagerLayout } from '../../packages/core/admin/admin/src/content-manager/components/ContentManagerLayout';

const Reset = createGlobalStyle`
  * { box-sizing: border-box; }
  body { margin: 0; }
  input { max-width: 100%; }
`;

const Fixture = () => {
  const [saved, setSaved] = React.useState(false);
  const preview = window.location.pathname === '/preview';
  return (
    <AppLayout
      sideNav={
        <MainNav>
          <NavLink
            as={Link}
            // @ts-expect-error The design system does not infer props from Router Link.
            to="/content-manager"
          >
            Content manager
          </NavLink>
        </MainNav>
      }
    >
      <ContentManagerLayout
        sideNav={
          <SubNav ariaLabel="Content">
            <SubNavLink
              as={Link}
              // @ts-expect-error The design system does not infer props from Router Link.
              to="/articles"
            >
              Articles
            </SubNavLink>
          </SubNav>
        }
      >
        <Main style={{ flex: 1, minWidth: 0 }}>
          <form
            onSubmit={(event) => {
              event.preventDefault();
              setSaved(true);
            }}
          >
            <ResponsiveHeaderLayout
              title={preview ? 'Edit article' : 'LongArticleTitle'.repeat(7)}
              subtitle="API ID: articles"
              primaryAction={
                <>
                  <Button type="button">Publish</Button>
                  <Button type="submit">Save</Button>
                </>
              }
            />
            <ResponsiveActionLayout
              startActions={
                <>
                  <input aria-label="Search" />
                  <Button>Filters</Button>
                </>
              }
              endActions={<Button>View settings</Button>}
            />
            <ResponsiveContentLayout>
              <Grid gap={4}>
                <GridItem col={9} s={12} xs={12}>
                  <Box background="neutral0" padding={5} hasRadius shadow="tableShadow">
                    <TextInput
                      label="Article title"
                      name="title"
                      defaultValue="Getting started with our product"
                    />
                    <Box paddingTop={4}>
                      <Textarea
                        label="Content"
                        name="content"
                        defaultValue="Welcome to our product. Find everything you need to get started, explore key features, and publish your first article."
                      />
                    </Box>
                    <Box paddingTop={4}>
                      <TextInput label="Slug" name="slug" defaultValue="getting-started" />
                    </Box>
                  </Box>
                </GridItem>
                <GridItem col={3} s={12} xs={12}>
                  <Box as="aside" background="neutral0" padding={4} hasRadius shadow="tableShadow">
                    <Typography as="h2" fontWeight="bold">
                      Information
                    </Typography>
                    <Box paddingTop={3}>
                      <Typography as="p">Status: Draft</Typography>
                    </Box>
                    <Box paddingTop={3}>
                      <Typography as="p">Created by: Admin</Typography>
                    </Box>
                  </Box>
                </GridItem>
              </Grid>
              <ScrollableTable aria-label="Articles table">
                <Table rowCount={1} colCount={3} style={{ minWidth: 1100 }}>
                  <thead>
                    <tr>
                      <th>Title</th>
                      <th>Status</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>Example article</td>
                      <td>Draft</td>
                      <td>
                        <button type="button">Edit article</button>
                      </td>
                    </tr>
                  </tbody>
                </Table>
              </ScrollableTable>
              <ResponsivePagination>
                <PageSizeURLQuery />
                <PaginationURLQuery pagination={{ pageCount: 1000 }} />
              </ResponsivePagination>
              {saved && <p role="status">Saved</p>}
            </ResponsiveContentLayout>
          </form>
        </Main>
      </ContentManagerLayout>
    </AppLayout>
  );
};

createRoot(document.getElementById('root')!).render(
  <IntlProvider locale="en" messages={{}}>
    <DesignSystemProvider locale="en" theme={lightTheme}>
      <Reset />
      <MemoryRouter initialEntries={['/articles?page=500']}>
        <Fixture />
      </MemoryRouter>
    </DesignSystemProvider>
  </IntlProvider>
);
