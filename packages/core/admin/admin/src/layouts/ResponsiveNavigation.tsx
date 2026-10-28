import * as React from 'react';

import { FocusTrap } from '@strapi/design-system';
import { Cross, MenuBurger, User } from '@strapi/icons';
import { useIntl } from 'react-intl';
import { Link, useLocation } from 'react-router-dom';
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

const AppBar = styled.header`
  position: sticky;
  top: 0;
  z-index: 4;
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spaces[3]};
  min-height: calc(3.5rem + env(safe-area-inset-top, 0px));
  padding: env(safe-area-inset-top, 0px) ${({ theme }) => theme.spaces[3]} 0;
  background: ${({ theme }) => theme.colors.neutral0};
  border-bottom: 1px solid ${({ theme }) => theme.colors.neutral150};
`;

const IconControl = styled.button`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  flex: 0 0 2.75rem;
  width: 2.75rem;
  height: 2.75rem;
  padding: 0;
  border: 0;
  border-radius: ${({ theme }) => theme.borderRadius};
  background: transparent;
  color: ${({ theme }) => theme.colors.neutral800};
  cursor: pointer;
  text-decoration: none;

  svg {
    width: 1.5rem;
    height: 1.5rem;
  }
  svg path {
    fill: currentColor;
  }
  &:hover {
    background: ${({ theme }) => theme.colors.neutral100};
  }
  &:focus-visible {
    outline: 2px solid ${({ theme }) => theme.colors.primary600};
    outline-offset: 2px;
  }
`;

const SectionTitle = styled.div`
  flex: 1;
  min-width: 0;
  font-size: 0.875rem;
  font-weight: 600;
  line-height: 1.3;
  color: ${({ theme }) => theme.colors.neutral800};
`;

const DrawerHeading = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: max(env(safe-area-inset-top, 0px), 0.75rem) 1rem 0.75rem;
  border-bottom: 1px solid ${({ theme }) => theme.colors.neutral150};
  font-weight: 600;
`;

const DrawerContent = styled(FocusTrap)`
  min-height: 100%;
  display: flex;
  flex-direction: column;
`;

const Drawer = styled.dialog`
  position: fixed;
  inset: 0 auto 0 0;
  margin: 0;
  padding: 0 0 env(safe-area-inset-bottom, 0px);
  border: 0;
  width: min(21rem, calc(100% - 2.5rem));
  max-width: 100%;
  height: 100%;
  max-height: 100%;
  height: 100dvh;
  color: ${({ theme }) => theme.colors.neutral800};
  background: ${({ theme }) => theme.colors.neutral0};
  box-shadow: 0 8px 40px rgba(0, 0, 0, 0.18);
  overflow: auto;
  overscroll-behavior: contain;
  animation: mobile-navigation-enter 180ms ease-out;

  &::backdrop {
    background: rgba(33, 33, 52, 0.48);
  }
  & nav a {
    min-height: 2.75rem;
    display: flex;
    align-items: center;
  }
  & nav button {
    min-height: 2.75rem;
    min-width: 2.75rem;
  }
  & nav {
    position: static;
    width: 100%;
    height: auto;
    flex: 1;
    overflow: visible;
  }
  @keyframes mobile-navigation-enter {
    from {
      transform: translateX(-100%);
    }
    to {
      transform: translateX(0);
    }
  }
  @media (prefers-reduced-motion: reduce) {
    animation: none;
  }
`;

interface ResponsiveNavigationProps {
  id: string;
  label: string;
  children: React.ReactNode;
  sectionTitle?: string;
}

export const ResponsiveNavigation = ({
  id,
  label,
  children,
  sectionTitle,
}: ResponsiveNavigationProps) => {
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
      <AppBar
        aria-label={formatMessage({
          id: 'app.navigation.application',
          defaultMessage: 'Application',
        })}
      >
        <IconControl
          ref={triggerRef}
          type="button"
          aria-label={label}
          aria-haspopup="dialog"
          aria-expanded={isOpen}
          aria-controls={isOpen ? id : undefined}
          onClick={() => {
            window.dispatchEvent(new CustomEvent(OPEN_NAVIGATION, { detail: id }));
            setIsOpen((open) => !open);
          }}
        >
          <MenuBurger aria-hidden="true" viewBox="6 6 12 12" />
        </IconControl>
        <SectionTitle>{sectionTitle || label}</SectionTitle>
        <IconControl
          as={Link}
          to="/me"
          aria-label={formatMessage({ id: 'global.profile', defaultMessage: 'Profile' })}
        >
          <User aria-hidden="true" />
        </IconControl>
      </AppBar>
      {isOpen && (
        <Drawer
          id={id}
          ref={dialogRef}
          aria-label={label}
          onCancel={(event) => {
            event.preventDefault();
            setIsOpen(false);
          }}
          onClick={(event) => {
            if (event.target !== event.currentTarget) return;
            const bounds = event.currentTarget.getBoundingClientRect();
            if (
              event.clientX < bounds.left ||
              event.clientX > bounds.right ||
              event.clientY < bounds.top ||
              event.clientY > bounds.bottom
            )
              setIsOpen(false);
          }}
          onClose={() => setIsOpen(false)}
        >
          <DrawerContent restoreFocus={false}>
            <DrawerHeading>
              <span>
                {formatMessage({ id: 'app.navigation.workspace', defaultMessage: 'Workspace' })}
              </span>
              <IconControl
                type="button"
                onClick={() => setIsOpen(false)}
                aria-label={formatMessage({ id: 'global.close', defaultMessage: 'Close' })}
              >
                <Cross aria-hidden="true" />
              </IconControl>
            </DrawerHeading>
            {children}
          </DrawerContent>
        </Drawer>
      )}
    </>
  );
};
