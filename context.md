# Project Context and Plan

This document outlines the development plan, decisions made, and the overall context for the StoryLoom project.

## Feature: Zine Creation Page (`/create`)

The goal is to build a feature where users can upload, preview, and reorder images to create a "zine."

### Frontend Implementation (Completed)

-   **Location:** `src/Create.jsx` and `src/ImageUpload.jsx`.
-   **Functionality:**
    -   A bordered upload area on the right side of the `/create` page.
    -   Supports file selection via clicking or drag-and-drop.
    -   Accepted formats: `jpg`, `jpeg`, `png`, `bmp`, `heic`.
    -   Selected images are displayed as previews.
    -   **HEIC Preview Limitation:** Due to limited native browser support for HEIC (High Efficiency Image File Format) images (most browsers except Safari cannot display them directly in an `<img>` tag), a generic placeholder is shown for HEIC files. Generating a live preview would require significant client-side (large JS libraries) or server-side (image conversion) processing, which is outside the scope of the current simplified architecture.
    -   Previews can be reordered via drag-and-drop.
    -   Individual previews can be removed with an "X" button.
    -   An "Upload Zine Pages" button is present below the preview area.
    -   A notification bubble appears for 7 seconds after image selection, instructing the user on reordering/removing images. This bubble is positioned in the lower-right corner of the upload area.
-   **Libraries Used:** `react-dropzone`, `react-dnd`, `immutability-helper`.

### Backend Implementation (Planned)

**Objective:** To provide a robust, cloud-based image upload feature that saves files to Google Cloud Storage (GCS) and records their URLs in MongoDB.

**Decision:** We will use **Google Cloud Storage** for file hosting, which is a scalable and professional solution.

**Chosen Stack:**
-   **Runtime/Framework:** Node.js & Express.js
-   **File Upload Handling:** Multer
    *   **Role:** Multer is an Express.js middleware specifically designed to process `multipart/form-data`, which is the encoding type used for file uploads from web forms. It extracts file data from the incoming request stream and makes it accessible on the `req.files` object in the controller. In this setup, Multer is configured to use `memoryStorage()`, meaning it holds the file contents in memory (as a Buffer) rather than saving them to disk, making them immediately available for upload to GCS.
-   **Image Processing:** None (files saved as-is)
-   **Image Storage:** Google Cloud Storage (GCS)
-   **Database:** MongoDB (to store GCS URLs and metadata)

**Detailed Workflow:**
1.  **Client-Side:** The React application sends the ordered list of images as `multipart/form-data` to the Express backend.
2.  **Backend - Receiving:** The Express server uses `multer` with memory storage to handle the incoming file uploads and hold them in memory.
3.  **Backend - Uploading to GCS:** For each image, the server uploads the file buffer to a Google Cloud Storage bucket.
4.  **Backend - Database:** Upon a successful upload to GCS, the service returns a permanent public URL for the image. The server collects these URLs.
5.  **Backend - Finalization:** An array of these GCS URLs (in the correct order) will be stored in a new document in a MongoDB `zines` collection.
6.  **Server Response:** The server will send a success response back to the client, including the GCS URLs.

### Google Cloud Storage Setup Instructions

To get the backend running with GCS, you need to configure your GCP project and credentials.

1.  **Set up Google Cloud Storage (GCS):**
    *   Create a GCS bucket in your Google Cloud project.
    *   Set the bucket's permissions to allow public viewing (by granting the `allUsers` principal the `Storage Object Viewer` role).
    *   Create a service account with the `Storage Admin` role.
    *   Download the JSON key file for that service account.

2.  **Configure Your Project's `.env` File:**
    *   Ensure your `MONGO_URI` is correctly set.
    *   Add the following GCS variables to your `.env` file, replacing the placeholders with your actual credentials:
        ```
        # Google Cloud Storage
        GCS_PROJECT_ID=your-gcp-project-id
        GCS_BUCKET_NAME=the-unique-bucket-name-you-created
        GOOGLE_APPLICATION_CREDENTIALS=./path/to/your/gcp-keyfile.json
        ```
