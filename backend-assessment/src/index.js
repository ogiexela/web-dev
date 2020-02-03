const express = require("express");

const app = express();

const PORT = process.env.PORT || 3000;
const HATCHWAY_HOST = process.env.HATCHWAY_HOST || 'hatchways.io';
const HATCHWAY_PORT = process.env.HATCHWAY_PORT || 80;
const HATCHWAY_PROTOCOL = process.env.HATCHWAY_PROTOCOl || 'https';
const HATCHWAY_PORT_STRING = HATCHWAY_PORT !== 80 ? `:${HATCHWAY_PORT}` : '';

const config = {
    HATCHWAY_POSTS_API_URL: `${HATCHWAY_PROTOCOL}://${HATCHWAY_HOST}${HATCHWAY_PORT_STRING}/api/assessment/blog/posts`,
    ACCEPTABLE_SORT_BY_FIELDS: ['id', 'reads', 'likes', 'popularity'],
    ACCEPTABLE_SORTY_DIRECTIONS: ['desc', 'asc'],
    DEFAULT_SORT_BY_FIELD: 'id',
    DEFAULT_SORT_DIRECTION: 'asc',
    cache: {},
};

const handleGetPosts = require('./hatchways/api-handlers/get_posts')(config);
const handleGetPing = require('./hatchways/api-handlers/get_ping');

app.get('/api/ping', handleGetPing);
app.get('/api/posts', handleGetPosts);

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT} `);
});