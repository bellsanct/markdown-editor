import React, { useState , useRef } from "react";
import { Button, Navbar, Nav, Container, Row, Col } from "react-bootstrap"
import { marked } from "marked";
import "./scrollbar.css";
import previewStyles from "./preview.css"

const editorStyle = {
  color: '#333',
  backgroundcolor: '#f8f8f8',
  border: '1px solid #ccc',
  padding: '10px',
  width: '50%',
  float: 'left',
  height: '90vh',
  resize: 'none' 
};

const previewStyle = {
  overflowY: 'auto',
  color: '#333',
  backgroundcolor: '#f8f8f8',
  border: '1px solid #000',
  padding: '10px',
  width: '50%',
  float: 'right',
  height: '90vh',
  resize: 'none' 
};

function MarkdownEditor() {
  const [markdown, setMarkdown] = useState("");
  const [existingMarkdown, setExistingMarkdown] = useState(""); // 既存のMarkdown
  const [editedMarkdown, setEditedMarkdown] = useState("");   
  const editorRef = useRef(null);
  const previewRef = useRef(null);

  const handleEditorScroll = () => {
    const scrollTop = editorRef.current.scrollTop;
    previewRef.current.scrollTop = scrollTop;
  };

  const handlePreviewScroll = () => {
    const scrollTop = previewRef.current.scrollTop;
    editorRef.current.scrollTop = scrollTop;
  };

  const handleLoadMarkdown = () => {
    const fileInput = document.createElement("input");
    fileInput.type = "file";
    fileInput.accept = ".md";

    fileInput.addEventListener("change", (e) => {
      const file = e.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
          const content = e.target.result;
          setExistingMarkdown({
		name: file.name,
		content: content,
	  });
          setEditedMarkdown(content);
	  setMarkdown(content);
        };
        reader.readAsText(file);
      }
    });

    fileInput.click();
  };

  const handleSaveMarkdown = () => {
    if (existingMarkdown) {
      // 既存のMarkdownファイルを上書き保存
      const blob = new Blob([markdown], { type: "text/markdown" });
      const url = URL.createObjectURL(blob);

      const a = document.createElement("a");
      a.href = url;

      // 既存のファイル名を使用
      a.download = existingMarkdown.name;

      a.click();
      URL.revokeObjectURL(url);
    } else {
      // 新規作成の場合、ファイル名を生成
      const date = new Date();
      const formattedDate = `${date.getFullYear()}${(date.getMonth() + 1).toString().padStart(2, '0')}${date.getDate().toString().padStart(2, '0')}`;
      const newFileName = `markdown-${formattedDate}.md`;

      const blob = new Blob([markdown], { type: "text/markdown" });
      const url = URL.createObjectURL(blob);

      const a = document.createElement("a");
      a.href = url;

      // 新しいファイル名を使用
      a.download = newFileName;

      a.click();
      URL.revokeObjectURL(url);
    }
  };

  return (
    <Container fluid>
      <Navbar bg="light">
        <Navbar.Brand>Markdown editor</Navbar.Brand>
        <Nav className="ml-auto">
	  <button className="btn btn-primary mx-2" onClick={handleLoadMarkdown}>読込</button>
          <button className="btn btn-success mx-2" onClick={handleSaveMarkdown}>保存</button>
        </Nav>
      </Navbar>
      <div className="markdown-editor">
        <textarea
	  ref={editorRef}
	  onScroll={handleEditorScroll}
	  style={editorStyle}
          className="editor"
          value={markdown}
          onChange={(e) => setMarkdown(e.target.value)}
        ></textarea>
        <div
	  ref={previewRef}
	  onScroll={handlePreviewScroll}
          className="preview"
	  style={previewStyle}
          dangerouslySetInnerHTML={{ __html: marked(markdown) }}
        ></div>
      </div>
    </Container>
  );
}

export default MarkdownEditor;
