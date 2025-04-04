let faceMesh;
let video;
let faces = [];
let options = { maxFaces: 1, refineLandmarks: false, flipHorizontal: false };

function preload() {
  faceMesh = ml5.faceMesh(options);
}

function setup() {
  createCanvas(1000, 780);
  video = createCapture(VIDEO);
  video.size(1000, 780);
  video.hide();
  faceMesh.detectStart(video, gotFaces);
}

function draw() {
  image(video, 0, 0, width, height);

  if (faces.length > 0) {
    let face = faces[0];

    // Find the bounding box around the face
    let xMin = width, yMin = height, xMax = 0, yMax = 0;
    for (let keypoint of face.keypoints) {
      xMin = min(xMin, keypoint.x);
      yMin = min(yMin, keypoint.y);
      xMax = max(xMax, keypoint.x);
      yMax = max(yMax, keypoint.y);
    }

    let w = xMax - xMin;
    let h = yMax - yMin;
    let diameter = max(w, h); // Ensuring a circular frame

    // Extract the face area from the video
    let faceImg = video.get(xMin, yMin, w, h);

    // Pixelate the face
    faceImg.resize(w / 9, h / 9);
    faceImg.resize(w, h);

    // Create a mask for the circular cutout
    let mask = createGraphics(w, h);
    mask.fill(255);
    mask.noStroke();
    mask.ellipse(w / 2, h / 2, diameter, diameter); // Draw a circle mask

    // Apply the mask to the face image
    faceImg.mask(mask);

    // Draw the circular masked face
    image(faceImg, xMin, yMin, w, h);
  }
}

// Callback function for when faceMesh outputs data
function gotFaces(results) {
  faces = results;
}
