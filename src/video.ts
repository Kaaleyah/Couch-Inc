import { controlChannel, sendVideo } from "./rtc"

export function setVideoPlaceholder() {
  let videoContainer = document.querySelector<HTMLDivElement>('#video')
  let icon = document.createElement('img')
  icon.classList.add('icon')
  icon.src = '/movie.svg'

  videoContainer?.appendChild(icon)
}

export function setUpWatch() {
  const joinButtons = document.querySelectorAll<HTMLButtonElement>('.joinBtn')

  joinButtons.forEach((joinButton) => {
    joinButton.className = 'hidden'  
  })

  let videoInput = document.querySelector<HTMLInputElement>('#videoInput')
  videoInput?.classList.remove('hidden')
}

export function setVideo() {
  let videoInput = document.querySelector<HTMLInputElement>('#videoInput')

  videoInput?.addEventListener('change', () => {
    let videoComponent = document.createElement('video')
    videoComponent!.id = 'videoComponent'

    let videoContainer = document.querySelector<HTMLDivElement>('#video')
    videoContainer!.innerHTML = ''
    videoContainer?.appendChild(videoComponent!)

    if (videoInput?.files && videoInput?.files[0]) {
      videoComponent?.setAttribute('src', URL.createObjectURL(videoInput.files[0]))
      videoComponent?.setAttribute('controls', 'true')
      //videoComponent.muted = true

      sendVideo(videoComponent)

      //listenToControls()
    }
  })
}

export function listenToControls() {
  var video = document.querySelector<HTMLVideoElement>('#videoComponent')

  video?.addEventListener('play', () => {
    console.log('play')
    controlChannel.send(`play-${video?.currentTime.toFixed(2)}`)
  })

  video?.addEventListener('pause', () => {
    console.log('pause')
    controlChannel.send(`pause-${video?.currentTime.toFixed(2)}`)
  })

  video?.addEventListener('timeupdate', () => {
    var currentTime = video?.currentTime;
    //console.log('Current Time: ' + currentTime?.toFixed(2) + ' seconds');
  })

  handleVideoControls(video)
}

function handleVideoControls(video: HTMLVideoElement | null) {
  controlChannel.onmessage = (event) => {
    const [command, time] = event.data.split('-')
    console.log(`Control message: ${command + ' ' + time}`);
    if (video) {

      if (video.currentTime - time > 0.5 || video.currentTime - time < -0.5)
      video.currentTime = parseFloat(time)
      if (command == 'play') {
        video?.play()
      } else if (command == 'pause') {
        video?.pause()
      }
    }
  }
}