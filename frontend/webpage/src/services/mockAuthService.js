export const authService = {
    login: async (email, password) => {
        return new Promise((resolve, reject) => {
            
            console.log(`[MockAuth] Attempting login for: ${email}`);

            setTimeout(() => {
                if ((email === 'admin@admin.com' && password === 'adminadmin') || email === 'test@test.com' && password === 'testtest' ) {
                    console.log('[MockAuth] Login Successful');
                    resolve("fake-jwt-token-xyz-123"); 
                } 
                else {
                    console.error('[MockAuth] Login Failed');
                    reject(new Error("Incorrect email or password"));
                }

            }, 1500); 
        });
    },

    logout: () => {
        localStorage.removeItem('authToken');
    }
};