import React, { useState } from "react";
import { Button, Navbar, Nav, Container, Row, Col } from "react-bootstrap"
import { marked } from "marked";

function MarkdownEditor() {
  const [markdown, setMarkdown] = useState("");
  const [existingMarkdown, setExistingMarkdown] = useState(""); // 既存のMarkdown
  const [editedMarkdown, setEditedMarkdown] = useState("");   

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
    <Container>
      <Navbar bg="light">
        <Navbar.Brand>Markdown editor</Navbar.Brand>
        <Nav className="ml-auto">
          <Nav.Item>
            <Button variant="primary">Click Me</Button>
          </Nav.Item>
        </Nav>
      </Navbar>
      <div className="markdown-editor">
        <button onClick={handleLoadMarkdown}>読込</button>
        <button onClick={handleSaveMarkdown}>保存</button>
        <textarea
          className="editor"
          value={markdown}
          onChange={(e) => setMarkdown(e.target.value)}
        ></textarea>
        <div
          className="preview"
          dangerouslySetInnerHTML={{ __html: marked(markdown) }}
        ></div>
      </div>
    </Container>
  );
}

export default MarkdownEditor;
