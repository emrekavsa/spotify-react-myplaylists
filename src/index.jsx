import { createRoot } from "react-dom/client";
import App from "./App.jsx";

const clientId = "b2438f09286046e7952f9170c182ffaf";
const redirectUri = "http://127.0.0.1:5173";
const scope = "user-read-private user-read-email playlist-read-private playlist-read-collaborative";

createRoot(document.getElementById("root")).render(
  <App clientId={clientId} redirectUri={redirectUri} scope={scope} />
);
