import React from "react";
import { EssayDataEntry } from "../../EssayData";
import DebugLogger from "../../utils/DebugLogger";
import EssayIndexItem from "../EssayIndexItem";
import styles from "./IndexPage.module.css";

export interface IndexPageProps {
  projectTitle: string;
  projectDescription: string;
  essays: { [essayID: string]: EssayDataEntry };
}

const logger = new DebugLogger("IndexPage: ");

interface IndexHeaderProps {
  title: string;
  description: string;
}
function IndexHeader(props: IndexHeaderProps) {
  const { title, description } = props;
  return (
    <div>
      <h1>{title}</h1>
      <p className="sans-copy-ff">{description}</p>
    </div>
  );
}

export default function IndexPage(props: IndexPageProps) {
  const { essays, projectDescription, projectTitle } = props;

  return (
    <div className={styles.IndexPage}>
      <IndexHeader title={projectTitle} description={projectDescription} />
      {Object.keys(essays).map((essayID: string, i: number) => {
        const essay: EssayDataEntry = essays[essayID];
        if (!essay) {
          logger.warn("bad essay id: " + essayID);
          return null;
        }
        return (
          <div className={styles.IndexItemContainer}>
            <EssayIndexItem essayID={essayID} key={i} essay={essay} />
          </div>
        );
      })}
    </div>
  );
}
