// import * as THREE from './js/three.module.js';
// import Stats from './js/stats.module.js'
// import { OrbitControls } from './js/OrbitControls.js'
// import floor from './images/hardwood2_diffuse.jpg';

console.log('查看当前屏幕设备像素比：', window.devicePixelRatio)

// --场景--
const scene = new THREE.Scene()

// --摄相机--
// 透视摄像机(视野角度FOV，长宽比，近截面near，远截面far)
const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  2000
)
// 调整位置
camera.position.x = -30
camera.position.y = 40
camera.position.z = 30
// 锁定摄像机镜头方向，看向原点；
camera.lookAt(scene.position)

// --渲染器--
const renderer = new THREE.WebGLRenderer({
  antialias: true,
})
// 设置尺寸
renderer.setSize(window.innerWidth, window.innerHeight)
// 设置渲染器颜色
renderer.setClearColor(new THREE.Color(0x000000)) // 背景颜色
renderer.shadowMap.enabled = true // 启用阴影
// 设置阴影类型
// renderer.shadowMap.type = THREE.BasicShadowMap; // 基本阴影映射类型，效果最差，性能最好；
renderer.shadowMap.type = THREE.PCFSoftShadowMap // 使用软阴影技术生成阴影，通过多次采样和模糊处理来产生更柔和的阴影效果；但是radius会失效(可以通过减少mapSize来增加模糊性)；
// 获取你屏幕对应的设备像素比.devicePixelRatio告诉threejs,以免渲染模糊问题
// renderer.setPixelRatio(window.devicePixelRatio);
// 将 webgl 渲染的 canvas 元素添加到 body
document.body.appendChild(renderer.domElement)

// 坐标轴
const axes = new THREE.AxesHelper(20)
scene.add(axes)

// console.log('images：', floor);
/** 初始化纹理加载器 */
const textLoader = new THREE.TextureLoader()
// 加载地面图片(图片宽度可能会被调整以适应平面宽度)
const planeTexture = textLoader.load('./images/hardwood2_diffuse.jpg')

// 平面
const planeGeometry = new THREE.PlaneGeometry(60, 30, 1, 1)
// 材质(最基本的MeshBasicMaterial材质对光源不会有任何反应)
// const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
// 地面材质，朗伯材质，非光泽表面的材质（可接受光照产生阴影效果）
const planeMaterial = new THREE.MeshLambertMaterial({
  color: 0xcccccc,
  // 矩形平面网格模型默认单面显示，可以设置side属性值为THREE.DoubleSide双面显示
  side: THREE.DoubleSide,
  map: planeTexture,
  // wireframe: true, // 线条模式渲染mesh对应的三角形数据
})
// Mesh，网格，合成物体元素时会用到；
const plane = new THREE.Mesh(planeGeometry, planeMaterial)
// 平面旋转
plane.rotation.x = -0.5 * Math.PI
// 调整位置
plane.position.x = 0
plane.position.y = 0
plane.position.z = 0
// 设置平面接受阴影
plane.receiveShadow = true
scene.add(plane)
console.log('查看平面几何体三角形数量：', planeGeometry.faces?.length)

// --立方体纹理--
// 立方体侧面纹理
const cubeSideTexture = textLoader.load('./images/minecraft/grass_dirt.png')
// 立方体顶部纹理
const cubeTopTexture = textLoader.load('./images/minecraft/grass.png')
// 立方体底部纹理
const cubeBottomTexture = textLoader.load('./images/minecraft/dirt.png')

// --立方体材质--
const cubeMaterials = [
  // 立方体侧面材质(x轴正面)
  new THREE.MeshLambertMaterial({
    map: cubeSideTexture,
  }),
  // 立方体侧面材质(x轴负面)
  new THREE.MeshLambertMaterial({
    map: cubeSideTexture,
  }),
  // 立方体顶部材质(y轴正面)
  new THREE.MeshLambertMaterial({
    map: cubeTopTexture,
  }),
  // 立方体底部材质(y轴负面)
  new THREE.MeshLambertMaterial({
    map: cubeBottomTexture,
  }),
  // 立方体侧面材质(z轴正面)
  new THREE.MeshLambertMaterial({
    map: cubeSideTexture,
  }),
  // 立方体侧面材质(z轴负面)
  new THREE.MeshLambertMaterial({
    map: cubeSideTexture,
  }),
]

