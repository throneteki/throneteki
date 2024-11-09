import React, { useEffect, useMemo, useRef } from 'react';
import classNames from 'classnames';
import { Circle, FabricImage, Group, Line, StaticCanvas } from 'fabric';
import { getCardDimensions } from '../../util';
import { Constants } from '../../constants';

const CardImage = ({ facedown, card, orientation, size, source }) => {
    const sizeClass = useMemo(() => ({ [size]: size !== 'normal' }), [size]);
    const canvasRef = useRef();
    const imageUrl = !facedown
        ? `/img/cards/${card.code}.png`
        : source === 'shadows'
          ? '/img/cards/cardback_shadow.png'
          : '/img/cards/cardback.png';

    let imageClass = classNames('card-image absolute left-0 top-0', sizeClass, {
        horizontal: card.type === 'plot',
        vertical: card.type !== 'plot',
        kneeled:
            card.type !== 'plot' &&
            (orientation === 'kneeled' || card.kneeled || orientation === 'horizontal')
    });

    useEffect(() => {
        let canvas;

        const iconPositions = {
            military: { top: 60, left: 5 },
            intrigue: { top: 123, left: 7 },
            power: { top: 182, left: 7 }
        };

        const borderPositions = {
            military: { top: 55, left: -1 },
            intrigue: { top: 117, left: 2 },
            power: { top: 177, left: 1 }
        };

        const addIconImage = async (group, icon) => {
            const iconImage = await FabricImage.fromURL(
                Constants.Icons[icon],
                {},
                iconPositions[icon]
            );

            iconImage.scaleToWidth(45);

            const border = new Circle({
                radius: 28,
                fill: 'green',
                left: borderPositions[icon].left,
                top: borderPositions[icon].top
            });

            group.add(border);
            group.add(iconImage);
        };

        const doEffect = async () => {
            canvas = new StaticCanvas(canvasRef.current);

            const cardDimensions = getCardDimensions(size);
            const group = new Group();

            canvas.setDimensions(cardDimensions, { cssOnly: false, backstoreOnly: false });

            const image = await FabricImage.fromURL(imageUrl, {}, { left: 0, top: 0 });
            const oImg = image;

            group.add(oImg);

            if (card.iconsAdded) {
                for (const icon of card.iconsAdded || []) {
                    await addIconImage(group, icon);
                }
            }

            if (card.iconsRemoved) {
                for (const icon of card.iconsRemoved) {
                    const line1 = new Line(
                        [
                            borderPositions[icon].left + 5,
                            borderPositions[icon].top + 54,
                            borderPositions[icon].left + 54,
                            borderPositions[icon].top + 2
                        ],
                        { stroke: 'red', strokeWidth: 10 }
                    );

                    const line2 = new Line(
                        [
                            borderPositions[icon].left + 54,
                            borderPositions[icon].top + 54,
                            borderPositions[icon].left + 5,
                            borderPositions[icon].top + 2
                        ],
                        { stroke: 'red', strokeWidth: 10 }
                    );

                    group.add(line1);
                    group.add(line2);
                }
            }

            group.scaleToWidth(cardDimensions.width);

            canvas.add(group);
        };

        doEffect();

        return () => {
            canvas.dispose();
            canvas = null;
        };
    }, [card, imageUrl, size]);

    return (
        <div className={imageClass}>
            <canvas ref={canvasRef} />
        </div>
    );
};

export default CardImage;
