import React, { useEffect, useState } from "react";

const Chat = () => {
	const [showNotification, setShowNotification] = useState(true);

	useEffect(() => {
		const botpressScript = document.createElement("script");
		botpressScript.src = "https://cdn.botpress.cloud/webchat/v3.0/inject.js";
		botpressScript.defer = true;

		botpressScript.onload = () => {
			const configScript = document.createElement("script");
			configScript.src =
				"https://files.bpcontent.cloud/2025/06/25/15/20250625151118-4W4EJ8MS.js";
			configScript.defer = true;

			configScript.onload = () => {
				const checkWidgetReady = setInterval(() => {
					if (window.botpressWebChat && window.botpressWebChat.sendEvent) {
						clearInterval(checkWidgetReady);

						// Show proactively once
						window.botpressWebChat.sendEvent({ type: "show" });

						window.botpressWebChat.onEvent((event) => {
							if (event.type === "webchatOpened") {
								setShowNotification(false);
							}
						});
					}
				}, 500);
			};

			document.body.appendChild(configScript);
		};

		document.body.appendChild(botpressScript);

		return () => {
			document.body.removeChild(botpressScript);
		};
	}, []);

	// Open the chat widget
	const openChat = () => {
		if (window.botpressWebChat) {
			window.botpressWebChat.sendEvent({ type: "show" });
		}
	};

	return (
		<>
			{showNotification && (
				<div
					style={{
						position: "fixed",
						bottom: "90px",
						right: "30px",
						backgroundColor: "#f9a825",
						color: "#000",
						padding: "12px 18px",
						borderRadius: "20px",
						boxShadow: "0 4px 12px rgba(0,0,0,0.2)",
						cursor: "pointer",
						zIndex: 1000,
						fontWeight: "bold",
						display: "flex",
						alignItems: "center",
						gap: "10px",
					}}
					onClick={openChat}
				>
					<span style={{ flexGrow: 1 }}>👋 Need help? Chat with us!</span>
					<span
						style={{
							marginLeft: "8px",
							cursor: "pointer",
							fontSize: "16px",
							fontWeight: "bold",
						}}
						onClick={(e) => {
							e.stopPropagation(); // Prevent double open (handled already)
							setShowNotification(false); // Close the notification
							openChat(); // Still open the chat
						}}
					>
						✖
					</span>
				</div>
			)}
		</>
	);
};

export default Chat;