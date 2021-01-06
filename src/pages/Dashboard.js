import React from 'react'
import './Dashboard.css'

import io from 'socket.io-client'
import faker from "faker"
import swal from 'sweetalert';
import { message } from 'antd'
import { Row } from 'reactstrap'


import arrow_up from './../assets/images/arrow_up.png'
import ImageButton from './../component/ImageButton'
import audio_on from './../assets/images/audio_on.png'
import audio_off from './../assets/images/audio_off.png'
import video_on from './../assets/images/video_on.png'
import video_off from './../assets/images/video_off.png'
import volume from './../assets/images/volume.png'
import record from './../assets/images/record.png'
import share_screen from './../assets/images/share_screen.png'
import messages from './../assets/images/messages.png'
import settings from './../assets/images/settings.png'
import end_call from './../assets/images/end_call.png'
import attendies from './../assets/images/attendies.png'


const server_url = process.env.NODE_ENV === 'production' ? 'http://localhost:4001' : "http://localhost:4001"

var connections = {}
const peerConnectionConfig = {
	'iceServers': [
		// { 'urls': 'stun:stun.services.mozilla.com' },
		{ 'urls': 'stun:stun.l.google.com:19302' },
	]
}
var socket = null
var socketId = null
var elms = 0

var isGlobalUser = false;
var mySocketID;

class Dashboard extends React.Component {
    constructor(props){
        super(props)
        this.localVideoref = React.createRef()

		this.videoAvailable = false
		this.audioAvailable = false

		this.state = {
			video: false,
			audio: false,
			screen: false,
			showModal: false,
			screenAvailable: false,
			messages: [],
			message: "",
			newmessages: 0,
			askForUsername: true,
			username: faker.internet.userName(),
			userList: [],
			isMute: false,
			buttonText: 'Mute',
			selected: false,
			value: 0
		}
		connections = {}

		this.getPermissions()
    }
    getPermissions = async () => {
		try {
			await navigator.mediaDevices.getUserMedia({ video: true })
				.then(() => this.videoAvailable = true)
				.catch(() => this.videoAvailable = false)

			await navigator.mediaDevices.getUserMedia({ audio: true })
				.then(() => this.audioAvailable = true)
				.catch(() => this.audioAvailable = false)

			if (navigator.mediaDevices.getDisplayMedia) {
				this.setState({ screenAvailable: true })
			} else {
				this.setState({ screenAvailable: false })
			}

			if (this.videoAvailable || this.audioAvailable) {
				navigator.mediaDevices.getUserMedia({ video: this.videoAvailable, audio: this.audioAvailable })
					.then((stream) => {
						window.localStream = stream
						this.localVideoref.current.srcObject = stream
					})
					.then((stream) => { })
					.catch((e) => console.log(e))
			}
		} catch (e) { console.log(e) }
    }
    
    getMedia = () => {
		this.setState({
			video: this.videoAvailable,
			audio: this.audioAvailable
		}, () => {
			this.getUserMedia()
			this.connectToSocketServer()
		})
	}

	getUserMedia = () => {
		if ((this.state.video && this.videoAvailable) || (this.state.audio && this.audioAvailable)) {
			navigator.mediaDevices.getUserMedia({ video: this.state.video, audio: this.state.audio })
				.then(this.getUserMediaSuccess)
				.then((stream) => { })
				.catch((e) => console.log(e))
		} else {
			try {
				let tracks = this.localVideoref.current.srcObject.getTracks()
				tracks.forEach(track => track.stop())
			} catch (e) { }
		}
	}

	getUserMediaSuccess = (stream) => {
		try {
			window.localStream.getTracks().forEach(track => track.stop())
		} catch (e) { console.log(e) }

		window.localStream = stream
		this.localVideoref.current.srcObject = stream

		for (let id in connections) {
			if (id === socketId) continue

			connections[id].addStream(window.localStream)

			connections[id].createOffer().then((description) => {
				connections[id].setLocalDescription(description)
					.then(() => {
						socket.emit('signal', id, JSON.stringify({ 'sdp': connections[id].localDescription }))
					})
					.catch(e => console.log(e))
			})
		}

		stream.getTracks().forEach(track => track.onended = () => {
			this.setState({
				video: false,
				audio: false,
			}, () => {
				try {
					let tracks = this.localVideoref.current.srcObject.getTracks()
					tracks.forEach(track => track.stop())
				} catch (e) { console.log(e) }

				let blackSilence = (...args) => new MediaStream([this.black(...args), this.silence()])
				window.localStream = blackSilence()
				this.localVideoref.current.srcObject = window.localStream

				for (let id in connections) {
					connections[id].addStream(window.localStream)

					connections[id].createOffer().then((description) => {
						connections[id].setLocalDescription(description)
							.then(() => {
								socket.emit('signal', id, JSON.stringify({ 'sdp': connections[id].localDescription }))
							})
							.catch(e => console.log(e))
					})
				}
			})
		})
	}

