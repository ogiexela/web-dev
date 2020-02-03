const config = {
    HATCHWAY_POSTS_API_URL: `dummy`,
    ACCEPTABLE_SORT_BY_FIELDS: ['id', 'reads', 'likes', 'popularity'],
    ACCEPTABLE_SORTY_DIRECTIONS: ['desc', 'asc'],
    DEFAULT_SORT_BY_FIELD: 'id',
    DEFAULT_SORT_DIRECTION: 'asc',
    cache: {},
};

jest.mock('axios');

const axios = require('axios');

const handleGetPosts = require('./get_posts')(config);

describe('test get posts end point', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    test('should return error when query.tags is missing', (done) => {
        handleGetPosts({ query: {} }, {
            status: (code) => {
                return {
                    send: (response) => {
                        expect(code).toBe(400);
                        expect(JSON.stringify(response)).toBe(JSON.stringify({ error: 'Tags parameter is required' }));
                        done();
                    }
                }
            }
        })
    });
    test('should return error when query.tags is empty string', (done) => {
        handleGetPosts({ query: { tags: '' } }, {
            status: (code) => {
                return {
                    send: (response) => {
                        expect(code).toBe(400);
                        expect(JSON.stringify(response)).toBe(JSON.stringify({ error: 'Tags parameter is required' }));
                        done();
                    }
                }
            }
        })
    });
    test('should return error when query.sortBy value is not valid', (done) => {
        handleGetPosts({ query: { tags: 'tech', sortBy: 'foo' } }, {
            status: (code) => {
                return {
                    send: (response) => {
                        expect(code).toBe(400);
                        expect(JSON.stringify(response)).toBe(JSON.stringify({ error: 'sortBy parameter is invalid' }));
                        done();
                    }
                }
            }
        })
    });
    test('should return error when query.direction value is not valid', (done) => {
        handleGetPosts({ query: { tags: 'tech', direction: 'foo' } }, {
            status: (code) => {
                return {
                    send: (response) => {
                        expect(code).toBe(400);
                        expect(JSON.stringify(response)).toBe(JSON.stringify({ error: 'direction parameter is invalid' }));
                        done();
                    }
                }
            }
        })
    });

    test('should call api for valid query', (done) => {
        const data = {
            "posts": [
                {
                    "author": "Rylee Paul",
                    "authorId": 9,
                    "id": 1,
                    "likes": 960,
                    "popularity": 0.13,
                    "reads": 50361,
                    "tags": [
                        "tech",
                        "health"
                    ]
                },
            ]
        };

        axios.get.mockReturnValue(Promise.resolve({ data }));

        handleGetPosts(
            { url: Math.random(), query: { tags: 'tech', direction: 'asc' } },
            {
                send: (response) => {
                    expect(JSON.stringify(response)).toBe(JSON.stringify(data));
                    done();
                }
            }
        );
    });
    test('should return a set (no duplicate posts)', (done) => {
        const data = {
            "posts": [
                {
                    "author": "2Rylee Paul",
                    "authorId": 9,
                    "id": 1,
                    "likes": 960,
                    "popularity": 0.13,
                    "reads": 50361,
                    "tags": [
                        "tech",
                        "health"
                    ]
                },
            ]
        };

        axios.get.mockReturnValue(Promise.resolve({ data }));

        handleGetPosts(
            { url: Math.random(), query: { tags: 'tech,health', direction: 'asc' } },
            {
                send: (response) => {
                    expect(JSON.stringify(response)).toBe(JSON.stringify(data));
                    done();
                }
            }
        );
    });

    test('should return a sorted result asc', (done) => {
        const data = {
            "posts": [
                {
                    "author": "Alex",
                    "authorId": 9,
                    "id": 1,
                    "likes": 960,
                    "popularity": 0.13,
                    "reads": 50361,
                    "tags": [
                        "tech",
                        "health"
                    ]
                },
                {
                    "author": "Bob",
                    "authorId": 9,
                    "id": 2,
                    "likes": 960,
                    "popularity": 0.13,
                    "reads": 50361,
                    "tags": [
                        "tech",
                        "health"
                    ]
                },
            ]
        };

        axios.get.mockReturnValue(Promise.resolve({ data }));

        handleGetPosts(
            { url: Math.random(), query: { tags: 'tech,health', sortBy: 'id', direction: 'asc' } },
            {
                send: (response) => {
                    expect(JSON.stringify(response)).toBe(JSON.stringify(data));
                    done();
                }
            }
        );
    });

    test('should return a sorted result desc', (done) => {
        const data = {
            "posts": [
                {
                    "author": "Alex",
                    "authorId": 9,
                    "id": 1,
                    "likes": 960,
                    "popularity": 0.13,
                    "reads": 50361,
                    "tags": [
                        "tech",
                        "health"
                    ]
                },
                {
                    "author": "Bob",
                    "authorId": 9,
                    "id": 2,
                    "likes": 960,
                    "popularity": 0.13,
                    "reads": 50361,
                    "tags": [
                        "tech",
                        "health"
                    ]
                },
            ]
        };

        const expectedData = {
            "posts": [
                {
                    "author": "Bob",
                    "authorId": 9,
                    "id": 2,
                    "likes": 960,
                    "popularity": 0.13,
                    "reads": 50361,
                    "tags": [
                        "tech",
                        "health"
                    ]
                },
                {
                    "author": "Alex",
                    "authorId": 9,
                    "id": 1,
                    "likes": 960,
                    "popularity": 0.13,
                    "reads": 50361,
                    "tags": [
                        "tech",
                        "health"
                    ]
                },
            ]
        };

        axios.get.mockReturnValue(Promise.resolve({ data }));

        handleGetPosts(
            { url: Math.random(), query: { tags: 'tech,health', sortBy: 'id', direction: 'desc' } },
            {
                send: (response) => {
                    expect(JSON.stringify(response)).toBe(JSON.stringify(expectedData));
                    done();
                }
            }
        );
    });

    test('should return a cached result for same url', (done) => {
        const data = {
            "posts": [
                {
                    "author": "2Rylee Paul",
                    "authorId": 9,
                    "id": 1,
                    "likes": 960,
                    "popularity": 0.13,
                    "reads": 50361,
                    "tags": [
                        "tech",
                        "health"
                    ]
                },
            ]
        };

        const getFunction = jest.fn(() => Promise.resolve({ data }));
        axios.get = getFunction;

        handleGetPosts(
            { url: 'this should be cached', query: { tags: 'tech,health', direction: 'asc' } },
            {
                send: () => {
                    handleGetPosts(
                        { url: 'this should be cached', query: { tags: 'tech,health', direction: 'asc' } },
                        {
                            send: () => {
                                handleGetPosts(
                                    { url: 'this should be cached', query: { tags: 'tech,health', direction: 'asc' } },
                                    {
                                        send: () => {
                                            handleGetPosts(
                                                { url: 'this should be cached', query: { tags: 'tech,health', direction: 'asc' } },
                                                {
                                                    send: (response) => {
                                                        expect(JSON.stringify(response)).toBe(JSON.stringify(data));
                                                        expect(getFunction).toHaveBeenCalledTimes(2);
                                                        done();
                                                    }
                                                }
                                            );
                                        }
                                    }
                                );
                            }
                        }
                    );
                }
            }
        );
    });
});
