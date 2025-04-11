"use client";

import { useState } from "react";
import axios from "axios";

export default function ARCardForm() {
  const [formData, setFormData] = useState<{
    name: string;
    company: string;
    position: string;
    twitter: string;
    website: string;
    face: File | null;
  }>({
    name: "",
    company: "",
    position: "",
    twitter: "",
    website: "",
    face: null,
  });

  const [qrUrl, setQrUrl] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({ ...prev, face: e.target.files?.[0] ?? null }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const data = new FormData();
    Object.entries(formData).forEach(([key, value]) => {
      if (value !== null) {
        data.append(key, value);
      }
    });

    try {
      const res = await axios.post("/api/create", data);
      setQrUrl(res.data.qrUrl);
      console.log("res", res);
    } catch (err) {
      console.error("Failed to submit form", err);
    }
  };

  return (
    <div className="p-4 max-w-xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">新しいAR名刺を作成</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          name="name"
          placeholder="名前"
          required
          onChange={handleChange}
          className="w-full border p-2 rounded"
        />
        <input
          type="text"
          name="company"
          placeholder="会社名"
          required
          onChange={handleChange}
          className="w-full border p-2 rounded"
        />
        <input
          type="text"
          name="position"
          placeholder="部署・役職（任意）"
          onChange={handleChange}
          className="w-full border p-2 rounded"
        />
        <input
          type="text"
          name="twitter"
          placeholder="XアカウントURL（任意）"
          onChange={handleChange}
          className="w-full border p-2 rounded"
        />
        <input
          type="text"
          name="website"
          placeholder="WebサイトURL（任意）"
          onChange={handleChange}
          className="w-full border p-2 rounded"
        />
        <input
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          required
          className="w-full"
        />
        <button
          type="submit"
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          QRコードを生成
        </button>
      </form>
      {qrUrl && (
        <div className="mt-6">
          <h2 className="text-lg font-semibold mb-2">生成されたQRコード</h2>
          <img src={qrUrl} alt="QR Code" className="border" />
          <a
            href={qrUrl}
            download="qrcode.png"
            className="text-blue-600 underline block mt-2"
          >
            ダウンロード
          </a>
        </div>
      )}
    </div>
  );
}
