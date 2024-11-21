import { useState, useEffect } from "react";
import {
  Camera,
  getCameras,
  createCamera,
  updateCamera,
  deleteCamera,
  getCameraSnapshot,
} from "@/lib/api";

export interface CameraWithSnapshot extends Camera {
  snapshot?: string;
  snapshotLoading?: boolean;
}

export function useCameras() {
  const [cameras, setCameras] = useState<CameraWithSnapshot[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchCameras = async () => {
    setLoading(true);
    setError(null);
    try {
      const fetchResult = await getCameras();

      // Immediately set cameras without snapshots
      const camerasWithoutSnapshots = fetchResult.map((camera: Camera) => ({
        ...camera,
        snapshot: undefined,
        snapshotLoading: true,
      }));

      setCameras(camerasWithoutSnapshots);
      setLoading(false);

      // Fetch snapshots individually for each camera
      camerasWithoutSnapshots.forEach(async (camera: CameraWithSnapshot) => {
        if (camera.id) {
          try {
            const snapshotBlob = await getCameraSnapshot(camera.id);
            const snapshotUrl = URL.createObjectURL(snapshotBlob);

            // Update individual camera snapshot immediately
            setCameras((prevCameras) =>
              prevCameras.map((cam) =>
                cam.id === camera.id
                  ? { ...cam, snapshot: snapshotUrl, snapshotLoading: false }
                  : cam
              )
            );
          } catch (snapshotError) {
            console.warn(
              `Could not fetch snapshot for camera ${camera.id}:`,
              snapshotError
            );

            // Update individual camera to show failed snapshot loading
            setCameras((prevCameras) =>
              prevCameras.map((cam) =>
                cam.id === camera.id
                  ? { ...cam, snapshot: undefined, snapshotLoading: false }
                  : cam
              )
            );
          }
        }
      });
    } catch (err) {
      console.error("Complete error object:", err);

      let errorMessage = "Failed to fetch cameras";
      if (err instanceof Error) {
        if (err.message.includes("Failed to fetch")) {
          errorMessage = "Network error. Please check your connection.";
        } else if (err.message.includes("timeout")) {
          errorMessage = "Request timed out. Please try again.";
        } else {
          errorMessage = err.message;
        }
      }

      setError(`${errorMessage} (Check console for details)`);
      setLoading(false);
    }
  };

  const addCamera = async (camera: Omit<Camera, "id">) => {
    setLoading(true);
    setError(null);
    try {
      const newCamera = await createCamera(camera);
      const cameraWithSnapshot: CameraWithSnapshot = {
        ...newCamera,
        snapshot: undefined,
        snapshotLoading: true,
      };

      setCameras((prevCameras) => [...prevCameras, cameraWithSnapshot]);

      // Attempt to fetch snapshot for the new camera
      if (newCamera.id) {
        try {
          const snapshotBlob = await getCameraSnapshot(newCamera.id);
          const snapshotUrl = URL.createObjectURL(snapshotBlob);

          setCameras((prevCameras) =>
            prevCameras.map((cam) =>
              cam.id === newCamera.id
                ? { ...cam, snapshot: snapshotUrl, snapshotLoading: false }
                : cam
            )
          );
        } catch (snapshotError) {
          console.warn(
            `Could not fetch snapshot for new camera ${newCamera.id}:`,
            snapshotError
          );

          setCameras((prevCameras) =>
            prevCameras.map((cam) =>
              cam.id === newCamera.id
                ? { ...cam, snapshot: undefined, snapshotLoading: false }
                : cam
            )
          );
        }
      }

      setLoading(false);
      return newCamera;
    } catch (err) {
      console.error("Error adding camera:", err);
      const errorMessage =
        err instanceof Error ? err.message : "Failed to add camera";
      setError(errorMessage);
      setLoading(false);
      throw err;
    }
  };

  const updateExistingCamera = async (
    id: number,
    camera: Omit<Camera, "id">
  ) => {
    setLoading(true);
    setError(null);
    try {
      const updatedCamera = await updateCamera(id, camera);
      setCameras((prevCameras) =>
        prevCameras.map((cam) =>
          cam.id === id
            ? {
                ...updatedCamera,
                snapshot: cam.snapshot,
                snapshotLoading: cam.snapshotLoading,
              }
            : cam
        )
      );
      setLoading(false);
      return updatedCamera;
    } catch (err) {
      console.error("Error updating camera:", err);
      const errorMessage =
        err instanceof Error ? err.message : "Failed to update camera";
      setError(errorMessage);
      setLoading(false);
      throw err;
    }
  };

  const deleteExistingCamera = async (id: number) => {
    setLoading(true);
    setError(null);
    try {
      await deleteCamera(id);
      setCameras((prevCameras) => prevCameras.filter((cam) => cam.id !== id));
      setLoading(false);
    } catch (err) {
      console.error("Error deleting camera:", err);
      const errorMessage =
        err instanceof Error ? err.message : "Failed to delete camera";
      setError(errorMessage);
      setLoading(false);
      throw err;
    }
  };

  useEffect(() => {
    fetchCameras();
  }, []);

  return {
    cameras,
    loading,
    error,
    fetchCameras,
    addCamera,
    updateCamera: updateExistingCamera,
    deleteCamera: deleteExistingCamera,
  };
}
