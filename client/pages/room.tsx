import type { NextPage } from "next";
import React, { useRouter } from "next/dist/client/router";
import { useEffect } from "react";
import Lobby from "../components/Lobby/Lobby";

const Room: NextPage = () => {
	const router = useRouter()
	const { code, name } = router.query
	//if (!code || !name) router.back()

	//Hehe kahoot trap music
	const audio = new Audio("https://r2---sn-bg07dnks.googlevideo.com/videoplayback?expire=1637035930&ei=OtuSYey4Ety0lu8Pq9qKqAY&ip=207.204.248.201&id=o-AHhXEufY6dL23azLRt5wM6aXyeSbmI5365-k7OneGchC&itag=18&source=youtube&requiressl=yes&vprv=1&mime=video%2Fmp4&ns=Zxjz4J-6xXsFNJBhXTMSmEcG&gir=yes&clen=2430190&ratebypass=yes&dur=96.037&lmt=1480483883645184&fexp=24001373,24007246&c=WEB&n=ADYkf3IuS_t4GY-w7q&sparams=expire%2Cei%2Cip%2Cid%2Citag%2Csource%2Crequiressl%2Cvprv%2Cmime%2Cns%2Cgir%2Cclen%2Cratebypass%2Cdur%2Clmt&sig=AOq0QJ8wRAIgdMrtjeu-OT1sdXZtdBfOOv53ThIL0vRs0S8YTtiZ0s4CIGXk7_ZDflvAyXwU3Gn2c1cX0xhUc1QE2IfbeIqXKsmw&rm=sn-42a4pcxgoxu-hp5e7l,sn-q4fell7l&req_id=5921c65bf302a3ee&ipbypass=yes&redirect_counter=3&cm2rm=sn-gpvey7l&cms_redirect=yes&mh=WU&mip=177.37.250.6&mm=34&mn=sn-bg07dnks&ms=ltu&mt=1637013878&mv=m&mvi=2&pl=23&lsparams=ipbypass,mh,mip,mm,mn,ms,mv,mvi,pl&lsig=AG3C_xAwRgIhANFZc9QG1nd4FXxFW9D2Hzy6LONAWtjcITuII9x974p0AiEAimnsaLxiyqTgky2BMTTrMstyECH1RqijMW0h6D2z_5Q%3D")
	useEffect(() => {
		audio.play()
		audio.loop = true
		return () => {
			audio.pause()
		}
	}, [])

	return (
		<div>
			<h1>Welcome {name}! To room {code}</h1>
			<Lobby code={code as string} name={name as string}></Lobby>
		</div>
	);
};

export default Room;
