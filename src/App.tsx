import { useEffect, useState } from 'react';

function App() {
  const [email, setEmail] = useState<string | null>(null);
  const isChromeExtension = typeof chrome !== 'undefined' && !!chrome?.storage?.local;

  const login = () => {
    if (isChromeExtension && chrome.runtime?.sendMessage) {
      chrome.runtime.sendMessage('LOGIN');
    } else {
      alert('OAuth login only works inside the extension popup.');
    }
  };

  const logout = () => {
    if (isChromeExtension) {
      chrome.storage.local.clear();
      setEmail(null);
    }
  };

  useEffect(() => {
    if (isChromeExtension) {
      chrome.storage.local.get(['user_email'], (res) => {
        if (res.user_email) {
          setEmail(res.user_email as string);
        }
      });
    }
  }, []);

  return (
    <div className="p-4 w-80 bg-white rounded-lg shadow text-sm font-sans">
      {email ? (
        <>
          <p className="mb-4 text-gray-700">
            Signed in as <strong className="text-blue-600">{email}</strong>
          </p>
          <button
            className="w-full py-2 bg-red-500 hover:bg-red-600 text-white rounded"
            onClick={logout}
          >
            Sign out
          </button>
        </>
      ) : (
        <button
          className="w-full py-2 bg-blue-600 hover:bg-blue-700 text-white rounded"
          onClick={login}
        >
          Sign in with Google
        </button>
      )}
    </div>
  );
}

export default App;
