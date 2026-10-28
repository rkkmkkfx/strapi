import * as React from 'react';

import { Box, Flex, SkipToContent } from '@strapi/design-system';
import { useIntl } from 'react-intl';
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
}

export const AppLayout = ({ children, sideNav }: AppLayoutProps) => {
  const { formatMessage } = useIntl();

  return (
    <Box background="neutral100">
      <SkipToContent>
        {formatMessage({ id: 'skipToContent', defaultMessage: 'Skip to content' })}
      </SkipToContent>
      <Shell alignItems="flex-start">
        <ResponsiveNavigation
          id="main-navigation"
          label={formatMessage({ id: 'app.navigation.main', defaultMessage: 'Main menu' })}
        >
          {sideNav}
        </ResponsiveNavigation>
        <FlexBox>{children}</FlexBox>
      </Shell>
    </Box>
  );
};
