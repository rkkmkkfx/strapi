interface MobileListField {
  name: string;
  fieldSchema: { type: string };
  metadatas?: { mainField?: { name: string } };
}

const TITLE_TYPES = ['string', 'text', 'uid', 'email', 'integer', 'biginteger', 'float', 'decimal'];

/** Card links must contain plain text, never interactive table-cell renderers. */
export const getMobileEntryTitle = (
  row: Record<string, unknown> & { id: string | number },
  headers: readonly MobileListField[],
  mainField?: string
): string => {
  const visibleScalars = headers.filter((header) => TITLE_TYPES.includes(header.fieldSchema.type));
  const field =
    visibleScalars.find((header) => header.name === mainField) ||
    visibleScalars.find((header) => ['string', 'text', 'uid'].includes(header.fieldSchema.type)) ||
    visibleScalars[0];
  const value = field ? row[field.name] : undefined;
  if (typeof value === 'string' && value.trim()) return value;
  if (typeof value === 'number' && Number.isFinite(value)) return String(value);
  return `#${row.id}`;
};

export const getMobileSortValue = (header: MobileListField, direction: 'ASC' | 'DESC') => {
  const relationField = header.metadatas?.mainField?.name;
  const name =
    header.fieldSchema.type === 'relation' && relationField
      ? `${header.name.split('.')[0]}[${relationField}]`
      : header.name;
  return `${name}:${direction}`;
};
