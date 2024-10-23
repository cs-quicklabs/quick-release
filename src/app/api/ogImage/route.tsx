import { WEB_DETAILS } from "@/Utils/constants";
import { ImageResponse } from "next/og";
import React from "react";

export const runtime = "edge";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);

    // DigitalOcean Spaces URL
    const DOurl = `https://${process.env.NEXT_PUBLIC_AWS_S3_BUCKET_NAME}.${process.env.NEXT_PUBLIC_AWS_S3_REGION}.digitaloceanspaces.com`;

    // Get the search parameters
    const title = searchParams.get("title");
    const description = searchParams.get("description");
    const teamName = searchParams.get("teamName");
    const teamlogo = searchParams.get("logo");

    // Create a React component with the HTML content
    const ImageContent = () => (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-start",
          justifyContent: "center",
          width: "100%",
          height: "100%",
          padding: "5rem",
          gap: "1rem",
          backgroundColor: "#f8f9fa", // Background color example
        }}
      >
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
            <img
              src={teamlogo ? `${DOurl}/${teamlogo}` : `${process.env.BASEURL}/logo.png`}
              width={60}
              height={60}
              alt="Logo"
            />
            <h1 style={{ fontSize: "3.5rem", color: "#333" }}>
              {teamName || WEB_DETAILS.name}
            </h1>
          </div>
          {!title && !description && (
            <span style={{ fontSize: "2rem", color: "#666" }}>
              Manage your release notes better
            </span>
          )}
        </div>
        {title && description && (
          <div style={{ display: "flex", flexDirection: "column" }}>
            <h1 style={{ fontSize: "4rem", color: "#333" }}>{title}</h1>
            <p style={{ fontSize: "2rem", color: "#666" }}>{description}</p>
          </div>
        )}
      </div>
    );

    // Generate an image using ImageResponse
    return new ImageResponse(<ImageContent />, {
      width: title ? 1160 : 800,
      height: title ? 580 : 400,
    });
  } catch (error) {
    console.error(error);
    return new Response("Error generating image", { status: 500 });
  }
}
