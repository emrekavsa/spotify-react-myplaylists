export default function Information({ playlists }) {
  if (!playlists)
    return <div className="loadingscreen">Loading playlists...</div>;

  return (
    <div>
      {playlists.map((playlist) => (
        <div key={playlist.url} className="playlist-container">
          <div className="playlist-card">
            <a
              href={playlist.url}
              target="_blank"
              className="playlist-image-link"
            >
              <img src={playlist.image} className="playlist-image" />
            </a>
            <h2 className="playlist-title">
              <span className="playlist-link">{playlist.name}</span>
            </h2>
          </div>

          {playlist.tracks.length > 0 && (
            <ul className="track-list">
              {playlist.tracks.map((track, j) => (
                <li key={track.url || j} className="track-card">
                  <a href={track.url} target="_blank">
                    <img className="track-album-image" src={track.albumImage} />
                  </a>
                  <span className="track-name">{track.name}</span>
                  <span className="track-artist">{track.artist}</span>
                </li>
              ))}
            </ul>
          )}
        </div>
      ))}
    </div>
  );
}
