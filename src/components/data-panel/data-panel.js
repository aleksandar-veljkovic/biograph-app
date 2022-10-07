import { ExpandLess, ExpandMore } from "@mui/icons-material";
import React, { useState } from "react";

export const DataPanel = ({ title, children, isToggled }) => {
	const [toggled, setToggled] = useState(isToggled);

	return (
		<div className="data-panel">
			<div 
				className="data-panel-header"
				onClick={() => setToggled(!toggled)}
			>
				<span>{ title } </span>
				{ 
					toggled ?
					<ExpandLess/>
						:
					<ExpandMore/>
				}
			</div>
			{ 
				toggled && (
					<div className="data-panel-content">
						{ children }
					</div>
				)
			}
		</div>
	)
}