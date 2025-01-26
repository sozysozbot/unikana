function beepSound() {
    const audioContext = new window.AudioContext();
    const oscillator = audioContext.createOscillator();
    oscillator.type = "sawtooth";
    oscillator.frequency.setValueAtTime(98, audioContext.currentTime); // Pitch: G2
    const gainNode = audioContext.createGain();
    gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    oscillator.start();
    oscillator.stop(audioContext.currentTime + 0.2);
}

function clickSound() {
    const audioContext = new window.AudioContext();

    const bufferSize = audioContext.sampleRate * 0.05 /* seconds */;
    const buffer = audioContext.createBuffer(1, bufferSize, audioContext.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
        data[i] = Math.random() * 2 - 1;
    }

    const noise = audioContext.createBufferSource();
    noise.buffer = buffer;

    const highPass = audioContext.createBiquadFilter();
    highPass.type = "highpass";
    highPass.frequency.setValueAtTime(500 /*Hz*/, audioContext.currentTime);

    const lowPass = audioContext.createBiquadFilter();
    lowPass.type = "lowpass";
    lowPass.frequency.setValueAtTime(1500 /*Hz*/, audioContext.currentTime);

    const gainNode = audioContext.createGain();
    gainNode.gain.setValueAtTime(0.9, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.05/* seconds; decay*/);

    noise.connect(highPass);
    highPass.connect(lowPass);
    lowPass.connect(gainNode);
    gainNode.connect(audioContext.destination);

    noise.start();
}
