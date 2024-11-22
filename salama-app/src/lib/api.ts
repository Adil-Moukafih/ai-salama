const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api/v1";

export interface Camera {
  id?: number;
  name: string;
  location: string;
  rtsp_url: string;
  status?: string;
}

export async function fetchData(endpoint: string) {
  try {
    console.log(`Fetching URL: ${API_BASE_URL}${endpoint}`);

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout

    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`Fetch error: ${response.status} - ${errorText}`);
      throw new Error(
        `HTTP error! status: ${response.status}, message: ${errorText}`
      );
    }

    return response.json();
  } catch (error) {
    console.error("Detailed fetch error:", error);

    if (error instanceof TypeError) {
      if (error.message === "Failed to fetch") {
        throw new Error(
          "Network error. Please check your connection and server status."
        );
      }
    }

    throw error;
  }
}

export async function getCameras(skip = 0, limit = 100) {
  try {
    const response = await fetch(
      `${API_BASE_URL}/cameras/?skip=${skip}&limit=${limit}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`Get cameras error: ${response.status} - ${errorText}`);
      throw new Error(
        `HTTP error! status: ${response.status}, message: ${errorText}`
      );
    }

    const data = await response.json();
    console.log("Cameras fetched:", data);
    return data;
  } catch (error) {
    console.error("Complete get cameras error:", error);

    if (error instanceof TypeError) {
      if (error.message === "Failed to fetch") {
        throw new Error(
          "Network error. Unable to connect to the server. Please check your connection."
        );
      }
    }

    throw error;
  }
}

export async function getCamera(id: number) {
  try {
    const response = await fetch(`${API_BASE_URL}/cameras/${id}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(
        `HTTP error! status: ${response.status}, message: ${errorText}`
      );
    }

    return response.json();
  } catch (error) {
    console.error("Get camera error:", error);
    throw error;
  }
}

export async function getCameraSnapshot(id: number) {
  try {
    const response = await fetch(`${API_BASE_URL}/cameras/${id}/snapshot`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(
        `HTTP error! status: ${response.status}, message: ${errorText}`
      );
    }

    return response.blob();
  } catch (error) {
    console.error("Get camera snapshot error:", error);
    throw error;
  }
}

export async function createCamera(camera: Omit<Camera, "id">) {
  try {
    const response = await fetch(`${API_BASE_URL}/cameras/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(camera),
      credentials: "include",
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(
        `HTTP error! status: ${response.status}, message: ${errorText}`
      );
    }

    return response.json();
  } catch (error) {
    console.error("Create camera error:", error);
    throw error;
  }
}

export async function updateCamera(id: number, camera: Omit<Camera, "id">) {
  try {
    const response = await fetch(`${API_BASE_URL}/cameras/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(camera),
      credentials: "include",
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(
        `HTTP error! status: ${response.status}, message: ${errorText}`
      );
    }

    return response.json();
  } catch (error) {
    console.error("Update camera error:", error);
    throw error;
  }
}

export async function deleteCamera(id: number) {
  try {
    const response = await fetch(`${API_BASE_URL}/cameras/${id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(
        `HTTP error! status: ${response.status}, message: ${errorText}`
      );
    }

    return response.json();
  } catch (error) {
    console.error("Delete camera error:", error);
    throw error;
  }
}

export async function getAlerts(skip = 0, limit = 10) {
  try {
    const response = await fetch(
      `${API_BASE_URL}/alerts/?skip=${skip}&limit=${limit}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`Get alerts error: ${response.status} - ${errorText}`);
      throw new Error(
        `HTTP error! status: ${response.status}, message: ${errorText}`
      );
    }

    const data = await response.json();
    console.log("Alerts fetched:", data);
    return data;
  } catch (error) {
    console.error("Complete get alerts error:", error);

    if (error instanceof TypeError) {
      if (error.message === "Failed to fetch") {
        throw new Error(
          "Network error. Unable to connect to the server. Please check your connection."
        );
      }
    }

    throw error;
  }
}
