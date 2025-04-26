const config = {
    API_BASE_URL: 'http://localhost:5000',
    ENDPOINTS: {
        REGISTER: '/api/auth/register',
        LOGIN: '/api/auth/login',
        FORGOT_PASSWORD: '/api/auth/forgot-password'
    },
    MONGODB: {
        COLLECTIONS: {
            USERS: 'users',
            SESSIONS: 'sessions'
        }
    },
    VALIDATION: {
        PASSWORD_MIN_LENGTH: 8,
        PHONE_REGEX: /^\+?[0-9]{10,15}$/,
        EMAIL_REGEX: /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    }
}; 