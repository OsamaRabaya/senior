async function testConnection() {
    try {
        // Test register endpoint
        const testUser = {
            fullName: "Test User",
            email: "test@example.com",
            phone: "+1234567890",
            username: "testuser",
            password: "Test123!",
            confirmPassword: "Test123!"
        };

        const registerResponse = await fetch(`${config.API_BASE_URL}${config.ENDPOINTS.REGISTER}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(testUser)
        });

        console.log('Register endpoint status:', registerResponse.status);

        // Test login endpoint
        const loginResponse = await fetch(`${config.API_BASE_URL}${config.ENDPOINTS.LOGIN}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                email: "test@example.com",
                password: "Test123!"
            })
        });

        console.log('Login endpoint status:', loginResponse.status);

        if (registerResponse.ok && loginResponse.ok) {
            console.log('All endpoints are working correctly!');
        } else {
            console.error('Some endpoints are not responding correctly');
        }
    } catch (error) {
        console.error('Connection test failed:', error);
    }
}

// Run the test
testConnection(); 