	getDislayMedia = () => {
		if (this.state.screen) {
			if (navigator.mediaDevices.getDisplayMedia) {
				navigator.mediaDevices.getDisplayMedia({ video: true, audio: true })
					.then(this.getDislayMediaSuccess)
					.then((stream) => { })
					.catch((e) => console.log(e))
			}
		}
	}

	getDislayMediaSuccess = (stream) => {
		try {
			window.localStream.getTracks().forEach(track => track.stop())
		} catch (e) { console.log(e) }

		window.localStream = stream
		this.localVideoref.current.srcObject = stream

		for (let id in connections) {
			if (id === socketId) continue

			connections[id].addStream(window.localStream)

			connections[id].createOffer().then((description) => {
				connections[id].setLocalDescription(description)
					.then(() => {
						socket.emit('signal', id, JSON.stringify({ 'sdp': connections[id].localDescription }))
					})
					.catch(e => console.log(e))
			})
		}

		stream.getTracks().forEach(track => track.onended = () => {
			this.setState({
				screen: false,
			}, () => {
				try {
					let tracks = this.localVideoref.current.srcObject.getTracks()
					tracks.forEach(track => track.stop())
				} catch (e) { console.log(e) }

				let blackSilence = (...args) => new MediaStream([this.black(...args), this.silence()])
				window.localStream = blackSilence()
				this.localVideoref.current.srcObject = window.localStream

				this.getUserMedia()
			})
		})
	}

	gotMessageFromServer = (fromId, message) => {
		var signal = JSON.parse(message)

		if (fromId !== socketId) {
			if (signal.sdp) {
				connections[fromId].setRemoteDescription(new RTCSessionDescription(signal.sdp)).then(() => {
					if (signal.sdp.type === 'offer') {
						connections[fromId].createAnswer().then((description) => {
							connections[fromId].setLocalDescription(description).then(() => {
								socket.emit('signal', fromId, JSON.stringify({ 'sdp': connections[fromId].localDescription }))
							}).catch(e => console.log(e))
						}).catch(e => console.log(e))
					}
				}).catch(e => console.log(e))
			}

			if (signal.ice) {
				connections[fromId].addIceCandidate(new RTCIceCandidate(signal.ice)).catch(e => console.log(e))
			}
		}
	}

	changeCssVideos = (main) => {
		let widthMain = main.offsetWidth
		let minWidth = "30%"

		if ((widthMain * 30 / 100) < 300) {
			minWidth = "300px"
		}
		let minHeight = "40%"

		let height = String(100 / elms) + "%"
		let width = ""
		if (elms === 0 || elms === 1) {
			width = "100%"
			height = "100%"
		} else if (elms === 2) {
			width = "45%"
			height = "100%"
		} else if (elms === 3 || elms === 4) {
			width = "35%"
			height = "50%"
		} else {
			width = String(100 / elms) + "%"
		}

		let videos = main.querySelectorAll("video")
		for (let a = 0; a < videos.length; ++a) {
			videos[a].style.minWidth = minWidth
			videos[a].style.minHeight = minHeight
			videos[a].style.setProperty("width", width)
			videos[a].style.setProperty("height", height)
		}

		return { minWidth, minHeight, width, height }
	}

	callVideoOnOff = (socketID, isMute, videoId, buttonId) => {
		if (mySocketID == socketID) {
			this.setState({ video: !this.state.video }, () => this.getUserMedia())
		}

	}

	callRemovePeople = (socketID) => {
		if (mySocketID == socketID) {
			this.handleEndCall()
		}
	}

