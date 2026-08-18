export interface PickItemLocation {
  sku: string;
  product_name: string;
  bin_code: string; // e.g. "A-12-3" (Aisle A, Shelf 12, Position 3)
  quantity: number;
}

export function sortBinsSerpentine(items: PickItemLocation[]): PickItemLocation[] {
  return [...items].sort((a, b) => {
    const parseBin = (code: string) => {
      const parts = code.split('-');
      const aisle = parts[0] || 'A';
      const shelf = parseInt(parts[1] || '0', 10);
      const pos = parseInt(parts[2] || '0', 10);
      return { aisle, shelf, pos };
    };

    const binA = parseBin(a.bin_code);
    const binB = parseBin(b.bin_code);

    // 1. Aisle comparison (alphabetical)
    if (binA.aisle !== binB.aisle) {
      return binA.aisle.localeCompare(binB.aisle);
    }

    // 2. Serpentine logic: even aisles travel ascending shelf, odd aisles travel descending shelf
    const aisleChar = binA.aisle.charCodeAt(0);
    const isEvenAisle = aisleChar % 2 === 0;

    if (binA.shelf !== binB.shelf) {
      return isEvenAisle ? binA.shelf - binB.shelf : binB.shelf - binA.shelf;
    }

    return binA.pos - binB.pos;
  });
}
