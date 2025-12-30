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
    setTimeout(() => {
        oscillator.stop();
        audioCtx.close();
    }, duration);
}