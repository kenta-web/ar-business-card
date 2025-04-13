"use client";

export default function ClientAR({ data }: { data: any }) {
  const query = new URLSearchParams({
    name: data.name,
    company: data.company,
    position: data.position || "",
    face_url: data.face_url,
  }).toString();

  return (
    <iframe
      src={`/view/marker/index.html?${query}`}
      style={{
        width: "100vw",
        height: "100vh",
        border: "none",
        position: "absolute",
        top: 0,
        left: 0,
      }}
      allow="camera"
    />
  );
}
