const CLASSES = {0:'zero', 1:'one', 2:'two', 3:'three', 4:'four',5:'five', 6:'six', 7:'seven', 8:'eight', 9:'nine'}

//-----------------------
// start button event
//-----------------------

/*
$("#start-button").click(function(){
	loadModel() ;
	startWebcam();
});
*/

/*
document.getElementById("start-button").onClick(function(){
  loadModel() ;
  startWebcam();
});
*/

const button = document.getElementById("start-button");
button.addEventListener('click', () => {
  console.log('start loading model');
  loadModel() ;
  startWebcam();
});


//-----------------------
// load model
//-----------------------

/*
let model;
async function loadModel() {
	console.log("model loading..");
	$("#console").html(`<li>model loading...</li>`);
	model=await tf.loadModel(`http://localhost:8080/sign_language_vgg16/model.json`);
	console.log("model loaded.");
	$("#console").html(`<li>VGG16 pre trained model loaded.</li>`);
};
*/

let model;
async function loadModel() {
  console.log("model loading..");
  document.getElementById("console").innerHTML =`<li>model loading...</li>`;
  model=await tf.loadModel(`model/model.json`);
  console.log("model loaded.");
  document.getElementById("console").innerHTML = "<li>VGG16 pre trained model loaded.</li>";
};


//-----------------------
// start webcam 
//-----------------------

var video;
function startWebcam() {
	console.log("video streaming start.");
	document.getElementById("console").innerHTML = `<li>video streaming start.</li>`;
	video = document.getElementById("main-stream-video").get(0);
	vendorUrl = window.URL || window.webkitURL;

	navigator.getMedia = navigator.getUserMedia ||
						 navigator.webkitGetUserMedia ||
						 navigator.mozGetUserMedia ||
						 navigator.msGetUserMedia;

	navigator.getMedia({
		video: true,
		audio: false
	}, function(stream) {
		localStream = stream;
		video.srcObject = stream;
		video.play();
	}, function(error) {
		alert("Something wrong with webcam!");
	});
}






//-----------------------
// predict button event
//-----------------------

/*
$("#predict-button").click(function(){
	setInterval(predict, 1000/10);
});
*/

document.getElementById("predict-button").addEventListener('click', () => {
  console.log('predict-button clicked');
  setInterval(predict, 1000/100);
});



//-----------------------
// TensorFlow.js method
// predict tensor
//-----------------------

async function predict(){
	let tensor = captureWebcam();

	let prediction = await model.predict(tensor).data();
	let results = Array.from(prediction)
				.map(function(p,i){
	return {
		probability: p,
		className: CLASSES[i]
	};
	}).sort(function(a,b){
		return b.probability-a.probability;
	}).slice(0,2);

	//$("#console").empty();
	document.getElementById("console").empty();

	results.forEach(function(p){
	  document.getElementById("console").append(`<li>${p.className} : ${p.probability.toFixed(6)}</li>`);
		console.log(p.className,p.probability.toFixed(6))
	});

};

//------------------------------
// capture streaming video 
// to a canvas object
//------------------------------

function captureWebcam() {
	var canvas    = document.createElement("canvas");
	var context   = canvas.getContext('2d');
	canvas.width  = video.width;
	canvas.height = video.height;

	context.drawImage(video, 0, 0, video.width, video.height);
	tensor_image = preprocessImage(canvas);

	return tensor_image;
}

//-----------------------
// TensorFlow.js method
// image to tensor
//-----------------------

function preprocessImage(image){
	let tensor = tf.fromPixels(image).resizeNearestNeighbor([100,100]).toFloat();	
	let offset = tf.scalar(255);
    return tensor.div(offset).expandDims();
}

//-----------------------
// clear button event
//-----------------------

/*
$("#clear-button").click(function clear() {
	location.reload();
});
*/

document.getElementById("clear-button").addEventListener('click', () => {
  console.log('clear-button clicked');
  location.reload();
});


