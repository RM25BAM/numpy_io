import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
let app;
let authInstance;
async function fetchFirebaseConfig() {
    const response = await fetch('http://127.0.0.1:8000/firebase-config', {
        headers: { Authorization: 'test123' }
    });

    if (!response.ok) {
        console.error("Fetch Error:", response.statusText);
        throw new Error('Failed to fetch Firebase configuration');
    }

    const config = await response.json();
    console.log("Fetched Firebase Config:", config);
    return config;
}
export async function initializeFirebase() {
    if (!app) {
        try {
            const firebaseConfig = await fetchFirebaseConfig();
            app = initializeApp(firebaseConfig);
            authInstance = getAuth(app);
            console.log("Firebase initialized successfully");
        } catch (error) {
            console.error('Failed to initialize Firebase:', error.message);
            throw error;
        }
    }
    return { app, auth: authInstance };
}
export const getAuthInstance = () => {
    if (!authInstance) {
        throw new Error("Firebase Auth instance is not initialized. Call initializeFirebase first.");
    }
    return authInstance;
};


// // Import the functions you need from the SDKs you need
// import { initializeApp } from "firebase/app";
// import { getAnalytics } from "firebase/analytics";
// import { getAuth } from "firebase/auth";
// // TODO: Add SDKs for Firebase products that you want to use
// // https://firebase.google.com/docs/web/setup#available-libraries

// // Your web app's Firebase configuration
// // For Firebase JS SDK v7.20.0 and later, measurementId is optional
// const firebaseConfig = {
//     apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
//     authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
//     projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
//     storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
//     messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
//     appId: process.env.REACT_APP_FIREBASE_APP_ID,
//     measurementId: process.env.REACT_APP_FIREBASE_MEASUREMENT_ID
// };

// // Initialize Firebase
// const app = initializeApp(firebaseConfig);
// export const auth = getAuth(app);
// export const analytics = getAnalytics(app);