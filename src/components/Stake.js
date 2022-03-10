import { Box, Button, Container, FormControl, Grid, InputLabel, MenuItem, Select, Typography } from "@mui/material";
import React, { useEffect, useState } from "react";
import { useWeb3 } from "../contexts/Web3Context";
import { toast } from "react-toastify";
import { ethers } from "ethers";

export default function Experience() {
	const { contract, signer, address, farmContract, testNFTFarm, provider } = useWeb3();
	const [nftBalance, setNFTBalance] = useState();
	const [stakeBalance, setStakeBalance] = useState();
	const [idList, setIdList] = useState([]);
	const [baseURI, setBaseURI] = useState();
	const [stakedId, setStakedId] = useState([]);
	const [estimateReward, setEstimateReward] = useState(0);
	const [stakeDays, setStakeDays] = React.useState("");
	const [loading, setLoading] = useState(true);
	useEffect(() => {
		if (!signer && !address) {
			setLoading(false);
			return;
		}
		async function init() {
			setLoading(true);
			const balance = await contract.balanceOf(address);
			const staked = await farmContract.getStakedToken(address);
			const baseUri = await contract.getBaseURI();
			await getStakedListByOwner();
			await getTokenListByOwner();
			await getEstimateReward();
			setBaseURI(baseUri);
			setStakeBalance(staked.length);
			setNFTBalance(balance.toString());

			setLoading(false);
		}
		init();
	}, [address]);
	const getStakedListByOwner = async () => {
		const stakedId = await farmContract.getStakedToken(address);
		let idArray = [];
		stakedId.forEach((tokenId) => idArray.push(tokenId.toString()));

		setStakedId(idArray);
	};
	const getTokenListByOwner = async () => {
		const balance = await contract.balanceOf(address);
		if (balance > 0) {
			const ownedNFT = await contract.getTokensOfOwner(address);
			let idArray = [];
			ownedNFT.forEach((tokenId) => idArray.push(tokenId.toString()));

			setIdList(idArray);
		}
	};
	const getEstimateReward = async () => {
		try {
			const farmWithSigner = farmContract.connect(signer);
			const estReward = await farmWithSigner.getRewardEstimate();
			setEstimateReward(parseFloat(ethers.utils.formatEther(estReward.toString())).toFixed(3));
		} catch (e) {
			console.error(e.message);
		}
	};
	const onImageClick = (e, id) => {
		console.log(id);
		if (stakedId.findIndex((ids) => ids === id) === -1) {
			stakeNFT(parseInt(id));
		} else {
			unstakeNFT(parseInt(id));
		}
	};
	const claimReward = async () => {
		const farmWithSigner = farmContract.connect(signer);
		const tx = await farmWithSigner.claimReward();
		toast.promise(waitForTransaction(tx.hash), {
			pending: "Pending Reward",
			success: "Rewarded!",
			error: "Error getting reward",
		});
	};
	const stakeNFT = async (id) => {
		const contractWithSigner = contract.connect(signer);
		const tx = await contractWithSigner.approve(testNFTFarm, id);

		await toast.promise(waitForTransaction(tx.hash), {
			pending: "Approving Stake",
			success: "Approved",
			error: "Error getting Approval",
		});
		const farmWithSigner = farmContract.connect(signer);
		// const farmTx = await farmWithSigner.stakeWithTimeLock(id, parseInt(stakeDays));
		const farmTx = await farmWithSigner.stakeWithTimeLockMinutes(id, parseInt(stakeDays));
		const stake = await toast.promise(waitForTransaction(farmTx.hash), {
			pending: "Staking",
			success: "Staked!",
			error: "Error Stake",
		});
		const staked = await farmContract.getStakedToken(address);
		const balance = await contract.balanceOf(address);
		setStakeBalance(staked.length);
		setNFTBalance(balance.toString());
		getStakedListByOwner();
		getTokenListByOwner();
	};
	function sleep(ms) {
		return new Promise((resolve) => setTimeout(resolve, ms));
	}
	const unstakeNFT = async (id) => {
		const farmWithSigner = farmContract.connect(signer);
		const tx = await farmWithSigner.unstake(id);
		const unstake = await toast.promise(waitForTransaction(tx.hash), {
			pending: "unStaking",
			success: "unStaked!",
			error: "Error Stake",
		});
		const staked = await farmContract.getStakedToken(address);
		const balance = await contract.balanceOf(address);
		setStakeBalance(staked.length);
		setNFTBalance(balance.toString());
		getStakedListByOwner();
		getTokenListByOwner();
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
	if (loading || !address) return <></>;
	return (
		<Container sx={{ width: { sx: "100vw", md: "90vw", marginTop: "50px" } }}>
			<Box>
				<Grid container display={"flex"} justifyContent="space-between" sx={{ borderRadius: "20px", mt: 1 }}>
					<Grid
						item
						xs={12}
						sm={12}
						display={"flex"}
						alignItems={"center"}
						sx={{ mt: { xs: 10, sm: 0 }, flexDirection: "column" }}
						justifyContent="center"
						className="grow"
					>
						<Grid item>
							<Typography>You Own: {parseInt(nftBalance) + parseInt(stakeBalance)} NFT</Typography>
							<Typography>You Staked: {stakeBalance} NFT</Typography>
							<Typography>Estimated Reward: {estimateReward} Token</Typography>
							<Button variant="outlined" onClick={claimReward}>
								Claim Reward!
							</Button>
							<Box sx={{ minWidth: 120, mt: 1 }}>
								<FormControl fullWidth>
									<InputLabel id="demo-simple-select-label">Stake Days (Minutes for testing)</InputLabel>
									<Select
										labelId="demo-simple-select-label"
										id="demo-simple-select"
										value={stakeDays}
										label="Stake Day"
										onChange={(e) => {
											setStakeDays(parseInt(e.target.value));
										}}
									>
										<MenuItem value={10}>10</MenuItem>
										<MenuItem value={20}>20</MenuItem>
										<MenuItem value={30}>30</MenuItem>
										<MenuItem value={40}>40</MenuItem>
										<MenuItem value={50}>50</MenuItem>
										<MenuItem value={60}>60</MenuItem>
									</Select>
								</FormControl>
							</Box>
							<Typography>Click Image To Stake / Unstake</Typography>
						</Grid>

						<Grid item>
							<Typography sx={{ borderBottom: "3px solid #CE00FF" }}>Staked</Typography>
						</Grid>

						{/* 	<img
							style={{
								border: "6px solid #F9BA55",
								borderRadius: "20px 0px 20px 0px",
								verticalAlign: "middle",
								width: "360px",
							}}
							width={"auto"}
							src="/img/preview.gif"
							alt="showcase"
						></img> */}
					</Grid>
					<Grid container spacing={3}>
						{idList.map((id) => {
							return (
								<Grid
									item
									display={"flex"}
									sx={{
										flexDirection: "column",
										justifyContent: "center",
										alignItems: "center",
									}}
									className="growmore"
									key={id}
								>
									<img
										width={150}
										height={150}
										onClick={(e) => onImageClick(e, id)}
										src={`${baseURI}${id}.png`}
										alt="NFTs"
									></img>
									ID - {id}
								</Grid>
							);
						})}
						{stakedId.map((id) => {
							return (
								<Grid
									item
									display={"flex"}
									sx={{
										flexDirection: "column",
										justifyContent: "center",
										alignItems: "center",
									}}
									className="growmore"
									key={id}
								>
									<img
										width={150}
										height={150}
										onClick={(e) => onImageClick(e, id)}
										src={`${baseURI}${id}.png`}
										alt="NFTs"
										style={{ border: "3px solid #CE00FF", boxShadow: "0 0 10px #E07AFF", borderRadius: "5px" }}
									></img>
									ID - {id}
								</Grid>
							);
						})}
					</Grid>
				</Grid>
			</Box>

			<br />
		</Container>
	);
}
