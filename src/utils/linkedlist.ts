export class ListNode<T> {
  public value: T;
  public next: ListNode<T> | null = null;
  public prev: ListNode<T> | null = null;

  constructor(value: T) {
    this.value = value;
  }
}

export class LinkedList<T> {
  head: ListNode<T> | null = null;
  tail: ListNode<T> | null = null;

  append(value: T): void {
    const newNode = new ListNode(value);

    if (!this.head) {
      this.head = newNode;
      this.tail = newNode;
    } else {
      newNode.prev = this.tail;
      this.tail!.next = newNode;
      this.tail = newNode;
    }
  }

  prepend(value: T): void {
    const newNode = new ListNode(value);

    if (!this.head) {
      this.head = newNode;
      this.tail = newNode;
    } else {
      newNode.next = this.head;
      this.head!.prev = newNode;
      this.head = newNode;
    }
  }

  delete(value: T): void {
    let current = this.head;

    while (current) {
      if (current.value === value) {
        if (current.prev) {
          current.prev.next = current.next;
        } else {
          this.head = current.next;
        }

        if (current.next) {
          current.next.prev = current.prev;
        } else {
          this.tail = current.prev;
        }

        return;
      }

      current = current.next;
    }
  }

  search(value: T): ListNode<T> | null {
    let current = this.head;

    while (current) {
      if (current.value === value) {
        return current;
      }

      current = current.next;
    }

    return null;
  }

  contains(value: T): boolean {
    return !!this.search(value);
  }

  mapToArray<U>(transform: (value: T, index: number) => U): Array<U> {
    const result = new Array<U>();
    let current = this.head;
    let index = 0;

    while (current) {
      const transformedValue = transform(current.value, index);
      result.push(transformedValue);
      current = current.next;
      index++;
    }

    return result;
  }
}
