import { NextResponse } from "next/server";
import { BACKEND_API } from "@/lib/config";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const photoUrl = searchParams.get("photoUrl");

  if (!photoUrl) {
    return NextResponse.json(
      { error: "photoUrl query parameter is required" },
      { status: 400 }
    );
  }

  try {
    const backendBase = BACKEND_API.baseUrl || "http://localhost:8000";
    const backendUrl = `${backendBase}/download-photo?photo_url=${encodeURIComponent(
      photoUrl
    )}`;

    const res = await fetch(backendUrl, { cache: "no-store" });

    if (!res.ok) {
      const text = await res.text().catch(() => "");
      console.error("Backend download-photo error", res.status, text);
      return NextResponse.json(
        { error: "Failed to generate download link" },
        { status: 500 }
      );
    }

    const data = await res.json();
    const signedUrl = data.signed_url || data.signedUrl;

    if (!signedUrl) {
      return NextResponse.json(
        { error: "Backend did not return a signed_url" },
        { status: 500 }
      );
    }

    return NextResponse.json({ signedUrl });
  } catch (error) {
    console.error("Error calling backend download-photo endpoint:", error);
    return NextResponse.json(
      { error: "Failed to generate download link" },
      { status: 500 }
    );
  }
}

