import { Cache } from '@helpers/cache'

describe('Cache methods tests', () => {
    it('should set, get, del and flush all cache keys', async () => {
        const cache = new Cache()
        cache.set('key', 'value', 90)

        expect(await cache.get('key')).toBe('value')

        cache.del('key')
        expect(await cache.get('key')).toBe(undefined)

        await cache.set('key', 'value', 90)
        await cache.flushAll()

        expect(await cache.get('key')).toBe(undefined)
    })
})
