import { Storage } from '@google-cloud/storage';
import fs from 'fs';
import path from 'path';

type SaveOptions = {
	contentType?: string;
	gzip?: boolean;
	metadata?: Record<string, unknown>;
};

let uploaderStorage: Storage | null = null;
let viewerStorage: Storage | null = null;

function parseCreds(envVarName: string) {
	const raw = process.env[envVarName];
	if (!raw) throw new Error(`${envVarName} environment variable is not set.`);
	try {
		return typeof raw === 'string' ? JSON.parse(raw) : raw;
	} catch (err) {
		throw new Error(`Failed to parse ${envVarName} JSON: ${String(err)}`);
	}
}

function getUploaderStorage() {
	if (uploaderStorage) return uploaderStorage;
	const creds = parseCreds('SERVICE_CREDS_UPLOADING');
	uploaderStorage = new Storage({
		credentials: creds,
		projectId: creds.project_id,
	});
	return uploaderStorage;
}

function getViewerStorage() {
	if (viewerStorage) return viewerStorage;
	const creds = parseCreds('SERVICE_CREDS_VIEWING');
	viewerStorage = new Storage({
		credentials: creds,
		projectId: creds.project_id,
	});
	return viewerStorage;
}

/**
 * Upload a Buffer or local file to Google Cloud Storage using the uploader credentials.
 * Returns the object destination (path) on success.
 */
export async function upload(
	data: Buffer | string,
	destination: string,
	options: SaveOptions = {}
): Promise<void> {
	const bucketName = process.env.GCS_BUCKET_NAME || process.env.BUCKET_NAME;
	if (!bucketName) throw new Error('GCS_BUCKET_NAME (or BUCKET_NAME) env var must be set.');

	const storage = getUploaderStorage();
	const bucket = storage.bucket(bucketName);
	const file = bucket.file(destination);

	if (typeof data === 'string') {
		const localPath = path.resolve(data);
		if (!fs.existsSync(localPath)) throw new Error(`Local file does not exist: ${localPath}`);
		await bucket.upload(localPath, {
			destination,
			gzip: options.gzip,
			metadata: {
				contentType: options.contentType,
				metadata: options.metadata,
			},
		});
	} else if (Buffer.isBuffer(data)) {
		await new Promise<void>((resolve, reject) => {
			const stream = file.createWriteStream({
				resumable: false,
				gzip: options.gzip,
				metadata: {
					contentType: options.contentType,
					metadata: options.metadata,
				},
			});
			stream.on('error', reject);
			stream.on('finish', resolve);
			stream.end(data);
		});
	} else {
		throw new Error('Data must be a Buffer or a local file path string.');
	}
}

/**
 * Generate a signed URL (v4) for reading an object using the viewing credentials.
 * expiresInSeconds defaults to 3600 (1 hour).
 */
export async function getSignedUrl(destination: string, expiresInSeconds = 3600): Promise<string> {
	const bucketName = process.env.GCS_BUCKET_NAME || process.env.BUCKET_NAME;
	if (!bucketName) throw new Error('GCS_BUCKET_NAME (or BUCKET_NAME) env var must be set.');

	const storage = getViewerStorage();
	const bucket = storage.bucket(bucketName);
	const file = bucket.file(destination);

	const [url] = await file.getSignedUrl({
		version: 'v4',
		action: 'read',
		expires: Date.now() + expiresInSeconds * 1000,
	});
	return url;
}

const bucket = { upload, getSignedUrl };
export default bucket;
