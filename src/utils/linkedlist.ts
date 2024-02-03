export class ListNode<T> {
  data: T;
  next: ListNode<T> | null;

  constructor(data: T) {
    this.data = data;
    this.next = null;
  }
}

export class LinkedList<T> {
  head: ListNode<T> | null;
  tail: ListNode<T> | null;

  constructor() {
    this.head = null;
    this.tail = null;
  }

  append(data: T): void {
    const newNode = new ListNode(data);

    if (!this.head) {
      this.head = newNode;
      this.tail = newNode;
    } else {
      this.tail!.next = newNode;
      this.tail = newNode;
    }
  }

  prepend(data: T): void {
    const newNode = new ListNode(data);

    if (!this.head) {
      this.head = newNode;
      this.tail = newNode;
    } else {
      newNode.next = this.head;
      this.head = newNode;
    }
  }

  delete(value: T): void {
    if (!this.head) {
      return;
    }

    if (this.head.data === value) {
      this.head = this.head.next;
      if (!this.head) {
        this.tail = null;
      }
      return;
    }

    let current = this.head;
    while (current.next && current.next.data !== value) {
      current = current.next;
    }

    if (current.next) {
      current.next = current.next.next;
      if (!current.next) {
        this.tail = current;
      }
    }
  }

  contains(value: T): boolean {
    let current = this.head;
    while (current) {
      if (current.data === value) {
        return true;
      }
      current = current.next;
    }
    return false;
  }

  print(): void {
    let current = this.head;
    while (current) {
      console.log(current.data);
      current = current.next;
    }
  }
}
