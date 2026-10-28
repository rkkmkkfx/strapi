import * as React from 'react';

import { BaseCheckbox } from '@strapi/design-system';
import { useQueryParams, useTableContext } from '@strapi/helper-plugin';
import { LocationDescriptor } from 'history';
import { useIntl } from 'react-intl';
import { Link } from 'react-router-dom';
import styled from 'styled-components';

const Controls = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 0.75rem;
  margin-bottom: 0.75rem;
  label {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    min-height: 2.75rem;
    font-size: 0.875rem;
  }
  select {
    max-width: 100%;
    min-height: 2.75rem;
    padding: 0.5rem;
    font-size: 1rem;
    color: ${({ theme }) => theme.colors.neutral800};
    background: ${({ theme }) => theme.colors.neutral0};
    border: 1px solid ${({ theme }) => theme.colors.neutral200};
    border-radius: ${({ theme }) => theme.borderRadius};
  }
`;
const Entries = styled.ul`
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  list-style: none;
`;
const Card = styled.article`
  display: grid;
  grid-template-columns: 2.75rem minmax(0, 1fr);
  background: ${({ theme }) => theme.colors.neutral0};
  border: 1px solid ${({ theme }) => theme.colors.neutral150};
  border-radius: ${({ theme }) => theme.borderRadius};
  padding: 0.75rem;
  box-shadow: 0 1px 3px rgba(33, 33, 52, 0.04);
`;
const Selection = styled.label`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 2.75rem;
  height: 2.75rem;
  cursor: pointer;
`;
const EntryTitle = styled(Link)`
  display: flex;
  align-items: center;
  min-height: 2.75rem;
  padding: 0.375rem 0;
  color: ${({ theme }) => theme.colors.neutral800};
  font-size: 1rem;
  font-weight: 600;
  line-height: 1.5;
  text-decoration: none;
  overflow-wrap: anywhere;
  &:focus-visible {
    outline: 2px solid ${({ theme }) => theme.colors.primary600};
    outline-offset: 2px;
  }
`;
const Metadata = styled.div`
  grid-column: 2;
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding-bottom: 0.75rem;
  color: ${({ theme }) => theme.colors.neutral600};
  font-size: 0.75rem;
`;
const Actions = styled.div`
  grid-column: 1 / -1;
  display: flex;
  justify-content: flex-end;
  gap: 0.25rem;
  border-top: 1px solid ${({ theme }) => theme.colors.neutral100};
  padding-top: 0.5rem;
  button,
  a {
    min-width: 2.75rem;
    min-height: 2.75rem;
  }
`;

interface MobileContentListProps<TRow> {
  rows: TRow[];
  getEntryLink: (row: TRow) => LocationDescriptor;
  renderTitle: (row: TRow) => React.ReactNode;
  renderStatus?: (row: TRow) => React.ReactNode;
  renderActions?: (row: TRow, index: number) => React.ReactNode;
  onNavigate?: (row: TRow) => void;
  sortOptions?: Array<{ label: string; value: string }>;
}

export const MobileContentList = <TRow extends { id: string | number }>({
  rows,
  getEntryLink,
  renderTitle,
  renderStatus,
  renderActions,
  onNavigate,
  sortOptions = [],
}: MobileContentListProps<TRow>) => {
  const { formatMessage } = useIntl();
  const { selectedEntries, setSelectedEntries, onSelectRow } = useTableContext();
  const [{ query }, setQuery] = useQueryParams<{ sort?: string; page?: number }>();
  const selected = rows.filter((row) => selectedEntries.includes(row.id));

  return (
    <>
      <Controls>
        <label>
          <BaseCheckbox
            checked={selected.length === rows.length && rows.length > 0}
            indeterminate={selected.length > 0 && selected.length < rows.length}
            onChange={() =>
              setSelectedEntries(selected.length === rows.length ? [] : rows.map((row) => row.id))
            }
            aria-label={formatMessage({
              id: 'global.select-all-entries',
              defaultMessage: 'Select all entries',
            })}
          />
          {formatMessage({ id: 'global.select-all-entries', defaultMessage: 'Select all entries' })}
        </label>
        {sortOptions.length > 0 && (
          <select
            aria-label={formatMessage({ id: 'app.list.sort', defaultMessage: 'Sort entries' })}
            value={query.sort || ''}
            onChange={(event) => setQuery({ sort: event.target.value, page: 1 })}
          >
            {!sortOptions.some((option) => option.value === query.sort) && (
              <option value={query.sort || ''}>
                {formatMessage({ id: 'app.list.default-order', defaultMessage: 'Default order' })}
              </option>
            )}
            {sortOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        )}
      </Controls>
      <Entries aria-label={formatMessage({ id: 'app.list.entries', defaultMessage: 'Entries' })}>
        {rows.map((row, index) => (
          <li key={row.id}>
            <Card>
              <Selection>
                <BaseCheckbox
                  checked={selectedEntries.includes(row.id)}
                  aria-label={formatMessage(
                    {
                      id: 'app.component.table.select.one-entry',
                      defaultMessage: 'Select {target}',
                    },
                    { target: index + 1 }
                  )}
                  onChange={() =>
                    onSelectRow({ name: row.id, value: !selectedEntries.includes(row.id) })
                  }
                />
              </Selection>
              <EntryTitle to={getEntryLink(row)} onClick={() => onNavigate?.(row)}>
                {renderTitle(row)}
              </EntryTitle>
              <Metadata>
                {renderStatus?.(row)}
                <span>#{row.id}</span>
              </Metadata>
              {renderActions && <Actions>{renderActions(row, index)}</Actions>}
            </Card>
          </li>
        ))}
      </Entries>
    </>
  );
};
