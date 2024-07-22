import React from 'react';
import classNames from 'classnames';

const Modal = ({ id, className, title, bodyClassName, children }) => {
    const stopPropagation = (e) => e.stopPropagation();

    return (
        <div id={id} className='modal fade' tabIndex='-1' role='dialog'>
            <div className='modal-dialog' role='document'>
                <div className={classNames('modal-content', className)} onClick={stopPropagation}>
                    <div className='modal-header'>
                        <button
                            type='button'
                            className='close'
                            data-dismiss='modal'
                            aria-label='Close'
                        >
                            <span aria-hidden='true'>×</span>
                        </button>
                        <h4 className='modal-title'>{title}</h4>
                    </div>
                    <div className={classNames('modal-body', bodyClassName)}>{children}</div>
                </div>
            </div>
        </div>
    );
};

export default Modal;
