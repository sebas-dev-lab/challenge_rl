import { ContextInterface, contextStore } from './context.interface';

export default abstract class ContextAbstract implements ContextInterface {
    store: contextStore;
    context_id: string;
    constructor(conn_id: string, store: contextStore) {
        this.context_id = conn_id;
        this.store = {
            ...store
        };
    }
    
    get_context_id(): string {
        return this.context_id;
    }

    get_all_store(): contextStore {
        return this.store;
    }

    get_store_by_key(key: string): any[] {
        return this.store[key];
    }
    get_store_key_size(key: string): number {
        return this.store[key].length;
    }
    set_store(data: contextStore): void {
        this.store = {
            ...this.store,
            ...data
        };
    }
    update_store(key: string, data: Array<any>): void {
        this.store[key] = data;
    }
}
