import React from 'react';
import { Modal } from '@heroui/react';
import classNames from 'classnames';

const Dialog = ({
    isOpen,
    onOpenChange,
    title,
    footer,
    size = 'md',
    placement = 'center',
    isDismissable = true,
    className,
    bodyClassName,
    closeClassName,
    children
}) => (
    <Modal>
        <Modal.Backdrop isOpen={isOpen} onOpenChange={onOpenChange} isDismissable={isDismissable}>
            <Modal.Container size={size} placement={placement} scroll='inside'>
                <Modal.Dialog
                    className={classNames('frame relative rounded-none bg-[#0e0f13]', className)}
                >
                    {(renderProps) => (
                        <>
                            <Modal.CloseTrigger className={closeClassName} />
                            {title && (
                                <Modal.Header className='px-[22px] pt-6 sm:px-7'>
                                    <Modal.Heading className='font-display text-xl font-semibold text-ink'>
                                        {title}
                                    </Modal.Heading>
                                </Modal.Header>
                            )}
                            <Modal.Body className={classNames('px-[22px] sm:px-7', bodyClassName)}>
                                {typeof children === 'function' ? children(renderProps) : children}
                            </Modal.Body>
                            {footer && (
                                <Modal.Footer className='mx-2.5 border-t border-gold-line px-3 pb-5 pt-3 sm:mx-3.5 sm:px-4'>
                                    {typeof footer === 'function' ? footer(renderProps) : footer}
                                </Modal.Footer>
                            )}
                        </>
                    )}
                </Modal.Dialog>
            </Modal.Container>
        </Modal.Backdrop>
    </Modal>
);

export default Dialog;
