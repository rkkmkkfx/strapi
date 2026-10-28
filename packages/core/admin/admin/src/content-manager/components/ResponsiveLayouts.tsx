import * as React from 'react';

import { Box, Flex, HeaderLayout, Typography } from '@strapi/design-system';
import styled from 'styled-components';

import { useIsMobile } from '../../layouts/ResponsiveNavigation';

const Header = styled.header`
  padding: ${({ theme }) => theme.spaces[4]};
  overflow-wrap: anywhere;
`;

const PrimaryActions = styled(Flex)`
  button,
  a {
    min-height: 2.75rem;
    text-decoration: none;
  }
`;

const StickyActions = styled.div`
  position: sticky;
  top: calc(3.5rem + env(safe-area-inset-top, 0px));
  z-index: 3;
  display: flex;
  justify-content: flex-end;
  gap: ${({ theme }) => theme.spaces[2]};
  padding: 0.75rem 1rem;
  margin-bottom: ${({ theme }) => theme.spaces[4]};
  background: ${({ theme }) => theme.colors.neutral0};
  border-bottom: 1px solid ${({ theme }) => theme.colors.neutral150};
  & > div {
    flex: 1;
  }
  button {
    min-height: 2.75rem;
    flex: 1;
  }
`;

export const ResponsiveHeaderLayout = ({
  title,
  subtitle,
  navigationAction,
  primaryAction,
  secondaryAction,
  stickyActions = false,
  ...props
}: React.ComponentProps<typeof HeaderLayout> & { stickyActions?: boolean }) => {
  const isMobile = useIsMobile();

  if (!isMobile) {
    return (
      <HeaderLayout
        {...props}
        title={title}
        subtitle={subtitle}
        navigationAction={navigationAction}
        primaryAction={primaryAction}
        secondaryAction={secondaryAction}
        style={{ ...props.style, minWidth: 0, overflowWrap: 'anywhere' }}
      />
    );
  }

  return (
    <>
      <Header>
        {navigationAction && <Box paddingBottom={2}>{navigationAction}</Box>}
        <Flex gap={3} wrap="wrap">
          <Typography {...props} as="h1" variant="alpha">
            {title}
          </Typography>
          {secondaryAction}
        </Flex>
        {typeof subtitle === 'string' ? (
          <Typography as="p" variant="epsilon" textColor="neutral600">
            {subtitle}
          </Typography>
        ) : (
          subtitle
        )}
        {primaryAction && !stickyActions && (
          <PrimaryActions paddingTop={4} gap={2} wrap="wrap">
            {primaryAction}
          </PrimaryActions>
        )}
      </Header>
      {stickyActions && primaryAction && <StickyActions>{primaryAction}</StickyActions>}
    </>
  );
};

export const ResponsiveContentLayout = styled.div`
  min-width: 0;
  padding-inline: ${({ theme }) => theme.spaces[10]};

  @media (max-width: 767px) {
    padding-inline: ${({ theme }) => theme.spaces[4]};
    input,
    textarea,
    [contenteditable='true'] {
      scroll-margin-top: 9rem;
    }
  }
`;

const Actions = styled(ResponsiveContentLayout)`
  display: flex;
  flex-wrap: wrap;
  align-items: flex-start;
  justify-content: space-between;
  gap: ${({ theme }) => theme.spaces[3]};
  padding-bottom: ${({ theme }) => theme.spaces[4]};
  @media (max-width: 767px) {
    button {
      min-width: 2.75rem;
      min-height: 2.75rem;
    }
  }
`;

interface ResponsiveActionLayoutProps {
  startActions?: React.ReactNode;
  endActions?: React.ReactNode;
}

export const ResponsiveActionLayout = ({
  startActions,
  endActions,
}: ResponsiveActionLayoutProps) => {
  if (!startActions && !endActions) {
    return null;
  }

  return (
    <Actions>
      <Flex gap={2} wrap="wrap" minWidth={0}>
        {startActions}
      </Flex>
      <Flex gap={2} wrap="wrap" minWidth={0}>
        {endActions}
      </Flex>
    </Actions>
  );
};

export const ResponsivePagination = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: flex-end;
  justify-content: space-between;
  gap: ${({ theme }) => theme.spaces[4]};
  min-width: 0;

  /* Page links form an ordered list; wrap them when the content column narrows. */
  nav {
    max-width: 100%;
  }

  ol {
    flex-wrap: wrap;
  }
`;

export const ScrollableTable = styled.div.attrs({ role: 'region', tabIndex: 0 })`
  max-width: 100%;
  min-width: 0;
  overflow-x: auto;
  overscroll-behavior-x: contain;
`;

export const EditActions = styled(Flex)`
  flex-wrap: wrap;
  gap: ${({ theme }) => theme.spaces[2]};
  @media (max-width: 767px) {
    width: 100%;
    & > button,
    & > div {
      flex: 1;
    }
    & > div > button {
      width: 100%;
    }
  }
`;
