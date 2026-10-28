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
  Status,
  Th,
  Td,
  Tr,
  Thead,
  Tbody,
  IconButton,
} from '@strapi/design-system';
import {
  PageSizeURLQuery,
  PaginationURLQuery,
  Table as HelperTable,
  SearchURLQuery,
} from '@strapi/helper-plugin';
import {
  MainNav,
  NavLink,
  NavSection,
  NavSections,
  NavBrand,
  NavFooter,
  SubNav,
  SubNavLink,
} from '@strapi/design-system/v2';
import {
  House,
  Write,
  Cog,
  Picture,
  Pencil,
  Duplicate,
  Trash,
  ArrowLeft,
  Plus,
} from '@strapi/icons';
import { createRoot } from 'react-dom/client';
import { IntlProvider } from 'react-intl';
import { Link, MemoryRouter, useLocation, NavLink as RouterNavLink } from 'react-router-dom';
import { createGlobalStyle } from 'styled-components';

import {
  ResponsiveActionLayout,
  ResponsiveContentLayout,
  ResponsiveHeaderLayout,
  ResponsivePagination,
  ScrollableTable,
  EditActions,
} from '../../packages/core/admin/admin/src/content-manager/components/ResponsiveLayouts';
import { MobileContentList } from '../../packages/core/admin/admin/src/content-manager/components/MobileContentList';
import { ContentTypeSelector } from '../../packages/core/admin/admin/src/content-manager/components/ContentTypeSelector';
import { AppLayout } from '../../packages/core/admin/admin/src/layouts/AppLayout';
import { useIsMobile } from '../../packages/core/admin/admin/src/layouts/ResponsiveNavigation';
import { ContentManagerLayout } from '../../packages/core/admin/admin/src/content-manager/components/ContentManagerLayout';

const Reset = createGlobalStyle`
  * { box-sizing: border-box; }
  body { margin: 0; background: #f6f6f9; }
  input { max-width: 100%; }
`;
const basePath = '/content-manager/collection-types/articles';
const articles = [
  { id: 1, title: 'Getting started with our product', published: false, updated: 'Today at 10:42' },
  { id: 2, title: 'Meet the team behind the work', published: true, updated: 'Yesterday at 14:30' },
  {
    id: 3,
    title: 'Five ways to improve your workflow',
    published: true,
    updated: 'Oct 26 at 09:15',
  },
  { id: 4, title: 'What’s new this autumn', published: false, updated: 'Oct 25 at 16:08' },
];
const collections = [
  { title: 'Articles', to: basePath, search: 'page=1&pageSize=10' },
  {
    title: 'Authors',
    to: '/content-manager/collection-types/authors',
    search: 'page=1&pageSize=10',
  },
];

const Destination = ({
  to,
  icon,
  children,
}: {
  to: string;
  icon: React.ReactNode;
  children: string;
}) => (
  <NavLink
    as={RouterNavLink}
    {...{ exact: to === '/' }}
    icon={icon}
    // @ts-expect-error The design system does not infer Router Link props.
    to={to}
  >
    {children}
  </NavLink>
);

const Navigation = () => (
  <MainNav>
    <NavBrand
      title="Strapi"
      workplace="Editorial workspace"
      icon={<span style={{ color: '#4945ff', fontWeight: 700, fontSize: 24 }}>S</span>}
    />
    <NavSections>
      <Destination to="/" icon={<House />}>
        Home
      </Destination>
      <Destination to={basePath} icon={<Write />}>
        Content manager
      </Destination>
      <NavSection label="Plugins">
        <Destination to="/plugins/upload" icon={<Picture />}>
          Media Library
        </Destination>
        <Destination to="/plugins/content-type-builder" icon={<Write />}>
          Content-Type Builder
        </Destination>
      </NavSection>
      <NavSection label="General">
        <Destination to="/settings" icon={<Cog />}>
          Settings
        </Destination>
      </NavSection>
    </NavSections>
    <NavFooter>
      <Destination to="/me" icon={<House />}>
        Admin profile
      </Destination>
    </NavFooter>
  </MainNav>
);

