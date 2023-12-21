import { io } from 'socket.io-client';
import { listenForOffer, sendOffer } from './rtc';

const socket = io('https://couchsocket.glitch.me/');
export var ownID = '';
var ownNick = '';

export async function setUpSocket() {
    let roomText = document.querySelector<HTMLInputElement>('#roomID');
    let roomBtn = document.querySelector<HTMLButtonElement>('#joinRoom');

    roomBtn?.addEventListener('click', () => {
        if (!roomText?.value) {
            return;
        }
        console.log(`Joining room ${roomText?.value}`);
        joinRoom(roomText?.value || '');

        listenForID()
        updateMembers()
        listenForOffer(socket)
    })
}

export async function joinRoom(ID: string) {
    socket.connect();
    socket.emit('join', ID);
}

function updateMembers() {
    let roomContainer = document.querySelector<HTMLDivElement>('#roomContainer');
    roomContainer?.classList.add('hidden');

    let membersContainer = document.querySelector<HTMLDivElement>('#membersContainer');
    membersContainer?.classList.remove('hidden');

    let membersList = document.querySelector<HTMLDivElement>('#memberList');

    // Update memers list
    socket.on("members", (members: Record<string, string>) => {
        console.log(members);
        if (membersList) {
            membersList.innerHTML = '';
        }

        for (let member in members) {
            console.log(members[member]);

            let memberDiv = document.createElement('div');
            memberDiv.classList.add('member');
            memberDiv.appendChild(document.createTextNode(members[member]));

            if (members[member] != ownNick) {
                let memberBtn = document.createElement('button');
                memberBtn.classList.add('joinBtn');
                memberBtn.appendChild(document.createTextNode('Join'));
                memberBtn.addEventListener('click', () => {
                    // Send offer to member
                    console.log(`Sending offer to ${members[member]}`);
                    sendOffer(member, socket);
                })
                memberDiv.appendChild(memberBtn);
            }
            membersList?.appendChild(memberDiv);
        }
    })
}

async function listenForID() {
    socket.on('id', (id: string, nick: string) => {
        ownID = id
        ownNick = nick
        console.log(`ID: ${id}`);
    })
}