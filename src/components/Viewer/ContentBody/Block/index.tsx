import React, { useEffect, useRef } from "react";
import {
  CriticalEditionDocumentBlock,
  FootnoteParagraphBlockData,
  HeaderBlockData,
  ImageBlockData,
  ParagraphBlockData,
} from "../../../../CriticalEditionData";
import validBlockData from "../../../../CriticalEditionData/validators/validBlockData";
import DebugLogger from "../../../../utils/DebugLogger";
// import getFootnotes from "../../../../utils/getFootnotes";
// import htmlToText from "../../../../utils/htmlToText";
import { Footnote } from "./Footnote";
import { Paragraph } from "./Paragraph";
import { Image } from "./Image";
import styles from "./Block.module.css";
// import CopyText from "./CopyText";
// import OpenFootnote from "./OpenFootnotes";
// import Permalink from "./Permalink";
// import PlayText from "./PlayText";
import { useLocation } from "react-router-dom";
import FootnoteCount from "./FootnoteCount";

const logger = new DebugLogger("Block: ");

export default function Block(props: {
  index: number;
  blockData: CriticalEditionDocumentBlock;
  playBlock: () => void;
  stopPlaying: () => void;
  playing: boolean;
  inFocus: boolean;
  expand?: boolean;
  nextFootnoteBlock?: FootnoteParagraphBlockData;
  previousFootnoteBlock?: FootnoteParagraphBlockData;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const blockID = `${
    (props.blockData.data as FootnoteParagraphBlockData).id ||
    `p-${props.index}`
  }`;

  // const footnotes = getFootnotes(props.blockData.data as ParagraphBlockData);

  logger.log("BLOCK TYPE:", props.blockData.type);
  useEffect(() => {
    if (props.inFocus && ref.current) {
      ref.current.scrollIntoView({ behavior: "smooth", block: "center" });
      ref.current.focus();
    }
  }, [blockID, props.inFocus]);

  // function Controls() {
  //   const html = (props.blockData.data as ParagraphBlockData).text;
  //   return (
  //     <div className={styles.Controls}>
  //       {html ? (
  //         <React.Fragment>
  //           <PlayText
  //             stopPlaying={props.stopPlaying}
  //             playing={props.playing}
  //             playBlock={props.playBlock}
  //             text={htmlToText(html)}
  //           />
  //           <Permalink blockID={blockID} />
  //           <CopyText
  //             text={(props.blockData.data as ParagraphBlockData).text}
  //           />
  //           {props.blockData.type === "paragraph" && footnotes.length > 0 ? (
  //             // <OpenFootnote footnoteIDs={footnotes} />
  //             <OpenFootnote
  //               footnoteCount={footnotes.length}
  //               footnoteIDs={
  //                 props.nextFootnoteBlock ? [props.nextFootnoteBlock.id] : []
  //               }
  //             />
  //           ) : null}
  //         </React.Fragment>
  //       ) : null}
  //     </div>
  //   );
  // }

  function WrapBlock(inner: JSX.Element) {
    const location = useLocation();
    const hash = location.hash.replace("#", "");
    const hide =
      props.blockData.type === "footnoteParagraph" && hash !== blockID;

    return (
      <div
        id={blockID}
        ref={ref}
        tabIndex={0}
        data-blocktype={props.blockData.type}
        className={`Block ${hide ? "hidden" : ""} blocktype-${
          props.blockData.type
        } ${styles.Block} ${props.inFocus ? styles.InFocus : ""}`}
      >
        <div className={styles.LeftMargin}>
          <FootnoteCount
            blockData={props.blockData.data as ParagraphBlockData}
          />
        </div>
        {/* <div className={styles.ControlsWrapper}>
          <div className={styles.ControlsFrame}>
            <Controls />
          </div>
        </div> */}
        {hide ? null : <div className={styles.BlockWrapper}>{inner}</div>}
        <div className={styles.RightMargin}></div>
      </div>
    );
  }

  if (props.blockData.type.toLowerCase().trim() === "delimiter") {
    return (
      <div className={styles.Delimiter}>
        <div className={styles.DelimiterInner}>***</div>
      </div>
    );
  }

  if (props.blockData.type.toLowerCase().trim() === "header") {
    const data = props.blockData.data as HeaderBlockData;
    const inner = React.createElement(`h${data.level}`, {}, `${data.text}`);
    return WrapBlock(<div className={styles.Header}>{inner}</div>);
  }

  try {
    validBlockData(props.blockData);
  } catch (e) {
    logger.warn("Error validating block " + String(e), Block);
    return null;
  }

  if (props.blockData.type.toLowerCase().trim() === "paragraph") {
    return WrapBlock(
      <Paragraph data={props.blockData.data as ParagraphBlockData} />
    );
  }
  if (props.blockData.type.toLocaleLowerCase().trim() === "footnoteparagraph") {
    return WrapBlock(
      <Footnote
        nextFootnoteBlock={props.nextFootnoteBlock}
        previousFootnoteBlock={props.previousFootnoteBlock}
        data={props.blockData.data as FootnoteParagraphBlockData}
      />
    );
  }
  if (props.blockData.type.toLowerCase().trim() === "image") {
    return WrapBlock(<Image data={props.blockData.data as ImageBlockData} />);
  }

  return null;
}
