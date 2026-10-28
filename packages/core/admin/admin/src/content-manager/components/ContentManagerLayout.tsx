import * as React from 'react';

import { Box } from '@strapi/design-system';
import styled from 'styled-components';

import { useIsMobile } from '../../layouts/ResponsiveNavigation';

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
  mobileNavigation?: React.ReactNode;
}

export const ContentManagerLayout = ({
  sideNav,
  children,
  mobileNavigation,
}: ContentManagerLayoutProps) => {
  const isMobile = useIsMobile();

  return (
    <Container>
      {isMobile ? mobileNavigation : sideNav}
      <Body paddingBottom={10}>{children}</Body>
    </Container>
  );
};
