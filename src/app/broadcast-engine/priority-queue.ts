import { NGXLogger } from 'ngx-logger';

export class PriorityQueue<T> {

    private data: Map<number, T[]> = new Map<number, T[]>();

    constructor(
        private logger: NGXLogger,
    ) { }

    // pushes item into the priority queue
    enqueue(item: T, priority: number) {
        if (this.data.has(priority)) {
            this.data.get(priority).push(item);
        } else {
            this.data.set(priority, [item]);
        }
    }

    // pops the highest priority item that's been in the queue the longest
    dequeue(): { item: T, priority: number } {
        const front = this.peek();
        if (!!front) {
            this.data.get(front.priority).shift();
            if (this.data.get(front.priority).length === 0) {
                this.data.delete(front.priority);
            }
        }
        return front;
    }

    // returns highest priority item that's been in the queue the longest
    // without modifying the queue
    peek(): { item: T, priority: number } {
        if (this.data.size === 0) { return null; }
        const keys: number[] = Array.from(this.data.keys());
        const maxKey: number = keys.reduce((a, b) => Math.max(a, b));
        const item: T = this.data.get(maxKey)[0];
        return { item: item, priority: maxKey };
    }

    get size(): number {
        let count = 0;
        this.data.forEach((value, key) => {
            count += value.length;
        });
        return count;
    }

    get nbuckets(): number {
        return this.data.size;
    }

    forEachBucket(callback: (bucket: number, contents: T[]) => void) {
        const keys = Array.from(this.data.keys()).sort((a, b) => b - a); // descending
        keys.forEach((i: number) => {
            callback(i, this.data.get(i));
        });
    }

    remove(priority: number, exclude: (value: T, index: number, array: T[]) => boolean) {
        const array: T[] = this.data.get(priority);
        if (!array) {
            this.logger.error('not supposed to happen');
            return;
        }
        const index: number = array.findIndex(exclude);
        if (index === -1) { return; }
        array.splice(index, 1);
        if (array.length === 0) {
            this.data.delete(priority);
        }
    }
}
