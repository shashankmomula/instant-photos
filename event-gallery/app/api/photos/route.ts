import { NextResponse } from "next/server";
import { GCS_CONFIG } from "@/lib/config";
import { BACKEND_API } from "@/lib/config";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const eventId = searchParams.get("event");

  if (!eventId) {
    return NextResponse.json(
      { error: "Event ID is required" },
      { status: 400 }
    );
  }

  try {
    // Fetch photos from backend which lists GCS files
    const backendUrl = BACKEND_API.baseUrl || 'http://localhost:8000';
    const listResponse = await fetch(`${backendUrl}/list-photos?event_id=${eventId}`, {
      cache: 'no-store', // Always fetch fresh data
    });
    
    if (listResponse.ok) {
      const data = await listResponse.json();
      return NextResponse.json({
        success: true,
        eventId,
        photos: data.photos || [],
        count: data.photos?.length || 0,
      });
    }

    // Fallback: If backend is not available, return empty array with error message
    console.error("Backend not available or error:", listResponse.status);
    return NextResponse.json({
      success: false,
      eventId,
      photos: [],
      count: 0,
      error: "Backend service unavailable. Please ensure the backend server is running.",
    });
  } catch (error) {
    console.error("Error fetching photos:", error);
    return NextResponse.json(
      { 
        error: "Failed to fetch photos",
        success: false,
        photos: [],
        count: 0,
      },
      { status: 500 }
    );
  }
}
