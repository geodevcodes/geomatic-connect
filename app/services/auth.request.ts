import axios from "axios";

// CREATE NEW USER REQUEST (REGISTER USER)
export const RegisterRequest = async (body: any) => {
  try {
    const response = await axios.post(
      `${process.env.NEXT_PUBLIC_BASEURL}/auth/register`,
      body,
      {
        headers: {
          Accept: "application/vnd.connect.v1+json",
          "Content-Type": "multipart/form-data",
        },
      }
    );
    const data = response.data;
    console.log(data, "data is here");
    if (!data) return;
    return data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

// REGISTER WITH GOOGLE (SIGN UP)
export const RegisterWithGoogleRequest = async () => {
  const response = await axios.get(
    `${process.env.NEXT_PUBLIC_BASEURL}/auth/google/redirect`,
    {
      maxBodyLength: Infinity,
      headers: {
        Accept: "application/vnd.connect.v1+json",
        "Content-Type": "application/json",
      },
    }
  );
  const data = await response.data;
  return data;
};

// EMAIL VERIFICATION REQUEST
export const VerifyEmailRequest = async (body: any) => {
  try {
    const response = await axios.post(
      `${process.env.NEXT_PUBLIC_BASEURL}/auth/verify-email`,
      body,
      {
        headers: {
          Accept: "application/vnd.connect.v1+json",
          "Content-Type": "application/json",
        },
      }
    );
    const data = response.data;
    console.log(data, "data is here");
    if (!data) return;
    return data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

// RESEND VERIFICATION REQUEST
export const ResendVerifyOTPRequest = async (body: any) => {
  try {
    const response = await axios.post(
      `${process.env.NEXT_PUBLIC_BASEURL}/auth/resend-verification`,
      body,
      {
        headers: {
          Accept: "application/vnd.connect.v1+json",
          "Content-Type": "application/json",
        },
      }
    );
    const data = response.data;
    console.log(data, "data is here");
    if (!data) return;
    return data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

// FORGOT PASSWORD REQUEST
export const ForgotPasswordRequest = async (body: any) => {
  try {
    const response = await axios.post(
      `${process.env.NEXT_PUBLIC_BASEURL}/auth/forgot-password`,
      body,
      {
        headers: {
          Accept: "application/vnd.connect.v1+json",
          "Content-Type": "application/json",
        },
      }
    );
    const data = response.data;
    console.log(data, "data is here");
    if (!data) return;
    return data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

// RESET PASSWORD REQUEST
export const ResetPasswordRequest = async (body: any, token: string) => {
  try {
    const response = await axios.post(
      `${process.env.NEXT_PUBLIC_BASEURL}/auth/reset-password/${token}`,
      body,
      {
        headers: {
          Accept: "application/vnd.connect.v1+json",
          "Content-Type": "application/json",
        },
      }
    );
    const data = response.data;
    console.log(data, "data is here");
    if (!data) return;
    return data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

