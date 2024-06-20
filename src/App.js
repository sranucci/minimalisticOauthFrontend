import React, { useState } from 'react';
import { initializeApp } from 'firebase/app';
import { getAuth, signInWithPopup, GoogleAuthProvider, GithubAuthProvider } from 'firebase/auth';

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyB84lGRGJZgQ-9m_0f3Kn6E2YWskqIsQ3Y",
  authDomain: "fir-auth-graphql-2d4eb.firebaseapp.com",
  projectId: "fir-auth-graphql-2d4eb",
  storageBucket: "fir-auth-graphql-2d4eb.appspot.com",
  messagingSenderId: "623336785373",
  appId: "1:623336785373:web:a72b6b38ac1579c19ca234"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Get a reference to the auth service
const auth = getAuth(app);

// Create instances of the provider objects
const googleProvider = new GoogleAuthProvider();
const githubProvider = new GithubAuthProvider();

function App() {
  const [token, setToken] = useState(null);
  const [provider, setProvider] = useState('google');

  const handleSignIn = () => {
    let selectedProvider;

    switch (provider) {
      case 'google':
        selectedProvider = googleProvider;
        break;
      case 'github':
        selectedProvider = githubProvider;
        break;
      default:
        selectedProvider = googleProvider;
    }

    signInWithPopup(auth, selectedProvider)
      .then(async (result) => {
        const user = result.user;
        const userIdToken = await user.getIdToken();
        console.log('User Info:', user);
        console.log('Token:', userIdToken);
        setToken(userIdToken);
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        const email = error.customData.email;
        const credential = error.credential;
        console.error('Error during sign-in:', errorCode, errorMessage, email, credential);
      });
  };

  const handleCopyToken = () => {
    if (token) {
      navigator.clipboard.writeText(token).then(() => {
        alert('Token copied to clipboard!');
      }).catch((error) => {
        console.error('Failed to copy token: ', error);
      });
    }
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>Firebase Sign-In</h1>
        <select value={provider} onChange={(e) => setProvider(e.target.value)}>
          <option value="google">Google</option>
          <option value="github">GitHub</option>
        </select>
        <button onClick={handleSignIn}>
          {provider === 'google' && <i className="fab fa-google"></i>}
          {provider === 'github' && <i className="fab fa-github"></i>}
          Sign In with {provider.charAt(0).toUpperCase() + provider.slice(1)}
        </button>
        <hr/>
        {token && <button onClick={handleCopyToken}>
          COPY JWT
        </button>}

        {token && (
          <div>
            <div className="token">
              <h2>Your Token:</h2>
              <p>{token}</p>
            </div>
          </div>
        )}
      </header>
    </div>
  );
}

export default App;
