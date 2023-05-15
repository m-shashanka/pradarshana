import styles from './BoxLoadingScreen.module.css';

const BoxLoadingScreen = ({parentHeight}) => {
    return (
        <div className={styles.parent} style={{minHeight: parentHeight}}>
            <div className={styles.boxes}>
                <div className={styles.box}>
                    <div></div>
                    <div></div>
                    <div></div>
                    <div></div>
                </div>
                <div className={styles.box}>
                    <div></div>
                    <div></div>
                    <div></div>
                    <div></div>
                </div>
                <div className={styles.box}>
                    <div></div>
                    <div></div>
                    <div></div>
                    <div></div>
                </div>
                <div className={styles.box}>
                    <div></div>
                    <div></div>
                    <div></div>
                    <div></div>
                </div>
            </div>
        </div>
    );
}

export default BoxLoadingScreen;