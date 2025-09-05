import { authenticatedFetch } from "@/lib/apifetch";

export interface InternalSignupData {
  contact_number: string;
  gender: string;
  reg_no: string;
  hosteller?: boolean;
}

export interface ExternalSignupData {
  contact_number: string;
  gender: string;
  college_name: string;
}

export async function signupInternal(data: InternalSignupData) {
  const response = await authenticatedFetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/auth/signup`, {
    method: "POST",
    body: JSON.stringify({
      contact_number: data.contact_number,
      gender: data.gender,
      reg_no: data.reg_no,
      role: "participant",
      internal: true,
      hosteller: Boolean(data.hosteller),
      college_name: "",
    }),
  });
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error || "Signup failed");
  }
  return response.json();
}

export async function signupExternal(data: ExternalSignupData) {
  const response = await authenticatedFetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/auth/signup`, {
    method: "POST",
    body: JSON.stringify({
      contact_number: data.contact_number,
      gender: data.gender,
      reg_no: "",
      role: "participant",
      internal: false,
      college_name: data.college_name,
    }),
  });
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error || "Signup failed");
  }
  return response.json();
}