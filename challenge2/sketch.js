let video;
let poseNet;
let poses = [];
let objects = [];
let score = 0;
let timer = 10;
let gameOver = false;

function setup() {
  let canvas = createCanvas(800, 600); 
  
 
  let canvasX = (windowWidth - width) / 2;
  let canvasY = (windowHeight - height) / 2;
  canvas.position(canvasX, canvasY);
  
  
  video = createCapture(VIDEO);
  video.size(width, height); 
  
  
  video.hide();
  
  
  poseNet = ml5.poseNet(video, modelReady);
  poseNet.on('pose', function(results) {
    poses = results;
  });
  
  
  for (let i = 0; i < 5; i++) {
    objects.push(new GameObject(random(50, width - 50), random(50, height - 50), 50, color(random(255), random(255), random(255))));
  }
  
  
  setInterval(updateTimer, 1000);
}

function modelReady() {
  console.log('Model Loaded');
}

function draw() {
  background(220);
  
  if (!gameOver) {
    
    push();
    translate(width, 0); 
    scale(-1, 1); 
    image(video, 0, 0, width, height); 
    pop();
    
    
    for (let object of objects) {
      object.display();
    }
    
    
    drawPoses();
    
    
    checkInteractions();
    
    
    textSize(24);
    fill(0);
    text('Score: ' + score, 20, 40);
    
    
    text('Time: ' + timer, width - 120, 40);
  } else {
    
    textSize(32);
    fill(255, 0, 0);
    textAlign(CENTER, CENTER);
    text('Game Over', width / 2, height / 2 - 50);
    textSize(24);
    text('Score: ' + score, width / 2, height / 2);
    
    fill(0, 100, 255);
    rectMode(CENTER);
    rect(width / 2, height / 2 + 50, 150, 50);
    fill(255);
    text('Restart', width / 2, height / 2 + 50);
  }
}

function drawPoses() {
  for (let i = 0; i < poses.length; i++) {
    let pose = poses[i].pose;
    let noseIndex = pose.keypoints.findIndex(kp => kp.part === 'nose');
    if (noseIndex !== -1) {
      let nose = pose.keypoints[noseIndex];
      fill(255, 0, 0);
      ellipse(width - nose.position.x, nose.position.y, 30, 30); 
    }
    
    let rightWristIndex = pose.keypoints.findIndex(kp => kp.part === 'rightWrist');
    if (rightWristIndex !== -1) {
      let rightWrist = pose.keypoints[rightWristIndex];
      fill(0, 255, 0);
      ellipse(width - rightWrist.position.x, rightWrist.position.y, 30, 30); 
    }
    
    let leftWristIndex = pose.keypoints.findIndex(kp => kp.part === 'leftWrist');
    if (leftWristIndex !== -1) {
      let leftWrist = pose.keypoints[leftWristIndex];
      fill(0, 255, 0);
      ellipse(width - leftWrist.position.x, leftWrist.position.y, 30, 30); 
    }
  }
}

function checkInteractions() {
  if (timer > 0) {
    for (let i = 0; i < objects.length; i++) {
      for (let j = 0; j < poses.length; j++) {
        let pose = poses[j].pose;
        let noseIndex = pose.keypoints.findIndex(kp => kp.part === 'nose');
        let rightWristIndex = pose.keypoints.findIndex(kp => kp.part === 'rightWrist');
        let leftWristIndex = pose.keypoints.findIndex(kp => kp.part === 'leftWrist');
        if (noseIndex !== -1 && rightWristIndex !== -1 && leftWristIndex !== -1) {
          let nose = pose.keypoints[noseIndex];
          let rightWrist = pose.keypoints[rightWristIndex];
          let leftWrist = pose.keypoints[leftWristIndex];
          let d1 = dist(objects[i].x, objects[i].y, width - nose.position.x, nose.position.y);
          let d2 = dist(objects[i].x, objects[i].y, width - rightWrist.position.x, rightWrist.position.y);
          let d3 = dist(objects[i].x, objects[i].y, width - leftWrist.position.x, leftWrist.position.y);
          if (d1 < 20 || d2 < 20 || d3 < 20) {
            
            objects[i].pushOutsideCanvas();
            
            score++;
          }
        }
      }
    }
  } else {
    
    gameOver = true;
  }
}

function updateTimer() {
  if (!gameOver && timer > 0) {
    timer--;
  }
}

function mouseClicked() {
  
  if (gameOver && mouseX > width / 2 - 75 && mouseX < width / 2 + 75 && mouseY > height / 2 + 25 && mouseY < height / 2 + 75) {
    timer = 10;
    score = 0;
    gameOver = false;
  }
}

class GameObject {
  constructor(x, y, size, col) {
    this.x = x;
    this.y = y;
    this.size = size;
    this.col = col;
  }
  
  display() {
    fill(this.col);
    ellipse(this.x, this.y, this.size, this.size);
  }
  
  pushOutsideCanvas() {
    
    this.x = random(50, width - 50);
    this.y = random(50, height - 50);
  }
}
