import React, { useState, useRef, useEffect } from "react";
import { Button, Navbar, Nav, Container, Row, Col, Form } from "react-bootstrap";
import { marked } from "marked";
import "./scrollbar.css";
import hljs from "highlight.js";
import "highlight.js/styles/github.css";
import "./preview.css";
import "github-markdown-css/github-markdown-light.css";
import "./theme.css";


function MarkdownEditor() {
  const [markdown, setMarkdown] = useState("");
  const [existingMarkdown, setExistingMarkdown] = useState("");
  const [editedMarkdown, setEditedMarkdown] = useState("");
  const [theme, setTheme] = useState("light");
  const [template, setTemplate] = useState("default");
  const editorRef = useRef(null);
  const previewRef = useRef(null);

  const toggleTheme = () => {
    setTheme(theme === "light" ? "dark" : "light");
  };

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

  useEffect(() => {
    // コンポーネントがマウントされた際にhighlight.jsを初期化
    hljs.highlightAll();
  }, [markdown]);
	
  return (
    <Container fluid className={theme}>
      <Navbar bg={theme} variant={theme}>
        <Navbar.Brand>Markdown editor</Navbar.Brand>
        <Nav className="ms-auto align-items-center">
          <Form.Select
            size="sm"
            value={template}
            onChange={(e) => setTemplate(e.target.value)}
            className="mx-2"
          >
            <option value="default">Default</option>
            <option value="github">GitHub</option>
          </Form.Select>
          <Button variant="secondary" className="mx-2" onClick={toggleTheme}>
            {theme === "light" ? "Dark" : "Light"}
          </Button>
          <Button className="mx-2" onClick={handleLoadMarkdown} variant="primary">
            読込
          </Button>
          <Button className="mx-2" onClick={handleSaveMarkdown} variant="success">
            保存
          </Button>
        </Nav>
      </Navbar>
      <Row className="mt-2">
        <Col md={6} className="p-0">
          <Form.Control
            as="textarea"
            placeholder="Enter markdown here..."
            ref={editorRef}
            onScroll={handleEditorScroll}
            className="editor"
            value={markdown}
            onChange={(e) => setMarkdown(e.target.value)}
          />
        </Col>
        <Col md={6} className="p-0">
          <div
            ref={previewRef}
            onScroll={handlePreviewScroll}
            className={`preview ${template === "github" ? "markdown-body" : ""}`}
            dangerouslySetInnerHTML={{ __html: marked(markdown) }}
          ></div>
        </Col>
      </Row>
    </Container>
  );
}

export default MarkdownEditor;
