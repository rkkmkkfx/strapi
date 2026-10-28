import * as React from 'react';

import { Box, Flex, SkipToContent } from '@strapi/design-system';
import { MessageDescriptor, useIntl } from 'react-intl';
import { useLocation } from 'react-router-dom';
import styled from 'styled-components';

import { ResponsiveNavigation } from './ResponsiveNavigation';

const FlexBox = styled(Box)`
  flex: 1;
  min-width: 0;
`;

const Shell = styled(Flex)`
  @media (max-width: 767px) {
    flex-direction: column;
    align-items: stretch;
  }
`;

interface AppLayoutProps {
  children: React.ReactNode;
  sideNav: React.ReactNode;
  navigationItems?: Array<{ to: string; intlLabel: MessageDescriptor }>;
}

export const AppLayout = ({ children, sideNav, navigationItems = [] }: AppLayoutProps) => {
  const { formatMessage } = useIntl();
  const { pathname } = useLocation();
  const currentItem = navigationItems
    .filter((item) => pathname === item.to || pathname.startsWith(`${item.to}/`))
    .sort((a, b) => b.to.length - a.to.length)[0];
  const sectionTitle = currentItem
    ? formatMessage(currentItem.intlLabel)
    : pathname.startsWith('/content-manager')
    ? formatMessage({ id: 'global.content-manager', defaultMessage: 'Content manager' })
    : pathname.startsWith('/settings')
    ? formatMessage({ id: 'global.settings', defaultMessage: 'Settings' })
    : 'Strapi';

  return (
    <Box background="neutral100">
      <SkipToContent>
        {formatMessage({ id: 'skipToContent', defaultMessage: 'Skip to content' })}
      </SkipToContent>
      <Shell alignItems="flex-start">
        <ResponsiveNavigation
          id="main-navigation"
          sectionTitle={sectionTitle}
          label={formatMessage({ id: 'app.navigation.main', defaultMessage: 'Main menu' })}
        >
          {sideNav}
        </ResponsiveNavigation>
        <FlexBox>{children}</FlexBox>
      </Shell>
    </Box>
  );
};
