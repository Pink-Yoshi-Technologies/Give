import { storage } from "../firebase";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";

function safeName(name) {
  return name.replace(/[^\w.-]/g, "_");
}

export async function uploadImageAndGetUrl(file, uid) {
  if (!uid) throw new Error("Sign in first");
  const path = `posts/${uid}/${Date.now()}_${safeName(file.name)}`;
  const fileRef = ref(storage, path);

  await uploadBytes(fileRef, file);
  const url = await getDownloadURL(fileRef);
  return { url, path };
}

export async function uploadManyAndGetUrls(files = [], uid) {
  const results = await Promise.all(files.map((f) => uploadImageAndGetUrl(f, uid)));
  return {
    urls: results.map((r) => r.url),
    paths: results.map((r) => r.path),
  };
}