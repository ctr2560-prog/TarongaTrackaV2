import { initializeApp } from 'firebase/app';
import { getStorage, ref, listAll, getDownloadURL, getMetadata } from 'firebase/storage';

const app = initializeApp({
  apiKey: "AIzaSyCFS0oFiThCyjgoRxgoJ6nyO34fzgyW2IM",
  authDomain: "tarongatracka.firebaseapp.com",
  projectId: "tarongatracka",
  storageBucket: "tarongatracka.firebasestorage.app",
});
const storage = getStorage(app);
const res = await listAll(ref(storage, 'zoosnooz/WDMZ31/Quokka'));
for (const item of res.items) {
  const [url, meta] = await Promise.all([getDownloadURL(item), getMetadata(item)]);
  console.log(item.name, '|', meta.contentType, '|', Math.round(meta.size/1024), 'KB');
  console.log(url);
}
process.exit(0);
