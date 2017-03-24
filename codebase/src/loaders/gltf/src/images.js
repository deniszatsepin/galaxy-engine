function requestImage(uri) {
  const src = `/models/glTF/${uri}`;
  return new Promise((resolve, reject) => {
    const image = new Image();
    image.addEventListener('load', () => resolve(image));
    image.addEventListener('error', (err) => reject(err));
    image.src = src;
  });
}

export default function loadImages(gltf) {
  const names = Object.keys(gltf.images);
  const requests = names
    .map(key => gltf.images[key])
    .map(image => requestImage(image.uri));

  return Promise
    .all(requests)
    .then((images) => {
      return images.reduce((acc, img, idx) => {
        acc[names[idx]] = img;
        return acc;
      }, {});
    });
}
