import * as THREE from 'three';

import metaversefile from 'metaversefile';

const { useApp, useFrame, useInternals, useLocalPlayer, useLoaders, usePhysics, useCleanup, useActivate, useNpcManager } = metaversefile;
const baseUrl = import.meta.url.replace(/(\/)[^\/\\]*$/, '$1');

const localVector = new THREE.Vector3();
const localVector2 = new THREE.Vector3();
const localVector3 = new THREE.Vector3();
const localVector4 = new THREE.Vector3();
const localVector5 = new THREE.Vector3();
const localQuaternion = new THREE.Quaternion();
const localQuaternion2 = new THREE.Quaternion();
const localQuaternion3 = new THREE.Quaternion();
const localQuaternion4 = new THREE.Quaternion();


export default () => {
  const app = useApp();
  const { renderer, camera } = useInternals();
  const localPlayer = useLocalPlayer();
  const physics = usePhysics();
  const textureLoader = new THREE.TextureLoader();
  const npcManager = useNpcManager();
  
  //####################################################### load range glb ####################################################
  {    
    let velocity = new THREE.Vector3();
    let angularVel = new THREE.Vector3();
    let physicsIds = [];
    let defaultSpawn = new THREE.Vector3(-194, -9, 1.78);
    let headObj = null;
    let signalObj = null;
    let degrees = 180;
    let timeSincePassive = 0;
    let timeSinceActive = 0;
    let timeSinceChangedTarget = 0;
    let hide = true;
    let goalX = 70;
    let startX = -160;
    let minWait = 3500;
    let maxWait = 10000;
    let rotationSpeed = 2;
    let goColor = 0x2eb800;
    let stopColor = 0xc90000;
    let eyeArray = [];
    let laserArray = [];
    let activeLines = [];
    let mainDoor = null;
    let mainSpawn = null;
    let spawnGame1 = null;
    let bridgeSpawn = null;
    let bridgeEnd = null;
    let gameState = 0;
    let glassArray = [];
    let bridgeFallLimit = -529;

    let audioArray = [];
    let greenAudio = null;
    let redAudio = null;
    let scanAudio = null;
    let shotAudio = null;
    let robotAudio = null;
    let positiveAudio = null;


    // Shooting range

    let buttonUp = null;
    let buttonDown = null;
    let controlPanel = null;
    let target3 = null;

    let maxTravel = -10;
    let minTravel = 5;
    let currentTravel = 0;

    let mousePressed = false;
    let raycaster = new THREE.Raycaster();

    document.body.addEventListener("mousedown", function (evt) {
      mousePressed = true;
    });

    document.body.addEventListener("mouseup", function (evt) {
      mousePressed = false;
    });

    (async () => {
        const u = `${baseUrl}range.glb`; 
        let gltf = await new Promise((accept, reject) => {
            const {gltfLoader} = useLoaders();
            gltfLoader.load(u, accept, function onprogress() {}, reject);        
        });
        app.add(gltf.scene);

        app.traverse(o => {
                  if(o.name === "ControlPanel") {
                    controlPanel = o;
                  }
                  if(o.name === "ButtonUp") {
                    buttonUp = o;
                  }
                  if(o.name === "ButtonDown") {
                    buttonDown = o;
                  }
                  if(o.name === "Target3") {
                    target3 = o;
                  }
                  o.castShadow = true;
                });

        const physicsId = physics.addGeometry(gltf.scene);
        physicsIds.push(physicsId);
        app.updateMatrixWorld();

        const listener = new THREE.AudioListener();
        camera.add( listener );

          if(buttonUp && buttonDown) {
            let buttonUpPos = new THREE.Vector3();
            let buttonDownPos = new THREE.Vector3();

            buttonUp.getWorldPosition(buttonUpPos);
            buttonDown.getWorldPosition(buttonDownPos);


          }
    })();
    useCleanup(() => {
      for (const physicsId of physicsIds) {
        physics.removeGeometry(physicsId);
      }
    });

    useFrame(({ timeDiff, timestamp }) => {

      if(controlPanel && buttonUp && buttonDown && target3) {

        if(mousePressed) {
            raycaster.setFromCamera( new THREE.Vector2(0,0), camera );

            const intersects = raycaster.intersectObjects( app.children );

            for ( let i = 0; i < intersects.length; i ++ ) {
              if(intersects[0].object.parent.name === "ButtonUp") {
                buttonUp.children[0].material = new THREE.MeshStandardMaterial({color: new THREE.Color(0xff0000)});
                currentTravel -= 0.01;

              }
              else if(intersects[0].object.parent.name === "ButtonDown") {
                buttonDown.children[0].material = new THREE.MeshStandardMaterial({color: new THREE.Color(0xff0000)});
                currentTravel += 0.01;
              }
            }
        }
        else {
          buttonUp.children[0].material = new THREE.MeshStandardMaterial({color: new THREE.Color(0x4a0000)});
          buttonDown.children[0].material = new THREE.MeshStandardMaterial({color: new THREE.Color(0x4a0000)});
        }

        currentTravel = THREE.MathUtils.clamp(currentTravel, maxTravel, minTravel);
        target3.position.x = currentTravel;
        target3.updateMatrixWorld();

      }

    });
  }

  return app;
};

