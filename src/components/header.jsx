export default function Header({ username, profileUrl }) {
  return (
    <header className="header">
      <img
        className="headerlogo"
        src="https://upload.wikimedia.org/wikipedia/commons/thumb/2/26/Spotify_logo_with_text.svg/2560px-Spotify_logo_with_text.svg.png"
      />
      <h1 className="welcomeback">
        Welcome back
        <a href={profileUrl} target="_blank" className="username-link">
          <span className="username"> {username}</span>
        </a>
      </h1>
    </header>
  );
}
