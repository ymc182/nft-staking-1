import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./App";
import { ToastContainer } from "react-toastify";
import reportWebVitals from "./reportWebVitals";
import "animate.css";
import Web3Context from "./contexts/Web3Context";
import "react-toastify/dist/ReactToastify.css";
import { createTheme, CssBaseline, ThemeProvider } from "@mui/material";
const darkTheme = createTheme({
	typography: {
		h3: {
			fontFamily: "Source Sans Pro",
			fontWeight: "700",
		},
		fontFamily: "Source Sans Pro",
	},

	palette: {
		mode: "dark",
		primary: {
			main: "#fff",
			light: "#90f2f7",
		},
		secondary: {
			main: "#fbf9f8",
		},
		background: {
			default: "#180924",
			paper: "#181818",
		},
		warning: {
			main: "#ff3d00",
		},
		text: {
			primary: "#fff",
		},
	},
});
ReactDOM.render(
	<React.StrictMode>
		<Web3Context>
			<ThemeProvider theme={darkTheme}>
				<App />
				<ToastContainer />
				<CssBaseline />
			</ThemeProvider>
		</Web3Context>
	</React.StrictMode>,
	document.getElementById("root")
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
