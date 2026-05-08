interface Props {
  files: any[]
  activeFile: any
  setActiveFile: (file: any) => void
}

export default function FileExplorer({
  files,
  activeFile,
  setActiveFile,
}: Props) {
  return (
    <div className="bg-gray-950 h-full p-3">
      <h2 className="text-lg mb-4">Files</h2>

      {files.map((file) => (
        <div
          key={file.id}
          onClick={() => setActiveFile(file)}
          className={`p-2 rounded cursor-pointer mb-2 ${
            activeFile?.id === file.id
              ? "bg-green-600"
              : "bg-gray-800"
          }`}
        >
          {file.filename}
        </div>
      ))}
    </div>
  )
}