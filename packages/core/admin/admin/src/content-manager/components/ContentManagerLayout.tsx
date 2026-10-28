import * as React from 'react';

import { Box } from '@strapi/design-system';
import { useIntl } from 'react-intl';
import styled from 'styled-components';

import { ResponsiveNavigation } from '../../layouts/ResponsiveNavigation';

const Container = styled.div`
  display: flex;
  align-items: flex-start;
  min-width: 0;

  @media (max-width: 767px) {
    flex-direction: column;
    align-items: stretch;
  }
`;

const Body = styled(Box)`
  flex: 1;
  min-width: 0;
`;

interface ContentManagerLayoutProps {
  sideNav: React.ReactNode;
  children: React.ReactNode;
}

export const ContentManagerLayout = ({ sideNav, children }: ContentManagerLayoutProps) => {
  const { formatMessage } = useIntl();

  return (
    <Container>
      <ResponsiveNavigation
        id="content-navigation"
        label={formatMessage({ id: 'app.navigation.content', defaultMessage: 'Content types' })}
      >
        {sideNav}
      </ResponsiveNavigation>
      <Body paddingBottom={10}>{children}</Body>
    </Container>
  );
};
