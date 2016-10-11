/**
 * CG Space Invaders
 * CG45179 16'17
 *
 * @author: Rui Ventura (ist181045)
 * @author: Diogo Freitas (ist181586)
 * @author: Sara Azinhal (ist181700)
 */

var camera, scene, renderer;
var clock = new THREE.Clock(true);
var MAX_SPEED = 750;
var velflag = 0; //1 right -1 left

function createOrtographicCamera() {
	camera = new THREE.OrthographicCamera(-1600, 1600, 820, -820, 1, 1000);
	camera.position.x = 0;
	camera.position.y = 100;
	camera.position.z = 0;
	camera.lookAt(scene.position);
}

function createPerspectiveCamera() {
	camera = new THREE.PerspectiveCamera(70, window.innerWidth / window.innerHeight, 1, 1000);
	camera.position.x = 75;
	camera.position.y = 75;
	camera.position.z = -75;
	camera.lookAt(scene.position);
}

function createScene() {
  	var rows = 2, columns = 4;
	scene = new THREE.Scene();
	scene.add(new THREE.AxisHelper(100));
	createField(0, 0, 0);
	createAlliedShip(0, 0, 600);
	var xDist = -75 * (columns - 1), zDist = -300;
	for (var i = 0; i < rows; i++){
		for (var e = 0; e < columns; e++){
			createEnemieShip(xDist, 0, zDist);
			xDist += 150;
		}
		zDist -= 100;
		xDist = -75 * (columns - 1);
	}
}

function createSceneMF() {
	scene = new THREE.Scene();
	scene.add(new THREE.AxisHelper(100));
	createAlliedShip(0, 0, 0);
}

function createSceneTF() {
	scene = new THREE.Scene();
	scene.add(new THREE.AxisHelper(100));
	createEnemieShip(0, 0, 0);
}

function render() {
	renderer.render(scene, camera);
}

function onResize() {
	renderer.setSize(window.innerWidth, window.innerHeight);

	if (window.innerWidth > 0 && window.innerHeight > 0) {
		camera.aspect = renderer.getSize().width / renderer.getSize().height;
		camera.updateProjectionMatrix();
	}
}

function onKeyUp(e) {
	console.log("onKeyUp");
  	switch(e.keyCode) {
    	case 37:
    	case 39:
	    	AShip.userData.braking = true;
	    	console.log("braking on");
	    	break;
  	}
}

function onKeyDown(e) {
	switch(e.keyCode) {
		case 65:
		case 97:
			material1.wireframe = !material1.wireframe;
			material2.wireframe = !material2.wireframe;
			material3.wireframe = !material3.wireframe;
			material4.wireframe = !material4.wireframe;
			material5.wireframe = !material5.wireframe;
			break;
		case 37:
			AShip.userData.direction = -1;
			console.log("onKeyDown - arrow left");
			//AShip.userData.braking = false;
			break;
	  	case 39:
	  		AShip.userData.direction = 1;
	  		console.log("onKeyDown - arrow right");
	  		//AShip.userData.braking = false;
			break;
		case 67:
			if (camera instanceof THREE.PerspectiveCamera){
				createOrtographicCamera();
			}
			else if (camera instanceof THREE.OrthographicCamera){
				createPerspectiveCamera();
			}
			break;
		case 77:
			createSceneMF();
			break;
		case 84:
			createSceneTF();
			break;
 	}
}

function animate() {
  	var interval = clock.getDelta();

  	if(AShip.userData.braking == false){
	  	if(AShip.userData.velocity > -MAX_SPEED && AShip.userData.velocity < MAX_SPEED){
			AShip.userData.velocity += AShip.userData.direction * AShip.userData.aceleration * interval;
		}
	}

	if((AShip.userData.direction == 1 && AShip.userData.velocity < 0) 
		|| (AShip.userData.direction == -1 && AShip.userData.velocity > 0)) {
		/*AShip.userData.velocity = 0;
		AShip.userData.direction = 0;*/
		AShip.userData.braking = true;
		//console.log("rip me");
	}


	if(AShip.userData.braking == true){
		
		/*if((AShip.userData.direction == 1 && AShip.userData.velocity == 0) 
			|| (AShip.userData.direction == -1 && AShip.userData.velocity == 0)) {
			AShip.userData.velocity = 0;
			AShip.userData.direction = 0;
			AShip.userData.braking = false;
			//console.log("rip me");
		}*/

		if (AShip.userData.braking) {
			if(velflag==0) {
				if(AShip.userData.velocity > 0) {
					velflag=1;
				}
				else {
					velflag=-1;
				}
			}

			//Key up brake	
			AShip.userData.velocity += -velflag * AShip.userData.aceleration * interval;
			console.log("braking");

			if((velflag==-1 && AShip.userData.velocity > 0) || (velflag==1 && AShip.userData.velocity < 0)) {
				AShip.userData.velocity = 0;
				AShip.userData.direction = 0;
				AShip.userData.braking = false;
				velflag=0;
				console.log("stopped");
			}
			
		}
	}

  	AShip.position.x += AShip.userData.velocity * interval;

  	if(AShip.position.x > 905){
  		AShip.position.x = 905;
  		AShip.userData.velocity = 0;
  		AShip.userData.direction = 0;
  		AShip.userData.braking = false;
  	}

  	if(AShip.position.x < -905){
  		AShip.position.x = -905;
  		AShip.userData.velocity = 0;
  		AShip.userData.direction = 0;
  		AShip.userData.braking = false;
  	}
   	
  	render();
	requestAnimationFrame(animate);
}

function init() {
	renderer = new THREE.WebGLRenderer({ antialias: true });
	renderer.setSize(window.innerWidth, window.innerHeight);
	document.body.appendChild(renderer.domElement);
	createScene();
	createOrtographicCamera();

 	window.addEventListener("keyup", onKeyUp);
	window.addEventListener("keydown", onKeyDown);
	window.addEventListener("resize", onResize);
}