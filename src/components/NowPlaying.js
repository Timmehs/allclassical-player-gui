import React, { Fragment } from "react"
import PropTypes from "prop-types"
import Segment from "./Segment"

const NowPlaying = ({ titles, hasMetaDeta }) => (
	<Segment>
		<div className={`hidden ${titles.length > 0 ? "show" : ""}`}>
			<small>Now Playing:</small>
			<div>
				<strong>{titles[0] || " "}</strong>
			</div>
			{titles.length > 1 && (
				<Fragment>
					<span>Previous:</span>
					<div>
						<strong>{titles[0] || " "}</strong>
					</div>
				</Fragment>
			)}
		</div>
	</Segment>
)

NowPlaying.propTypes = {
	titles: PropTypes.array.isRequired
}

export default NowPlaying