// 几何体(这里设为立方体)
const geometry = new THREE.BoxGeometry(4, 4, 4)

// 创建立方体
const cube = new THREE.Mesh(geometry, cubeMaterials)
// 调整位置
cube.position.x = 0
cube.position.y = 3
cube.position.z = 0
// 给立方体设置投影
cube.castShadow = true
// 添加到场景去
scene.add(cube)

// 随机创建大量的模型,测试渲染性能
const num = 1000 //控制长方体模型数量
const tempArr = [] // 存储临时立方体到数组
for (let i = 0; i < num; i++) {
  let geometry = new THREE.BoxGeometry(4, 4, 4)
  let material = new THREE.MeshLambertMaterial({ color: 0x00ffff })
  let tempCube = new THREE.Mesh(geometry, material)
  // 随机生成长方体xyz坐标
  let x = (Math.random() - 0.5) * 200
  let y = (Math.random() - 0.5) * 200
  let z = (Math.random() - 0.5) * 200
  tempCube.position.set(x, y, z)
  // 给立方体设置投影
  tempCube.castShadow = true
  scene.add(tempCube) // 模型对象插入场景中
  tempArr[i] = tempCube
}

// --添加光效
// 环境光
const ambientLight = new THREE.AmbientLight(0xffffff, 0.2)
scene.add(ambientLight)

// 方向光
// const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
// directionalLight.position.set(10, 10, 10);
// scene.add(directionalLight);

// 聚光灯(光源颜色，光照强度)
const spotLight = new THREE.SpotLight(0xffffff)
// 光照强度
// spotLight.intensity = 1.0;
// 光源位置
spotLight.position.set(-40, 160, -10)
// 发散角度
spotLight.angle = Math.PI / 6 // 光锥角度的二分之一
// 光源衰减(默认值是2.0)
// spotLight.decay = 0.0; // 不衰减；
// 设置聚光灯投射阴影
spotLight.castShadow = true
// 阴影大小，越大越精细；
spotLight.shadow.mapSize.width = 1024
spotLight.shadow.mapSize.height = 1024
// 阴影模糊
// spotLight.shadow.radius = 2;
// 阴影，远截面
// spotLight.shadow.camera.far = 1000;
// 阴影，近截面
// spotLight.shadow.camera.near = 0.1;
scene.add(spotLight)

// 光源辅助线
const spotLightHelper = new THREE.SpotLightHelper(spotLight)
scene.add(spotLightHelper)

// --添加轨道控制器(可以使得相机围绕目标进行轨道运动。)--
const controls = new THREE.OrbitControls(camera, renderer.domElement)

// 状态监视器
const stats = new Stats()
// 设置模式，（0: fps, 1: 帧渲染周期ms, 2: mb）
stats.setMode(0)
// 显示面板，传入面板id（0: fps, 1: ms, 2: mb）
stats.showPanel(0)
document.body.appendChild(stats.domElement)

// 渲染
// 下面一行，只是静态的；
// renderer.render(scene, camera)
// 替换为函数

// 时钟
const clock = new THREE.Clock()

// 动画
function animate() {
  // 返回已经过去的时间, 以秒为单位
  let elapsedTime = clock.getElapsedTime()
  // console.log(elapsedTime);

  // 立方体旋转
  cube.rotation.x += 0.01 // x轴
  cube.rotation.y += 0.01 // y轴
  // 两秒自转一圈
  cube.rotation.z = elapsedTime * Math.PI // z轴

  // 临时立方体也旋转
  tempArr.forEach((item) => {
    item.rotation.x += 0.01 // x轴
    item.rotation.y += 0.01 // y轴
    item.rotation.z += 0.01 // z轴
  })

  // 更新帧数
  stats.update()

  // 更新控制器
  controls.update()

  // 渲染画面
  renderer.render(scene, camera)

  // 每帧动画
  requestAnimationFrame(animate)
}

animate()
