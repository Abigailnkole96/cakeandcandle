document.addEventListener('DOMContentLoaded', function() {
    const flame = document.querySelector('.flame');

    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        navigator.mediaDevices.getUserMedia({ audio: true }).then(stream => {
            const audioContext = new (window.AudioContext || window.webkitAudioContext)();
            const microphone = audioContext.createMediaStreamSource(stream);
            const analyser = audioContext.createAnalyser();
            analyser.fftSize = 256;
            const bufferLength = analyser.frequencyBinCount;
            const dataArray = new Uint8Array(bufferLength);

            microphone.connect(analyser);

            function detectBlow() {
                analyser.getByteTimeDomainData(dataArray);

                let sum = 0;
                for (let i = 0; i < bufferLength; i++) {
                    sum += (dataArray[i] - 128) * (dataArray[i] - 128);
                }
                const rms = Math.sqrt(sum / bufferLength);

                // Detect a blow by checking if the RMS exceeds a threshold
                if (rms > 25) { // Adjust this threshold as needed
                    flame.classList.add('flame-off');
                }

                requestAnimationFrame(detectBlow);
            }

            detectBlow();
        }).catch(error => {
            console.error('Error accessing the microphone', error);
        });
    } else {
        console.error('getUserMedia not supported on your browser!');
    }
});
