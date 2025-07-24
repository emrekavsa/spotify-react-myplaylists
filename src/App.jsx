import { useState, useEffect } from "react";
import Header from "./components/header.jsx";
import Information from "./components/information.jsx";
import Login from "./components/login.jsx";
import {
  redirectToAuthCodeFlow,
  getAccessToken,
  fetchAllUserData,
} from "./pkceflow/spotifyAPI.js";

export default function App({ clientId, redirectUri, scope }) {
  const [userData, setUserData] = useState({
    token: null,
    username: "",
    profileUrl: "",
    playlists: [],
  });
  const [isActive, setIsActive] = useState(false);

  useEffect(() => {
    const code = new URLSearchParams(window.location.search).get("code");

    if (userData.token) {
      setIsActive(true);
      return;
    }

    if (!code) return;

    getAccessToken(clientId, code, redirectUri)
      .then((accessToken) => {
        setUserData((prev) => ({ ...prev, token: accessToken }));
        setIsActive(true);
        window.history.replaceState({}, document.title, "/");
      })
      .catch(() => setIsActive(false));
  }, [clientId, redirectUri, userData.token]);

  useEffect(() => {
    if (!userData.token) return;

    fetchAllUserData(userData.token)
      .then(({ username, profileUrl, playlists }) => {
        setUserData((prev) => ({
          ...prev,
          username,
          profileUrl,
          playlists,
        }));
      })
      .catch(() => setUserData((prev) => ({ ...prev, playlists: [] })));
  }, [userData.token]);

  return (
    <div>
      {isActive ? (
        <>
          <Header
            username={userData.username}
            profileUrl={userData.profileUrl}
          />
          <Information playlists={userData.playlists} />
        </>
      ) : (
        <Login
          onLogin={() => redirectToAuthCodeFlow(clientId, redirectUri, scope)}
        />
      )}
    </div>
  );
}
