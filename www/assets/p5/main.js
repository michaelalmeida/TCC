var mic;

function setup() {
  //createCanvas(200, 200);
  mic = new p5.AudioIn();
  mic.start();
}
/*
function draw() {
  background(0);
  var vol = mic.getLevel();
  ellipse(100, 100, 200, vol * 200);
  select('p').html(vol);
}*/
