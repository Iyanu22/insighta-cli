const axios = require("axios");
const jwt = require("jsonwebtoken");
const { getCredentials, saveCredentials, clearCredentials, API_URL } = require("./config");

function isTokenExpired(token) {
  try {
    const decoded = jwt.decode(token);
    if (!decoded || !decoded.exp) return true;
    return decoded.exp * 1000 < Date.now() + 10000; // 10 second buffer
  } catch {
    return true;
  }
}

async function getValidToken() {
  const creds = getCredentials();
  if (!creds) throw new Error("Not logged in. Run: insighta login");

  // If access token is still valid use it directly
  if (creds.access_token && !isTokenExpired(creds.access_token)) {
    return creds.access_token;
  }

  // Access token expired — try to refresh
  try {
    const response = await axios.post(
      `${API_URL}/auth/refresh`,
      { refresh_token: creds.refresh_token },
      { headers: { "Content-Type": "application/json" } }
    );

    const newCreds = {
      ...creds,
      access_token: response.data.access_token,
      refresh_token: response.data.refresh_token,
    };
    saveCredentials(newCreds);
    return newCreds.access_token;
  } catch (err) {
    const detail = err.response ? JSON.stringify(err.response.data) : err.message;
    clearCredentials();
    throw new Error(`Session expired (${detail}). Please run: insighta login`);
  }
}

async function apiRequest(method, path, data = null, params = null) {
  const creds = getCredentials();
  if (!creds) throw new Error("Not logged in. Run: insighta login");

  // Use stored token directly if valid
  let token = creds.access_token;
  if (isTokenExpired(token)) {
    token = await getValidToken();
  }

  try {
    const response = await axios({
      method,
      url: `${API_URL}${path}`,
      data,
      params,
      headers: {
        Authorization: `Bearer ${token}`,
        "X-API-Version": "1",
        "Content-Type": "application/json",
      },
    });
    return response.data;
  } catch (err) {
    const detail = err.response ? JSON.stringify(err.response.data) : err.message;
    throw new Error(detail);
  }
}

module.exports = { apiRequest, getValidToken };