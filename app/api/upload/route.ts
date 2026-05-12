import { mkdir, readdir, unlink, writeFile } from "node:fs/promises";
import path from "node:path";
import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { isAdminRequest } from "@/app/api/login/route";

export const runtime = "nodejs";

const galleryDirectory = path.join(process.cwd(), "public", "gallery");
const allowedTypes = new Set(["image/jpeg", "image/png", "image/webp"]);
const allowedExtensions = new Set([".jpg", ".jpeg", ".png", ".webp"]);
const maxUploadSize = 5 * 1024 * 1024;
const localImageSource = "local";
const managedImageSource = "managed";

function getSupabaseConfig() {
  const url = process.env.SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  const bucket = process.env.SUPABASE_STORAGE_BUCKET || "gallery";

  if (!url || !serviceRoleKey) {
    return null;
  }

  return { url, serviceRoleKey, bucket };
}

function getSupabaseStorage() {
  const config = getSupabaseConfig();

  if (!config) {
    return null;
  }

  const client = createClient(config.url, config.serviceRoleKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  });

  return { bucket: config.bucket, storage: client.storage.from(config.bucket) };
}

function createSafeFilename(filename: string) {
  const parsedPath = path.parse(filename);
  const extension = parsedPath.ext.toLowerCase();
  const baseName = parsedPath.name
    .toLowerCase()
    .replace(/[^a-z0-9-_]+/g, "-")
    .replace(/^-+|-+$/g, "");

  return `${Date.now()}-${baseName || "gallery-image"}${extension}`;
}

function getSafeGalleryFilePath(filename: string) {
  const extension = path.extname(filename).toLowerCase();

  if (
    !filename ||
    path.basename(filename) !== filename ||
    !allowedExtensions.has(extension)
  ) {
    return null;
  }

  const filePath = path.join(galleryDirectory, filename);
  const relativePath = path.relative(galleryDirectory, filePath);

  if (relativePath.startsWith("..") || path.isAbsolute(relativePath)) {
    return null;
  }

  return filePath;
}

async function getLocalGalleryImages() {
  await mkdir(galleryDirectory, { recursive: true });

  const files = await readdir(galleryDirectory);

  return files
    .filter((file) => allowedExtensions.has(path.extname(file).toLowerCase()))
    .sort((firstFile, secondFile) =>
      firstFile.localeCompare(secondFile, undefined, {
        numeric: true,
        sensitivity: "base",
      }),
    )
    .map((file) => ({
      name: file,
      src: `/gallery/${encodeURIComponent(file)}`,
      alt: "Epoxid art gallery image",
      source: localImageSource,
    }));
}

async function getSupabaseGalleryImages() {
  const supabaseStorage = getSupabaseStorage();

  if (!supabaseStorage) {
    return [];
  }

  const { data, error } = await supabaseStorage.storage.list("", {
    limit: 200,
    sortBy: { column: "name", order: "asc" },
  });

  if (error) {
    throw error;
  }

  return (data || [])
    .filter((file) => allowedExtensions.has(path.extname(file.name).toLowerCase()))
    .sort((firstFile, secondFile) =>
      firstFile.name.localeCompare(secondFile.name, undefined, {
        numeric: true,
        sensitivity: "base",
      }),
    )
    .map((file) => {
      const { data: publicUrlData } =
        supabaseStorage.storage.getPublicUrl(file.name);

      return {
        name: file.name,
        src: publicUrlData.publicUrl,
        alt: "Epoxid art gallery image",
        source: managedImageSource,
      };
    });
}

async function getGalleryImages() {
  const images = [
    ...(await getLocalGalleryImages()),
    ...(await getSupabaseGalleryImages()),
  ];

  return images.map((image, index) => ({
    ...image,
    alt: `Epoxid art gallery image ${index + 1}`,
  }));
}

export async function GET() {
  try {
    const images = await getGalleryImages();

    return NextResponse.json({ images });
  } catch {
    return NextResponse.json(
      { error: "Could not read gallery images." },
      { status: 500 },
    );
  }
}

export async function POST(request: Request) {
  if (!isAdminRequest(request)) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }

  try {
    const formData = await request.formData();
    const file = formData.get("file");

    if (!(file instanceof File)) {
      return NextResponse.json(
        { error: "No file selected." },
        { status: 400 },
      );
    }

    if (file.size === 0) {
      return NextResponse.json(
        { error: "File is empty." },
        { status: 400 },
      );
    }

    if (file.size > maxUploadSize) {
      return NextResponse.json(
        { error: "Image must be 5 MB or smaller." },
        { status: 400 },
      );
    }

    const extension = path.extname(file.name).toLowerCase();

    if (!allowedTypes.has(file.type) || !allowedExtensions.has(extension)) {
      return NextResponse.json(
        { error: "Only JPG, PNG, and WEBP images are allowed." },
        { status: 400 },
      );
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const filename = createSafeFilename(file.name);
    const supabaseStorage = getSupabaseStorage();

    if (supabaseStorage) {
      const { error } = await supabaseStorage.storage.upload(filename, buffer, {
        contentType: file.type,
        upsert: false,
      });

      if (error) {
        throw error;
      }

      const images = await getGalleryImages();

      return NextResponse.json({
        image: images.find(
          (image) =>
            image.name === filename && image.source === managedImageSource,
        ),
        images,
      });
    }

    await mkdir(galleryDirectory, { recursive: true });
    await writeFile(path.join(galleryDirectory, filename), buffer);

    const images = await getGalleryImages();

    return NextResponse.json({
      image: {
        name: filename,
        src: `/gallery/${encodeURIComponent(filename)}`,
        source: managedImageSource,
      },
      images,
    });
  } catch {
    return NextResponse.json(
      { error: "Upload failed. Please try again." },
      { status: 500 },
    );
  }
}

export async function DELETE(request: Request) {
  if (!isAdminRequest(request)) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }

  try {
    const body = await request.json();
    const filename = typeof body.name === "string" ? body.name : "";
    const source = typeof body.source === "string" ? body.source : "";
    const supabaseStorage = getSupabaseStorage();

    if (supabaseStorage && source === localImageSource) {
      return NextResponse.json(
        { error: "Bundled gallery images cannot be deleted from admin." },
        { status: 400 },
      );
    }

    if (supabaseStorage) {
      if (
        !filename ||
        path.basename(filename) !== filename ||
        !allowedExtensions.has(path.extname(filename).toLowerCase())
      ) {
        return NextResponse.json(
          { error: "Invalid image filename." },
          { status: 400 },
        );
      }

      const { error } = await supabaseStorage.storage.remove([filename]);

      if (error) {
        throw error;
      }

      const images = await getGalleryImages();

      return NextResponse.json({ images });
    }

    const filePath = getSafeGalleryFilePath(filename);

    if (!filePath) {
      return NextResponse.json(
        { error: "Invalid image filename." },
        { status: 400 },
      );
    }

    await unlink(filePath);

    const images = await getGalleryImages();

    return NextResponse.json({ images });
  } catch {
    return NextResponse.json(
      { error: "Could not delete image." },
      { status: 500 },
    );
  }
}
