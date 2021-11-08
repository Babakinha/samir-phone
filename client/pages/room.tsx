import type { NextPage } from "next";
import { useRouter } from "next/dist/client/router";
import TestRoom from "../components/Room/TestRoom";

const Room: NextPage = () => {
	const router = useRouter()
	const { code, name } = router.query
	//if (!code || !name) router.back()

	return (
		<div>
			<h1>Welcome {name}! To room {code}</h1>
			<TestRoom></TestRoom>
		</div>
	);
};

export default Room;