	callmuteCalled = (socketID, isMute, videoId, buttonId, selfMutePress) => {
		// console.log("socketID, isMute, videoId, buttonId", socketID, isMute, videoId, buttonId)
		// if (isGlobalUser && (mySocketID != socketID)) {
		// 	let video = document.getElementById('video' + socketID);	
		// 	video.muted = !video.muted;
		// 	console.log("video", video)

		// 	let buttonMute = document.getElementById('buttonmute' + socketID)
		// 	buttonMute.title = video.muted

		// }
		// else
		console.log("socketID, isMute, videoId, buttonId, selfMutePress,mySocketID", socketID, isMute, videoId, buttonId, selfMutePress, mySocketID)
		if (mySocketID == socketID && (selfMutePress == null)) {
			console.log("executionskdv0")
			let video = document.getElementById('my-video');
			video.muted = !video.muted;
			console.log("video", video)

			this.setState(state => {
				let audio = !state.audio

				return {
					audio
				}
			}, () => this.getUserMedia())
		}
		else {

			let video = document.getElementById(videoId);
			if (video) {
				video.muted = !video.muted;
			}


			let buttonMute = document.getElementById(buttonId)
			if (buttonMute) {
				buttonMute.src = video.muted ? audio_off : audio_on
			}

		}


	}

