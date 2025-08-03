# Mini Zipper API

This project is a NestJS-based service for processing `.zip` files containing images. It extracts the images, generates thumbnails asynchronously using worker threads, and returns a processing summary.

## Features

* Accepts `.zip` file uploads via `POST /zip`
* Extracts images to temporary directory
* Creates thumbnails using `sharp` in worker threads
* Collects `processed` and `skipped` counts with `mutex` protection
* Cleans up temporary files after processing

## Installation

```bash
npm install
```

## Running the App

```bash
npm run start
```

## API Endpoint

### POST `/zip`

Uploads and processes a `.zip` archive containing `.jpg`, `.jpeg`, or `.png` images.

**Form-data field:** `zip` (type: file)

**Example using cURL:**

```bash
curl -F "zip=@test_images.zip" http://localhost:3000/zip
```

**Example response:**

```json
{
  "processed": 8,
  "skipped": 2,
  "durationMs": 135
}
```

## Folder Structure

```
mini-zipper/
├── src/
│   ├── workers/             # Worker thread logic
│   ├── zip/                 # Zip controller and service
│   └── main.ts              # App bootstrap
├── output/                  # Output thumbnails
├── tmp/
│   ├── zips/                # Uploaded zip files
│   └── unzipped/            # Temporary extracted images
```

## Notes

* Temporary image files are stored in the OS temp directory (via `os.tmpdir()`)
* Output thumbnails are stored in `./output/{uuid}` and not deleted automatically
* Worker concurrency is managed via `Promise.allSettled`

## TODO

* Add file size/type validation
* Add support for concurrency limits
* Add automated tests (unit/e2e)

---

Made with ❤️ using NestJS, Sharp, and Node.js worker threads.
