import { ownID } from "./socket";
import { setUpWatch } from "./video";

const configuration = { iceServers: [{ urls: 'stun:stun.l.google.com:19302' }] };
const peerConnection = new RTCPeerConnection(configuration);
export var controlChannel: RTCDataChannel;

export async function sendOffer(memberID: string, socket: any) {
    controlChannel = peerConnection.createDataChannel('videoControls');

    controlChannel.onopen = () => {
        console.log('Control channel is open');
        setUpWatch()
        
        controlChannel.onmessage = (event) => {
            console.log(`Control message: ${event.data}`);
        }
    }

    peerConnection.oniceconnectionstatechange = () => {
        if (peerConnection.iceConnectionState === 'connected') {
            console.log('Connected');
        }
    }

    peerConnection.onicecandidate = (event) => {
        if (event.candidate) {
            //console.log(`New ICE Candidate, reprint SDP: ${JSON.stringify(peerConnection.localDescription)}`);
            socket.emit('iceCandidate', ownID, memberID, event.candidate);
        }
    }

    // Listen for ICE candidates
    socket.on('iceCandidate', (iceCandidate: any) => {
        console.log(`ICE Candidate: ${JSON.stringify(iceCandidate)}`);
        peerConnection.addIceCandidate(iceCandidate);
    })

    peerConnection.createOffer()
    .then(offer => peerConnection.setLocalDescription(offer))
    .then(() => {
        console.log(`SDP Offer to ${memberID}: ${JSON.stringify(peerConnection.localDescription)}`);
        socket.emit('offerMember', ownID, memberID, peerConnection.localDescription);
    })

    listenForAnswer(socket, peerConnection);
}

export async function listenForOffer(socket: any) {
    socket.on("offerSDP", (senderID: string, offerSDP: any) => {
        console.log(`Offer SDP: ${JSON.stringify(offerSDP)}`);

        peerConnection.ondatachannel = (event) => {
            controlChannel = event.channel;

            controlChannel.onopen = () => {
                console.log('Control channel is open');
                setUpWatch()

                controlChannel.onmessage = (event) => {
                    console.log(`Control message: ${event.data}`);
                }
            }
        }

        peerConnection.oniceconnectionstatechange = () => {
            if (peerConnection.iceConnectionState === 'connected') {
                console.log('Connected');
            }
        }

        peerConnection.onicecandidate = (event) => {
            if (event.candidate) {
                //console.log(`New ICE Candidate, reprint SDP: ${JSON.stringify(peerConnection.localDescription)}`);
                socket.emit('iceCandidate', ownID, senderID, event.candidate);
            }
        }

        // Listen for ICE candidates
        socket.on('iceCandidate', (iceCandidate: any) => {
            console.log(`ICE Candidate: ${JSON.stringify(iceCandidate)}`);
            peerConnection.addIceCandidate(iceCandidate);
        })

        peerConnection.setRemoteDescription(offerSDP)
        .then(() => peerConnection.createAnswer())
        .then(answer => peerConnection.setLocalDescription(answer))
        .then(() => {
            console.log(`SDP Answer to ${senderID}: ${JSON.stringify(peerConnection.localDescription)}`);
            socket.emit('answerMember', ownID, senderID, peerConnection.localDescription);
        })
    })
}

export async function listenForAnswer(socket: any, peerConnection: RTCPeerConnection) {
    socket.on("answerSDP", (senderID: string, answerSDP: any) => {
        console.log(`Answer SDP: ${JSON.stringify(answerSDP)}`);
        peerConnection.setRemoteDescription(answerSDP);
    })
}

export async function listenToVideoControls() {

}