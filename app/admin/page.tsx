"use client";

import Image from "next/image";
import { FormEvent, useEffect, useState } from "react";

type GalleryImage = {
  name: string;
  src: string;
  alt: string;
};

async function getGalleryImages() {
  const response = await fetch("/api/upload");
  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error || "Could not load images.");
  }

  return data.images as GalleryImage[];
}

export default function AdminPage() {
  const [isCheckingSession, setIsCheckingSession] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [images, setImages] = useState<GalleryImage[]>([]);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const [deletingImageName, setDeletingImageName] = useState("");

  useEffect(() => {
    const checkSession = async () => {
      try {
        const response = await fetch("/api/login");
        const data = await response.json();

        setIsAuthenticated(Boolean(data.authenticated));
      } catch {
        setIsAuthenticated(false);
      } finally {
        setIsCheckingSession(false);
      }
    };

    checkSession();
  }, []);

  useEffect(() => {
    if (!isAuthenticated) {
      return;
    }

    getGalleryImages().then(setImages).catch((loadError: Error) => {
      setError(loadError.message);
    });
  }, [isAuthenticated]);

  const handleLogin = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");
    setMessage("");

    try {
      const response = await fetch("/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }),
      });
      const data = await response.json();

      if (response.ok && data.authenticated) {
        setIsAuthenticated(true);
        return;
      }

      setError(data.error || "Login failed.");
    } catch {
      setError("Login failed. Please try again.");
    }
  };

  const handleUpload = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");
    setMessage("");

    if (!selectedFile) {
      setError("Please choose an image before uploading.");
      return;
    }

    if (selectedFile.size === 0) {
      setError("Selected file is empty.");
      return;
    }

    if (!selectedFile.type.startsWith("image/")) {
      setError("Only image files are allowed.");
      return;
    }

    const formData = new FormData();
    formData.append("file", selectedFile);
    setIsUploading(true);

    try {
      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Upload failed.");
      }

      setImages(data.images);
      setSelectedFile(null);
      setMessage("Image uploaded successfully.");
    } catch (uploadError) {
      setError(
        uploadError instanceof Error
          ? uploadError.message
          : "Upload failed. Please try again.",
      );
    } finally {
      setIsUploading(false);
    }
  };

  const handleLogout = async () => {
    await fetch("/api/login", { method: "DELETE" });
    setIsAuthenticated(false);
    setPassword("");
    setSelectedFile(null);
    setMessage("");
    setError("");
  };

  const handleDeleteImage = async (image: GalleryImage) => {
    const shouldDelete = window.confirm(`Delete ${image.name}?`);

    if (!shouldDelete) {
      return;
    }

    setError("");
    setMessage("");
    setDeletingImageName(image.name);

    try {
      const response = await fetch("/api/upload", {
        method: "DELETE",
        headers: {
          "content-type": "application/json",
        },
        body: JSON.stringify({ name: image.name }),
      });
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Delete failed.");
      }

      setImages(data.images);
      setMessage("Image deleted successfully.");
    } catch (deleteError) {
      setError(
        deleteError instanceof Error
          ? deleteError.message
          : "Delete failed. Please try again.",
      );
    } finally {
      setDeletingImageName("");
    }
  };

  if (isCheckingSession) {
    return (
      <main className="mx-auto w-full max-w-md px-6 py-14 sm:px-10">
        <p className="theme-color text-sm text-[var(--color-muted)]">
          Checking admin session...
        </p>
      </main>
    );
  }

  if (!isAuthenticated) {
    return (
      <main className="mx-auto w-full max-w-md px-6 py-14 sm:px-10">
        <h1 className="theme-color text-3xl font-semibold text-[var(--color-ink)]">
          Admin Login
        </h1>
        <form className="mt-8 space-y-5" onSubmit={handleLogin}>
          <label className="block text-sm font-medium text-[var(--color-ink)]">
            Username
            <input
              className="theme-color mt-2 w-full rounded-md border border-[var(--color-line)] bg-[var(--color-card)] px-3 py-2 text-[var(--color-ink)] outline-none focus:border-[var(--color-muted)]"
              value={username}
              onChange={(event) => setUsername(event.target.value)}
              autoComplete="username"
            />
          </label>
          <label className="block text-sm font-medium text-[var(--color-ink)]">
            Password
            <input
              className="theme-color mt-2 w-full rounded-md border border-[var(--color-line)] bg-[var(--color-card)] px-3 py-2 text-[var(--color-ink)] outline-none focus:border-[var(--color-muted)]"
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              autoComplete="current-password"
            />
          </label>
          {error && <p className="text-sm text-red-500">{error}</p>}
          <button
            className="rounded-md bg-[var(--color-shell)] px-4 py-2 text-sm font-medium text-[var(--color-shell-text)] transition-opacity duration-200 hover:opacity-85"
            type="submit"
          >
            Login
          </button>
        </form>
      </main>
    );
  }

  return (
    <main className="mx-auto w-full max-w-7xl px-6 py-14 sm:px-10 lg:px-12">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="theme-color text-sm font-semibold uppercase tracking-[0.12em] text-[var(--color-accent)]">
            Smukavchuk Epoxid Art
          </p>
          <h1 className="theme-color mt-3 text-4xl font-semibold text-[var(--color-ink)]">
            Admin Panel
          </h1>
        </div>
        <button
          className="self-start rounded-md border border-[var(--color-line)] px-4 py-2 text-sm font-medium text-[var(--color-ink)] transition-opacity duration-200 hover:opacity-70 sm:self-auto"
          type="button"
          onClick={handleLogout}
        >
          Logout
        </button>
      </div>

      <section className="theme-color mt-10 border-t border-[var(--color-line)] pt-8">
        <h2 className="theme-color text-xl font-semibold text-[var(--color-ink)]">
          Upload Image
        </h2>
        <form
          className="mt-5 flex flex-col gap-4 sm:flex-row"
          onSubmit={handleUpload}
        >
          <input
            className="theme-color w-full rounded-md border border-[var(--color-line)] bg-[var(--color-card)] px-3 py-2 text-sm text-[var(--color-ink)] sm:max-w-md"
            type="file"
            accept="image/jpeg,image/png,image/webp"
            onChange={(event) =>
              setSelectedFile(event.target.files?.[0] ?? null)
            }
          />
          <button
            className="rounded-md bg-[var(--color-shell)] px-4 py-2 text-sm font-medium text-[var(--color-shell-text)] transition-opacity duration-200 hover:opacity-85 disabled:cursor-not-allowed disabled:opacity-50"
            type="submit"
            disabled={isUploading}
          >
            {isUploading ? "Uploading..." : "Upload"}
          </button>
        </form>
        {message && <p className="mt-4 text-sm text-green-600">{message}</p>}
        {error && <p className="mt-4 text-sm text-red-500">{error}</p>}
      </section>

      <section className="mt-10">
        <h2 className="theme-color text-xl font-semibold text-[var(--color-ink)]">
          Gallery Images
        </h2>
        <div className="mt-5 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
          {images.map((image) => (
            <figure key={image.src} className="min-w-0">
              <Image
                className="aspect-[4/3] w-full rounded-md object-cover"
                src={image.src}
                alt={image.alt}
                width={320}
                height={240}
              />
              <figcaption className="theme-color mt-2 truncate text-xs text-[var(--color-muted)]">
                {image.name}
              </figcaption>
              <button
                className="mt-2 rounded-md border border-red-500/30 px-3 py-1.5 text-xs font-medium text-red-500 transition-opacity duration-200 hover:opacity-70 disabled:cursor-not-allowed disabled:opacity-50"
                type="button"
                disabled={deletingImageName === image.name}
                onClick={() => handleDeleteImage(image)}
              >
                {deletingImageName === image.name ? "Deleting..." : "Delete"}
              </button>
            </figure>
          ))}
        </div>
      </section>
    </main>
  );
}
