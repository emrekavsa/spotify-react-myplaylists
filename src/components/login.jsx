export default function Login({ onLogin }) {
  return (
    <div className="buttoncontainer">
      <button className="loginbutton" onClick={onLogin}>
        Login using spotify
      </button>
    </div>
  );
}
