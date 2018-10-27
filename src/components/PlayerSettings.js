import React from "react"
import Segment from "./Segment"

const PlayerSettings = ({ active, close }) => {
	const className = `player-settings ${active ? " active" : ""}`
	return (
		<div className={className}>
			<div className="uk-padding">
				<h3>Settings</h3>
				<span className="settings-btn" onClick={() => close()}>
					<i className="fas fa-times fa-lg" />
				</span>
			</div>
		</div>
	)
}

export default PlayerSettings
