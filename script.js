// Three.js দিয়ে 3D ট্রেন গেম তৈরি
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ canvas: document.getElementById("gameCanvas") });
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// রেললাইন তৈরি
const trackGeometry = new THREE.BoxGeometry(10, 0.1, 100);
const trackMaterial = new THREE.MeshBasicMaterial({ color: 0x8B4513 });
const track = new THREE.Mesh(trackGeometry, trackMaterial);
scene.add(track);

// ট্রেন তৈরি
const trainGeometry = new THREE.BoxGeometry(5, 2, 10);
const trainMaterial = new THREE.MeshBasicMaterial({ color: 0xff0000 });
const train = new THREE.Mesh(trainGeometry, trainMaterial);
train.position.y = 1;
scene.add(train);

// দরজা তৈরি
const doorGeometry = new THREE.BoxGeometry(0.1, 2, 3);
const doorMaterial = new THREE.MeshBasicMaterial({ color: 0x333333 });
const leftDoor = new THREE.Mesh(doorGeometry, doorMaterial);
const rightDoor = new THREE.Mesh(doorGeometry, doorMaterial);
leftDoor.position.set(-2.5, 1, 3);
rightDoor.position.set(2.5, 1, 3);
scene.add(leftDoor, rightDoor);

// স্টেশন তৈরি
const stationGeometry = new THREE.BoxGeometry(15, 2, 5);
const stationMaterial = new THREE.MeshBasicMaterial({ color: 0xaaaaaa });
const station = new THREE.Mesh(stationGeometry, stationMaterial);
station.position.set(0, 1, 30);
scene.add(station);

// সিগন্যাল লাইট তৈরি
const signalGeometry = new THREE.BoxGeometry(1, 3, 1);
const signalMaterialRed = new THREE.MeshBasicMaterial({ color: 0xff0000 });
const signalMaterialGreen = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
const signal = new THREE.Mesh(signalGeometry, signalMaterialRed);
signal.position.set(-6, 3, 25);
scene.add(signal);

// ক্যামেরার অবস্থান ঠিক করা
camera.position.set(0, 5, 20);
camera.lookAt(train.position);

// দরজা খোলা-বন্ধের কন্ডিশন
let doorsOpen = false;
function toggleDoors() {
    if (!doorsOpen) {
        leftDoor.position.x -= 0.5;
        rightDoor.position.x += 0.5;
        document.getElementById("doorSound").play();
    } else {
        leftDoor.position.x += 0.5;
        rightDoor.position.x -= 0.5;
    }
    doorsOpen = !doorsOpen;
}

// ট্রেন মুভমেন্ট
let speed = 0;
document.addEventListener("keydown", (event) => {
    if (event.key === "w") speed = 0.5; // সামনে এগোবে
    if (event.key === "s") speed = -0.5; // পিছনে যাবে
    if (event.key === "h") document.getElementById("hornSound").play(); // হর্ন বাজাবে
    if (event.key === "d") toggleDoors(); // দরজা খোলা-বন্ধ
});

document.addEventListener("keyup", () => {
    speed = 0;
});

// ট্রেন স্টেশনে থামবে এবং সিগন্যাল পরিবর্তন হবে
function checkStationStop() {
    if (train.position.z <= 30.5 && train.position.z >= 29.5) {
        speed = 0;
        signal.material = signalMaterialGreen; // সবুজ সিগন্যাল দেখাবে
        setTimeout(() => {
            toggleDoors(); // দরজা খুলবে
            setTimeout(() => {
                toggleDoors(); // দরজা বন্ধ হবে
                setTimeout(() => {
                    signal.material = signalMaterialRed; // আবার লাল সিগন্যাল হবে
                }, 2000);
            }, 3000);
        }, 1000);
    }
}

// অ্যানিমেশন লুপ
function animate() {
    requestAnimationFrame(animate);
    train.position.z -= speed;
    checkStationStop();
    renderer.render(scene, camera);
}
animate();