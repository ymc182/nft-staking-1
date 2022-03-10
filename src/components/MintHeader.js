import { Box, Button, Container, Grid, IconButton, Typography, styled } from "@mui/material";
import React, { useEffect } from "react";
import { toast } from "react-toastify";
import InstagramIcon from "@mui/icons-material/Instagram";
import TwitterIcon from "@mui/icons-material/Twitter";
import PublicIcon from "@mui/icons-material/Public";
import { useWeb3 } from "../contexts/Web3Context";
import { ethers } from "ethers";
export default function MintHeader() {
	const [nftSupply, setNftSupply] = React.useState(null);
	const [mintPrice, setMintPrice] = React.useState();
	const { contract, signer, address, provider, login, logout } = useWeb3();
	useEffect(() => {
		if (!contract) return;
		const getTotal = async () => {
			const total = await contract.totalSupply();
			setNftSupply(total.toString());
			const currentPrice = await contract.getCurrentPrice();
			setMintPrice(ethers.utils.formatEther(currentPrice.toString()));
		};
		getTotal();
	}, []);
	const mint = async () => {
		const contractWithSigner = contract.connect(signer);

		const tx = await contractWithSigner.mintNFT(1, { value: ethers.utils.parseEther(mintPrice) });
		await toast.promise(waitForTransaction(tx.hash), {
			pending: "Minting...",
			success: "Minted!",
			error: "Error Minting NFT",
		});
	};
	const waitForTransaction = async (tx) => {
		let confirmedApprove = null;
		return new Promise(async (res, rej) => {
			while (confirmedApprove === undefined || confirmedApprove === null) {
				confirmedApprove = await provider.getTransactionReceipt(tx);
				await sleep(1000);
				console.log(confirmedApprove);
			}
			res(confirmedApprove);
		});
	};
	function sleep(ms) {
		return new Promise((resolve) => setTimeout(resolve, ms));
	}
	const StyledButton = styled(Button)`
		color: #fff;
		width: 180px;
		height: 60px;
		padding: 6px 18px;
		font-size: 18px;
		border: 3px solid #fff;
		border-radius: 20px;
		&:hover {
			color: #fff;
			border: 3px solid #fff;
		}
		&:focus {
			border: 3px solid #fff;
		}
		border-radius: 0px;
	`;

	return (
		<Container sx={{ width: { sx: "100vw", md: "90vw", marginTop: "50px" } }}>
			<Box>
				<Grid container display={"flex"} justifyContent="space-between" sx={{ borderRadius: "20px", mt: 15 }}>
					<Grid item xs={12} sm={1} sx={{}}>
						<SocialMediaButton />
					</Grid>
					<Grid item xs={12} sm={6} sx={{}}>
						<Grid
							className="animate__animated animate__zoomIn"
							container
							display="flex"
							justifyContent={"space-between"}
							direction="column"
							sx={{
								height: "350px",

								border: "2px solid #CE00FF",
								p: 3,
								boxShadow: "0 0 10px #E07AFF",
							}}
						>
							<Grid item>
								<Typography className="grow" variant="h3" fontWeight={"900"} /* sx={{ textShadow: "2px 2px 6px" }} */>
									BINANTS NFT
								</Typography>
							</Grid>
							<Grid item>
								<Typography variant="subtitle1">A collection of 3333 RPG Play-2-Earn unique NFTs</Typography>
							</Grid>
							<Grid item>
								<Typography variant="subtitle1">Launching 28/02 5pm UTC</Typography>
							</Grid>
							<Grid item>
								<StyledButton onClick={address ? mint : login} className="grow" variant="outlined" size="large">
									{address ? "Mint Now" : "Connect"}
								</StyledButton>
							</Grid>

							<Grid item>
								Minted {nftSupply} / 3333 || Mint Price : {mintPrice} BNB
							</Grid>
						</Grid>
					</Grid>
					<Grid
						item
						xs={12}
						sm={5}
						display={"flex"}
						alignItems={"center"}
						sx={{ mt: { xs: 10, sm: 0 } }}
						justifyContent="center"
						className="grow"
					>
						<img
							style={{
								borderRadius: "0px 20px 0px 20px",
								verticalAlign: "middle",
								height: "350px",
							}}
							width={"auto"}
							src="/img/showcase1.png"
							alt="showcase"
							className="animate__animated animate__bounce "
						></img>
					</Grid>
				</Grid>
			</Box>

			<br />
		</Container>
	);
}

function SocialMediaButton({}) {
	return (
		<Grid container display={"flex"}>
			<Grid item>
				<a href="#">
					<IconButton
						className="growmore"
						sx={{
							fontSize: "300%",
						}}
					>
						<span className="iconify" data-icon="simple-icons:discord"></span>
					</IconButton>
				</a>
			</Grid>
			<Grid item>
				<a href="#">
					<IconButton>
						<InstagramIcon
							className="growmore"
							sx={{
								fontSize: "200%",
							}}
						/>
					</IconButton>
				</a>
			</Grid>

			<Grid item>
				<a href="#">
					<IconButton>
						<TwitterIcon
							className="growmore"
							sx={{
								fontSize: "200%",
							}}
						/>
					</IconButton>
				</a>
			</Grid>
			<Grid item>
				<a href="#">
					<IconButton>
						<PublicIcon
							className="growmore"
							sx={{
								fontSize: "200%",
							}}
						/>
					</IconButton>
				</a>
			</Grid>
		</Grid>
	);
}
