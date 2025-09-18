export type SortDirection = 'asc' | 'desc';

export function sortByColumn<T>(
  data: T[],
  column: keyof T | string,
  direction: SortDirection = 'asc'
): T[] {
  return [...data].sort((a, b) => {
    const valueA = (a[column as keyof T] as any);
    const valueB = (b[column as keyof T] as any);

    if (valueA == null || valueB == null) return 0;

    let result = 0;
    if (valueA < valueB) result = -1;
    if (valueA > valueB) result = 1;

    return direction === 'asc' ? result : -result;
  });
}

export function toggleDirection(current: 'asc' | 'desc'): 'asc' | 'desc' {
  return current === 'asc' ? 'desc' : 'asc';
}
