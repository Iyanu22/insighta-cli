const http = require("http");
const { exec } = require("child_process");
const axios = require("axios");
const chalk = require("chalk");
const { saveCredentials, API_URL } = require("../lib/config");

function openBrowser(url) {
  const platform = process.platform;
  if (platform === "win32") exec(`start "" "${url}"`);
  else if (platform === "darwin") exec(`open "${url}"`);
  else exec(`xdg-open "${url}"`);
}

module.exports = async function login() {
  console.log(chalk.blue("Starting login..."));

  const server = http.createServer(async (req, res) => {
    try {
      const url = new URL(req.url, "http://localhost:9876");
      if (url.pathname !== "/callback") {
        res.end("OK");
        return;
      }

      const code = url.searchParams.get("code");
      if (!code) {
        res.end("No code received");
        server.close();
        return;
      }

      res.end(`
        <html><body style="font-family:sans-serif;text-align:center;padding:50px">
          <h2>Login successful!</h2>
          <p>You can close this tab and return to the terminal.</p>
        </body></html>
      `);

      // const response = await axios.get(
      //   `${API_URL}/auth/github/callback?code=${code}`
      // );
        console.log("Got code:", code);
console.log("Calling backend:", `${API_URL}/auth/github/callback?code=${code}`);
const response = await axios.get(
  `${API_URL}/auth/github/callback?code=${code}`
);
console.log("Backend response:", JSON.stringify(response.data));
      const { access_token, refresh_token, user } = response.data;
      saveCredentials({ access_token, refresh_token, user });
      console.log(chalk.green(`Logged in as @${user.username} (${user.role})`));
    } catch (err) {
      console.log(chalk.red("Login failed: " + err.message));
    }

    server.close();
  });

  server.listen(9876, () => {
    console.log(chalk.blue("Opening GitHub login in your browser..."));
    const params = new URLSearchParams({
  client_id: "Ov23liapFKh7Rbc8WyGm",
  redirect_uri: "http://localhost:9876/callback",
  scope: "user:email",
});
openBrowser(`https://github.com/login/oauth/authorize?${params}`);
  });
};