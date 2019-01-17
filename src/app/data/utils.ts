import { ICartSave } from '../services/models';

export interface WindowTrainData {
  data: string;
  left: string;
  right: string;
}

export interface TrainData {
  data: number;
  label: number;
}

export const removeStopWords = (line: string): string => {
  const stopWords = ['is', 'a', 'will', 'be', 'to', 'the'];

  return line
    .split(' ')
    .map(x => {
      if (stopWords.indexOf(x) === -1) {
        return x.toLowerCase();
      }
      return undefined;
    })
    .filter(x => !!x)
    .join(' ');
};

export const getUniqueWords = (lines: string[]): string[] => {
  const wordSet = new Set();

  lines.forEach(l => l.split(' ').forEach(w => wordSet.add(w)));

  return Array.from(wordSet);
};

export const resolveWindow = (max: number, index: number): { left: number; right: number } => {
  const out: { left: number; right: number } = { left: -1, right: -1 };

  if (index === 0) {
    out.left = 1;
  } else if (index === max) {
    out.left = max - 1;
  } else {
    out.left = index - 1;
  }

  if (index === 0) {
    out.right = 2;
  } else if (index === max) {
    out.right = max - 1;
    out.left = max - 2;
  } else {
    out.right = index + 1;
  }
  return out;
};

// console.log(resolveWindow(0, 2, 0));
// console.log(resolveWindow(0, 2, 1));
// console.log(resolveWindow(0, 2, 2));
// console.log('-------------------------')
// console.log(resolveWindow(0, 3, 0));
// console.log(resolveWindow(0, 3, 1));
// console.log(resolveWindow(0, 3, 2));
// console.log(resolveWindow(0, 3, 3));

export const generateTrainingData = (line: string): WindowTrainData[] => {
  const items = line.split(' ');

  const results: WindowTrainData[] = [];

  for (let i = 0; i < items.length; i++) {
    const resolveNabours = resolveWindow(items.length - 1, i);

    results.push({
      data: items[i],
      left: items[resolveNabours.left],
      right: items[resolveNabours.right],
    });
  }

  return results;
};

export const transformCartToTraining = (
  cartItem: ICartSave,
  lookup: { [id: string]: number },
): TrainData[] => {
  const result: TrainData[] = [];

  cartItem.products.forEach((x, i) => {
    for (let index = 0; index < cartItem.products.length; index++) {
      const label = cartItem.products[index];
      if (i !== index) {
        result.push({
          data: lookup[x.productCode],
          label: lookup[label.productCode],
        });
      }
    }
  });

  return result;
};
