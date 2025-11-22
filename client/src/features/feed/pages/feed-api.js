import { api } from "@/axios";

const ROOT = "/feed";

export const getUploadSignatures = async () => {
  try {
    const response = await api.get(`${ROOT}/upload-signature`);

    return response.data;
  } catch (error) {
    console.error("Error fetching upload signatures:", error);
    throw error;
  }
};
