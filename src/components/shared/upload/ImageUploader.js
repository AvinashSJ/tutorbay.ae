"use client";
import { useState, useRef } from "react";
import { getSupabase } from "@/libs/supabase";
import Image from "next/image";
import { validateFileUpload } from "@/libs/validations";

const ALLOWED_IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp"];

const ImageUploader = ({ currentUrl, type, label, userId, onUpload, bucket = "profiles", containerClassName }) => {
  const [preview, setPreview] = useState(currentUrl || null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState(null);
  const inputRef = useRef(null);

  const handleFile = async (file) => {
    setError(null);

    const validation = validateFileUpload(file, {
      maxSizeMB: 5,
      allowedTypes: ALLOWED_IMAGE_TYPES,
      allowedExtensions: [".jpg", ".jpeg", ".png", ".webp"],
    });

    if (!validation.isValid) {
      setError(validation.error);
      return;
    }

    const ext = file.name.split(".").pop();
    const filePath = `${userId}/${type}-${Date.now()}.${ext}`;
    setUploading(true);

    try {
      const supabase = getSupabase();
      const { error: uploadError } = await supabase.storage
        .from(bucket)
        .upload(filePath, file, { contentType: file.type });

      if (uploadError) {
        setError(uploadError.message);
        setUploading(false);
        return;
      }

      const { data: publicData } = supabase.storage
        .from(bucket)
        .getPublicUrl(filePath);

      const publicUrl = publicData?.publicUrl;
      setPreview(publicUrl);
      onUpload(publicUrl);
    } catch (err) {
      setError(err.message || "Upload failed");
    } finally {
      setUploading(false);
    }
  };

  const handleInputChange = (e) => {
    const file = e.target.files?.[0];
    if (file) handleFile(file);
    if (inputRef.current) inputRef.current.value = "";
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const file = e.dataTransfer?.files?.[0];
    if (file) handleFile(file);
  };

  const handleRemove = () => {
    setPreview(null);
    onUpload(null);
    if (inputRef.current) inputRef.current.value = "";
  };

  return (
    <div className="flex flex-col items-center">
      <label className="block text-sm font-medium text-gray-600 mb-2 w-full">{label}</label>

      <div
        onDragOver={(e) => e.preventDefault()}
        onDrop={handleDrop}
        onClick={() => inputRef.current?.click()}
        className={`relative w-full transition cursor-pointer flex items-center justify-center overflow-hidden bg-gray-50 ${containerClassName || (type === "profile" ? "h-40 w-40 rounded-full border-2 border-dashed border-gray-300 hover:border-primaryColor" : "h-32 w-full rounded-lg border-2 border-dashed border-gray-300 hover:border-primaryColor")}`}
      >
        {uploading ? (
          <div className="flex flex-col items-center gap-2">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primaryColor" />
            <span className="text-xs text-gray-500">Uploading...</span>
          </div>
        ) : preview ? (
          <Image
            src={preview}
            alt={label}
            fill
            className={type === "profile" ? "object-cover" : "object-cover"}
          />
        ) : (
          <div className="flex flex-col items-center gap-1 p-4 text-center">
            <svg className="w-8 h-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
            </svg>
            <span className="text-xs text-gray-400">Click or drag to upload</span>
            <span className="text-[10px] text-gray-300">JPEG, PNG, WebP (max 5MB)</span>
          </div>
        )}
      </div>

      <input
        ref={inputRef}
        type="file"
        accept=".jpg,.jpeg,.png,.webp"
        onChange={handleInputChange}
        className="hidden"
      />

      {error && (
        <p className="text-xs text-red-500 mt-1 text-center">{error}</p>
      )}

      {preview && !uploading && (
        <button
          type="button"
          onClick={handleRemove}
          className="mt-2 text-xs text-red-500 hover:text-red-700 transition"
        >
          Remove
        </button>
      )}
    </div>
  );
};

export default ImageUploader;
