import uuid from 'uuid';
import loadBuffers from './buffers';
import { actions } from 'state/scene';
import { actions as transformActions} from 'state/transform';
import { actions as visualActions} from 'state/visual';
import createLambertMaterial from 'materials/lambert';

const {
  createEntity,
  addEntityChild,
} = actions;
const {
  addTransform
} = transformActions;
const {
  addVisual
} = visualActions;

export {
  getSceneNames,
  getScene,
  getSceneNodes,
  parseNode,
};

function getSceneNames(gltf) {
  return Object.keys(gltf.scenes);
}

function getScene(gltf, name) {
  return gltf.scenes[name || gltf.scene];
}

function getSceneNodes(gltf, sceneName) {
  const scene = getScene(gltf, sceneName);
  if (!scene) return [];
  return scene.nodes.map(name => gltf.nodes[name]);
}

function parseNode(gltf, nodeName, parent) {
  const node = gltf.nodes[nodeName];
  const record = [];
  const entityId = uuid.v4();
  record.push(createEntity(entityId));

  if (parent) {
    record.push(addEntityChild(parent, entityId));
  }

  if (node.matrix) {
    record.push(addTransform(entityId, {
      matrix: node.matrix,
    }));
  }

  if (node.translation) {
    record.push(addTransform(entityId, {
      position: node.translation,
      rotation: node.rotation,
      scale: node.scale,
    }));
  }

  if (node.meshes) {
    node.meshes
      .map(meshName => parseMesh(gltf, meshName))
      .forEach(primitives => {
        primitives.forEach(visual => {
          record.push(addVisual(entityId, {
            geometry: visual.geometry,
            material: createLambertMaterial(),
          }));
        })
      });
  }

  node.children
    .map(child => parseNode(gltf, child, entityId))
    .forEach((action) => {
      if (Array.isArray(action)) {
        action.forEach(a => record.push(a));
      } else {
        record.push(action)
      }
    });

  return record;
}

function parseMesh(gltf, meshName) {
  const mesh = gltf.meshes[meshName];

  return mesh.primitives
    .map(primitive => {
      const {
        attributes: {
          NORMAL: normals,
          POSITION: positions,
        },
        indices: cells,
      } = primitive;

      return {
        geometry: {
          cells: parseAccessor(gltf, cells),
          positions: parseAccessor(gltf, positions),
          normals: parseAccessor(gltf, normals),
        },
      };
    });
}

function parseAccessor(gltf, name) {
  const accessor = gltf.accessors[name];
  const arrayType = getArrayType(accessor.componentType);
  const bufferView = gltf.bufferViews[accessor.bufferView];
  const buffer = gltf.__resources.buffers[bufferView.buffer];
  const byteOffset = accessor.byteOffset + bufferView.byteOffset;
  const length = getAccessorLength(accessor);

  return new arrayType(buffer, byteOffset, length);
}

function getArrayType(type) {
  switch(type) {
    case 5126: return Float32Array;
    case 5123: return Uint16Array;
    case 5122: return Int16Array;
    case 5121: return Uint8Array;
    case 5120: return Int8Array;
  }
}

function getAccessorLength(accessor) {
  // return getComponentSize(accessor.componentType) *
  return  getComponentsNumber(accessor.type) * accessor.count;
}

function getComponentSize(type) {
  switch(type) {
    case 5126: return 4;
    case 5123: return 2;
    case 5122: return 2;
    case 5121: return 1;
    case 5120: return 1;
  }
}

function getComponentsNumber(type) {
  switch (type) {
    case 'SCALAR': return 1;
    case 'VEC2': return 2;
    case 'VEC3': return 3;
    case 'VEC4': return 4;
    case 'MAT2': return 4;
    case 'MAT3': return 9;
    case 'MAT4': return 16;
  }
}
