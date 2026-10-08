// api.js
// Every call from the webpage to the C++ server goes through here.
// GET reads something; POST changes the cinema. Parameters travel in the URL query string.

export const EVENT = {
  VISIT: 1,
  COMPARE: 2,
  SWAP: 3,
  MOVE: 4,
  SET: 5,
  RANGE: 6,
  FOUND: 7,
  TAKE: 8,
  CELL: 9,
};

function buildUrl(path, params) {
  const url = new URL(path, window.location.origin);
  Object.entries(params || {}).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      url.searchParams.set(key, String(value));
    }
  });
  return url;
}

async function call(method, path, params) {
  let response;
  try {
    response = await fetch(buildUrl(path, params), { method });
  } catch (networkError) {
    const error = new Error("Cannot reach the C++ server. Is it running? (make run)");
    error.offline = true;
    throw error;
  }
  let body;
  try {
    body = await response.json();
  } catch (parseError) {
    throw new Error(`Server sent something that is not JSON (HTTP ${response.status})`);
  }
  if (!response.ok && body && body.ok === false) {
    const error = new Error(body.message || `HTTP ${response.status}`);
    error.body = body;
    throw error;
  }
  return body;
}

export const api = {
  get: (path, params) => call("GET", path, params),
  post: (path, params) => call("POST", path, params),

  info: () => call("GET", "/api/info"),
  state: () => call("GET", "/api/state"),
  reset: () => call("POST", "/api/reset"),
  source: (module) => call("GET", "/api/source", { module }),
};
