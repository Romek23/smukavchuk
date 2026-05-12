import { mkdir, readdir, unlink, writeFile } from "node:fs/promises";
import path from "node:path";
import { NextResponse } from "next/server";
import { isAdminRequest } from "@/app/api/login/route";

export const runtime = "nodejs";

const galleryDirectory = path.join(process.cwd(), "public", "gallery");
const allowedTypes = new Set(["image/jpeg", "image/png", "image/webp"]);
const allowedExtensions = new Set([".jpg", ".jpeg", ".png", ".webp"]);
const maxUploadSize = 5 * 1024 * 1024;

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

async function getGalleryImages() {
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
    .map((file, index) => ({
      name: file,
      src: `/gallery/${encodeURIComponent(file)}`,
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

    await mkdir(galleryDirectory, { recursive: true });
    await writeFile(path.join(galleryDirectory, filename), buffer);

    const images = await getGalleryImages();

    return NextResponse.json({
      image: {
        name: filename,
        src: `/gallery/${encodeURIComponent(filename)}`,
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
