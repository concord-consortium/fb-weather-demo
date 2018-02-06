import * as React from 'react';
import * as Clipboard from "clipboard";
import IconButton from 'material-ui-next/IconButton';
import SvgIcon from 'material-ui-next/SvgIcon';
import Tooltip from 'material-ui-next/Tooltip';
import { urlParams } from "../utilities/url-params";

export const LinkIcon = (props: any) => {
  // SVG from https://material.io/icons/#ic_link
  // tslint:disable-next-line:max-line-length
  const svgPath = "M3.9 12c0-1.71 1.39-3.1 3.1-3.1h4V7H7c-2.76 0-5 2.24-5 5s2.24 5 5 5h4v-1.9H7c-1.71 0-3.1-1.39-3.1-3.1zM8 13h8v-2H8v2zm9-6h-4v1.9h4c1.71 0 3.1 1.39 3.1 3.1s-1.39 3.1-3.1 3.1h-4V17h4c2.76 0 5-2.24 5-5s-2.24-5-5-5z";
  return (
    <SvgIcon {...props}>
      <path d={svgPath}/>
    </SvgIcon>
  );
};

interface CopyStudentLinkButtonProps {
}

interface CopyStudentLinkButtonState {
}

export class CopyStudentLinkButton
  extends React.Component<CopyStudentLinkButtonProps, CopyStudentLinkButtonState> {

  clipboard: Clipboard;

  componentDidMount() {
    if (urlParams.isTesting && Clipboard.isSupported()) {
      this.clipboard = new Clipboard('.copy-student-url-button');
    }
  }

  componentWillUnmount() {
    if (this.clipboard) {
      this.clipboard.destroy();
    }
  }

  render() {
    const teacherUrl = window.location.href,
          studentUrl = urlParams.isTesting
                        ? teacherUrl.replace('show/teacher', 'show/student')
                        : '';
    return (
      <Tooltip id="tooltip-copy-student-url" title="Copy Student Link" placement="left">
        <IconButton className="copy-student-url-button" aria-label="Copy"
                    data-clipboard-text={studentUrl}>
          <LinkIcon />
        </IconButton>
      </Tooltip>
    );
  }
}
