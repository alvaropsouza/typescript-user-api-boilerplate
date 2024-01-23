import NodeCache from 'node-cache'

export class Cache {
    private nodeCache: NodeCache

    constructor() {
        this.nodeCache = new NodeCache()
    }

    async set(key: string, value: string, ttl?: number): Promise<void> {
        this.nodeCache.set(key, value, ttl)
    }

    async get(key: string): Promise<string | null> {
        return this.nodeCache.get<string>(key)
    }

    async del(key: string): Promise<void> {
        this.nodeCache.del(key)
    }

    async flushAll(): Promise<void> {
        this.nodeCache.flushAll()
    }
}
