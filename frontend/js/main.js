const video = document.getElementById("video");
const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

const riskText = document.getElementById("riskText");
const riskFill = document.getElementById("riskFill");
const riskLabel = document.getElementById("riskLabel");
const aclEl = document.getElementById("acl");
const spineEl = document.getElementById("spine");
const hipEl = document.getElementById("hip");
const shoulderEl = document.getElementById("shoulder");
const anglesEl = document.getElementById("angles");
const exerciseText = document.getElementById("exerciseText");

// Chart setup
const riskChartCtx = document.getElementById("riskChart").getContext("2d");
const riskData = {
  labels: [],
  datasets: [{
    label: 'Risk %',
    data: [],
    borderColor: 'purple',
    backgroundColor: 'rgba(128,0,128,0.2)',
    tension: 0.3
  }]
};
const riskChart = new Chart(riskChartCtx, {
  type: 'line',
  data: riskData,
  options: {
    responsive: true,
    animation: false,
    scales: { y: { min: 0, max: 100 }, x: { display: false } }
  }
});

// Functions for angle and deviation
const clamp = (v, min, max) => Math.max(min, Math.min(max, v));

function angle(A, B, C) {
  const AB = { x: A.x - B.x, y: A.y - B.y };
  const CB = { x: C.x - B.x, y: C.y - B.y };
  const dot = AB.x * CB.x + AB.y * CB.y;
  const mag = Math.hypot(AB.x, AB.y) * Math.hypot(CB.x, CB.y);
  return (Math.acos(clamp(dot / mag, -1, 1)) * 180) / Math.PI;
}

function verticalDeviation(A, B) {
  const dx = A.x - B.x;
  const dy = A.y - B.y;
  return (Math.atan2(Math.abs(dx), Math.abs(dy)) * 180) / Math.PI;
}

// Web Audio API beep for high risk
function playBeep(duration = 200, frequency = 440, volume = 0.5) {
  const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  const oscillator = audioCtx.createOscillator();
  const gainNode = audioCtx.createGain();
  oscillator.connect(gainNode);
  gainNode.connect(audioCtx.destination);
  gainNode.gain.value = volume;
  oscillator.frequency.value = frequency;
  oscillator.type = 'sine';
  oscillator.start();
  setTimeout(() => { oscillator.stop(); audioCtx.close(); }, duration);
}
let alertPlaying = false;

// MediaPipe Pose setup
const pose = new Pose({ locateFile: f => `https://cdn.jsdelivr.net/npm/@mediapipe/pose@0.5/${f}` });
pose.setOptions({ modelComplexity: 1, smoothLandmarks: true, minDetectionConfidence: 0.5, minTrackingConfidence: 0.5 });

pose.onResults(r => {
  ctx.save();
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.drawImage(r.image, 0, 0, canvas.width, canvas.height);

  if (!r.poseLandmarks) { ctx.restore(); return; }

  drawConnectors(ctx, r.poseLandmarks, POSE_CONNECTIONS, { color: "#00ffd7", lineWidth: 2 });
  drawLandmarks(ctx, r.poseLandmarks, { color: "#ff5c5c", lineWidth: 1 });

  const lm = r.poseLandmarks;
  const leftKnee = angle(lm[23], lm[25], lm[27]);
  const rightKnee = angle(lm[24], lm[26], lm[28]);
  const midShoulder = { x: (lm[11].x + lm[12].x) / 2, y: (lm[11].y + lm[12].y) / 2 };
  const midHip = { x: (lm[23].x + lm[24].x) / 2, y: (lm[23].y + lm[24].y) / 2 };
  const trunk = verticalDeviation(midShoulder, midHip);
  const shoulderDeviation = clamp(Math.abs(lm[11].y - lm[12].y) * 1000, 0, 100);
  const hipStability = clamp(100 - Math.abs(lm[23].y - lm[24].y) * 800, 0, 100);
  const kneeRisk = clamp((180 - Math.min(leftKnee, rightKnee)) * 0.7, 0, 100);
  const spineRisk = clamp(trunk * 2, 0, 100);
  const shoulderRisk = clamp(shoulderDeviation, 0, 100);

  // Risk calculation starting from 0%
  const total = Math.round(0.35 * kneeRisk + 0.35 * spineRisk + 0.3 * shoulderRisk);

  // Update panel
  riskText.textContent = total + "%";
  riskFill.style.width = total + "%";
  riskLabel.textContent = total < 35 ? "Good" : total < 65 ? "Moderate" : "High Risk";
  riskLabel.className = total < 35 ? "green" : total < 65 ? "yellow" : "red";

  aclEl.textContent = Math.round(kneeRisk) + "%";
  spineEl.textContent = Math.round(spineRisk) + "%";
  hipEl.textContent = Math.round(hipStability) + "%";
  shoulderEl.textContent = Math.round(100 - shoulderDeviation) + "%";

  // Update angles (Live Angles section)
  anglesEl.innerHTML = `Left Knee: ${leftKnee.toFixed(1)}°<br>Right Knee: ${rightKnee.toFixed(1)}°<br>Trunk: ${trunk.toFixed(1)}°`;

  // Update exercise recommendation (Corrective Exercise section)
  exerciseText.textContent = total < 35 ? "Maintain posture, no exercise needed." :
    total < 65 ? "Do 15s back stretch and 10 squats." :
      "High risk! Perform 30s back stretch + 20 squats + shoulder alignment exercise.";

  // Update risk chart color
  if (total >= 50) { 
    riskChart.data.datasets[0].borderColor = 'red'; 
    riskChart.data.datasets[0].backgroundColor = 'rgba(255,0,0,0.2)'; 
    if (!alertPlaying) { 
      playBeep(); 
      alertPlaying = true; 
    } 
  } else { 
    riskChart.data.datasets[0].borderColor = 'purple'; 
    riskChart.data.datasets[0].backgroundColor = 'rgba(128,0,128,0.2)';
    alertPlaying = false;
  }

  // Update risk chart data
  riskData.labels.push('');
  riskData.datasets[0].data.push(Math.max(0, total));
  if (riskData.labels.length > 50) {
    riskData.labels.shift();
    riskData.datasets[0].data.shift();
  }
  riskChart.update();
});

const cam = new Camera(video, { onFrame: async () => await pose.send({ image: video }), width: 480, height: 360 });
cam.start();
