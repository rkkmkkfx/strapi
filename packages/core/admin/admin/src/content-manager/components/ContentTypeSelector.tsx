import { ChevronDown } from '@strapi/icons';
import { useIntl } from 'react-intl';
import { useHistory, useLocation } from 'react-router-dom';
import styled from 'styled-components';

interface ContentTypeOption {
  title: string;
  to: string;
  search: string | null;
}

interface ContentTypeSelectorProps {
  collectionTypes: ContentTypeOption[];
  singleTypes: ContentTypeOption[];
}

const Container = styled.div`
  padding: ${({ theme }) => theme.spaces[4]};
  padding-bottom: 0;
`;
const Label = styled.label`
  display: block;
  margin-bottom: ${({ theme }) => theme.spaces[2]};
  color: ${({ theme }) => theme.colors.neutral600};
  font-size: 0.75rem;
  font-weight: 600;
`;
const Field = styled.div`
  position: relative;
  svg {
    position: absolute;
    right: 1rem;
    top: 1rem;
    pointer-events: none;
  }
`;
const Select = styled.select`
  appearance: none;
  width: 100%;
  min-height: 2.75rem;
  padding: 0.625rem 2.75rem 0.625rem 1rem;
  border: 1px solid ${({ theme }) => theme.colors.neutral200};
  border-radius: ${({ theme }) => theme.borderRadius};
  background: ${({ theme }) => theme.colors.neutral0};
  color: ${({ theme }) => theme.colors.neutral800};
  font-size: 1rem;
  font-weight: 600;
  text-overflow: ellipsis;
  &:focus-visible {
    outline: 2px solid ${({ theme }) => theme.colors.primary600};
    outline-offset: 2px;
  }
`;

export const ContentTypeSelector = ({ collectionTypes, singleTypes }: ContentTypeSelectorProps) => {
  const { pathname } = useLocation();
  const history = useHistory();
  const { formatMessage, locale } = useIntl();
  const links = [...collectionTypes, ...singleTypes];
  const active = links.find((link) => pathname === link.to || pathname.startsWith(`${link.to}/`));
  const groups = [
    {
      label: formatMessage({
        id: 'content-manager.components.LeftMenu.collection-types',
        defaultMessage: 'Collection Types',
      }),
      links: collectionTypes,
    },
    {
      label: formatMessage({
        id: 'content-manager.components.LeftMenu.single-types',
        defaultMessage: 'Single Types',
      }),
      links: singleTypes,
    },
  ];
  const displayName = (link: ContentTypeOption) =>
    formatMessage({ id: link.title, defaultMessage: link.title });

  return (
    <Container>
      <Label htmlFor="content-type-selector">
        {formatMessage({ id: 'app.navigation.content-type', defaultMessage: 'Content type' })}
      </Label>
      <Field>
        <Select
          id="content-type-selector"
          value={active?.to || ''}
          onChange={(event) => {
            const next = links.find((link) => link.to === event.target.value);
            if (next) history.push({ pathname: next.to, search: next.search || '' });
          }}
        >
          {!active && (
            <option value="" disabled>
              {formatMessage({
                id: 'app.navigation.choose-content',
                defaultMessage: 'Choose a content type',
              })}
            </option>
          )}
          {groups
            .filter((group) => group.links.length > 0)
            .map((group) => (
              <optgroup label={group.label} key={group.label}>
                {[...group.links]
                  .sort((a, b) => displayName(a).localeCompare(displayName(b), locale))
                  .map((link) => (
                    <option key={link.to} value={link.to}>
                      {displayName(link)}
                    </option>
                  ))}
              </optgroup>
            ))}
        </Select>
        <ChevronDown aria-hidden="true" />
      </Field>
    </Container>
  );
};
