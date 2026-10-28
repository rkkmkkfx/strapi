import * as React from 'react';

import { Button, FocusTrap } from '@strapi/design-system';
import { useIntl } from 'react-intl';
import { useLocation } from 'react-router-dom';
import styled from 'styled-components';

const MOBILE_QUERY = '(max-width: 767px)';
const OPEN_NAVIGATION = 'strapi:open-mobile-navigation';

export const useIsMobile = () => {
  const [isMobile, setIsMobile] = React.useState(() => window.matchMedia(MOBILE_QUERY).matches);

  React.useEffect(() => {
    const query = window.matchMedia(MOBILE_QUERY);
    const update = () => setIsMobile(query.matches);
    query.addEventListener('change', update);
    update();
    return () => query.removeEventListener('change', update);
  }, []);

  return isMobile;
};

const MenuBar = styled.div`
  padding: ${({ theme }) => theme.spaces[3]};
  background: ${({ theme }) => theme.colors.neutral0};
  border-bottom: 1px solid ${({ theme }) => theme.colors.neutral200};
`;

const Drawer = styled.dialog`
  position: fixed;
  inset: 0 auto 0 0;
  margin: 0;
  padding: 0;
  border: 0;
  width: min(20rem, 100%);
  max-width: 100%;
  height: 100%;
  max-height: 100%;
  height: 100dvh;
  color: ${({ theme }) => theme.colors.neutral800};
  background: ${({ theme }) => theme.colors.neutral0};
  overflow: auto;
  overscroll-behavior: contain;

  &::backdrop {
    background: rgba(0, 0, 0, 0.4);
  }

  /* Existing navigation primitives use sticky, viewport-height roots. */
  & nav {
    position: static;
    width: 100%;
    height: auto;
    min-height: calc(100% - 4rem);
    overflow: visible;
  }
`;

interface ResponsiveNavigationProps {
  id: string;
  label: string;
  children: React.ReactNode;
}

export const ResponsiveNavigation = ({ id, label, children }: ResponsiveNavigationProps) => {
  const isMobile = useIsMobile();
  const [isOpen, setIsOpen] = React.useState(false);
  const triggerRef = React.useRef<HTMLButtonElement>(null);
  const dialogRef = React.useRef<HTMLDialogElement>(null);
  const { pathname, search, hash } = useLocation();
  const { formatMessage } = useIntl();

  React.useEffect(() => {
    setIsOpen(false);
  }, [pathname, search, hash, isMobile]);

  React.useEffect(() => {
    const closeOtherNavigation = (event: Event) => {
      if ((event as CustomEvent<string>).detail !== id) {
        setIsOpen(false);
      }
    };
    window.addEventListener(OPEN_NAVIGATION, closeOtherNavigation);
    return () => window.removeEventListener(OPEN_NAVIGATION, closeOtherNavigation);
  }, [id]);

  React.useEffect(() => {
    if (!isOpen || !isMobile) {
      return undefined;
    }

    const dialog = dialogRef.current!;
    const trigger = triggerRef.current;
    const previousOverflow = document.body.style.overflow;
    dialog.showModal();
    document.body.style.overflow = 'hidden';

    return () => {
      dialog.close();
      document.body.style.overflow = previousOverflow;
      trigger?.focus();
    };
  }, [isOpen, isMobile]);

  if (!isMobile) {
    return <>{children}</>;
  }

  return (
    <>
      <MenuBar>
        <Button
          ref={triggerRef}
          type="button"
          variant="tertiary"
          aria-haspopup="dialog"
          aria-expanded={isOpen}
          aria-controls={isOpen ? id : undefined}
          onClick={() => {
            window.dispatchEvent(new CustomEvent(OPEN_NAVIGATION, { detail: id }));
            setIsOpen((open) => !open);
          }}
        >
          {label}
        </Button>
      </MenuBar>
      {isOpen && (
        <Drawer
          id={id}
          ref={dialogRef}
          aria-label={label}
          onCancel={(event) => {
            event.preventDefault();
            setIsOpen(false);
          }}
          onClose={() => setIsOpen(false)}
        >
          <FocusTrap restoreFocus={false}>
            <MenuBar>
              <Button type="button" variant="tertiary" onClick={() => setIsOpen(false)}>
                {formatMessage({ id: 'global.close', defaultMessage: 'Close' })}
              </Button>
            </MenuBar>
            {children}
          </FocusTrap>
        </Drawer>
      )}
    </>
  );
};
