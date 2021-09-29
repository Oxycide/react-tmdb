import {
    SEARCH_BASE_URL,
    POPULAR_BASE_URL,
    API_URL,
    API_KEY,
    REQUEST_TOKEN_URL,
    LOGIN_URL,
    SESSION_ID_URL
} from './config';

const defaultConfig = {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json'
    }
};

const apiSettings = {
    fetchMovies: async (searchTerm, page) => {
        const endpoint = searchTerm
            ? `${SEARCH_BASE_URL}${searchTerm}&page=${page}`
            : `${POPULAR_BASE_URL}&page=${page}`;
        const movies = await fetch(endpoint);
        return movies.json();
    },
    fetchMovie: async movieId => {
        const endpoint = `${API_URL}movie/${movieId}?api_key=${API_KEY}`;
        const movie = await fetch(endpoint);
        return movie.json();
    },
    fetchCredits: async movieId => {
        const creditsEndpoint = `${API_URL}movie/${movieId}/credits?api_key=${API_KEY}`;
        const credit = await fetch(creditsEndpoint);
        return credit.json();
    },
    // Bonus material below for login
    getRequestToken: async () => {
        const reqToken = await (await fetch(REQUEST_TOKEN_URL)).json();
        return reqToken.request_token;
    },
    authenticate: async (requestToken, username, password) => {
        const bodyData = {
            username,
            password,
            request_token: requestToken
        };
        // First authenticate the requestToken
        const data = await (
            await fetch(LOGIN_URL, {
                ...defaultConfig,
                body: JSON.stringify(bodyData)
            })
        ).json();
        // Then get the sessionId with the requestToken
        if (data.success) {
            const sessionId = await fetch(SESSION_ID_URL, {
                ...defaultConfig,
                body: JSON.stringify({request_token: requestToken})
            });
            return sessionId.json();
        }
    },
    rateMovie: async (sessionId, movieId, value) => {
        const endpoint = `${API_URL}movie/${movieId}/rating?api_key=${API_KEY}&session_id=${sessionId}`;

        const rating = fetch(endpoint, {
            ...defaultConfig,
            body: JSON.stringify({value})
        });

        return rating.json();
    }
};

export default apiSettings;
