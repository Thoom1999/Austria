import { FileUploader } from "react-drag-drop-files";

const fileTypes = ["JPG", "PNG", "SVG"];

function DragAndDrop(props) {

  return (
    <FileUploader handleChange={props.uploadFile} name="file" types={fileTypes}  multiple={false} hoverTitle="Drop Here"/>
  );
}

export default DragAndDrop;