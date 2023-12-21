import './style.css'
import { setVideoPlaceholder, setVideo } from './video.ts'
import { sendAnswer, sendOffer } from './rtc.ts'
import { setUpSocket } from './socket.ts'



setVideoPlaceholder()
setVideo()
setUpSocket()