import * as React from "react";
import { ComponentStyleMap } from "../component-style-map";
import { TeacherSetupStationsView } from "./teacher-setup-stations-view";

export interface TeacherSetupGridState { }
export interface TeacherSetupGridProps { }
const styles:ComponentStyleMap= { };

export class TeacherSetupGridView extends React.Component<TeacherSetupGridProps, TeacherSetupGridState> {
  constructor(props:TeacherSetupGridProps, ctx:any){
    super(props, ctx);
  }

  render() {
    return (
        <div>
          hi
        </div>
    );
  }
}