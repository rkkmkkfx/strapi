import { getMobileEntryTitle, getMobileSortValue } from '../mobileList';

it('uses a visible scalar main field as a plain-text entry title', () => {
  expect(
    getMobileEntryTitle(
      { id: 7, title: 'A complete article title', owner: { name: 'Someone' } },
      [
        { name: 'owner.name', fieldSchema: { type: 'relation' } },
        { name: 'title', fieldSchema: { type: 'string' } },
      ],
      'title'
    )
  ).toBe('A complete article title');
});

it('falls back to an ID instead of interactive relations or hidden title fields', () => {
  expect(
    getMobileEntryTitle(
      { id: 7, title: 'Restricted title', owner: [{ id: 2 }] },
      [{ name: 'owner', fieldSchema: { type: 'relation' } }],
      'title'
    )
  ).toBe('#7');
});

it('uses an ID for an empty visible title', () => {
  expect(
    getMobileEntryTitle(
      { id: 7, title: '  ' },
      [{ name: 'title', fieldSchema: { type: 'string' } }],
      'title'
    )
  ).toBe('#7');
});

it('matches table relation sorting syntax', () => {
  expect(
    getMobileSortValue(
      {
        name: 'author.name',
        fieldSchema: { type: 'relation' },
        metadatas: { mainField: { name: 'name' } },
      },
      'DESC'
    )
  ).toBe('author[name]:DESC');
  expect(getMobileSortValue({ name: 'title', fieldSchema: { type: 'string' } }, 'ASC')).toBe(
    'title:ASC'
  );
});
