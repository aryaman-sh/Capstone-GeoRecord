import useAuth from "../hooks/useAuth";
import { GeoJsonObject } from "geojson";

type ApiSuccessResponse<T> = {
  data: T;
  error: null;
};

type ApiErrorResponse<T> = {
  data: null;
  error: T;
};

type ApiResponse<T, E> = ApiSuccessResponse<T> | ApiErrorResponse<E>;

const useLocationApi = () => {
  const auth = useAuth();

  const locationQuery = async (
    west: number,
    south: number,
    east: number,
    north: number
  ): Promise<ApiResponse<GeoJsonObject, string>> => {
    const margin = 0;
    const encodedCoordinates = `${west - margin},${south - margin},${
      east + margin
    },${north + margin}`;

    const response = await fetch(
      `${
        import.meta.env.VITE_API_URL ?? "/api/v1"
      }/location/query/${encodedCoordinates}`,
      {
        method: "GET",
        mode: "cors",
        credentials: "include",
        headers: {
          Authorization: `Bearer ${auth.jwt}`, // notice the Bearer before your token
        },
      }
    );

    const jsonResponse = await response.json();

    // An error occured
    if (jsonResponse.error) {
      return { data: null, error: jsonResponse.message };
    }

    return {
      data: jsonResponse.payload,
      error: null,
    };
  };

  const createLocation = async (
    coords: [[number]],
    name: string
  ): Promise<ApiResponse<null, string | null>> => {
    // We format the object as GeoJSON for the API call
    const geojson = {
      type: "Feature",
      geometry: {
        type: "Polygon",
        coordinates: [coords],
      },
      properties: {
        name: name,
      },
    };

    const response = await fetch(
      `${import.meta.env.VITE_API_URL ?? "/api/v1"}/location`,
      {
        method: "POST",
        mode: "cors",
        credentials: "include",
        headers: {
          Authorization: `Bearer ${auth.jwt}`, // notice the Bearer before your token
          "Content-Type": "application/json",
        },
        body: JSON.stringify(geojson),
      }
    );

    const jsonResponse = await response.json();

    // An error occured
    if (jsonResponse.error) {
      return { data: null, error: jsonResponse.message };
    }

    return {
      data: jsonResponse.payload,
      error: null,
    };
  };

  return {
    locationQuery,
    createLocation,
  };
};

export default useLocationApi;
