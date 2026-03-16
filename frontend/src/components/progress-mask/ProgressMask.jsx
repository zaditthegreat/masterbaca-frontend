import { useEffect, useState } from 'react';
import styles from './progress-mask.module.scss';
import { clamp } from '../../utils/math.js';

function ProgressMask({ progress, isInteracting }) {
    const [status, setStatus] = useState(null);
    const isGood = status === 'good';
    const isBad = status === 'bad';

    useEffect(() => {
        if (progress > 0) {
            setStatus('good');
        } else if (progress < 0) {
            setStatus('bad');
        }
    }, [progress]);

    // Dimensions for the Rounded Rectangle - Increased width for text
    const width = isBad ? 140 : 100;
    const height = 48;
    const radius = 12;

    // Perimeter calculation
    const perimeter = 2 * (width - 2 * radius) + 2 * (height - 2 * radius) + 2 * Math.PI * radius;
    const dashoffset = perimeter - perimeter * clamp(Math.abs(progress), 0, 1);

    return (
        <div
            className={[
                styles.container,
                status && styles.active,
                isGood && styles.good,
                isBad && styles.bad,
            ]
                .filter(Boolean)
                .join(' ')}
            style={{
                opacity: Math.abs(progress) * 2,
                transition: isInteracting ? '' : 'opacity 0.3s linear',
            }}
        >
            <div
                className={styles.rect_wrap}
                style={{ width: width + 10, height: height + 10 }}
            >
                <svg
                    className={styles.rect_progress}
                    width={width + 10}
                    height={height + 10}
                    viewBox={`0 0 ${width + 10} ${height + 10}`}
                >
                    <rect
                        className={styles.bar}
                        x="5"
                        y="5"
                        width={width}
                        height={height}
                        rx={radius}
                        strokeDasharray={perimeter}
                        strokeDashoffset={dashoffset}
                        style={{
                            transition: isInteracting ? '' : 'stroke-dashoffset 0.3s linear',
                        }}
                    />
                </svg>

                <div className={styles.label_wrap}>
                    {isGood && <span className={styles.text_good}>SUKA</span>}
                    {isBad && <span className={styles.text_bad}>TIDAK SUKA</span>}
                </div>
            </div>
        </div>
    );
}

export default ProgressMask;
