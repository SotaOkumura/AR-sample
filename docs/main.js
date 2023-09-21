// OS識別用
let os;

// DOM構築完了イベントハンドラ登録
window.addEventListener("DOMContentLoaded", init);

// 初期化
function init() {
    // 簡易的なOS判定
    os = detectOSSimply();
    if (os == "iphone") {
        // alert("iphone");
        // safari用。DeviceOrientation APIの使用をユーザに許可して貰う
        // document.getElementById("permit").addEventListener("click", permitDeviceOrientationForSafari);

        window.addEventListener(
            "deviceorientation",
            orientation,
            true
        );
    } else if (os == "android") {
        // alert("android");
        window.addEventListener(
            "deviceorientationabsolute",
            orientation,
            true
        );
    } else{
        window.alert("PC未対応");
    }

    /*
    document.body.insertAdjacentHTML("beforeend",
            `<a-scene id="map">
                <a-entity camera look-controls orbit-controls="target: 0 1.6 -0.5; maxPolarAngle:180; minDistance: 0.5; maxDistance: 200; initialPosition: 0 10 30"></a-entity>
                <a-gltf-model src="./model/map.glb"  position="0 -1 0" rotation="0 0 0" scale="8 8 8"></a-gltf-model>
                <a-sky color="#9EA1E7"></a-sky>
            </a-scene>`
        );
        */
       {
            //シーンの基本設定
            var scene = new THREE.Scene();
            var width = 600;
            var height = 400;
            var fov = 60;
            var aspect = width / height;//アスペクト比
            var near = 1;//ここから
            var far = 1000;//ここまでの間に3Dの描画を行う
            var camera = new THREE.PerspectiveCamera( fov, aspect, near, far);
            camera.position.set(0,0,10);//カメラの位置。ここでは10手前に引いている
            var controls = new THREE.OrbitControls(camera);
           
            // if(!Detector.webgl) Detector.addGetWebGLMessage();
          //レンダラーをDOM上に設置する
            var renderer = new THREE.WebGLRenderer({antialias:true});
            renderer.setClearColor(0xFFFFFF, 1);
            renderer.setSize( width,height );
            document.body.appendChild(renderer.domElement);
           
          //光源を設定する
            var directionalLight = new THREE.DirectionalLight( 0xffffff);
            directionalLight.position.set( 0, 0.7, 0.7); //光源の角度
            scene.add(directionalLight);
           
            /*
          //geometry(形状)とmaterial(素材)を元に物体(Mesh)を作成
            var geometry = new THREE.Geometry();
            geometry.vertices.push(new THREE.Vector3(0,0,4)); //頂点の作成
            geometry.vertices.push(new THREE.Vector3(2,0,0));
            geometry.vertices.push(new THREE.Vector3(0,-2,0));
            geometry.vertices.push(new THREE.Vector3(-2,0,0));
            geometry.vertices.push(new THREE.Vector3(0,2,0));
            geometry.vertices.push(new THREE.Vector3(0,0,-2));
           
            geometry.faces.push(new THREE.Face3(0,2,1)); //頂点を結んだ面の作成
            geometry.faces.push(new THREE.Face3(0,3,2));
            geometry.faces.push(new THREE.Face3(0,4,3));
            geometry.faces.push(new THREE.Face3(0,1,4));
            geometry.faces.push(new THREE.Face3(5,1,2));
            geometry.faces.push(new THREE.Face3(5,2,3));
            geometry.faces.push(new THREE.Face3(5,3,4));
            geometry.faces.push(new THREE.Face3(5,4,1));
           
            geometry.computeFaceNormals();//法線ベクトルの自動計算
            geometry.computeVertexNormals();//シェーディングを滑らかにする
          //素材と形状からメッシュを作成
            var material = new THREE.MeshNormalMaterial();
            var mesh = new THREE.Mesh(geometry,material);
            */
            const loader = new GLTFLoader();
 
            loader.load('./model/map.glb', function(gltf) {
                model = gltf.scene;
                model.traverse((object) => { //モデルの構成要素
                    if(object.isMesh) { //その構成要素がメッシュだったら
                    object.material.trasparent = true;//透明許可
                    object.material.opacity = 0.8;//透過
                    object.material.depthTest = true;//陰影で消える部分
                    }})
                scene.add(model);
            }, undefined, function(e) {
                console.error(e);
            });
            // scene.add(mesh);
           
            var wire = new THREE.MeshBasicMaterial({color: 0xffffff, wireframe: true});
            var wireMesh = new THREE.Mesh(geometry,wire);//同じ形状からワイヤーも作成
            scene.add(wireMesh);
           
            renderer.render(scene,camera);//これまでに作った内容をレンダリング
           
          //作成したメッシュをアニメーションさせる
            (function renderLoop(){
              requestAnimationFrame(renderLoop);
              controls.update();
              mesh.rotation.set(
                0,
                mesh.rotation.y + 0.02,
                mesh.rotation.z + 0.02
              )
              wireMesh.rotation.set(
                0,
                mesh.rotation.y + 0.02,
                mesh.rotation.z + 0.02
              )
              renderer.render(scene,camera);
            })();
          };
           
          //関数mainをDOM構築完了後に読み込む
          // window.addEventListener('DOMContentLoaded',main,false);
    const cameraNode = document.getElementById("camera");
    cameraNode.parentNode.removeChild(camera);
}