	connectToSocketServer = () => {
		socket = io.connect(server_url, { secure: true })

		socket.on('signal', this.gotMessageFromServer)

		socket.on('connect', () => {
			console.log("Messages")
			socket.emit('join-call', window.location.href)
			socketId = socket.id

			socket.on('chat-message', this.addMessage)

			socket.on('user-left', (id) => {
				// var videoContainer = document.getElementById(id);
				// if (videoContainer) {
				// 	videoContainer.parentNode.removeChild(videoContainer);
				// }
				// let videoContainer = document.querySelector(id)
				// if (videoContainer !== null) {
				// 	videoContainer.parentNode.removeChil
				// }



				let video = document.querySelector(`[data-socket="${id}"]`)
				if (video !== null) {
					elms--
					video.parentNode.removeChild(video)

					let main = document.getElementById('main')
					this.changeCssVideos(main)
				}

				let buttonMute = document.getElementById("buttonmute" + id)

				if (buttonMute) {
					buttonMute.parentNode.removeChild(buttonMute)
				}

				let buttonVideo = document.getElementById("buttonvideo" + id)

				if (buttonVideo) {
					buttonVideo.parentNode.removeChild(buttonVideo)
				}

				let buttonRemovePeople = document.getElementById("buttonremovepeople" + id)

				if (buttonRemovePeople) {
					buttonRemovePeople.parentNode.removeChild(buttonRemovePeople)
				}
			})

			socket.on('callmute', this.callmuteCalled)
			socket.on('videoOnOff', this.callVideoOnOff)

			socket.on('remove_user', this.callRemovePeople)

			socket.on('user-joined', (id, clients) => {
				if (clients.length == 1) {
					isGlobalUser = true
				}
				console.log("clients, id", clients, id)
				clients.forEach((socketListId, index) => {
					console.log("client for loop", socketListId, index)
					connections[socketListId] = new RTCPeerConnection(peerConnectionConfig)
					// Wait for their ice candidate       
					connections[socketListId].onicecandidate = function (event) {
						if (event.candidate != null) {
							socket.emit('signal', socketListId, JSON.stringify({ 'ice': event.candidate }))
						}
					}

					// Wait for their video stream
					connections[socketListId].onaddstream = (event) => {

						console.log("exe1111")
						// TODO mute button, full screen button
						var searchVidep = document.querySelector(`[data-socket="${socketListId}"]`)
						if (searchVidep !== null) { // if i don't do this check it make an empyt square
							searchVidep.srcObject = event.stream
							console.log("exe1")
						} else {
							console.log("exe2")

							// this.setState(state => {
							// 	const userList = [...state.userList, false];

							// 	return {
							// 		userList,
							// 		value: '',
							// 	};
							// }, () => {

							// });

							console.log("user joined")

							elms = clients.length
							let main = document.getElementById('main')
							let cssMesure = this.changeCssVideos(main)
							let videoContainer = document.createElement('div')
							videoContainer.id = id;
							videoContainer.style.setProperty("background-color", "red")
							videoContainer.style.setProperty("display", "flex")
							videoContainer.style.setProperty("flex-direction", "column")
							videoContainer.style.setProperty("justify-content", "center")
							videoContainer.style.setProperty("align-items", "center")
							let buttonContainer = document.createElement('div')
							buttonContainer.style.setProperty("display", "flex")
							buttonContainer.style.setProperty("flex-direction", "row")
							let video = document.createElement('video')
							let buttonMute = document.createElement('img')
							let buttonVideo = document.createElement('img')
							let buttonRemovePeople = document.createElement('img')

							buttonMute.value = true
							buttonMute.id = "buttonmute" + id
							buttonMute.src = audio_on
							buttonMute.style.setProperty("cursor", "pointer")
							buttonMute.style.setProperty("width", "50px")
							buttonMute.style.setProperty("height", "50px")
							buttonMute.style.setProperty("margin-left", "-60px")
							buttonMute.style.setProperty("z-index", "99")
							buttonMute.style.setProperty("color", "red")
							buttonMute.style.setProperty("backgroundColor", this.state.userList[index] ? 'black' : 'white')



							buttonVideo.value = true;
							buttonVideo.id = "buttonvideo" + id
							buttonVideo.src = video_on
							buttonVideo.style.setProperty("cursor", "pointer")
							buttonVideo.style.setProperty("width", "50px")
							buttonVideo.style.setProperty("height", "50px")
							buttonVideo.style.setProperty("margin-left", "-50px")
							buttonVideo.style.setProperty("margin-top", "110px")
							buttonVideo.style.setProperty("z-index", "99")
							buttonVideo.style.setProperty("color", "red")
							buttonVideo.style.setProperty("backgroundColor", this.state.userList[index] ? 'black' : 'white')

							buttonRemovePeople.value = true
							buttonRemovePeople.id = "buttonremovepeople" + id
							buttonRemovePeople.src = end_call
							buttonRemovePeople.style.setProperty("cursor", "pointer")
							buttonRemovePeople.style.setProperty("width", "50px")
							buttonRemovePeople.style.setProperty("height", "50px")
							buttonRemovePeople.style.setProperty("margin-left", "-50px")
							buttonRemovePeople.style.setProperty("margin-top", "220px")
							buttonRemovePeople.style.setProperty("z-index", "99")
							buttonRemovePeople.style.setProperty("color", "red")
							buttonRemovePeople.style.setProperty("backgroundColor", this.state.userList[index] ? 'black' : 'white')


							buttonMute.onclick = function () {
								let video = document.getElementById("video" + id);
								video.muted = !video.muted;
								console.log("video", video)

								let button = document.getElementById("buttonmute" + id)
								button.src = video.muted ? audio_off : audio_on
								console.log("callmute called")
								socket.emit('callmute', socketListId, video.muted, "video" + id, "buttonmute" + id)
								console.log("send event to server")
								// socket.broadcast('callmute', socketListId, video.muted, "video" + id, "buttonmute" + id)
								// socket.broadcast("callmute_broadcast")

								// socket.emit('chat-message', "jbskdb", "kbcskf")
							}.bind(this);

							buttonVideo.onclick = function () {

								let button = document.getElementById("buttonvideo" + id)
								button.src = button.src == video_on ? video_off : video_on
								socket.emit('videoOnOff', socketListId, button.src == video_on ? false : true, "video" + id, "buttonvideo" + id)

								// socket.emit('chat-message', "jbskdb", "kbcskf")
							}.bind(this);


							buttonRemovePeople.onclick = function () {

								// let button = document.getElementById("buttonvideo" + id)
								// button.src = button.src == video_on ? video_off : video_on
								socket.emit('remove_user', socketListId)

								// socket.emit('chat-message', "jbskdb", "kbcskf")
							}.bind(this);
							let css = {
								minWidth: cssMesure.minWidth, minHeight: cssMesure.minHeight, maxHeight: "100%", margin: "10px",
								borderStyle: "solid", borderColor: "#bdbdbd", objectFit: "fill", borderRadius: '10px'
							}
							for (let i in css) video.style[i] = css[i]

							videoContainer.style.setProperty("width", cssMesure.width)
							videoContainer.style.setProperty("height", cssMesure.height)
							video.style.setProperty("width", cssMesure.width)
							video.style.setProperty("height", cssMesure.height)




							video.setAttribute('data-socket', socketListId)
							video.srcObject = event.stream
							video.autoplay = true
							video.playsinline = true
							video.muted = false
							video.id = "video" + id


							let user = {
								stream: event.stream,
								muted: false,
								autoplay: true,
								playsinline: true,
								dataSocket: socketListId
							}

							console.log("user", user)

							// userList.push(user)

							// this.setState(state => {
							// 	const userList = [...state.userList, user];

							// 	return {
							// 		userList,
							// 		value: '',
							// 	};
							// });

							// video.append(buttonMute)

							// videoContainer.appendChild(video)
							// buttonContainer.appendChild(buttonMute)
							// buttonContainer.appendChild(buttonVideo)
							// videoContainer.appendChild(buttonContainer)

							mySocketID = id;

							main.appendChild(video)
							if (isGlobalUser) {
								main.appendChild(buttonMute)
								main.appendChild(buttonVideo)
								main.appendChild(buttonRemovePeople)
							}

						}
					}

					// Add the local video stream
					if (window.localStream !== undefined && window.localStream !== null) {
						connections[socketListId].addStream(window.localStream)
					} else {
						let blackSilence = (...args) => new MediaStream([this.black(...args), this.silence()])
						window.localStream = blackSilence()
						connections[socketListId].addStream(window.localStream)
					}
				})

				if (id === socketId) {
					for (let id2 in connections) {
						if (id2 === socketId) continue

						try {
							connections[id2].addStream(window.localStream)
						} catch (e) { }

						connections[id2].createOffer().then((description) => {
							connections[id2].setLocalDescription(description)
								.then(() => {
									socket.emit('signal', id2, JSON.stringify({ 'sdp': connections[id2].localDescription }))
								})
								.catch(e => console.log(e))
						})
					}
				}
			})
		})
	}

