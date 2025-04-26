async function makeRequest(endpoint, method, data) {
    try {
        const response = await fetch(`${config.API_BASE_URL}${endpoint}`, {
            method,
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify(data)
        });

        const responseData = await response.json();

        if (!response.ok) {
            // Handle MongoDB-specific errors
            if (responseData.code === 11000) {
                throw new Error('This email or username is already registered');
            }
            throw new Error(responseData.message || 'An error occurred');
        }

        return responseData;
    } catch (error) {
        console.error('API Error:', error);
        throw error;
    }
}

// Validation functions
const validate = {
    email(email) {
        return config.VALIDATION.EMAIL_REGEX.test(email);
    },
    phone(phone) {
        return config.VALIDATION.PHONE_REGEX.test(phone);
    },
    password(password) {
        return password.length >= config.VALIDATION.PASSWORD_MIN_LENGTH;
    }
};

// Auth related functions
const auth = {
    async register(userData) {
        // Validate data before sending
        if (!validate.email(userData.email)) {
            throw new Error('Please enter a valid email address');
        }
        if (!validate.phone(userData.phone)) {
            throw new Error('Please enter a valid phone number');
        }
        if (!validate.password(userData.password)) {
            throw new Error(`Password must be at least ${config.VALIDATION.PASSWORD_MIN_LENGTH} characters long`);
        }

        return makeRequest(config.ENDPOINTS.REGISTER, 'POST', userData);
    },

    async login(credentials) {
        if (!validate.email(credentials.email)) {
            throw new Error('Please enter a valid email address');
        }
        return makeRequest(config.ENDPOINTS.LOGIN, 'POST', credentials);
    },

    async forgotPassword(data) {
        if (data.method === 'email' && !validate.email(data.email)) {
            throw new Error('Please enter a valid email address');
        }
        if (data.method === 'phone' && !validate.phone(data.phone)) {
            throw new Error('Please enter a valid phone number');
        }
        return makeRequest(config.ENDPOINTS.FORGOT_PASSWORD, 'POST', data);
    }
}; 