// camera.js
export class Camera {
  constructor(videoElement, config) {
    this.videoElement = videoElement;
    this.config = config;
    this.stream = null;
  }

  async start() {
    this.stream = await navigator.mediaDevices.getUserMedia({
      video: { facingMode: 'user' },
    });
    this.videoElement.srcObject = this.stream;
    this.videoElement.play();
  }

  stop() {
    if (this.stream) {
      this.stream.getTracks().forEach(track => track.stop());
    }
  }
}
