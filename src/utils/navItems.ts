export type NavKey = 'build' | 'invest' | 'life';

export const NAV_ITEMS: Array<{ key: NavKey; tags: string[] }> = [
  { key: 'build', tags: ['innovation', 'model', 'management'] },
  { key: 'invest', tags: ['risk', 'strategy', 'allocation'] },
  { key: 'life', tags: ['reflect', 'media', 'roam'] },
];
