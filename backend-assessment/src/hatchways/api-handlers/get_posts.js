const axios = require('axios');

const sort = (field, direction) => (a, b) => {
    switch (direction) {
        // this also handles non-numeric values
        case 'asc':
            if (a[field] > b[field]) {
                return 1;
            } else if (a[field] < b[field]) {
                return -1;
            } else {
                return 0
            }
        case 'desc':
            if (a[field] > b[field]) {
                return -1;
            } else if (a[field] < b[field]) {
                return 1;
            } else {
                return 0
            }
        default:
            return 0;
    }
};

const handleGetPosts = (config) => (req, res) => {
    const requestUrl = req.url;

    if (config.cache[requestUrl]) {
        res.send(config.cache[requestUrl]);
        return;
    }

    const query = req.query;

    if (!query.tags) {
        res.status(400).send({ error: 'Tags parameter is required' });
        return;
    }

    const tags = (query.tags).split(',') || [];
    const sortBy = query.sortBy || config.DEFAULT_SORT_BY_FIELD;
    const direction = query.direction || config.DEFAULT_SORT_DIRECTION;

    if (sortBy !== config.DEFAULT_SORT_BY_FIELD) {
        if (!config.ACCEPTABLE_SORT_BY_FIELDS.some(field => field === sortBy)) {
            res.status(400).send({ error: 'sortBy parameter is invalid' });
            return;
        }
    }

    if (direction !== config.DEFAULT_SORT_DIRECTION) {
        if (!config.ACCEPTABLE_SORTY_DIRECTIONS.some(dir => dir === direction)) {
            res.status(400).send({ error: 'direction parameter is invalid' });
            return;
        }
    }

    const postsRequests = tags
        .map(tag => {
            const apiurl = `${config.HATCHWAY_POSTS_API_URL}?tag=${tag}&sortBy=${sortBy}&direction=${direction} `;
            return axios
                .get(apiurl)
                .then(response => response.data)
                .then(data => (data.posts || []))
                //return an object with post.id as key and post as value eg. { 1: {id: 1, author: 'foobar'}}
                .then(posts => posts
                    .reduce((red, post) => {
                        red[post.id] = post;
                        return red;
                    }, {}));
        });

    Promise
        .all(postsRequests)
        // collect all posts results into a single object
        // this results in an object with no duplicated posts
        .then(posts => {
            return posts
                .reduce((red, element) => {
                    return { ...red, ...element };
                }, {});
        })
        .then(posts => Object.values(posts))
        // sort posts
        .then(posts => posts.sort(sort(sortBy, direction)))
        .then(posts => ({ posts }))
        .then(posts => {
            // cache the result and reply to the client
            config.cache[req.url] = posts;
            res.send(posts);
        })
        .catch(error => {
            console.error(error);
            res.status(500).send(error);
        });
};

module.exports = handleGetPosts;