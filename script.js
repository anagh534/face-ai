const video = document.getElementById('video');
Promise.all([
    faceapi.nets.tinyFaceDetector.loadFromUri('models'),
    faceapi.nets.faceLandmark68Net.loadFromUri('models'),
    faceapi.nets.faceExpressionNet.loadFromUri('models')
]).then(begainVideo());

async function begainVideo() {
    let stream = null;
    try {
        stream = await navigator.mediaDevices.getUserMedia({ audio: false, video: true });
        video.srcObject = stream;
    }
    catch (err) {
        alert("Unable to connect to device");
        console.log(err);
    }
}
video.addEventListener('play', () => {
    const canvas = faceapi.createCanvasFromMedia(video)
    document.body.append(canvas);
    const dim = { width: video.width, height: video.height }
    faceapi.matchDimensions(canvas, dim);
    setInterval(async () => {
        const detections = await faceapi.detectAllFaces(video, new faceapi.TinyFaceDetectorOptions()).withFaceLandmarks().withFaceExpressions()
        const resizeDetections = faceapi.resizeResults(detections, dim)
        canvas.getContext("2d").clearRect(0, 0, canvas.width, canvas.height)
        faceapi.draw.drawDetections(canvas, resizeDetections)
        faceapi.draw.drawFaceLandmarks(canvas,resizeDetections)
        faceapi.draw.drawFaceExpressions(canvas,resizeDetections)
    },100)
})