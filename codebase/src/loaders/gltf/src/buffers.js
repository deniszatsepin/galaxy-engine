import req from 'superagent';

function requestBuffer(uri) {
  return req
      .get(`/models/glTF/${uri}`)
      .responseType('arraybuffer');
}

function loadBuffers(gltf) {
  const names = Object.keys(gltf.buffers);
  const requests = names
    .map(key => gltf.buffers[key])
    .map(buffer => requestBuffer(buffer.uri));

  return Promise
    .all(requests)
    .then(responses => responses.map(resp => resp.body))
    .then((buffers) => {
      return buffers.reduce((acc, buf, idx) => {
        acc[names[idx]] = buf;
        return acc;
      }, {});
    });
}

export default loadBuffers;
