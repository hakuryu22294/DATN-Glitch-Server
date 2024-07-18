// components
import Menu from '@mui/material/Menu';

// utils
import PropTypes from 'prop-types';

const Submenu = ({children, open, onClose, anchorEl}) => {
    return (
        <Menu
            open={open}
            onClose={onClose}
            anchorEl={anchorEl}
            elevation={0}
            classes={{
                paper: '!shadow !min-w-[210px] rounded-md !bg-widget'
            }}
            anchorOrigin={{
                vertical: 'top',
                horizontal: 'left'
            }}
            transformOrigin={{
                vertical: 'top',
                horizontal: 'right'
            }}
            sx={{
                transform: 'translateX(-16px) translateY(-10px)',
                '& .MuiMenu-list': {
                    padding: 0,
                    color: 'var(--text)'
                }
            }}
        >
            {children}
        </Menu>
    )
}

Submenu.propTypes = {
    open: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
    anchorEl: PropTypes.any
}

export default Submenu