export function extendArray<T>(array: Array<T>, elements: Array<T>): Array<T> {
  let set = new Set<T>();

  for (let i = 0; i < array.length; i++) {
    set.add(array[i]);
  }

  for (let i = 0; i < elements.length; i++) {
    set.add(elements[i]);
  }

  return set.values();
}

export function reduceArray<T>(array: Array<T>, elements: Array<T>): Array<T> {
  let set = new Set<T>();
  
  for (let i = 0; i < array.length; i++) {
    set.add(array[i]);
  }

  for (let i = 0; i < elements.length; i++) {
    set.delete(elements[i]);
  }

  return set.values();
}

export function upcastCopy<T extends V, V>(array: Array<T>): Array<V> {
  let newArr = new Array<V>();

  for (let i = 0; i < array.length; i++) {
    newArr.push(array[i]);
  }

  return newArr;
}
