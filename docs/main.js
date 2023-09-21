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
alert("更新10");

let str = "";
let cnt = 0;

// 加速度センサの値が変化したら実行される devicemotion イベント
window.addEventListener("devicemotion", (dat) => {
    aX = dat.accelerationIncludingGravity.x;    // x軸の重力加速度（Android と iOSでは正負が逆）
    aY = dat.accelerationIncludingGravity.y;    // y軸の重力加速度（Android と iOSでは正負が逆）
    aZ = dat.accelerationIncludingGravity.z;    // z軸の重力加速度（Android と iOSでは正負が逆）

    let X=Math.abs(aX);
    let Z=Math.abs(aZ);
    str += `[${X},${Z}],`;
    cnt ++;
    if(cnt == 20){
        alert(str);
        cnt = 0;
    }

    if((X>=2 || Z>=2) && flag == 0) flag = 1;


    if(flag == 1){
        flag *= -1; //flag 1->-1
        alert("検知");
        document.body.insertAdjacentHTML("beforeend",
            `<a-scene>
                <a-entity camera look-controls orbit-controls="target: 0 1.6 -0.5; maxPolarAngle:180; minDistance: 0.5; maxDistance: 200; initialPosition: 0 0 30"></a-entity>
                <a-gltf-model  id="test" src="./model/map.glb"  position="0 -1 0" rotation="0 0 0" scale="8 8 8"></a-gltf-model>
                <a-sky color="#9EA1E7"></a-sky>
            </a-scene>`
        )
    };

});