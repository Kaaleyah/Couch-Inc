export function setVideoPlaceholder() {
  let videoContainer = document.querySelector<HTMLDivElement>('#video')
  let icon = document.createElement('img')
  icon.classList.add('icon')
  icon.src = '/movie.svg'

  videoContainer?.appendChild(icon)
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
    }
  })
}