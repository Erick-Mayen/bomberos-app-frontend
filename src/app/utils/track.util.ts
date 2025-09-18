export function trackById<T extends { id: string | number }>(_: number, item: T): string | number {
  return item.id;
}
