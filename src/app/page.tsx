"use client";

import { useState } from "react";
import axios from "axios";

export default function ARCardForm() {
  const [formData, setFormData] = useState({
    name: "",
    company: "",
    position: "",
    twitter: "",
    website: "",
  });

  const [qrUrl, setQrUrl] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const data = new FormData();
    Object.entries(formData).forEach(([key, value]) => data.append(key, value));
    try {
      const res = await axios.post("/api/create", data);
      setQrUrl(res.data.qrUrl);
    } catch (err) {
      console.error("Failed to submit form", err);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-blue-100 p-4">
      <div className="w-full max-w-lg bg-white/60 backdrop-blur-md rounded-2xl shadow-xl p-8">
        <h1 className="text-3xl font-bold text-blue-700 mb-2">AR名刺作成</h1>
        <p className="text-gray-600 mb-6">
          必要事項を入力してください。QRコードが自動生成されます。
        </p>

        <form onSubmit={handleSubmit} className="space-y-5">
          {[
            { name: "name", label: "名前", required: true },
            { name: "company", label: "会社名", required: true },
            { name: "position", label: "部署・役職（任意）" },
            { name: "twitter", label: "XアカウントURL（任意）" },
            { name: "website", label: "WebサイトURL（任意）" },
          ].map(({ name, label, required }) => (
            <div key={name}>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {label}
              </label>
              <input
                type="text"
                name={name}
                required={required}
                onChange={handleChange}
                className="w-full p-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400 shadow-sm transition"
              />
            </div>
          ))}

          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-xl transition shadow-md"
          >
            QRコードを生成
          </button>
        </form>

        {qrUrl && (
          <div className="mt-8 bg-white rounded-xl shadow-inner p-4 text-center">
            <h2 className="text-lg font-semibold text-blue-700 mb-2">
              QRコード
            </h2>
            <img
              src={qrUrl}
              alt="QR Code"
              className="mx-auto w-40 h-40 object-contain"
            />
            <a
              href={qrUrl}
              download="qrcode.png"
              className="text-blue-600 hover:text-blue-800 underline mt-2 inline-block"
            >
              ダウンロード
            </a>
          </div>
        )}
      </div>
    </div>
  );
}
