import React from "react";
import { Link } from "react-router-dom";
import { EssayDataEntry } from "../../Data/EssayData";
import styles from "./EssayIndexItem.module.css";

export interface EssayIndexItemProps {
  essay: EssayDataEntry;
}

export default function EssayIndexItem(props: EssayIndexItemProps) {
  const { essay } = props;

  return (
    <Link to={`/essay/${essay.id}`} className={styles.ItemLink}>
      <div className={styles.EssayIndexItem}>
        <div className={styles.ThumbnailArea}>
          <video
            poster={essay.posterPath}
            playsInline
            muted
            loop
            className={styles.SplashBackgroundVideo}
            onMouseOver={(
              event: React.MouseEvent<HTMLVideoElement, MouseEvent>
            ) => (event.target as HTMLVideoElement).play()}
            onMouseOut={(event) => (event.target as HTMLVideoElement).pause()}
          >
            <source src={essay.smallVideoPath} type={"video/mp4"}></source>
          </video>
        </div>
        <div className={styles.TextArea}>
          <div className={styles.TitleContainer}>
            <header>
              <h3 className={styles.Title}> {essay.title}</h3>
              <p className={`${styles.Byline} sans-copy-ff`}>
                by {essay.author}
                {essay.affiliation ? `, ${essay.affiliation}` : null}
              </p>
            </header>
          </div>
        </div>
      </div>
    </Link>
  );
}