	silence = () => {
		let ctx = new AudioContext()
		let oscillator = ctx.createOscillator()
		let dst = oscillator.connect(ctx.createMediaStreamDestination())
		oscillator.start()
		ctx.resume()
		return Object.assign(dst.stream.getAudioTracks()[0], { enabled: false })
	}
	black = ({ width = 640, height = 480 } = {}) => {
		let canvas = Object.assign(document.createElement("canvas"), { width, height })
		canvas.getContext('2d').fillRect(0, 0, width, height)
		let stream = canvas.captureStream()
		return Object.assign(stream.getVideoTracks()[0], { enabled: false })
	}

	handleVideo = () => this.setState({ video: !this.state.video }, () => this.getUserMedia())
	handleAudio = (e) => {
		console.log("THIS IS HANDEL AUDIO----", e.target)
		this.setState({ audio: !this.state.audio }, () => {
			let selfMutePress = true;
			this.getUserMedia()
			socket.emit('callmute', mySocketID, this.state.audio, "video" + mySocketID, "buttonmute" + mySocketID, selfMutePress)
		})
	}

	onChangeHandler = (event) => {
		console.log(event.target.files)
		swal({
			title: "Upload Successful",
			icon: "success",
			button: "Close",
		});
	}

	handleDocumentUpload = (e) => {
		console.log("THIS IS HANDEL AUDIO----", e.target)
		this.upload.click()
		console.log(this.upload.files)
		this.setState({ audio: !this.state.audio }, () => {
			let selfMutePress = true;
			this.getUserMedia()
			socket.emit('callmute', mySocketID, this.state.audio, "video" + mySocketID, "buttonmute" + mySocketID, selfMutePress)
		})
	}

	handleScreen = () => this.setState({ screen: !this.state.screen }, () => this.getDislayMedia())

	handleEndCall = () => {
		try {
			let tracks = this.localVideoref.current.srcObject.getTracks()
			tracks.forEach(track => track.stop())
		} catch (e) { }
		window.location.href = "/"
	}
	handleTabChange = (e) => {
		if (e.target.innerText.indexOf('PRIVATE') > -1) {
			this.setState({ value: 1 })
			this.setState({ selected: false })
		} else {
			this.setState({ value: 0 })

			this.setState({ selected: true })
		}
	}

	openChat = () => this.setState({ showModal: true, newmessages: 0 })
	closeChat = () => this.setState({ showModal: false })
	handleMessage = (e) => this.setState({ message: e.target.value })

