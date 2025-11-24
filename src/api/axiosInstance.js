const API_BASE_URL = "http://localhost:5000";

class ApiClient {
  async request(endpoint, options = {}) {
    const config = {
      headers: { "Content-Type": "application/json" },
      ...options,
    };

    try {
      const response = await fetch(`${API_BASE_URL}${endpoint}`, config);
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `Error: ${response.status}`);
      }

      if (response.status === 204 || response.status === 205) {
        return null; // Return null or an empty object instead of parsing JSON
      }
      return await response.json();
    } catch (error) {
      console.error(`API Call Failed [${endpoint}]:`, error);
      throw error;
    }
  }

  get(endpoint, options = {}) {
    // Handle query parameters
    if (options.params) {
      const queryString = new URLSearchParams(options.params).toString();
      endpoint = queryString ? `${endpoint}?${queryString}` : endpoint;
    }
    return this.request(endpoint, { method: "GET" });
  }
  post(endpoint, body) {
    return this.request(endpoint, {
      method: "POST",
      body: JSON.stringify(body),
    });
  }
  put(endpoint, body) {
    return this.request(endpoint, {
      method: "PUT",
      body: JSON.stringify(body),
    });
  }
  delete(endpoint) {
    return this.request(endpoint, { method: "DELETE" });
  }
}

export const api = new ApiClient();
