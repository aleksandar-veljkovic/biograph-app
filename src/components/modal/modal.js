import { CloseOutlined } from "@mui/icons-material"

export const Modal = ({ children, onClose, title }) => {

    return (
        <div className="modal-wrap">
            <div className="modal">
                <div className="modal-header">
                    <span>{title}</span>
                    <span className="close-modal" onClick={() => onClose()}><CloseOutlined/></span>
                </div>
                <div className="modal-body">
                    { children }
                </div>
            </div>
        </div>
    )
}