import req from 'superagent';
import loadBuffers from './buffers';

function load(uri) {
  return req.get(uri).accept('json')
    .then((resp) => {
      return resp.body || JSON.parse(resp.text);
    })
    .then((gltf) => {
      return loadResources(gltf)
        .then((resources) => {
          gltf.__resources = resources;
          return gltf;
        });
    });
}

function loadResources(gltf) {
  const resources = {};

  const promises = [
    loadBuffers(gltf).then((buffers) => {
      resources.buffers = buffers;
    }),
  ];

  return Promise.all(promises).then(() => resources);
}

// load('/models/glTF/monster.gltf')
//   .then((gltf) => {
//     console.log(gltf);
//     return parse(gltf)
//   })
//   .catch((e) => console.log(e));

export {
  load
};
