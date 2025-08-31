import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

const QuillEditor = ({ value, onChange, ...props }) => {
  return (
    <ReactQuill
      theme="snow"
      value={value}
      onChange={onChange}
      {...props}
    />
  );
};

export default QuillEditor;