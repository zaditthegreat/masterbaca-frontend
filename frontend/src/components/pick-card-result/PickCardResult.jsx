import styles from './pick-card-result.module.scss';

function PickCardResult() {
    return (
        <div className={styles.empty}>
            <div className={styles.title}>All Caught Up! 🎉</div>
            <div className="text-gray-500 mt-2">
                You've swiped through all available books.
            </div>
        </div>
    );
}

export default PickCardResult;
