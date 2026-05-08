import Editor from "@monaco-editor/react"

interface Props {
  code: string
  setCode: (value: string) => void
  language: string
}

export default function EditorPanel({
  code,
  setCode,
  language,
}: Props) {
  return (
    <div className="h-full">
      <Editor
        height="100%"
        theme="vs-dark"
        language={language}
        value={code}
        onChange={(value) => setCode(value || "")}
      />
    </div>
  )
}