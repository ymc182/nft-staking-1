import "./App.css";

import { Box, Grid, Typography, styled, Modal } from "@mui/material";
import NavBar from "./components/NavBar";
import MintHeader from "./components/MintHeader";
import Stake from "./components/Stake";

//https://data-seed-prebsc-1-s2.binance.org:8545/
function App() {
	return (
		<div>
			<NavBar />
			<Grid container justifyContent="center" alignItems="center" direction={"row"} spacing={18} display="flex">
				<Grid item sx={{ position: "relative" }}>
					<MintHeader />
				</Grid>
				<Grid item>
					<Stake />
				</Grid>
			</Grid>
		</div>
	);
}

export default App;
