export function filterData<T>(
  data: T[],
  searchTerm: string,
  columns: (keyof T)[]
): T[] {
  if (!searchTerm) return data;

  const term = searchTerm.toLowerCase();
  return data.filter(item =>
    columns.some(col => {
      const value = (item[col] as any)?.toString().toLowerCase();
      return value?.includes(term);
    })
  );
}
