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

      listenToControls()
    }
  })
}

export function listenToControls() {
  var video = document.querySelector<HTMLVideoElement>('#videoComponent')

  video?.addEventListener('play', () => {
    console.log('play')
  })

  video?.addEventListener('pause', () => {
    console.log('pause')
  })

  video?.addEventListener('timeupdate', () => {
    var currentTime = video?.currentTime;
    //console.log('Current Time: ' + currentTime?.toFixed(2) + ' seconds');
  })
}