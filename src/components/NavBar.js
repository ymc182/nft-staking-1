import * as React from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import LogoutIcon from "@mui/icons-material/Logout";
import Container from "@mui/material/Container";
import Button from "@mui/material/Button";
import { styled } from "@mui/material";
import { useWeb3 } from "../contexts/Web3Context";
const pages = [];
const TextButton = styled(Button)`
	color: #fff;
	width: 90px;
	height: 60px;
	padding: 6px 6px;
	font-size: 18px;

	&:hover {
		color: #fff;
	}
	&:focus {
	}
	border-radius: 0px;
`;
const StyledButton = styled(Button)`
	background: #291440;
	color: #fff;
	width: 180px;
	height: 60px;
	padding: 6px 18px;
	font-size: 18px;

	&:hover {
		color: #fff;
	}
	&:focus {
	}
	border-radius: 0px;
`;
const NavBar = () => {
	const { login, address, logout } = useWeb3();
	const buttom = React.useRef();
	return (
		<AppBar
			position="sticky"
			sx={{
				display: "flex",
				height: "90px",
				background: "rgba(18,18,18,0.5)",
				alignItems: "center",
				width: "100%",

				backgroundSize: "cover",
			}}
		>
			<Container maxWidth="xl" sx={{ height: "100%", width: { sx: "100vw", md: "90vw" } }}>
				<Toolbar disableGutters sx={{ height: "100%" }}>
					<Typography variant="h6" noWrap component="div" sx={{ mr: 2, display: { xs: "none", md: "flex" } }}>
						<Box
							sx={{
								width: "80px",
								height: "80px",
								display: "flex",
								alignItems: "center",
								justifyContent: "center",
							}}
						>
							<img src="/img/favicon.ico" height={"100%"} width={"100%"} alt="LOGO"></img>
						</Box>
					</Typography>
					<Typography variant="h6" noWrap component="div" sx={{ mr: 2, display: { xs: "none", md: "flex" } }}>
						<TextButton onClick={(e) => window.location.replace("/")}>Home</TextButton>
					</Typography>
					<Typography variant="h6" noWrap component="div" sx={{ mr: 2, display: { xs: "none", md: "flex" } }}>
						<TextButton
							onClick={(e) => {
								buttom.current.scrollIntoView({ behavior: "smooth" });
							}}
						>
							Stake
						</TextButton>
					</Typography>
					<Typography variant="h6" noWrap component="div" sx={{ flexGrow: 1, display: { xs: "flex", md: "none" } }}>
						<Box
							sx={{
								width: "80px",
								height: "80px",

								display: "flex",
								alignItems: "center",
								justifyContent: "center",
								border: "3px solid #fff",
							}}
						>
							<img src="/img/logo.png" height={60} width={60} alt="LOGO"></img>
						</Box>
					</Typography>
					<Box sx={{ flexGrow: 1, display: { xs: "none", md: "flex" } }}>
						{pages.map((page) => (
							<Button key={page} sx={{ my: 2, color: "white", display: "block" }}>
								{page}
							</Button>
						))}
					</Box>

					<StyledButton
						onClick={address ? logout : login}
						className="grow"
						variant="standard"
						size="large"
						sx={{ borderRadius: "10px 10px 10px 10px" }}
					>
						{address ? address.slice(0, 6) + "..." : "Connect"}
					</StyledButton>
				</Toolbar>
				<div style={{ float: "left", clear: "both" }} ref={buttom}></div>
			</Container>
		</AppBar>
	);
};
export default NavBar;