//test
// 簡易OS判定
function detectOSSimply() {
    let ret;
    if (
        navigator.userAgent.indexOf("iPhone") > 0 ||
        navigator.userAgent.indexOf("iPad") > 0 ||
        navigator.userAgent.indexOf("iPod") > 0
    ) {
        // iPad OS13のsafariはデフォルト「Macintosh」なので別途要対応
        ret = "iphone";
    } else if (navigator.userAgent.indexOf("Android") > 0) {
        ret = "android";
    } else {
        ret = "pc";
    }

    return ret;
}

// iPhone + Safariの場合はDeviceOrientation APIの使用許可をユーザに求める
// function permitDeviceOrientationForSafari() {
//     alert("request");
//     DeviceOrientationEvent.requestPermission()
//         .then(response => {
//             if (response === "granted") {
//                 window.addEventListener(
//                     "deviceorientation",
//                     detectDirection
//                 );
//             }
//         })
//         .catch(console.error);
// }

var aX = 0, aY = 0, aZ = 0;      // 加速度の値を入れる変数を3個用意

let flag = 0;
alert("更新12");

// let str = "";
// let cnt = 0;

// 加速度センサの値が変化したら実行される devicemotion イベント
window.addEventListener("devicemotion", (dat) => {
    aX = dat.accelerationIncludingGravity.x;    // x軸の重力加速度（Android と iOSでは正負が逆）
    aY = dat.accelerationIncludingGravity.y;    // y軸の重力加速度（Android と iOSでは正負が逆）
    aZ = dat.accelerationIncludingGravity.z;    // z軸の重力加速度（Android と iOSでは正負が逆）

    let X=Math.abs(aX);
    let Z=Math.abs(aZ);
    // str += `[${X},${Z}],`;
    // cnt ++;
    // if(cnt == 20){
    //     alert(str);
    //     cnt = 0;
    // }

    if((X>=4 || Z>=11) && flag == 0) flag = 1;


    if(flag == 1){
        flag *= -1; //flag 1->-1
        alert("検知");
        // document.body.insertAdjacentHTML("beforeend",
        //     `<a-scene>
        //         <a-entity camera look-controls orbit-controls="target: 0 1.6 -0.5; maxPolarAngle:180; minDistance: 0.5; maxDistance: 200; initialPosition: 0 0 30"></a-entity>
        //         <a-gltf-model  id="test" src="./model/map.glb"  position="0 -1 0" rotation="0 0 0" scale="8 8 8"></a-gltf-model>
        //         <a-sky color="#9EA1E7"></a-sky>
        //     </a-scene>`
        // );
        // const camera = document.getElementById("camera");
        // camera.parentNode.removeChild(camera);
    };

});