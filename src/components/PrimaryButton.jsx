import { Button } from 'antd'
import React from 'react'
import buttonStyles from "styles/components/Button.module.scss"

const PrimaryButton = ({
    size,
    htmlType,
    className,
    style,
    children,
    buttonType,
    color,
    loading,
    ...props
}) => {
    return (
        <Button
            htmlType={htmlType}
            style={style}
            loading={loading}
            className={`
            ${buttonStyles.buttonContainer}
            ${size === "small" && buttonStyles.smallButton}
            ${buttonType === "text" && buttonStyles.textButton}
            ${buttonType === "pagination" && buttonStyles.paginationButton}
            ${color === "primary" && buttonStyles.primaryColorButton}

            ${className && className}
            `}
            onClick={props.onClick}
            icon={props.icon}
            disabled={props.disabled}
        >
            {children}
        </Button>
    )
}

export default PrimaryButton