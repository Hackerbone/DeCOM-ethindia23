import { ExclamationCircleFilled } from '@ant-design/icons';
import { Modal } from 'antd';
import React from 'react'
import styles from "styles/components/Modal.module.scss"


const { confirm } = Modal;

export const showConfirm = (params) => {
    confirm({
        title: params?.title ?? 'Are you sure?',
        icon: params?.icon ?? <ExclamationCircleFilled />,
        ...(params?.content && {content: params?.content}),
        okText: params?.okText ?? 'Delete',
        cancelText: params?.cancelText ?? 'Cancel',
        className: `${styles.confirmModalPopup} ${params?.className && params?.className}`,
        onOk() {
            if (params?.onOk) {
                params?.onOk();
            }
        },
        onCancel() {
            if (params?.onCancel) {
                params?.onCancel();
            }
        },
        cancelButtonProps: {
            className: `${styles.confirmModalCancelButton}`,
            type: "text"
        },
        okButtonProps: {
            className: `${styles.confirmModalOkButton}`,
        },

    });
}
