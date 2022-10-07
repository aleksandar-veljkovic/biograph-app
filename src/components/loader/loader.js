import React from "react";

export const Loader = ({ action=null }) => {
	return (
		<div className="loader">
			<div className="loader-icon-wrap">
				<img src={require('../../assets/icons/loader.gif')}/>
				<p className="action-label">{ action || 'Loading'}, please wait</p>
			</div>
		</div>
	)
}