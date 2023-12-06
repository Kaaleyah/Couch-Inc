import './style.css'
import movieIcon from '/movie.svg'
import { setupCounter } from './counter.ts'

document.querySelector<HTMLDivElement>('#video')!.innerHTML = `
  <img class="icon" src="${movieIcon}" />
`