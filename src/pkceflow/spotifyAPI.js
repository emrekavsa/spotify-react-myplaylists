export function generateCodeVerifier(length = 128) {
  let text = "";
  const possible =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  for (let i = 0; i < length; i++) {
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  }
  return text;
}

export async function generateCodeChallenge(codeVerifier) {
  const data = new TextEncoder().encode(codeVerifier);
  const digest = await window.crypto.subtle.digest("SHA-256", data);
  return btoa(String.fromCharCode(...new Uint8Array(digest)))
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "");
}

export async function redirectToAuthCodeFlow(clientId, redirectUri, scope) {
  const verifier = generateCodeVerifier(128);
  const challenge = await generateCodeChallenge(verifier);
  localStorage.setItem("verifier", verifier);

  const params = new URLSearchParams();
  params.append("client_id", clientId);
  params.append("response_type", "code");
  params.append("redirect_uri", redirectUri);
  params.append("scope", scope);
  params.append("code_challenge_method", "S256");
  params.append("code_challenge", challenge);

  document.location = `https://accounts.spotify.com/authorize?${params}`;
}

export async function getAccessToken(clientId, code, redirectUri) {
  const verifier = localStorage.getItem("verifier");

  const params = new URLSearchParams();
  params.append("client_id", clientId);
  params.append("grant_type", "authorization_code");
  params.append("code", code);
  params.append("redirect_uri", redirectUri);
  params.append("code_verifier", verifier);

  const result = await fetch("https://accounts.spotify.com/api/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: params,
  });

  const { access_token } = await result.json();
  return access_token;
}

const fetchSpotify = (url, token) =>
  fetch(url, { headers: { Authorization: `Bearer ${token}` } }).then((res) =>
    res.json()
  );

const endpoint = {
  profile: "https://api.spotify.com/v1/me",
  playlists: "https://api.spotify.com/v1/me/playlists",
};

export const fetchUserProfile = (token) =>
  fetchSpotify(endpoint.profile, token);
export const fetchUserPlaylists = (token) =>
  fetchSpotify(endpoint.playlists, token);
export const fetchPlaylistTracks = (url, token) => fetchSpotify(url, token);

const songFrame = (tracksData) =>
  tracksData.items
    .filter((item) => item.track)
    .map((item) => ({
      name: item.track.name,
      artist: item.track.artists?.[0]?.name || "",
      albumImage: item.track.album?.images?.[0]?.url,
      url: item.track.external_urls.spotify,
    }));

const playlistFrame = (playlist, tracks) => ({
  name: playlist.name,
  image: playlist.images?.[0]?.url,
  url: playlist.external_urls.spotify,
  tracks,
});

export const fetchAllUserData = (token) => {
  return Promise.all([fetchUserProfile(token), fetchUserPlaylists(token)]).then(
    ([userProfile, playlistsData]) => {
      if (!playlistsData.items?.length) {
        return {
          username: userProfile.display_name,
          profileUrl: userProfile.external_urls?.spotify,
          playlists: [],
        };
      }

      return Promise.all(
        playlistsData.items.map((playlist) =>
          fetchPlaylistTracks(playlist.tracks.href, token).then((tracksData) =>
            playlistFrame(playlist, songFrame(tracksData))
          )
        )
      ).then((playlistsWithTracks) => ({
        username: userProfile.display_name,
        profileUrl: userProfile.external_urls?.spotify,
        playlists: playlistsWithTracks,
      }));
    }
  );
};
