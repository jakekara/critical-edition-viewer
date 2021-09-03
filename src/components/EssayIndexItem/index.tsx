import React from "react";
import { Link } from "react-router-dom";
import { EssayDataEntry } from "../../Data/EssayData";
import styles from "./EssayIndexItem.module.css";

export interface EssayIndexItemProps {
  essay: EssayDataEntry;
  textOnly: boolean;
  showBylines: boolean;
  showSupertitles: boolean;
}

export default function EssayIndexItem(props: EssayIndexItemProps) {
  const { essay, textOnly, showBylines, showSupertitles } = props;

  return (
    <Link tabIndex={0} to={`/essay/${essay.id}`} className={styles.ItemLink}>
      <article title={essay.title} className={styles.EssayIndexItem}>
        {textOnly ? null : (
          <div className={styles.ThumbnailArea}>
            <video
              aria-label={`Thumbnail video for '${essay.title}'`}
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
        )}
        <div className={styles.TextArea}>
          <div className={styles.TitleContainer}>
            {/* <header> */}
            {showSupertitles ? (
              <p
                aria-label={`Supertitle for '${essay.title}'`}
                className={styles.SuperTitle}
              >
                {essay.supertitle}
              </p>
            ) : null}
            <h3 className={styles.Title}> {essay.title}</h3>
            {showBylines ? (
              <p
                aria-label={`Author byline for '${essay.title}'`}
                className={`${styles.Byline} sans-copy-ff`}
              >
                by {essay.author}
                {essay.affiliation ? `, ${essay.affiliation}` : null}
              </p>
            ) : null}
            {/* </header> */}
          </div>
        </div>
      </article>
    </Link>
  );
}
