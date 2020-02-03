const handleGetPing = require('./get_ping');

describe('test get ping end point', () => {
    test('should reply with {success: true}', (done) => {
        handleGetPing(undefined, {
            send: (response) => {
                expect(JSON.stringify(response)).toBe(JSON.stringify({ success: true }));
                done();
            }
        })
    });
});