const Fixture = () => {
  const [saved, setSaved] = React.useState(false);
  const [showTable, setShowTable] = React.useState(false);
  const { pathname } = useLocation();
  const isMobile = useIsMobile();
  const editor = pathname.startsWith(`${basePath}/`);
  const stress = window.location.pathname.includes('stress');
  return (
    <AppLayout sideNav={<Navigation />}>
      <ContentManagerLayout
        mobileNavigation={<ContentTypeSelector collectionTypes={collections} singleTypes={[]} />}
        sideNav={
          <SubNav ariaLabel="Content">
            <Box padding={5}>
              <Typography fontWeight="bold">Content manager</Typography>
            </Box>
            {/* @ts-expect-error The design system does not infer Router Link props. */}
            <SubNavLink as={Link} to={basePath}>
              Articles
            </SubNavLink>
            <Box padding={4}>
              <Typography textColor="neutral600" variant="pi">
                Collection types
              </Typography>
            </Box>
            {/* @ts-expect-error The design system does not infer Router Link props. */}
            <SubNavLink as={Link} to="/content-manager/collection-types/authors">
              Authors
            </SubNavLink>
          </SubNav>
        }
      >
        <Main style={{ minWidth: 0 }}>
          {editor ? (
            <form
              onSubmit={(event) => {
                event.preventDefault();
                setSaved(true);
              }}
            >
              <ResponsiveHeaderLayout
                stickyActions
                title={stress ? 'LongArticleTitle'.repeat(7) : 'Getting started with our product'}
                subtitle="Article · Draft"
                navigationAction={
                  <Link
                    to={basePath}
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: 8,
                      minHeight: 44,
                      color: '#4945ff',
                      textDecoration: 'none',
                      fontSize: 14,
                    }}
                  >
                    <ArrowLeft aria-hidden /> All articles
                  </Link>
                }
                primaryAction={
                  <EditActions>
                    <Button type="button" variant="secondary">
                      Publish
                    </Button>
                    <Button type="submit">Save</Button>
                  </EditActions>
                }
              />
              <ResponsiveContentLayout>
                <Grid gap={4}>
                  <GridItem col={9} s={12} xs={12} minWidth={0}>
                    <Box background="neutral0" padding={5} hasRadius borderColor="neutral150">
                      <TextInput
                        label="Article title"
                        name="title"
                        defaultValue="Getting started with our product"
                      />
                      <Box paddingTop={5}>
                        <Textarea
                          label="Summary"
                          name="summary"
                          defaultValue="Everything you need to publish your first article and get more from your workspace."
                        />
                      </Box>
                      <Box paddingTop={5}>
                        <Textarea
                          label="Content"
                          name="content"
                          rows={14}
                          defaultValue={
                            'Welcome to your workspace.\n\nStart with a clear title and a short introduction. Organize your content into sections that make it easy for readers to find what they need.\n\nAdd your story, review the details, and save a draft before publishing. Your changes stay private until you choose to publish.'
                          }
                        />
                      </Box>
                      <Box paddingTop={5}>
                        <TextInput label="Slug" name="slug" defaultValue="getting-started" />
                      </Box>
                    </Box>
                  </GridItem>
                  <GridItem col={3} s={12} xs={12} minWidth={0}>
                    <Box
                      as="aside"
                      background="neutral0"
                      padding={4}
                      hasRadius
                      borderColor="neutral150"
                    >
                      <Typography as="h2" fontWeight="bold">
                        Information
                      </Typography>
                      <Box paddingTop={4}>
                        <Status size="S" variant="secondary">
                          Draft
                        </Status>
                      </Box>
                      <Box paddingTop={4}>
                        <Typography as="p" variant="pi" textColor="neutral600">
                          Last updated
                        </Typography>
                        <Typography as="p" variant="omega">
                          Today, 10:42
                        </Typography>
                      </Box>
                      <Box paddingTop={4}>
                        <Typography as="p" variant="pi" textColor="neutral600">
                          Created by
                        </Typography>
                        <Typography as="p" variant="omega">
                          Admin
                        </Typography>
                      </Box>
                    </Box>
                  </GridItem>
                </Grid>
                {saved && <p role="status">Saved</p>}
              </ResponsiveContentLayout>
            </form>
          ) : (
            <>
              <ResponsiveHeaderLayout
                title={stress ? 'LongCollectionTitle'.repeat(7) : 'Articles'}
                subtitle="4 entries"
                primaryAction={
                  <Button
                    startIcon={<Plus />}
                    forwardedAs={Link}
                    // @ts-expect-error The design system does not infer Router Link props.
                    to={`${basePath}/1`}
                  >
                    Create entry
                  </Button>
                }
              />
              <ResponsiveActionLayout
                startActions={
                  <>
                    <SearchURLQuery label="Search articles" placeholder="Search articles" />
                    <Button variant="tertiary">Filters</Button>
                  </>
                }
                endActions={
                  isMobile ? (
                    <Button variant="tertiary" onClick={() => setShowTable((value) => !value)}>
                      {showTable ? 'Card view' : 'Table view'}
                    </Button>
                  ) : (
                    <Button variant="tertiary">View settings</Button>
                  )
                }
              />
              <ResponsiveContentLayout>
                <HelperTable.Root rows={articles} colCount={4} isLoading={false}>
                  <HelperTable.ActionBar>
                    <Button variant="danger-light">Delete selected</Button>
                  </HelperTable.ActionBar>
                  {isMobile && !showTable ? (
                    <MobileContentList
                      rows={articles}
                      getEntryLink={(row) => `${basePath}/${row.id}`}
                      renderTitle={(row) => row.title}
                      renderStatus={(row) => (
                        <Status size="S" variant={row.published ? 'success' : 'secondary'}>
                          {row.published ? 'Published' : 'Draft'}
                        </Status>
                      )}
                      sortOptions={[
                        { label: 'Title (ascending)', value: 'title:ASC' },
                        { label: 'Title (descending)', value: 'title:DESC' },
                      ]}
                      renderActions={(row) => (
                        <>
                          <IconButton
                            label={`Edit article ${row.id}`}
                            forwardedAs={Link}
                            // @ts-expect-error The design system does not infer Router Link props.
                            to={`${basePath}/${row.id}`}
                          >
                            <Pencil />
                          </IconButton>
                          <IconButton label={`Duplicate article ${row.id}`}>
                            <Duplicate />
                          </IconButton>
                          <IconButton label={`Delete article ${row.id}`}>
                            <Trash />
                          </IconButton>
                        </>
                      )}
                    />
                  ) : (
                    <ScrollableTable aria-label="Articles table">
                      <Table rowCount={articles.length} colCount={4} style={{ minWidth: 1000 }}>
                        <Thead>
                          <Tr>
                            <Th>Title</Th>
                            <Th>Status</Th>
                            <Th>Updated</Th>
                            <Th>Actions</Th>
                          </Tr>
                        </Thead>
                        <Tbody>
                          {articles.map((row) => (
                            <Tr key={row.id}>
                              <Td>
                                <Link to={`${basePath}/${row.id}`}>{row.title}</Link>
                              </Td>
                              <Td>
                                <Status size="S" variant={row.published ? 'success' : 'secondary'}>
                                  {row.published ? 'Published' : 'Draft'}
                                </Status>
                              </Td>
                              <Td>{row.updated}</Td>
                              <Td>
                                <Link to={`${basePath}/${row.id}`}>Edit article</Link>
                              </Td>
                            </Tr>
                          ))}
                        </Tbody>
                      </Table>
                    </ScrollableTable>
                  )}
                  <Box paddingTop={4}>
                    <ResponsivePagination>
                      <PageSizeURLQuery />
                      <PaginationURLQuery pagination={{ pageCount: stress ? 1000 : 1 }} />
                    </ResponsivePagination>
                  </Box>
                </HelperTable.Root>
              </ResponsiveContentLayout>
            </>
          )}
        </Main>
      </ContentManagerLayout>
    </AppLayout>
  );
};
const entry = window.location.pathname.includes('editor')
  ? `${basePath}/1`
  : `${basePath}?page=1&pageSize=10`;
createRoot(document.getElementById('root')!).render(
  <IntlProvider locale="en" messages={{}}>
    <DesignSystemProvider locale="en" theme={lightTheme}>
      <Reset />
      <MemoryRouter initialEntries={[entry]}>
        <Fixture />
      </MemoryRouter>
    </DesignSystemProvider>
  </IntlProvider>
);
