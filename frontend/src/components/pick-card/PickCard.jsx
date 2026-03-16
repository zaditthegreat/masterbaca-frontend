import React, { useCallback, useEffect, useRef, useState } from 'react';
import styles from './pick-card.module.scss';
import { API_BASE_URL } from '../../services/apiClient.js';
import { clamp } from '../../utils/math.js';
import PickCardResult from '../pick-card-result/PickCardResult';
import ProgressMask from '../progress-mask/ProgressMask';

const getPosition = (event) => {
    if ('touches' in event && event.touches.length > 0) {
        return { x: event.touches[0].clientX, y: event.touches[0].clientY };
    } else {
        return { x: event.clientX, y: event.clientY };
    }
};

function PickCard({ cardList = [], onEvaluate }) {
    const interactionRef = useRef();
    const [isInteracting, setIsInteracting] = useState(false);
    const [activeIndex, setActiveIndex] = useState(cardList.length - 1);
    const [progress, setProgress] = useState(0);

    useEffect(() => {
        setActiveIndex(cardList.length - 1);
    }, [cardList.length]);

    const handleStart = useCallback((e) => {
        document.body.classList.add(styles.fix_container);
        e.currentTarget.style.transition = '';
        const { x, y } = getPosition(e);
        interactionRef.current = { x, y, $card: e.currentTarget };
        setIsInteracting(true);
    }, []);

    const handleMove = useCallback((e) => {
        if (!interactionRef.current) return;
        const $card = interactionRef.current.$card;
        if (!$card) return;

        const { x, y } = getPosition(e);
        const dx = (x - interactionRef.current.x) * 0.8;
        const dy = (y - interactionRef.current.y) * 0.5;
        const deg = (dx / 600) * -30;

        $card.style.transform = `translate(${dx}px, ${dy}px) rotate(${deg}deg)`;
        const newProgress = clamp(dx / 150, -1, 1);
        setProgress(newProgress);
    }, []);

    const handleEnd = useCallback(() => {
        const $card = interactionRef.current?.$card;
        if (!$card) return;

        const isSelect = Math.abs(progress) === 1;
        const isGood = progress === 1;

        const transform = $card.style.transform;
        const [, currentXString] = transform.match(/translate\(([^,px]+)px, [^)]+\)/) || [];
        const [, currentYString] = transform.match(/translate\([^,]+, ([^)px]+)px\)/) || [];
        const [, currentRotateString] = transform.match(/rotate\(([^)deg]+)deg\)/) || [];

        const currentX = parseInt(currentXString, 10) || 0;
        const currentY = parseInt(currentYString, 10) || 0;
        const currentRotate = parseInt(currentRotateString, 10) || 0;

        const dx = isGood
            ? window.innerWidth
            : (window.innerWidth + $card.getBoundingClientRect().width) * -1;

        $card.style.transition = 'transform 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)';
        $card.style.transform = isSelect
            ? `translate(${currentX + dx}px, ${currentY}px) rotate(${currentRotate * 2}deg)`
            : 'translate(0, 0) rotate(0deg)';

        interactionRef.current = undefined;
        setIsInteracting(false);
        setProgress(0);

        if (isSelect) {
            setTimeout(() => setActiveIndex((prev) => prev - 1), 100);
        }

        setTimeout(() => {
            document.body.classList.remove(styles.fix_container);
            if (isSelect) {
                onEvaluate?.(cardList[activeIndex], isGood ? 'good' : 'bad');
            }
        }, 400);
    }, [cardList, onEvaluate, progress, activeIndex]);

    useEffect(() => {
        window.addEventListener('mousemove', handleMove);
        window.addEventListener('touchmove', handleMove);
        window.addEventListener('mouseup', handleEnd);
        window.addEventListener('touchend', handleEnd);
        return () => {
            window.removeEventListener('mousemove', handleMove);
            window.removeEventListener('touchmove', handleMove);
            window.removeEventListener('mouseup', handleEnd);
            window.removeEventListener('touchend', handleEnd);
        };
    }, [handleMove, handleEnd]);

    return (
        <div className={styles.container}>
            <PickCardResult />

            {cardList.map((card, index) => {
                // Optimization: Only render top 3 cards (current + 2 below)
                if (index > activeIndex || index < activeIndex - 2) return null;

                const isActiveCard = index >= activeIndex;
                const isCurrentTopCard = index === activeIndex;

                return (
                    <div
                        key={index}
                        className={`
              ${styles.card} 
              ${isActiveCard ? styles.active : ''} 
              ${isCurrentTopCard ? styles.top : ''}
            `}
                        {...(isCurrentTopCard && {
                            onTouchStart: handleStart,
                            onMouseDown: handleStart,
                        })}
                    >
                        <div className={`${styles.card_inner} shadow-[0_10px_40px_-15px_rgba(0,0,0,0.15)] border border-slate-100`}>
                            {/* Image Section */}
                            <div className="relative h-[65%] w-full overflow-hidden rounded-br-[10px] rounded-bl-[10px]">
                                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent z-10"></div>
                                <img
                                    src={API_BASE_URL + card.cover_url}
                                    alt={card.name}
                                    className="h-full w-full object-cover pointer-events-none"
                                    draggable="false"
                                />
                                <div className="absolute bottom-5 left-5 z-20 pr-4 drop-shadow-lg">
                                    {/* <span className="px-2 py-1 rounded bg-primary text-white text-[10px] font-black uppercase tracking-widest mb-2 shadow-sm inline-block">
                                        {card.badge || 'Trending'}
                                    </span> */}
                                    <h2 className="text-2xl font-extrabold text-white leading-tight tracking-tight drop-shadow-md">
                                        {card.title}
                                    </h2>
                                    <p className="text-white/95 text-base font-bold tracking-tight">
                                        {card.author}
                                    </p>
                                </div>
                            </div>

                            {/* Content Section */}
                            <div className="flex-1 p-6 flex flex-col justify-between bg-white">
                                <p className="text-slate-600 text-sm leading-relaxed line-clamp-4 font-medium italic">
                                    "{card.short_summary || "No summary available."}"
                                </p>
                                <div className="flex items-center justify-between mt-4">
                                    <div className="flex gap-2">
                                        {card.genre?.split(', ').slice(0, 2).map((g) => (
                                            <span
                                                key={g}
                                                className="px-3 py-1.5 rounded-full bg-slate-50 border border-slate-100 text-[10px] font-extrabold uppercase tracking-wider text-slate-500"
                                            >
                                                {g}
                                            </span>
                                        ))}
                                    </div>
                                    {card.rate &&
                                        <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-primary/10 text-primary">
                                            <span className="material-symbols-outlined text-sm font-black fill-1">star</span>

                                            <span className="text-[11px] font-black uppercase tracking-tighter">
                                                {card.rate}
                                            </span>
                                        </div>
                                    }
                                </div>
                            </div>

                            {isCurrentTopCard && (
                                <ProgressMask progress={progress} isInteracting={isInteracting} />
                            )}
                        </div>
                    </div>
                );
            })}
        </div>
    );
}

export default PickCard;
