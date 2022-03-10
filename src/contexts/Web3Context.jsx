import WalletConnectProvider from "@walletconnect/web3-provider";
import { ethers } from "ethers";
import { createContext, useContext, useEffect, useState } from "react";
import Web3Modal from "web3modal";
import abi from "./nftabi.json";
import farm from "./farmabi.json";
import { toast } from "react-toastify";
import { Backdrop, Box, CircularProgress } from "@mui/material";
const Web3Provider = createContext();
export const useWeb3 = () => {
	return useContext(Web3Provider);
};
const Web3Context = ({ children }) => {
	const [address, setAddress] = useState();
	const [signer, setSigner] = useState();
	const [provider, setProvider] = useState();
	const [contract, setContract] = useState();
	const [loading, setLoading] = useState(true);
	const [farmContract, setFarmContract] = useState();
	//Setup Testnet and Mainnet , testnet chain id is 97,mainnet is 56
	const chainId = parseInt(process.env.REACT_APP_CHAIN_ID);
	console.log(chainId);
	//Both Contract address here
	const testNFT = process.env.REACT_APP_NFT_CONTRACT_ADDRESS;
	const testNFTFarm = process.env.REACT_APP_FARM_CONTRACT_ADDRESS;

	const web3Modal = new Web3Modal({
		network: "testnet", // optional
		cacheProvider: false, // optional
		providerOptions, // required
	});
	const logout = () => {
		setAddress();
		setSigner();
		setProvider();
		setContract();
	};
	const login = async () => {
		setLoading(true);
		//=============Etherjs for testnet==================
		const _provider = new ethers.providers.Web3Provider(window.ethereum, "any");
		setProvider(_provider);
		//Pop up metamask
		await _provider.send("eth_requestAccounts", []);
		const _signer = _provider.getSigner();
		setSigner(_signer);
		const _address = await _signer.getAddress();
		const _contract = new ethers.Contract(testNFT, abi, _provider);
		const _farmContract = new ethers.Contract(testNFTFarm, farm, _provider);

		setAddress(_address);
		setContract(_contract);
		setFarmContract(_farmContract);
		setLoading(false);
		//===================Web3Modal in Mainnet Only===================
		/* web3Modal.clearCachedProvider();
		const instance = await web3Modal.connect();
		const _provider = new ethers.providers.Web3Provider(instance);

		const _signer = _provider.getSigner();
		console.log(_signer);
		setProvider(_provider);
		setSigner(_signer);
		setAddress(await _signer.getAddress());
		const _contract = new ethers.Contract(testNFT, abi, _provider);
		const _farmContract = new ethers.Contract(testNFTFarm, farm, _provider);
		setContract(_contract);
		setFarmContract(_farmContract);
		_provider.on("accountsChanged", (accounts) => {
			console.log(accounts);
		});

		// Subscribe to chainId change
		_provider.on("chainChanged", (chainId) => {
			console.log(chainId);
		});

		// Subscribe to provider connection
		_provider.on("connect", (info) => {
			console.log(info);
		});

		// Subscribe to provider disconnection
		_provider.on("disconnect", (error) => {
			console.log(error);
		}); */
	};

	useEffect(() => {
		async function initializeWallet() {
			if (typeof window.ethereum === "undefined") {
				setLoading(false);
				return;
			}
			const _provider = new ethers.providers.Web3Provider(window.ethereum, "any");

			window.ethereum.on("chainChanged", (id) => {
				if (parseInt(id) !== chainId) {
					toast("Incorrect Network,please switch to BSC testnet");
					setLoading(false);
					return;
				}
			});
			window.ethereum.on("accountsChanged", async (accounts) => {
				setLoading(true);
				logout();
				await login();
				setLoading(false);
			});
			window.ethereum.on("connect", (connectinfo) => {
				console.log(connectinfo);
			});
			window.ethereum.on("disconnect", (connectinfo) => {
				console.log(connectinfo);
			});
			_provider.getNetwork().then((network) => {
				if (network.chainId !== chainId) {
					toast("Incorrect Network,please switch to BSC testnet");
					setLoading(false);
					return;
				}
				const _contract = new ethers.Contract(testNFT, abi, _provider);
				const _farmContract = new ethers.Contract(testNFTFarm, farm, _provider);

				setContract(_contract);
				setFarmContract(_farmContract);
				setProvider(_provider);
				setLoading(false);
			});
		}
		initializeWallet();
		//Check is already connected and set address details
	}, []);

	const value = { login, logout, signer, provider, testNFT, testNFTFarm, contract, address, farmContract };

	return (
		<Web3Provider.Provider value={value}>
			{loading ? (
				<Backdrop sx={{ background: "#270027", color: "white", zIndex: 1001 }} open={loading}>
					<CircularProgress color="inherit" />
				</Backdrop>
			) : (
				children
			)}
		</Web3Provider.Provider>
	);
};
const providerOptions = {
	walletconnect: {
		package: WalletConnectProvider, // required
		options: {
			rpc: {
				56: "https://bsc-dataseed.binance.org",
			},
			network: "binance",
			chainId: 56,
			infuraId: "1b47bf0a6d0b4f1893f3c1ea5c8f9501", // required
		},
	},
};

export default Web3Context;
