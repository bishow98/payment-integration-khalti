import axios from "axios";

// Function to verify Khalti Payment
export const verifyKhaltiPayment = async (pidx) => {
  const headers = {
    Authorization: `Key ${process.env.KHALTI_SECRET_KEY}`,
    "Content-Type": "application/json",
  };

  const body = JSON.stringify({ pidx });

  try {
    const response = await axios.post(`${process.env.KHALTI_GATEWAY_URL}/api/v2/epayment/lookup/`, body, { headers });
    return response.data;
  } catch (error) {
    console.error("Error verifying Khalti payment:", error);
    throw error;
  }
};

// Function to initialize Khalti Payment
export const initializeKhaltiPayment = async (details) => {
  const headers = {
    Authorization: `Key ${process.env.KHALTI_SECRET_KEY}`,
    "Content-Type": "application/json",
  };

  try {
    const response = await axios.post(`${process.env.KHALTI_GATEWAY_URL}/api/v2/epayment/initiate/`, details, { headers });
    return response.data;
  } catch (error) {
    console.error("Error initializing Khalti payment:", error);
    throw error;
  }
};
