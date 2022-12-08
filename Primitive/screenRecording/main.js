let mediaRecord; //用于录制视频
let mediaStream; //视频流
let videoBuffer = []; //保存的视频数据
let videoUrl = ""; //生成的视频临时地址

const startButton = document.getElementById("start-button");
const pauseButton = document.getElementById("pause-button");
const resumeButton = document.getElementById("resume-button");
const stopButton = document.getElementById("stop-button");
const downloadButton = document.getElementById("download-button");
const textTitle = document.getElementById("text");
const videoPreview = document.getElementById("preview");
const videoPlayback = document.getElementById("playback");

pauseButton.setAttribute("disabled", "disabled");
resumeButton.setAttribute("disabled", "disabled");
stopButton.setAttribute("disabled", "disabled");
downloadButton.setAttribute("disabled", "disabled");

videoPlayback.style = "display: none";
textTitle.innerText = "实时映射";

/**
 * 开始录屏
 */
async function startRecord() {
  if (!navigator.mediaDevices && !navigator.mediaDevices.getDisplayMedia) {
    alert("当前浏览器不支持屏幕捕捉");
    return;
  }
  reset();

  //获取视频流，这时候会弹出用户选择框，前提用户设备支持
  mediaStream = await navigator.mediaDevices.getDisplayMedia({
    audio: true,
    video: true,
  });
  //延迟录制时间，等待弹框的消失
  setTimeout(() => {
    mediaRecord = new MediaRecorder(mediaStream, {
      mimeType: "video/webm;codecs=vp9",
      audioBitsPerSecond: 128000, //音频码率
      videoBitsPerSecond: 250000000, //视频码率
    });
    mediaRecord.ondataavailable = function (e) {
      if (e.data.size > 0) {
        console.info("视频数据可用", e, mediaRecord);
        videoBuffer.push(e.data);
        //   downloadButton.removeAttribute("disabled");
      }
    };
    mediaRecord.onstop = function (e) {
      stopRecord();
    };
    mediaRecord.start(1000); //每隔1s保存一下

    //视频预览
    videoPreview.srcObject = mediaStream;

    pauseButton.removeAttribute("disabled");
    stopButton.removeAttribute("disabled");
    startButton.setAttribute("disabled", "disabled");
    videoPlayback.style = "display: none";
    videoPreview.style = "display: inline-block";
    textTitle.innerText = "实时映射";
  }, 300);
}

function reset() {
  mediaRecord = null;
  mediaStream = null;
  videoBuffer = [];
}

function pauseRecord() {
  resumeButton.removeAttribute("disabled");
  pauseButton.setAttribute("disabled", "disabled");
  mediaRecord && mediaRecord.state === "recording" && mediaRecord.pause();
}

function resumeRecord() {
  pauseButton.removeAttribute("disabled");
  resumeButton.setAttribute("disabled", "disabled");
  mediaRecord && mediaRecord.state === "paused" && mediaRecord.resume();
}

/**
 * 停止录制
 */
function stopRecord() {
  if (mediaStream) {
    for (let track of mediaStream.getTracks()) {
      track.stop();
    }
  }
  mediaRecord && mediaRecord.state !== "inactive" && mediaRecord.stop();

  startButton.removeAttribute("disabled");
  pauseButton.setAttribute("disabled", "disabled");
  resumeButton.setAttribute("disabled", "disabled");
  stopButton.setAttribute("disabled", "disabled");
  downloadButton.removeAttribute("disabled");
  videoPreview.style = "display: none";
  videoPlayback.style = "display: inline-block";
  textTitle.innerText = "回放";

  console.log(videoBuffer);
  if (videoBuffer == null || videoBuffer.length == 0) {
    alert("没有视频数据");
    return;
  }
  let blob = new Blob(videoBuffer, {
    type: "video/webm",
  });
  videoUrl = URL.createObjectURL(blob);
  videoPlayback.src = videoUrl;
}

function download() {
  let a = document.createElement("a");
  document.body.appendChild(a);
  a.style = "display: none";
  a.href = videoUrl;
  a.download = "test.webm";
  a.click();
  window.URL.revokeObjectURL(videoUrl);
}
