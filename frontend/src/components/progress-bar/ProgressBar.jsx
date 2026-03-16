import styles from './progress-bar.module.scss';

function ProgressBar({ progress, className }) {
    const progressPercentage = Math.floor(progress * 100);

    return (
        <div className={[className, styles.container].join(' ')}>
            <div
                className={styles.bar}
                style={{
                    width: `${progressPercentage}%`,
                }}
            >
                Progress: {Math.floor(progressPercentage)}%
            </div>
        </div>
    );
}

export default ProgressBar;
