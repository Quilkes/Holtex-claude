import { NextResponse } from "next/server";
import axios from "axios";

export async function POST(request) {
  try {
    const { code } = await request.json();

    if (!code) {
      return NextResponse.json(
        { error: "Authorization code is required" },
        { status: 400 }
      );
    }

    console.log("Code received:", code);
    console.log("Redirect URI:", `${process.env.NEXT_PUBLIC_BASE_URL}/auth/sign-in`);

    // Exchange the code for tokens
    const tokenResponse = await axios.post(
      "https://oauth2.googleapis.com/token",
      {
        code,
        client_id: process.env.GOOGLE_CLIENT_ID,
        client_secret: process.env.GOOGLE_CLIENT_SECRET,
        redirect_uri: `${process.env.NEXT_PUBLIC_BASE_URL}/auth/sign-in`,
        grant_type: "authorization_code",
      }
    );

    // Return the tokens to the client
    return NextResponse.json(tokenResponse.data);
  } catch (error) {
    console.error("Error exchanging Google auth code:", error);
    console.error("Response data:", error.response?.data);
    console.error("Request that failed:", {
      code: error.config?.data ? JSON.parse(error.config.data).code.substring(0, 20) + "..." : null,
      client_id: process.env.GOOGLE_CLIENT_ID ? "[EXISTS]" : "[MISSING]",
      client_secret: process.env.GOOGLE_CLIENT_SECRET ? "[EXISTS]" : "[MISSING]",
      redirect_uri: `${process.env.NEXT_PUBLIC_BASE_URL}/auth/sign-in`,
    });

    return NextResponse.json(
      {
        error: "Failed to exchange authorization code",
        details: error.response?.data || error.message,
      },
      { status: 500 }
    );
  }
}