	addMessage = (data, sender, socketIdSender) => {
		this.setState(prevState => ({
			messages: [...prevState.messages, { "sender": sender, "data": data }],
		}))
		if (socketIdSender !== socketId) {
			this.setState({ newmessages: this.state.newmessages + 1 })
		}
	}


	handleUsername = (e) => this.setState({ username: e.target.value })

	sendMessage = () => {
		socket.emit('chat-message', this.state.message, this.state.username)
		this.setState({ message: "", sender: this.state.username })
	}

	copyUrl = () => {
		let text = window.location.href
		if (!navigator.clipboard) {
			let textArea = document.createElement("textarea")
			textArea.value = text
			document.body.appendChild(textArea)
			textArea.focus()
			textArea.select()
			try {
				document.execCommand('copy')
				message.success("Link copied to clipboard!")
			} catch (err) {
				message.error("Failed to copy")
			}
			document.body.removeChild(textArea)
			return
		}
		navigator.clipboard.writeText(text).then(function () {
			message.success("Link copied to clipboard!")
		}, () => {
			message.error("Failed to copy")
		})
	}

	connect = () => this.setState({ askForUsername: false }, () => this.getMedia())

	isChrome = function () {
		let userAgent = (navigator && (navigator.userAgent || '')).toLowerCase()
		let vendor = (navigator && (navigator.vendor || '')).toLowerCase()
		let matchChrome = /google inc/.test(vendor) ? userAgent.match(/(?:chrome|crios)\/(\d+)/) : null
		// let matchFirefox = userAgent.match(/(?:firefox|fxios)\/(\d+)/)
		// return matchChrome !== null || matchFirefox !== null
		return matchChrome !== null
	}

    render(){
        if (this.isChrome() === false) {
			return (
				<div style={{
					background: "white", width: "30%", height: "auto", padding: "20px", minWidth: "400px",
					textAlign: "center", margin: "auto", marginTop: "50px", justifyContent: "center"
				}}>
					<h1>Sorry, this works only with Google Chrome</h1>
				</div>
			)
		}

        return(
            <>
            <body>
            <div className="mainDiv-Dashboard">
            <Row id="main" className="flex-container" style={{ margin: 0, padding: 0 }}>
								<video id="my-video" ref={this.localVideoref} autoPlay muted={this.state.audio} style={{
									borderStyle: "solid", borderColor: "#bdbdbd", margin: "10px", objectFit: "fill",
									borderRadius: "10px",
									width: "100%", height: "100%"
								}}>

								</video>
                                </Row>
            </div></body>
            <footer className="footer">
                <div className="interpreter-container">
                    <div className="original-audio-container">
                        <span className="Original-Audio">Original Audio</span>
                        <img src={arrow_up} className="arrow-up"/>
                    </div>
                    <span className="Interpreting-languages">Interpreting languages</span>
                </div>
                 <div className="left-footer-button-container">
                         <ImageButton active={audio_on} inactive={audio_off} title="Mic" isChangeble={true} onClick={(val) => {console.log(val)}}/>
                         <ImageButton active={video_on} inactive={video_off} title="Camera" isChangeble={true} onClick={(val) => {console.log(val)}}/>
                         <ImageButton active={volume}  title="Volume" isChangeble={false} onClick={(val) => {console.log(val)}}/>   
                 </div>
                 <div className="record-container">
                 <ImageButton active={record}  title="Record" isChangeble={false} onClick={(val) => {console.log(val)}}/>
                 </div>
                 <div className="right-footer-button-container">
                         <ImageButton active={share_screen}  title="Screen" isChangeble={false} onClick={(val) => {console.log(val)}}/>
                         <ImageButton active={attendies}  title="Attendees" isChangeble={false} onClick={(val) => {console.log(val)}}/>
                         <ImageButton active={messages}  title="Chat" isChangeble={false} onClick={(val) => {console.log(val)}}/> 
                         <ImageButton active={settings}  title="Settings" isChangeble={false} onClick={(val) => {console.log(val)}}/> 
                         <ImageButton active={end_call}  title="End" isChangeble={false} onClick={(val) => {console.log(val)}}/>   
                 </div>
                </footer>
            </>
            
        )
    }
}
export default Dashboard